"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Package, Heart, User, MapPin, Phone, Mail, Edit3, CheckCircle, Truck, Clock, AlertCircle, ShoppingCart, X, CreditCard, Home, FileText, ChevronRight, HelpCircle } from "lucide-react";
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MySwal = withReactContent(Swal);
import "react-toastify/ReactToastify.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useGetProfile, useUpdateProfile } from '@/hooks/user/useProfile';
import { useAuth } from '@/context/UserContext';
import Cookies from 'js-cookie';
import WishlistItem from '@/components/wishlist/WishlistItem';
import { useWishlist } from '@/hooks/wishlist/useWishlist';
import { useGetOrdersByEmail } from '@/hooks/order/useGetOrders';
import AddressManager from '@/components/profile/AddressManager';
import NavigationHeader from '@/components/NavigationHeader';
import Footer from '@/components/Footer';
import { ProfilePageSkeleton, ProfileTabSkeleton } from '@/components/skeletons/site-skeletons';

interface Address {
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  addresses?: Address[];
  email: string;
}

const WishlistContent = () => {
  const { user } = useAuth();
  const email = Cookies.get('userEmail');
  
  const { data: wishlistData, isLoading, isError, error, refetch } = useWishlist(email || '');

  if (isLoading) {
    return <ProfileTabSkeleton />;
  }
  
  if (isError) {
    return (
      <div className="text-center py-12">
        <Heart className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading wishlist</h3>
        <p className="mt-1 text-sm text-gray-500">{error?.message || 'Failed to load wishlist items'}</p>
        <div className="mt-6">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  const wishlistItems = wishlistData?.wishlist || [];
  
  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Your wishlist is empty</h3>
        <p className="mt-1 text-sm text-gray-500">Save items that you like by clicking the heart icon on product pages</p>
        <div className="mt-6">
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {wishlistItems.map((item: any) => (
        <WishlistItem 
          key={item.productId} 
          item={item} 
          onRemove={() => refetch()} 
        />
      ))}
    </div>
  );
};

const OrdersContent = () => {
  const email = Cookies.get('userEmail');
  const { data, isLoading, isError, error } = useGetOrdersByEmail(email || '');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openDetails = (order: any) => { setSelectedOrder(order); setModalOpen(true); };
  
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<'cancellation' | 'return'>('cancellation');
  const [requestReason, setRequestReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestPhotos, setRequestPhotos] = useState<File[]>([]);
  const [requestVideo, setRequestVideo] = useState<File | null>(null);

  const fileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };

  const handleCancelClick = async (order: any) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9333ea', // purple-600
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/orders/request-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order._id,
            type: 'cancellation',
            reason: 'User cancelled via confirmation'
          })
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Order cancellation request submitted");
          window.location.reload();
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error("Failed to cancel order");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRequest = async () => {
    if (requestType === 'return' && !requestReason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    if (requestType === 'return') {
      if (requestPhotos.length < 2 || requestPhotos.length > 4) {
        toast.error('Please upload 2 to 4 photos');
        return;
      }
      const tooLargePhoto = requestPhotos.find((f) => f.size > 5 * 1024 * 1024);
      if (tooLargePhoto) {
        toast.error('Each photo must be <= 5MB');
        return;
      }
      if (requestVideo && requestVideo.size > 10 * 1024 * 1024) {
        toast.error('Video must be <= 10MB');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const photosBase64 = requestType === 'return'
        ? await Promise.all(requestPhotos.map((f) => fileToBase64(f)))
        : undefined;
      const videoBase64 = requestType === 'return' && requestVideo
        ? await fileToBase64(requestVideo)
        : undefined;

      const res = await fetch('/api/orders/request-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder._id,
          type: requestType,
          reason: requestReason,
          photosBase64,
          videoBase64,
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setRequestModalOpen(false);
        setRequestReason('');
        setRequestPhotos([]);
        setRequestVideo(null);
        // Refresh orders
        window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateInvoice = (order: any) => {
    try {
      console.log('Generating invoice for order:', order);
      const doc = new jsPDF() as any;
      const primaryColor = [147, 51, 234]; // purple-600 in RGB
      
      // Header Section
      doc.setFillColor(250, 245, 255); // Light purple background for header
      doc.rect(0, 0, 210, 25, 'F');
      
      // Add Logo
      try {
        doc.addImage('/logo.png', 'PNG', 14, 2, 35, 20);
      } catch (e) {
        // Fallback to text if image fails
        doc.setFontSize(24);
        doc.setTextColor(147, 51, 234);
        doc.setFont(undefined, 'bold');
        doc.text('NAVRANGII', 14, 15);
      }
      
      doc.setFontSize(18);
      doc.setTextColor(0);
      doc.text('TAX INVOICE', 196, 10, { align: 'right' });
      
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Order ID: ${order.orderId || order._id}`, 196, 15, { align: 'right' });
      const orderDate = new Date(order.createdAt);
      const formattedDate = `${orderDate.getDate().toString().padStart(2, '0')}/${(orderDate.getMonth() + 1).toString().padStart(2, '0')}/${orderDate.getFullYear()}`;
      doc.text(`Date: (${formattedDate})`, 196, 19, { align: 'right' });

      // Billing Info Section
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.setFont(undefined, 'bold');
      doc.text('Bill From:', 14, 34);
      doc.text('Bill To:', 196, 34, { align: 'right' });

      doc.setFontSize(9);
      doc.setTextColor(80);
      doc.setFont(undefined, 'normal');
      
      // From Info
      doc.text('Navrangii Store', 14, 40);
      doc.text('A-310, Pramukh Avenue', 14, 44);
      doc.text('Nallasopara West, Palghar, MH 401203', 14, 48);
      doc.text('Email: support@navrangii.com', 14, 52);
      doc.text('Phone: +91 86260 72002', 14, 56);

      // To Info
      const addr = order.shippingAddress || order.address || {};
      const customerName = order.customerName || addr.fullName || 'Customer';
      doc.text(customerName, 196, 40, { align: 'right' });
      
      // Right align address lines manually for better control
      const addressLine = addr.addressLine1 || addr.address || 'N/A';
      const cityStateZip = `${addr.city || ''}, ${addr.state || ''} ${addr.postalCode || addr.pin || ''}`;
      
      doc.text(addressLine, 196, 44, { align: 'right', maxWidth: 80 });
      doc.text(cityStateZip, 196, 52, { align: 'right' });
      
      const phoneNum = order.customerPhone || order.phone || addr.phone || 'N/A';
      doc.text(`Phone: ${phoneNum}`, 196, 56, { align: 'right' });

      // Items Table
      const items = Array.isArray(order.cartItems)
        ? order.cartItems
        : (Array.isArray(order.items) ? order.items : []);

      const getUnitPrice = (item: any) => {
        const direct = Number(item?.price);
        if (!Number.isNaN(direct) && direct > 0) return direct;

        const selectedVariant = item?.variant;
        const sizeRow = selectedVariant?.sizes?.find((s: any) => s.size === item?.size) || selectedVariant?.sizes?.[0];
        const fromVariant = Number(sizeRow?.sellingPrice);
        if (!Number.isNaN(fromVariant) && fromVariant > 0) return fromVariant;

        return 0;
      };

      const itemsComputed = items.map((item: any, idx: number) => {
        const qty = Number(item?.quantity) || 1;
        const unitPrice = getUnitPrice(item);
        const lineTotal = unitPrice * qty;

        const productName = item?.product?.name || item?.productName || 'Product';
        const variantInfo = [item?.variant?.color, item?.size].filter(Boolean).join(', ');
        const fullDescription = variantInfo ? `${productName}\n(${variantInfo})` : productName;

        return {
          sn: idx + 1,
          fullDescription,
          qty,
          unitPrice,
          lineTotal,
        };
      });

      const subtotal = itemsComputed.reduce((sum: number, r: any) => sum + r.lineTotal, 0);
      const discount = Number(order?.discount) || 0;
      const shipping = Number(order?.shipping) || 0;
      const totalAmount = (order.total || (subtotal + shipping - discount));

      const tableBody = [
        ...itemsComputed.map((r: any) => ([
          String(r.sn),
          r.fullDescription,
          String(r.qty),
          `Rs. ${r.unitPrice.toLocaleString()}`,
          `Rs. ${r.lineTotal.toLocaleString()}`,
        ])),
        // Summary rows
        ['', '', '', 'Subtotal', `Rs. ${subtotal.toLocaleString()}`],
        ...(discount > 0 ? [['', '', '', 'Discount', `-Rs. ${discount.toLocaleString()}`]] : []),
        ['', '', '', 'Shipping', shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`],
        ['', '', '', 'TOTAL', `Rs. ${totalAmount.toLocaleString()}`],
      ];

      autoTable(doc, {
        startY: 65,
        head: [[
          'No.',
          'Product Description',
          'Qty',
          'Price',
          'Amount'
        ]],
        body: tableBody,
        headStyles: {
          fillColor: [0, 0, 0],
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle',
        },
        bodyStyles: {
          fontSize: 9,
          textColor: 0,
          valign: 'top',
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 15 },
          1: { halign: 'left', cellWidth: 105 },
          2: { halign: 'center', cellWidth: 15 },
          3: { halign: 'right', cellWidth: 23 },
          4: { halign: 'right', cellWidth: 24 },
        },
        margin: { left: 14, right: 14 },
        theme: 'grid',
        styles: { 
          overflow: 'linebreak', 
          lineColor: [0, 0, 0], 
          lineWidth: 0.2,
          cellPadding: 3
        },
        didParseCell: (data: any) => {
          // Identify if it's a summary row
          const isSummaryRow = data.row.index >= itemsComputed.length;
          if (isSummaryRow) {
            // Apply bold for summary labels and values
            if (data.column.index >= 3) {
              data.cell.styles.fontStyle = 'bold';
            }
            
            // Special styling for the TOTAL row
            const totalRowIndex = tableBody.length - 1;
            if (data.row.index === totalRowIndex) {
              data.cell.styles.fillColor = [240, 240, 240];
              data.cell.styles.fontSize = 11;
            }

            // Ensure all vertical lines are drawn and connected
            if (data.column.index < 3) {
              // Draw borders to ensure vertical lines are continuous
              if (data.column.index === 0) {
                data.cell.styles.lineWidth = { top: 0, right: 0.2, bottom: 0.2, left: 0.2 };
              } else {
                data.cell.styles.lineWidth = { top: 0, right: 0.2, bottom: 0.2, left: 0 };
              }
              data.cell.text = '';
            } else {
              // Ensure horizontal lines between summary rows are drawn
              data.cell.styles.lineWidth = { top: 0, right: 0.2, bottom: 0.2, left: 0 };
            }
          }
        }
      });

      let currentY = ((doc as any).lastAutoTable?.finalY || 160) + 10;

      // Compact Footer (Placed directly below table)
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.setFont(undefined, 'normal');
      doc.text('This is a computer generated invoice and does not require a signature.', 105, currentY, { align: 'center' });
      
      doc.setTextColor(147, 51, 234);
      doc.setFont(undefined, 'bold');
      // doc.text('www.navrangii.com', 105, currentY + 5, { align: 'center' });

      doc.save(`Invoice-${order.orderId || order._id}.pdf`);
      toast.success("Invoice downloaded");
    } catch (error) {
      console.error('Invoice generation error:', error);
      toast.error("Failed to generate invoice");
    }
  };

  const getStatusConfig = (order: any) => {
    const s = (order.paymentStatus === 'paid' || order.paymentStatus === 'success') ? 'confirmed' : (order.status || 'pending');
    const map: Record<string, {label: string; cls: string}> = {
      pending: {label:'Pending', cls:'bg-yellow-100 text-yellow-800'},
      confirmed: {label:'Order Confirmed', cls:'bg-blue-100 text-blue-800'},
      processing: {label:'Processing', cls:'bg-purple-100 text-purple-800'},
      shipped: {label:'Shipped', cls:'bg-indigo-100 text-indigo-800'},
      delivered: {label:'Delivered', cls:'bg-green-100 text-green-800'},
      cancelled: {label:'Cancelled', cls:'bg-red-100 text-red-800'},
    };
    // Prioritize 'cancelled' status if it exists in order.status or order.orderStatusUpdate.status
    if (order.status === 'cancelled' || order.orderStatusUpdate?.status === 'cancelled') {
      return map.cancelled;
    }
    return map[s] || map.pending;
  };
  const getTimeline = (order: any) => {
    const status = (order.paymentStatus === 'paid' || order.paymentStatus === 'success') ? 'confirmed' : (order.status || 'pending');
    
    if (order.status === 'cancelled' || order.orderStatusUpdate?.status === 'cancelled') {
      return [
        {id:'pending', label:'Order Placed', desc:'Your order has been placed successfully', done: true, current: false},
        {id:'cancelled', label:'Order Cancelled', desc:'Your order has been cancelled', done: true, current: true, isError: true},
      ];
    }

    const steps = ['pending','confirmed','shipped','delivered'];
    const idx = steps.indexOf(status === 'processing' ? 'confirmed' : status);
    return [
      {id:'pending', label:'Order Placed', desc:'Your order has been placed successfully', done: idx>=0, current: status==='pending'},
      {id:'confirmed', label:'Order Confirmed', desc:'Seller has confirmed your order', done: idx>=1, current: status==='confirmed'},
      {id:'shipped', label:'Shipped', desc:'Your item has been shipped', done: idx>=2, current: status==='shipped'},
      {id:'delivered', label:'Out for Delivery', desc:'Courier is out for delivery', done: idx>=3, current: status==='delivered'},
    ];
  };

  if (isLoading) {
    return <ProfileTabSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading orders</h3>
        <p className="mt-1 text-sm text-gray-500">{error?.message || 'Failed to load your orders'}</p>
      </div>
    );
  }

  const orders = data?.orders || [];

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400 text-4xl">📦</div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by placing your first order.</p>
        <div className="mt-6">
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
        <button onClick={() => window.location.href='/'} className="text-purple-600 text-sm font-medium hover:text-purple-800 flex items-center gap-1">
          Continue Shopping <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Order Cards */}
      {orders.map((order: any) => {
        const cfg = getStatusConfig(order);
        const first = order.cartItems?.[0] || order.items?.[0];
        const count = (order.cartItems?.length || order.items?.length || 1);
        const date = new Date(order.createdAt);
        const tl = getTimeline(order);

        return (
          <div key={order._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Order ID:</span>
                <span className="text-sm font-semibold text-gray-900">{order.orderId || order._id.slice(-6)}</span>
                <button onClick={() => navigator.clipboard.writeText(order.orderId || order._id)} className="text-gray-400 hover:text-gray-600" title="Copy">
                  <FileText className="h-3.5 w-3.5" />
                </button>
              </div>
              <button className="text-xs text-gray-500 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" /> Help
              </button>
            </div>

            {/* Product */}
            <div className="px-4 py-4 flex gap-4">
              <div className="w-20 h-24 bg-gray-50 rounded overflow-hidden flex-shrink-0 border relative">
                <Image src={first?.variant?.thumbnail || first?.product?.image || first?.imageUrl || "/placeholder.svg"} alt={first?.product?.name || first?.productName || "Product"} fill sizes="80px" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{first?.product?.name || first?.productName || "Product"}</h3>
                <p className="text-xs text-gray-500 mt-1">Qty: {first?.quantity || 1}</p>
                {count > 1 && <p className="text-xs text-gray-400 mt-0.5">+{count - 1} more item{count > 2 ? 's' : ''}</p>}
                <p className="text-sm font-bold text-gray-900 mt-2">₹{order.total?.toLocaleString() || 0}</p>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              {/* <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
                  <Clock className="h-3 w-3" /> {cfg.label}
                </span>
              </div> */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <button onClick={() => openDetails(order)} className="text-purple-600 font-medium hover:text-purple-800 flex items-center gap-1">
                    See all updates <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {['pending', 'confirmed'].includes(order.paymentStatus === 'paid' || order.paymentStatus === 'success' ? 'confirmed' : (order.status || 'pending')) && order.status !== 'cancelled' && order.orderStatusUpdate?.status !== 'cancelled' && (
                    <button 
                      onClick={() => handleCancelClick(order)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1 border border-red-200 rounded-md hover:bg-red-50"
                    >
                      Cancellation Request
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <button 
                      onClick={() => {
                        setSelectedOrder(order);
                        setRequestType('return');
                        setRequestModalOpen(true);
                      }}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium px-3 py-1 border border-purple-200 rounded-md hover:bg-purple-50"
                    >
                      Return / Exchange
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Request Modal (Cancellation/Return) */}
      <Dialog open={requestModalOpen} onOpenChange={setRequestModalOpen}>
        <DialogContent className="max-w-md bg-white p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {requestType === 'cancellation' ? 'Request Cancellation' : 'Request Return / Exchange'}
            </DialogTitle>
            <div className="text-sm text-gray-500 mt-2">
              {requestType === 'cancellation' 
                ? "Click submit to request cancellation for this order." 
                : "Please tell us why you'd like to return or exchange your order (damaged, wrong size, etc.)."}
            </div>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {requestType === 'return' && (
              <>
                <textarea
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="Enter your reason here..."
                  className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm text-gray-900"
                />

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Upload Photos (2 to 4)</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setRequestPhotos(files.slice(0, 4));
                      }}
                      className="block w-full text-sm"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      Max 4 photos, each up to 5MB.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Upload Video (optional)</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const f = (e.target.files || [])[0] || null;
                        setRequestVideo(f);
                      }}
                      className="block w-full text-sm"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      Optional video up to 10MB.
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setRequestModalOpen(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Go Back
              </button>
              <button
                onClick={handleRequest}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center">
              Our team will review your request and contact you via email.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="!max-w-md lg:!max-w-3xl w-full !top-36 lg:!top-40 !translate-y-0 !max-h-[calc(100vh-10rem)] lg:!max-h-[calc(100vh-11rem)] overflow-y-auto bg-white p-0 gap-0 mx-auto rounded-xl text-gray-900">
          <DialogHeader className="sr-only">
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (() => {
            const cfg = getStatusConfig(selectedOrder);
            const tl = getTimeline(selectedOrder);
            const first = selectedOrder.cartItems?.[0] || selectedOrder.items?.[0];
            const addr = selectedOrder.shippingAddress || selectedOrder.address || {};
            const date = new Date(selectedOrder.createdAt);
            return (
              <>
                <div className="sticky top-0 bg-white z-10 px-4 lg:px-6 py-3 border-b border-gray-200 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Order Details</span>
                  <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1"><X className="h-5 w-5" /></button>
                </div>
                <div className="p-4 lg:p-6 space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Product */}
                    <div className="flex gap-3 pb-3 border-b border-gray-100">
                      <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border relative">
                        <Image src={first?.variant?.thumbnail || first?.product?.image || first?.imageUrl || "/placeholder.svg"} alt={first?.product?.name || first?.productName || "Product"} fill sizes="96px" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm lg:text-base font-semibold text-gray-900 leading-snug">{first?.product?.name || first?.productName || "Product"}</h3>
                        <p className="text-xs text-gray-400 mt-1">Qty: {first?.quantity || 1}</p>
                        <p className="text-base lg:text-lg font-bold text-gray-900 mt-2">₹{selectedOrder.total?.toLocaleString() || 0}</p>
                      </div>
                    </div>

                    {/* Status Card */}
                    <div className="border border-gray-200 rounded-lg p-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                        <Clock className="h-3 w-3" /> {cfg.label}
                      </span>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Timeline</h3>
                      <div className="space-y-0">
                        {tl.map((s, i) => (
                          <div key={s.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-2.5 h-2.5 rounded-full ${s.isError ? 'bg-red-500' : s.done ? 'bg-green-500' : 'bg-gray-300'}`} />
                              {i < tl.length - 1 && <div className={`w-0.5 flex-1 min-h-[20px] ${s.done ? (s.isError ? 'bg-red-400' : 'bg-green-400') : 'bg-gray-200'}`} />}
                            </div>
                            <div className="pb-3">
                              <p className={`text-sm font-medium ${s.done ? (s.isError ? 'text-red-600' : 'text-gray-900') : 'text-gray-400'}`}>{s.label}</p>
                              <p className={`text-xs mt-0.5 ${s.done ? (s.isError ? 'text-red-500' : 'text-gray-500') : 'text-gray-400'}`}>{s.desc}</p>
                              {s.id === 'pending' && s.done && (
                                <p className="text-xs text-gray-400 mt-0.5">{date.toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric'})}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Address */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"><Home className="h-4 w-4 text-gray-600" /> Delivery Address</h3>
                      <div className="text-sm text-gray-600 leading-relaxed pl-6">
                        <p className="font-medium text-gray-900">{selectedOrder.customerName || addr.fullName || 'N/A'}</p>
                        <p>{addr.addressLine1 || addr.address || 'N/A'}</p>
                        <p>{addr.city}, {addr.state} {addr.postalCode || addr.pin || addr.zipCode || ''}</p>
                        <p>{addr.country || 'India'}</p>
                      </div>
                    </div>

                    {/* Price Details */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Price Details</h3>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Selling Price</span>
                        <span>₹{(selectedOrder.subtotal || selectedOrder.total || 0).toLocaleString()}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount</span>
                          <span>-₹{selectedOrder.discount.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedOrder.shipping > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Shipping</span>
                          <span>₹{selectedOrder.shipping.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                        <span>Total Amount</span>
                        <span className="text-green-600">₹{selectedOrder.total?.toLocaleString() || 0}</span>
                      </div>
                    </div>

                    {/* Payment */}
                    <div className="flex items-center justify-between py-3 border border-gray-200 rounded-lg px-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <CreditCard className="h-4 w-4" />
                        Paid by {selectedOrder.paymentMethod === 'online' ? 'Online Payment' : selectedOrder.paymentMethod || 'Online Payment'}
                      </div>
                      <button
                        onClick={() => generateInvoice(selectedOrder)}
                        className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center gap-1"
                      >
                        Download Invoice <FileText className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Close */}
                  <button onClick={() => setModalOpen(false)} className="w-full lg:col-span-2 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800">
                    Close
                  </button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams?.get('tab') as 'profile' | 'orders' | 'wishlist') || 'profile';
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>(initialTab);
  const [isEditing, setIsEditing] = useState(false);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Fetch user profile data using React Query
  const { data: userProfile, isLoading, isError, error } = useGetProfile();

  // Mutation for updating profile
  const { mutate: updateProfile } = useUpdateProfile();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return <ProfilePageSkeleton />;
  }

  const handleUpdateProfile = (data: Partial<UserProfile>) => {
    console.log('Updating profile with data:', data);
    const emailFromCookie = Cookies.get('userEmail');
    if (emailFromCookie) {
      // Ensure we're sending the correct data structure
      const updateData = {
        ...data,
        email: emailFromCookie
      };
      console.log('Sending update data:', updateData);
      updateProfile(updateData as UpdateProfileData);
      setIsEditing(false);
    }
  };

  const handleUpdateAddresses = (addresses: Address[]) => {
    const emailFromCookie = Cookies.get('userEmail');
    if (emailFromCookie) {
      updateProfile({ addresses, email: emailFromCookie } as any);
    }
  };

  return (
    <>
      <NavigationHeader />
      <div className="min-h-screen bg-gray-50 py-8 mt-32 lg:mt-36">
        <div className="max-w-7xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {/* Header with tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'orders' 
                  ? 'border-purple-500 text-purple-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <Package className="h-5 w-5 mr-2" />
                Your Orders
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'wishlist' 
                  ? 'border-purple-500 text-purple-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('wishlist')}
              >
                Wishlist
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'profile' 
                  ? 'border-purple-500 text-purple-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'orders' && (
              <div className="py-6">
                <OrdersContent />
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="py-6">
                <WishlistContent />
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                {userProfile ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        Edit Profile
                      </button>
                    </div>

                    {isEditing ? (
                      <EditProfileForm 
                        profile={userProfile} 
                        onUpdate={(data: Partial<UserProfile>) => handleUpdateProfile(data)} 
                        onCancel={() => setIsEditing(false)} 
                      />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500">Full Name</p>
                              <p className="text-base font-medium text-gray-900">{userProfile.name || 'Not set'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Email Address</p>
                              <p className="text-base font-medium text-gray-900">{userProfile.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Phone Number</p>
                              <p className="text-base font-medium text-gray-900">{userProfile.phone || 'Not set'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                          <AddressManager 
                            addresses={userProfile.addresses || []} 
                            onUpdateAddresses={handleUpdateAddresses} 
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-gray-400">👤</div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No profile data</h3>
                    <p className="mt-1 text-sm text-gray-500">No profile information available.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
     </div>
     <Footer />
    </>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}

interface EditProfileFormProps {
  profile: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => void;
  onCancel: () => void;
}

interface EditProfileFormData {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

const EditProfileForm = ({ profile, onUpdate, onCancel }: EditProfileFormProps) => {
  const [formData, setFormData] = useState<EditProfileFormData>({
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    addresses: profile.addresses || []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
      <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                disabled
              />
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <AddressManager 
            addresses={formData.addresses || []} 
            onUpdateAddresses={(addresses) => setFormData(prev => ({ ...prev, addresses }))} 
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};
