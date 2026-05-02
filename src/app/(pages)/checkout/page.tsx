"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/cart/useCart';
import { useGetProfile } from '@/hooks/user/useProfile';
import { useGetCoupons } from '@/hooks/coupon/useGetCoupons';
import { useClearCart } from '@/hooks/cart/useClearCart';
import { Coupon } from '@/lib/types/couponType';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import RazorpayScript from '@/components/payment/RazorpayScript';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get('buyNow') === 'true';
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [buyNowItem, setBuyNowItem] = useState<any>(null);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // Fetch user profile to get addresses
  const { data: userProfile } = useGetProfile(userEmail || '');
  
  // Check if user is logged in and load buy now item
  useEffect(() => {
    const email = Cookies.get('userEmail');
    if (!email) {
      router.push('/cart');
    } else {
      setUserEmail(email);
    }
    
    // Load buy now item from localStorage
    if (isBuyNow) {
      const storedItem = localStorage.getItem('buyNowItem');
      if (storedItem) {
        setBuyNowItem(JSON.parse(storedItem));
      }
    }
  }, [router, isBuyNow]);

  useEffect(() => {
    if (userProfile) {
      setContactName(userProfile.name || '');
      setContactPhone(userProfile.phone || '');
    }
  }, [userProfile]);
  
  const { data: cartData, isLoading: cartLoading } = useCart(userEmail || '');
  const { data: coupons = [] } = useGetCoupons();
  const clearCart = useClearCart();
  
  // Determine items to display (cart or buy now)
  const cartItems = isBuyNow && buyNowItem 
    ? [{
        product: buyNowItem.product,
        variant: buyNowItem.variant,
        size: buyNowItem.size,
        quantity: buyNowItem.quantity
      }]
    : (cartData?.cart || []);
  
  const isLoading = isBuyNow ? false : cartLoading;
  
  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    // Use the variant field directly
    const selectedVariant = item.variant;
    const sizeData = selectedVariant?.sizes?.find((s: any) => s.size === item.size) || selectedVariant?.sizes?.[0];
    const price = sizeData?.sellingPrice || 0;
    return total + (price * item.quantity);
  }, 0);
 
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping - discount;

  // Create Razorpay order
  const createOrder = async () => {
    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            email: userEmail,
            items: cartItems.length,
          },
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      setOrderId(data.orderId);
      return { orderId: data.orderId, key: data.key };
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to initialize payment');
      return null;
    }
  };

  // Handle Razorpay payment
  const handlePayment = async () => {
    if (!window.Razorpay) {
      toast.error('Payment system not loaded. Please try again.');
      return;
    }

    setPaymentStatus('processing');
    const orderData = await createOrder();
    if (!orderData) {
      setPaymentStatus('failed');
      return;
    }

    const { orderId: createdOrderId, key } = orderData;

    if (!key) {
      toast.error('Payment configuration error. Please refresh the page.');
      setPaymentStatus('failed');
      return;
    }

    const options = {
      key: key,
      amount: total * 100,
      currency: 'INR',
      name: 'Darshu Store',
      description: 'Order Payment',
      order_id: createdOrderId,
      config: {
        display: {
          blocks: {
            upi: {
              name: "Pay via UPI",
              instruments: [
                {
                  method: "upi",
                },
              ],
            },
          },
          sequence: ["block.upi", "block.method"],
          preferences: {
            show_default_blocks: true,
          },
        },
      },
      handler: async (response: any) => {
        try {
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails: {
                userEmail,
                customerName: contactName || userProfile?.name || userEmail?.split('@')[0] || 'Guest',
                customerEmail: userEmail,
                cartItems,
                subtotal,
                shipping,
                total,
                discount,
                couponCode: appliedCoupon?.code,
                paymentMethod: 'online',
                shippingAddress: selectedAddress ? {
                  ...selectedAddress,
                  phone: contactPhone || userProfile?.phone || selectedAddress.phone || 'N/A',
                } : null,
              },
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            await clearCart.mutateAsync({ email: userEmail || '' });
            setPaymentStatus('success');
            toast.success('Payment successful!');
          } else {
            setPaymentStatus('failed');
            toast.error('Payment verification failed');
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          setPaymentStatus('failed');
          toast.error('Payment verification failed');
        }
      },
      prefill: {
        email: userEmail || '',
      },
      theme: {
        color: '#7C3AED',
      },
      modal: {
        ondismiss: () => {
          setPaymentStatus('idle');
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <RazorpayScript onLoad={() => setRazorpayLoaded(true)} />
      {paymentStatus === 'success' && (
        <PaymentSuccessModal 
          onContinue={() => router.push('/')} 
        />
      )}
      {paymentStatus === 'failed' && (
        <PaymentFailedModal 
          onRetry={() => setPaymentStatus('idle')} 
          onChangeMethod={() => setPaymentStatus('idle')} 
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-purple-600 hover:text-purple-800"
          >
            ← Back to cart
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-xs text-gray-500">Confirm your details and place your order</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Contact information</h2>
                  <p className="text-xs text-gray-500">We'll use these details to share order updates.</p>
                </div>
                <span className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold flex items-center justify-center">1</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={userEmail || ''}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Customer name</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Mobile number</label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Coupon code</h2>
                  <p className="text-xs text-gray-500">Have a discount code? Apply it here.</p>
                </div>
                <span className="h-8 w-8 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold flex items-center justify-center">2</span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-800">{appliedCoupon.code}</p>
                    <p className="text-xs text-green-600">
                      {appliedCoupon.discountType === 'percentage' 
                        ? `${appliedCoupon.discountValue}% off` 
                        : `₹${appliedCoupon.discountValue} off`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedCoupon(null);
                      setDiscount(0);
                      setCouponCode('');
                      setCouponError('');
                    }}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white uppercase"
                    />
                    <button
                      type="button"
                      className="px-6 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.status === 'active');
                        if (!coupon) {
                          setCouponError('Invalid coupon code');
                          return;
                        }
                        if (subtotal < coupon.minimumOrderAmount) {
                          setCouponError(`Minimum order amount ₹${coupon.minimumOrderAmount} required`);
                          return;
                        }
                        const now = new Date();
                        if (new Date(coupon.startDate) > now || new Date(coupon.endDate) < now) {
                          setCouponError('Coupon has expired');
                          return;
                        }
                        
                        let discountAmount = 0;
                        if (coupon.discountType === 'percentage') {
                          discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
                          if (coupon.maximumDiscountAmount && discountAmount > coupon.maximumDiscountAmount) {
                            discountAmount = coupon.maximumDiscountAmount;
                          }
                        } else {
                          discountAmount = coupon.discountValue;
                        }
                        setDiscount(discountAmount);
                        setAppliedCoupon(coupon);
                        setCouponError('');
                      }}
                      disabled={!couponCode}
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-sm text-red-600 mt-2">{couponError}</p>
                  )}
                  {coupons.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">Available coupons:</p>
                      <div className="flex flex-wrap gap-2">
                        {coupons.filter(c => c.status === 'active').slice(0, 3).map(coupon => (
                          <button
                            key={coupon._id}
                            type="button"
                            onClick={() => setCouponCode(coupon.code)}
                            className="px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded border border-purple-200 hover:bg-purple-100"
                          >
                            {coupon.code}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Shipping address</h2>
                  <p className="text-xs text-gray-500">Choose where you want your order delivered.</p>
                </div>
                <span className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold flex items-center justify-center">3</span>
              </div>

              <AddressForm onAddressSelect={setSelectedAddress} />
            </div>

          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-4 sticky top-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900">Order summary</h2>
                <span className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold flex items-center justify-center">1</span>
              </div>

              <div className="border rounded-lg p-3 mb-3">
                {cartItems.slice(0, 1).map((item, idx) => {
                  const sizeData = item.variant?.sizes?.find((s: any) => s.size === item.size) || item.variant?.sizes?.[0];
                  const unitPrice = sizeData?.sellingPrice || 0;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.variant?.thumbnail || item.product?.image || '/placeholder.svg'}
                          alt={item.product?.name || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2">{item.product?.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{unitPrice.toLocaleString()}</p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">₹{(unitPrice * item.quantity).toLocaleString()}</div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span className="text-green-600 font-medium">{discount > 0 ? `-₹${discount.toLocaleString()}` : '₹0'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-gray-900 font-medium">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">Total</span>
                  <span className="text-2xl font-bold text-green-600">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 border rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900">Secure checkout</p>
                <p className="text-xs text-gray-500 mt-1">Payments and personal data are protected.</p>

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={!razorpayLoaded || total <= 0}
                  className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {paymentStatus === 'processing' ? 'Processing...' : razorpayLoaded ? 'Proceed to Payment' : 'Loading Payment...'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Payment Success Modal
const PaymentSuccessModal = ({ onContinue }: { onContinue: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-8 max-w-md mx-4 text-center"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
      <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
      <button
        onClick={onContinue}
        className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
      >
        Continue Shopping
      </button>
    </motion.div>
  </motion.div>
);

// Payment Failed Modal
const PaymentFailedModal = ({ onRetry, onChangeMethod }: { onRetry: () => void; onChangeMethod: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-8 max-w-md mx-4 text-center"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
        <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
      <p className="text-gray-600 mb-6">Sorry, your payment could not be processed.</p>
      <div className="flex flex-col gap-3">
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onChangeMethod}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Go Back
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const AddressForm = ({ onAddressSelect }: { onAddressSelect: (address: any) => void }) => {
  const { data: userProfile } = useGetProfile();
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  
  // Set default address when profile loads
  useEffect(() => {
    if (userProfile?.addresses && userProfile.addresses.length > 0) {
      const defaultAddress = userProfile.addresses.find(addr => addr.isDefault) || userProfile.addresses[0];
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
        onAddressSelect(defaultAddress);
        setFormData({
          fullName: userProfile.name || '',
          phone: userProfile.phone || '',
          address: defaultAddress.address || '',
          city: defaultAddress.city || '',
          state: defaultAddress.state || '',
          zipCode: defaultAddress.zipCode || '',
        });
      }
    }
  }, [userProfile, onAddressSelect]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddressSelect = (addressStr: string) => {
    const address = JSON.parse(addressStr);
    setSelectedAddress(address);
    onAddressSelect(address);
    setFormData({
      fullName: userProfile?.name || '',
      phone: userProfile?.phone || '',
      address: address.address || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Address Selection */}
      {userProfile?.addresses && userProfile.addresses.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Select Delivery Address</h3>
          <div className="space-y-3">
            {userProfile.addresses.map((address, index) => (
              <div 
                key={index}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedAddress && selectedAddress.address === address.address && selectedAddress.city === address.city ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400'}`}
                onClick={() => handleAddressSelect(JSON.stringify(address))}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    checked={!!(selectedAddress && selectedAddress.address === address.address && selectedAddress.city === address.city)}
                    onChange={() => handleAddressSelect(JSON.stringify(address))}
                    className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500"
                  />
                  <div className="ml-3">
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-900">{address.title}</h4>
                      {address.isDefault && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{userProfile?.name || ''}</p>
                    <p className="text-gray-600 text-sm">{address.address}</p>
                    <p className="text-gray-600 text-sm">{address.city}, {address.state} {address.zipCode}</p>
                    <p className="text-gray-600 text-sm">{address.country}</p>
                    <p className="text-gray-600 text-sm">{userProfile?.phone || ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowNewAddressForm(!showNewAddressForm)}
              className="text-purple-600 hover:text-purple-800 font-medium text-sm"
            >
              + Add New Address
            </button>
          </div>
        </div>
      )}
      
      {/* New Address Form */}
      {(showNewAddressForm || !userProfile?.addresses || userProfile.addresses.length === 0) && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">{userProfile?.addresses && userProfile.addresses.length > 0 ? 'Add New Address' : 'Delivery Address'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your address"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your state"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your ZIP code"
              />
            </div>
          </div>
        </div>
      )}
      
      
    </div>
  );
};


const OrderReview = ({ cartItems, subtotal, shipping, total, deliveryAddress }: { cartItems: any[], subtotal: number, shipping: number, total: number, deliveryAddress: any }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {cartItems.map((item, index) => (
          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 w-14 h-14 relative rounded-md overflow-hidden bg-gray-200">
              {/* Product Image */}
              <img
                src={item.variant?.thumbnail || item.product?.image || '/placeholder.svg'}
                alt={item.product?.name || 'Product'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3 flex-grow">
              <h3 className="font-medium text-gray-900">{item.product?.name}</h3>
              <p className="text-sm text-gray-600">{item.variant?.color} • Size: {item.size}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">
                ₹{(item.variant?.sizes?.find((s: any) => s.size === item.size)?.sellingPrice || 0) * item.quantity}
              </p>
              <p className="text-sm text-gray-500">
                ₹{item.variant?.sizes?.find((s: any) => s.size === item.size)?.sellingPrice || 0} × {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
          <span>Total</span>
          <span className="text-purple-600">₹{total.toLocaleString()}</span>
        </div>
      </div>
      
      {/* Delivery Address Summary */}
      {deliveryAddress && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-medium text-gray-900 mb-2">Delivery Address</h3>
          <div className="text-sm text-gray-600">
            <p>{deliveryAddress.title}</p>
            <p>{deliveryAddress.address}</p>
            <p>{deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zipCode}</p>
            <p>{deliveryAddress.country}</p>
          </div>
        </div>
      )}
      
      
    </div>
  );
};
