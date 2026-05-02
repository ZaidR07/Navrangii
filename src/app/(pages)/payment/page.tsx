"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/cart/useCart';
import { useClearCart } from '@/hooks/cart/useClearCart';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { CheckCircle, CreditCard, Smartphone, Building, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import RazorpayScript from '@/components/payment/RazorpayScript';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit-card');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [razorpayKey, setRazorpayKey] = useState<string>('');
  
  const { data: cartData } = useCart(userEmail || '');
  const clearCart = useClearCart();
  
  // Check if user is logged in
  useEffect(() => {
    const email = Cookies.get('userEmail');
    if (!email) {
      router.push('/cart');
    } else {
      setUserEmail(email);
    }
  }, [router]);
  
  // Calculate totals
  const cartItems = cartData?.cart || [];
  const subtotal = cartItems.reduce((total, item) => {
    const selectedVariant = item.variant;
    const sizeData = selectedVariant?.sizes?.find((s: any) => s.size === item.size) || selectedVariant?.sizes?.[0];
    const price = sizeData?.sellingPrice || 0;
    return total + (price * item.quantity);
  }, 0);
  
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;
  
  // Create Razorpay order
  const createOrder = async () => {
    try {
      setPaymentStatus('processing');
      
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
      setRazorpayKey(data.key || '');
      return { orderId: data.orderId, key: data.key };
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to initialize payment');
      setPaymentStatus('failed');
      return null;
    }
  };

  // Handle Razorpay payment
  const handlePayment = async () => {
    if (!window.Razorpay) {
      toast.error('Payment system not loaded. Please try again.');
      return;
    }
    
    const orderData = await createOrder();
    if (!orderData) return;

    const { orderId: createdOrderId, key } = orderData;
    
    if (!key) {
      toast.error('Payment configuration error. Please refresh the page.');
      return;
    }

    const options = {
      key: key,
      amount: total * 100,
      currency: 'INR',
      name: 'Darshu Store',
      description: 'Order Payment',
      order_id: createdOrderId,
      handler: async (response: any) => {
        // Verify payment
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
                cartItems,
                subtotal,
                shipping,
                total,
                paymentMethod: selectedPaymentMethod,
              },
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            // Clear cart after successful payment
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
  
  const handleContinueShopping = () => {
    router.push('/');
  };
  
  const getPaymentMethodIcon = () => {
    switch (selectedPaymentMethod) {
      case 'credit-card': return <CreditCard className="h-6 w-6" />;
      case 'upi': return <Smartphone className="h-6 w-6" />;
      case 'net-banking': return <Building className="h-6 w-6" />;
      case 'cash-on-delivery': return <DollarSign className="h-6 w-6" />;
      default: return <CreditCard className="h-6 w-6" />;
    }
  };
  
  const getPaymentMethodName = () => {
    switch (selectedPaymentMethod) {
      case 'credit-card': return 'Credit/Debit Card';
      case 'upi': return 'UPI';
      case 'net-banking': return 'Net Banking';
      case 'cash-on-delivery': return 'Cash on Delivery';
      default: return 'Credit/Debit Card';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <RazorpayScript onLoad={() => setRazorpayLoaded(true)} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          <p className="mt-2 text-gray-600">Complete your secure payment</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          {paymentStatus === 'idle' && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-6">
                {getPaymentMethodIcon()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Pay</h2>
              <p className="text-gray-600 mb-6">Click the button below to proceed with secure payment via Razorpay</p>
              
              <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-full bg-white shadow-sm mr-4">
                    {getPaymentMethodIcon()}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{getPaymentMethodName()}</p>
                    <p className="text-sm text-gray-600">Amount: ₹{total.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handlePayment}
                disabled={!razorpayLoaded || total <= 0}
                className="px-8 py-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {razorpayLoaded ? 'Pay Now' : 'Loading Payment...'}
              </button>
            </div>
          )}
          
          {paymentStatus === 'processing' && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
              <p className="text-gray-600 mb-6">Please wait while we securely process your payment...</p>
              
              <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-full bg-white shadow-sm mr-4">
                    {getPaymentMethodIcon()}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{getPaymentMethodName()}</p>
                    <p className="text-sm text-gray-600">Amount: ₹{total.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {paymentStatus === 'success' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-8">Your order has been placed successfully. Thank you for shopping with Navrangi!</p>
              
              <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID</span>
                    <span className="font-medium">#ORD-{Math.floor(Math.random() * 1000000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">{getPaymentMethodName()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-medium text-green-600">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items</span>
                    <span className="font-medium">{cartItems.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleContinueShopping}
                  className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => router.push('/profile/orders')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Order Details
                </button>
              </div>
            </motion.div>
          )}
          
          {paymentStatus === 'failed' && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
              <p className="text-gray-600 mb-8">Sorry, your payment could not be processed. Please try again.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setPaymentStatus('processing')}
                  className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/checkout')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Change Payment Method
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
