"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, CheckCircle, Clock, Truck, XCircle, IndianRupee } from "lucide-react";
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <RefreshCw className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cancellation & Exchange</h1>
            <p className="text-sm text-gray-600">Review cancellation and return/exchange requests</p>
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
        <label className="text-sm text-gray-600">Filter:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
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
            <div className="bg-white border rounded-lg p-10 text-center text-gray-500">No requests</div>
          ) : (
            filtered.map((req) => (
              <div key={req._id} className="bg-white border rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {req.type === "cancellation" ? "Cancellation" : "Return / Exchange"}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-700">
                      <span className="font-medium">Order:</span> {req.orderNumber || req.orderId}
                    </div>
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">Customer:</span> {req.customerName || "N/A"} ({req.userEmail || "N/A"})
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
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
                    <div className="text-xs text-gray-500">Status</div>
                    <select
                      value={req.status}
                      onChange={(e) => updateStatus(req._id, e.target.value as RequestStatus)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    >
                      {statusSteps.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    {typeof req.refundAmount === "number" && (
                      <div className="text-xs text-gray-600">
                        Refund amount: <span className="font-semibold">₹{req.refundAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
