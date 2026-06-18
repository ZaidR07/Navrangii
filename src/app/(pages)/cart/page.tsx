"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/cart/useCart';
import { useRemoveFromCart } from '@/hooks/cart/useRemoveFromCart';
import { useUpdateCartQuantity } from '@/hooks/cart/useUpdateCartQuantity';
import { useGetCoupons } from '@/hooks/coupon/useGetCoupons';
import { motion } from 'framer-motion';
import { X, ShoppingCart, Tag, Calendar, Check } from 'lucide-react';
import CartLoginModal from '@/components/cart/CartLoginModal';
import CartItem from '@/components/cart/CartItem';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { CartItem as CartItemType } from '@/hooks/cart/useCart';
import { Coupon } from '@/lib/types/couponType';
import { useAuth } from '@/context/UserContext';
import { useCurrentAdmin } from '@/hooks/admin/useCurrentAdmin';

import NavigationHeader from '@/components/NavigationHeader';
import Footer from '@/components/Footer';

export default function CartPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [undoItems, setUndoItems] = useState<any[]>([]);
  const [undoTimers, setUndoTimers] = useState<Record<string, NodeJS.Timeout>>({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [showCouponList, setShowCouponList] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  const { user } = useAuth();
  const { data: currentAdmin } = useCurrentAdmin();
  const isAdminUser = currentAdmin?.isAdmin === true;
  
  const { data: coupons = [] } = useGetCoupons();
  
  useEffect(() => {
    const emailFromAuthOrCookie = user?.email || Cookies.get('userEmail') || '';
    setUserEmail(emailFromAuthOrCookie);
  }, [user?.email]);

  useEffect(() => {
    if (isAdminUser) {
      router.replace('/admin/dashboard');
    }
  }, [isAdminUser, router]);
  
  const { data: cartData, isLoading, isError, refetch } = useCart(userEmail);
  const removeMutation = useRemoveFromCart();
  const updateQuantityMutation = useUpdateCartQuantity();
  
  // Filter out items that are in undo state
  const cartItems = (cartData?.cart || []).filter(
    (item: CartItemType) => !undoItems.some(undoItem => 
      undoItem.productId === item.productId && 
      undoItem.variantId === item.variantId && 
      undoItem.size === item.size
    )
  );
  
  // Calculate totals using the new variant data structure
  const subtotal = cartItems.reduce((total, item) => {
    // Use the variant field directly, fallback to old method if not available
    const selectedVariant = item.variant || (item.variantId 
      ? item.product?.variants?.find((v: any) => v._id === item.variantId)
      : item.product?.variants?.[0]);
    const sizeData = selectedVariant?.sizes?.find((s: any) => s.size === item.size) || selectedVariant?.sizes?.[0];
    const price = sizeData?.sellingPrice || 0;
    return total + (price * item.quantity);
  }, 0);
  
  // Calculate discount
  const calculateDiscount = () => {
    if (!appliedCoupon || subtotal < appliedCoupon.minimumOrderAmount) return 0;
    
    let discount = 0;
    if (appliedCoupon.discountType === 'percentage') {
      discount = (subtotal * appliedCoupon.discountValue) / 100;
      if (appliedCoupon.maximumDiscountAmount) {
        discount = Math.min(discount, appliedCoupon.maximumDiscountAmount);
      }
    } else {
      discount = appliedCoupon.discountValue;
    }
    
    return Math.min(discount, subtotal); // Ensure discount doesn't exceed subtotal
  };
  
  const discount = calculateDiscount();
  const shipping = 99;
  const total = subtotal - discount + shipping;
  
  const handleLoginRequired = () => {
    setIsLoginModalOpen(true);
  };
  
  const handleLoginSuccess = (email: string) => {
    setIsLoginModalOpen(false);
    refetch();
  };
  
  const applyCoupon = (code: string) => {
    const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    if (coupon) {
      // Check if coupon is valid - compare dates only (ignore time)
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startDate = new Date(coupon.startDate);
      const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const endDate = new Date(coupon.endDate);
      const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      
      if (coupon.status !== 'active') {
        alert('This coupon is not active');
        return;
      }
      
      if (today < startDay) {
        alert('This coupon is not yet valid');
        return;
      }
      
      if (today > endDay) {
        alert('This coupon has expired');
        return;
      }
      
      if (coupon.usedCount >= coupon.usageLimit) {
        alert('This coupon has reached its usage limit');
        return;
      }
      
      if (subtotal < coupon.minimumOrderAmount) {
        alert(`Minimum order amount is ₹${coupon.minimumOrderAmount}`);
        return;
      }
      
      setAppliedCoupon(coupon);
      setShowCouponList(false);
    } else {
      alert('Invalid coupon code');
    }
  };
  
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };
  
  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      applyCoupon(couponCode.trim());
    }
  };
  
  const handleCouponSelect = (coupon: Coupon) => {
    setCouponCode(coupon.code);
    applyCoupon(coupon.code);
  };
  
  const removeFromCart = async (productId: string, variantId: string | undefined, size: string) => {
    if (!userEmail) return;
    
    // Find the item being removed
    const itemToRemove = (cartData?.cart || []).find(
      (item: any) => item.productId === productId && item.variantId === variantId && item.size === size
    );
    
    if (itemToRemove) {
      // Add to undo items
      setUndoItems(prev => [...prev, itemToRemove]);
      
      // Set a timer to actually remove after 2 seconds
      const timer = setTimeout(async () => {
        try {
          await removeMutation.mutateAsync({ 
            email: userEmail, 
            productId,
            variantId,
            size
          });
          // Refetch the cart data after successful removal
          refetch();
          // Remove from undo items
          setUndoItems(prev => prev.filter(item => 
            !(item.productId === productId && item.variantId === variantId && item.size === size)
          ));
          // Clear the timer
          setUndoTimers(prev => {
            const newTimers = { ...prev };
            const key = `${productId}-${variantId || 'default'}-${size}`;
            delete newTimers[key];
            return newTimers;
          });
        } catch (error) {
          console.error('Error removing from cart:', error);
          // Remove from undo items even if there's an error
          setUndoItems(prev => prev.filter(item => 
            !(item.productId === productId && item.variantId === variantId && item.size === size)
          ));
        }
      }, 2000);
      
      // Store the timer so it can be cleared if undo is clicked
      const key = `${productId}-${variantId || 'default'}-${size}`;
      setUndoTimers(prev => ({ ...prev, [key]: timer }));
    }
  };
  
  const undoRemove = (productId: string, variantId: string | undefined, size: string) => {
    const key = `${productId}-${variantId || 'default'}-${size}`;
    // Clear the timer for this item
    if (undoTimers[key]) {
      clearTimeout(undoTimers[key]);
      setUndoTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[key];
        return newTimers;
      });
    }
    
    // Remove from undo items
    setUndoItems(prev => prev.filter(item => 
      !(item.productId === productId && item.variantId === variantId && item.size === size)
    ));
  };
  
  const updateQuantity = async (productId: string, variantId: string | undefined, size: string, quantity: number) => {
    if (!userEmail) return;
    
    try {
      await updateQuantityMutation.mutateAsync({
        email: userEmail,
        productId,
        variantId,
        size,
        quantity
      });
      // Refetch the cart data after successful update
      refetch();
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };
  
  if (!userEmail || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <X className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Error loading cart</h3>
            <p className="text-gray-500 mb-6">There was a problem loading your cart. Please try again later.</p>
            <button 
              onClick={() => refetch()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
      <NavigationHeader />
      <div className="py-8 mt-36 lg:mt-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end mb-8" />
          
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <ShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add items to your cart by clicking the "Add to Cart" button on product pages</p>
              <button 
                onClick={() => router.push('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems.map((item: any, index: number) => (
                    <CartItem 
                      key={`${item.productId}-${item.variantId || 'default'}-${item.size}-${index}`} 
                      item={item} 
                      onRemove={removeFromCart} 
                      onUpdateQuantity={updateQuantity}
                    />
                  ))}
                  
                  {/* Undo items - these are temporarily hidden but still in the DOM for undo functionality */}
                  {undoItems.map((item: any) => {
                    const key = `${item.productId}-${item.variantId || 'default'}-${item.size}`;
                    return (
                      <div key={`undo-${key}`} className="relative">
                        <CartItem 
                          key={key} 
                          item={item} 
                          onRemove={() => {}} // No-op since it's being removed
                          onUpdateQuantity={() => {}} // No-op since it's being removed
                        />
                        <div className="fixed bottom-4 right-4 bg-white text-purple-600 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center border border-gray-200">
                          <span className="text-sm mr-3">Removed from cart</span>
                          <button 
                            onClick={() => undoRemove(item.productId, item.variantId, item.size)}
                            className="text-sm font-semibold text-purple-600 hover:text-purple-800"
                          >
                            Undo
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-36">
                  {/* Coupon Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Apply Coupon</h3>
                    
                    {appliedCoupon ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <Check className="h-5 w-5 text-green-600 mr-2" />
                              <span className="font-semibold text-green-800">{appliedCoupon.code}</span>
                            </div>
                            <p className="text-sm text-green-700 mt-1">{appliedCoupon.description}</p>
                            <div className="flex items-center text-xs text-green-600 mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Valid until {new Date(appliedCoupon.endDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <button 
                            onClick={removeCoupon}
                            className="text-green-600 hover:text-green-800"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="mt-2 text-sm text-green-700">
                          <span>You saved ₹{discount.toLocaleString()}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter coupon code"
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <button
                            onClick={handleApplyCoupon}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                        
                        <div className="relative">
                          <button
                            onClick={() => setShowCouponList(!showCouponList)}
                            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                          >
                            {showCouponList ? 'Hide available coupons' : 'View available coupons'}
                          </button>
                          
                          {showCouponList && (
                            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {coupons.length > 0 ? (
                                coupons
                                  .filter(coupon => {
                                    const now = new Date();
                                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                                    const startDate = new Date(coupon.startDate);
                                    const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                                    const endDate = new Date(coupon.endDate);
                                    const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                                    return coupon.status === 'active' && today >= startDay && today <= endDay;
                                  })
                                  .map((coupon) => (
                                    <div 
                                      key={coupon._id}
                                      className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                                      onClick={() => handleCouponSelect(coupon)}
                                    >
                                      <div className="flex justify-between">
                                        <span className="font-semibold text-purple-700">{coupon.code}</span>
                                        <span className="text-sm font-medium">
                                          {coupon.discountType === 'percentage' 
                                            ? `${coupon.discountValue}% OFF`
                                            : `₹${coupon.discountValue} OFF`}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                                      <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-500">
                                          Min. ₹{coupon.minimumOrderAmount}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          Valid until {new Date(coupon.endDate).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  ))
                              ) : (
                                <div className="p-4 text-center text-gray-500">
                                  No coupons available
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">₹{shipping}</span>
                    </div>
                    {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        <span>Coupon ({appliedCoupon.code})</span>
                      </div>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-purple-600">₹{total.toLocaleString()}</span>
                  </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      if (isAdminUser) {
                        return;
                      }
                      router.push('/checkout');
                    }}
                    disabled={isAdminUser}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Free shipping on orders above ₹999
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="pb-24" />
      <Footer />
      <CartLoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </div>
  );
}
