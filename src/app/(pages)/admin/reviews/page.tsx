"use client";

import { useEffect, useState } from "react";
import { MessageSquare, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

interface Review {
  _id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateStatus = async (reviewId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/reviews/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Review ${status}`);
        fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update review");
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/admin/reviews/delete?reviewId=${reviewId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review deleted");
        fetchReviews();
      }
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const filteredReviews = filter === "all" 
    ? reviews 
    : reviews.filter(r => r.status === filter);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <MessageSquare className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Reviews</h1>
            <p className="text-sm text-gray-600 dark:text-slate-400">Manage and moderate customer feedback</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Reviews</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 p-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 dark:text-slate-500 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-slate-400">No reviews found matching the filter.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReviews.map((review) => (
            <div key={review._id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200 dark:text-slate-600'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 dark:text-slate-500">
                      {new Date(review.createdAt).toLocaleString()}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      review.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200' :
                      review.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200' :
                      'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200'
                    }`}>
                      {review.status}
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium mb-1">{review.userName}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">{review.userEmail}</p>
                  <p className="text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700/50">
                    "{review.comment}"
                  </p>
                </div>
                
                <div className="flex md:flex-col gap-2 shrink-0">
                  {review.status !== 'approved' && (
                    <button 
                      onClick={() => updateStatus(review._id, 'approved')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <CheckCircle className="h-4 w-4" /> Approve
                    </button>
                  )}
                  {review.status !== 'rejected' && (
                    <button 
                      onClick={() => updateStatus(review._id, 'rejected')}
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                  )}
                  <button 
                    onClick={() => deleteReview(review._id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-400 rounded-lg hover:bg-gray-50 dark:bg-slate-800/50 transition-colors text-sm"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Star = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);
