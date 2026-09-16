"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import { TestimonialGridSkeleton } from "@/components/skeletons/site-skeletons";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  review: string;
  product: string;
  avatar?: string;
}

// No fallback - only show Google Reviews

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRating, setTotalRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch Google Reviews
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/google-reviews");
      const data = await response.json();
      console.log("Reviews data:", data);

      if (data.success && data.reviews.length > 0) {
        console.log("First review:", data.reviews[0]);
        setTestimonials(data.reviews);
        setTotalRating(data.totalRating);
        setTotalReviews(data.totalReviews);
      } else {
        setTestimonials([]);
        setError(data.message || "No reviews available");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setTestimonials([]);
      setError("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-rose-50">
      <div className="max-w-7xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">CUSTOMER <span className="text-purple-600">REVIEWS</span></h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-2xl mx-auto mb-6 px-4">
            Hear from our happy customers who have experienced the joy of wearing their colors with Navrangii
          </p>

          {/* Google Rating Badge */}
          {/* {
          !isLoading && testimonials.length > 0 && totalReviews > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md mb-4"
            >
              <div className="flex items-center gap-1">
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-semibold text-gray-900">Google Reviews</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-lg">{totalRating.toFixed(1)}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(totalRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-500">({totalReviews} reviews)</span>
            </motion.div>
          )
          } */}

          {/* Loading State */}
          {isLoading && <Skeleton className="h-5 w-48 mx-auto" />}

          {/* Error Notice */}
          {error && !isLoading && testimonials.length === 0 && (
            <div className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-full inline-block">
              {error}. Please check Google Reviews configuration.
            </div>
          )}
        </motion.div>

        {/* Desktop Testimonials Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <TestimonialGridSkeleton count={3} />
          ) : (
          testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full relative overflow-hidden group"
            >
              {/* Subtle Theme Accent - Top Gradient Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-rose-400 opacity-70 group-hover:opacity-100 transition-opacity" />
              {/* Google Review Badge */}
              <div className="flex items-center gap-2 mb-4">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-semibold text-gray-700">Google Review</span>
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-6 leading-relaxed flex-grow text-sm">
                "{testimonial.review}"
              </p>

              {/* Customer Info */}
              <div className="border-t border-gray-100 pt-4 mt-auto">
                <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                <p className="text-xs text-gray-500">{testimonial.location}</p>
              </div>
            </motion.div>
          ))
          )}
        </div>

        {/* Mobile Reviews Grid (no slider) */}
        <div className="md:hidden">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <TestimonialGridSkeleton count={2} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white shadow-md p-5 flex flex-col border border-gray-100 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-rose-400 opacity-70" />
                  <div className="flex gap-1 mb-3 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed flex-grow text-sm">"{testimonial.review}"</p>
                  <div className="border-t border-gray-100 pt-3 mt-auto">
                    <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        {!isLoading && testimonials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <a
              href="https://www.google.com/search?q=Trex+Infotech+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-600 to-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              </svg>
              See all {totalReviews} Google Reviews
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
