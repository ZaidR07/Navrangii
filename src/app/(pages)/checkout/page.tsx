"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/cart/useCart';
import { useGetProfile } from '@/hooks/user/useProfile';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  
  // Fetch user profile to get addresses
  const { data: userProfile } = useGetProfile(userEmail || '');
  
  // Check if user is logged in
  useEffect(() => {
    const email = Cookies.get('userEmail');
    if (!email) {
      router.push('/cart');
    } else {
      setUserEmail(email);
    }
  }, [router]);
  
  const { data: cartData, isLoading } = useCart(userEmail || '');
  
  // Calculate totals
  const cartItems = cartData?.cart || [];
  const subtotal = cartItems.reduce((total, item) => {
    // Use the variant field directly
    const selectedVariant = item.variant;
    const sizeData = selectedVariant?.sizes?.find((s: any) => s.size === item.size) || selectedVariant?.sizes?.[0];
    const price = sizeData?.sellingPrice || 0;
    return total + (price * item.quantity);
  }, 0);
  
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your purchase</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">Step 1</span>
              </div>
              
              <AddressForm onAddressSelect={setSelectedAddress} />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">Step 2</span>
              </div>
              
              <PaymentOptions />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Review</h2>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">Step 3</span>
              </div>
              
              <OrderReview 
                cartItems={cartItems} 
                subtotal={subtotal} 
                shipping={shipping} 
                total={total} 
                deliveryAddress={selectedAddress}
              />
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-purple-600">₹{total.toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                onClick={() => router.push('/payment')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Proceed to Payment
              </button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                By placing your order, you agree to our <a href="#" className="text-purple-600 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      
      <div className="flex justify-end">
        <button
          type="button"
          className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

const PaymentOptions = () => {
  const [selectedPayment, setSelectedPayment] = useState('credit-card');
  
  const paymentMethods = [
    { id: 'credit-card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'upi', name: 'UPI', icon: '📲' },
    { id: 'net-banking', name: 'Net Banking', icon: '🏦' },
    { id: 'cash-on-delivery', name: 'Cash on Delivery', icon: '💵' },
  ];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div 
            key={method.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedPayment === method.id ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400'}`}
            onClick={() => setSelectedPayment(method.id)}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">{method.icon}</span>
              <span className="font-medium text-gray-900">{method.name}</span>
            </div>
          </div>
        ))}
      </div>
      
      {selectedPayment === 'credit-card' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 border border-gray-300 rounded-lg"
        >
          <h3 className="font-medium text-gray-900 mb-3">Card Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="123"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Name on card"
              />
            </div>
          </div>
        </motion.div>
      )}
      
      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
};

const OrderReview = ({ cartItems, subtotal, shipping, total, deliveryAddress }: { cartItems: any[], subtotal: number, shipping: number, total: number, deliveryAddress: any }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {cartItems.map((item, index) => (
          <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 w-16 h-16 relative rounded-md overflow-hidden bg-gray-200">
              {/* Product Image */}
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
            </div>
            <div className="ml-4 flex-grow">
              <h3 className="font-medium text-gray-900">{item.product?.name}</h3>
              <p className="text-sm text-gray-600">{item.variant?.color} • Size: {item.size}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">
                ₹{(item.variant?.sizes?.find((s: any) => s.size === item.size)?.sellingPrice || 0) * item.quantity}
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
      
      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};
