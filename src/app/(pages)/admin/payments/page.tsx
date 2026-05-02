
"use client";

import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, XCircle, Clock, Search, Download, Filter } from 'lucide-react';
import { useGetOrders } from '@/hooks/order/useGetOrders';
import { Order } from '@/lib/types/orderType';

export default function PaymentsPage() {
  const { data: ordersData, isLoading } = useGetOrders()
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (ordersData?.orders) {
      // Transform API data to match Order type (enrichment done server-side)
      const transformedOrders = ordersData.orders.map((order: any) => ({
        ...order,
        customerName: order.customerName || order.userEmail?.split('@')[0] || 'Unknown',
        customerEmail: order.customerEmail || order.userEmail || 'N/A',
        orderStatusUpdate: order.orderStatusUpdate || {
          status: order.status || "pending",
          paymentStatus: order.status === "paid" ? "paid" : "pending",
        },
        items: order.items || [],
        subtotal: order.subtotal || order.total || 0,
        tax: order.tax || 0,
        shipping: order.shipping || 0,
        total: order.total || 0,
        shippingAddress: order.shippingAddress || order.address || {},
        paymentDetails: order.paymentDetails || {
          razorpayOrderId: order.razorpayOrderId,
          razorpayPaymentId: order.razorpayPaymentId,
          verified: true,
        },
        paymentMethod: order.paymentMethod || "Razorpay",
        assignedDeliveryPartner: order.assignedDeliveryPartner,
        assignedDate: order.assignedDate,
        orderDate: order.orderDate || order.createdAt,
        createdAt: order.createdAt,
      }))
      setOrders(transformedOrders)
    }
  }, [ordersData])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.orderStatusUpdate?.paymentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'paid':
        return (
          <span className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle className="h-4 w-4" /> Paid
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-sm font-medium">
            <Clock className="h-4 w-4" /> Pending
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm font-medium">
            <XCircle className="h-4 w-4" /> Failed
          </span>
        );
      case 'refunded':
        return (
          <span className="flex items-center gap-1 text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle className="h-4 w-4" /> Refunded
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
            <Clock className="h-4 w-4" /> Unknown
          </span>
        );
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case 'Credit Card':
        return (
          <span className="flex items-center gap-1 text-purple-600 bg-purple-100 px-3 py-1 rounded-full text-sm font-medium">
            <CreditCard className="h-4 w-4" /> Credit Card
          </span>
        );
      case 'PayPal':
        return (
          <span className="flex items-center gap-1 text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm font-medium">
            PayPal
          </span>
        );
      case 'Razorpay':
        return (
          <span className="flex items-center gap-1 text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full text-sm font-medium">
            <CreditCard className="h-4 w-4" /> Razorpay
          </span>
        );
      case 'COD':
        return (
          <span className="flex items-center gap-1 text-orange-600 bg-orange-100 px-3 py-1 rounded-full text-sm font-medium">
            COD
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
            {method}
          </span>
        );
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <CreditCard className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
            <p className="text-sm text-gray-600">View all order payments and payment details</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer, or payment method..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Razorpay ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order, index) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">#{(index + 1).toString().padStart(3, '0')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">{order.shippingAddress?.phone || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-600">
                      {order.paymentDetails?.razorpayPaymentId || order.paymentDetails?.razorpayOrderId || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentMethodBadge(order.paymentMethod)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(() => {
                      const date = new Date(order.createdAt);
                      const day = date.getDate().toString().padStart(2, '0');
                      const month = (date.getMonth() + 1).toString().padStart(2, '0');
                      const year = date.getFullYear();
                      return `${day}/${month}/${year}`;
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">₹{order.total.toFixed(2)}</span>
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={6} className="px-6 py-4 text-right text-gray-900">
                  Total Amount:
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-lg font-bold text-purple-700">
                    ₹{filteredOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No payments found</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
