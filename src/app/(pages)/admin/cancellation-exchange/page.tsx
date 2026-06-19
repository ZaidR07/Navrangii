"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, CheckCircle, Clock, Truck, XCircle, IndianRupee, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";

type RequestType = "cancellation" | "return";

type RequestStatus =
  | "requested"
  | "approved"
  | "pickup_scheduled"
  | "picked_up"
  | "refunded"
  | "rejected";

interface OrderRequest {
  _id: string;
  orderId: string;
  orderNumber: string | null;
  userEmail: string | null;
  customerName: string | null;
  type: RequestType;
  reason: string;
  photoUrls: string[];
  videoUrl: string | null;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  order?: any;
  refundAmount?: number;
  originalOrderStatus?: string;
}

const statusSteps: { value: RequestStatus; label: string; icon: any }[] = [
  { value: "requested", label: "Requested", icon: Clock },
  { value: "approved", label: "Approved", icon: CheckCircle },
  { value: "pickup_scheduled", label: "Pickup Scheduled", icon: Truck },
  { value: "picked_up", label: "Picked Up", icon: RefreshCw },
  { value: "refunded", label: "Refunded", icon: IndianRupee },
  { value: "rejected", label: "Rejected", icon: XCircle },
];

export default function CancellationExchangePage() {
  const [requests, setRequests] = useState<OrderRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    requestId: string;
    newStatus: RequestStatus;
    request?: OrderRequest;
  }>({ open: false, requestId: "", newStatus: "requested" });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/order-requests");
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load requests");
      setRequests(data.requests || []);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return requests;
    return requests.filter((r) => r.status === statusFilter);
  }, [requests, statusFilter]);

  const updateStatus = async (requestId: string, status: RequestStatus) => {
    try {
      const res = await fetch("/api/admin/order-requests/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to update");
      toast.success(data.message || "Updated");
      await fetchRequests();
    } catch (e: any) {
      toast.error(e?.message || "Failed to update");
    }
  };

  const handleStatusSelectChange = (req: OrderRequest, newStatus: RequestStatus) => {
    setConfirmDialog({ open: true, requestId: req._id, newStatus, request: req });
  };

  const handleConfirm = () => {
    if (confirmDialog.requestId && confirmDialog.newStatus) {
      updateStatus(confirmDialog.requestId, confirmDialog.newStatus);
    }
    setConfirmDialog({ open: false, requestId: "", newStatus: "requested" });
  };

  const handleCancel = () => {
    setConfirmDialog({ open: false, requestId: "", newStatus: "requested" });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <RefreshCw className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cancellation & Exchange</h1>
            <p className="text-sm text-gray-600 dark:text-slate-400">Review cancellation and return/exchange requests</p>
          </div>
        </div>
        <button
          onClick={fetchRequests}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Refresh
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm text-gray-600 dark:text-slate-400">Filter:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm"
        >
          <option value="all">All</option>
          {statusSteps.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border rounded-lg p-10 text-center text-gray-500 dark:text-slate-400">No requests</div>
          ) : (
            filtered.map((req) => (
              <div key={req._id} className="bg-white dark:bg-slate-800 border rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {req.type === "cancellation" ? "Cancellation" : "Return / Exchange"}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-slate-400">•</span>
                      <span className="text-xs text-gray-500 dark:text-slate-400">{new Date(req.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-700 dark:text-slate-300">
                      <span className="font-medium">Order:</span> {req.orderNumber || req.orderId}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-slate-300">
                      <span className="font-medium">Customer:</span> {req.customerName || "N/A"} ({req.userEmail || "N/A"})
                    </div>
                    <div className="mt-2 text-sm text-gray-700 dark:text-slate-300">
                      <span className="font-medium">Reason:</span> {req.reason}
                    </div>

                    {(req.photoUrls?.length > 0 || req.videoUrl) && (
                      <div className="mt-3 space-y-2">
                        {req.photoUrls?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {req.photoUrls.map((u) => (
                              <a key={u} href={u} target="_blank" className="text-xs text-purple-600 underline">
                                Photo
                              </a>
                            ))}
                          </div>
                        )}
                        {req.videoUrl && (
                          <a href={req.videoUrl} target="_blank" className="text-xs text-purple-600 underline">
                            Video
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-64">
                    <div className="text-xs text-gray-500 dark:text-slate-400">Status</div>
                    <select
                      value={req.status}
                      onChange={(e) => handleStatusSelectChange(req, e.target.value as RequestStatus)}
                      className="px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm"
                    >
                      {statusSteps.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    {typeof req.refundAmount === "number" && (
                      <div className="text-xs text-gray-600 dark:text-slate-400 space-y-1">
                        <div>
                          Order status at request: <span className="font-semibold capitalize">{req.originalOrderStatus || "N/A"}</span>
                        </div>
                        <div>
                          Refund amount: <span className="font-semibold">₹{req.refundAmount.toLocaleString()}</span>
                          {req.type === "cancellation" && ["shipped", "delivered"].includes(req.originalOrderStatus || "") && (
                            <span className="text-amber-600 dark:text-amber-400 ml-1">(₹200 deducted)</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4 border dark:border-slate-700">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Confirm Status Change
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                  You are about to change the status to <strong className="text-gray-900 dark:text-white">{statusSteps.find(s => s.value === confirmDialog.newStatus)?.label}</strong>.
                  {confirmDialog.newStatus === "refunded" && (
                    <> This will <strong className="text-gray-900 dark:text-white">automatically process the refund</strong> via Razorpay and the money will be sent to the customer.</>
                  )}
                  {confirmDialog.newStatus === "rejected" && (
                    <> The customer will be notified that their request has been rejected.</>
                  )}
                  {confirmDialog.newStatus !== "refunded" && confirmDialog.newStatus !== "rejected" && (
                    <> The customer will be notified of this status update.</>
                  )}
                  <br /><br />
                  Are you sure you want to proceed?
                </p>

                {confirmDialog.newStatus === "refunded" && confirmDialog.request && typeof confirmDialog.request.refundAmount === "number" && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-slate-400">
                      <span>Customer:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{confirmDialog.request.customerName || confirmDialog.request.userEmail || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-slate-400">
                      <span>Order:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{confirmDialog.request.orderNumber || confirmDialog.request.orderId}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-slate-400">
                      <span>Type:</span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">{confirmDialog.request.type}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-slate-600 mt-2 pt-2 flex justify-between">
                      <span className="text-gray-900 dark:text-white font-semibold">Refund Amount:</span>
                      <span className="text-green-600 dark:text-green-400 font-bold">₹{confirmDialog.request.refundAmount.toLocaleString()}</span>
                    </div>
                    {confirmDialog.request.type === "cancellation" && ["shipped", "delivered"].includes(confirmDialog.request.originalOrderStatus || "") && (
                      <div className="text-xs text-amber-600 dark:text-amber-400 mt-1 text-right">₹200 deducted (order was {confirmDialog.request.originalOrderStatus})</div>
                    )}
                  </div>
                )}

                <div className="mt-5 flex gap-3 justify-end">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
                      confirmDialog.newStatus === "refunded"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    Yes, update to {statusSteps.find(s => s.value === confirmDialog.newStatus)?.label}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
