import React from 'react';
import { Star } from 'lucide-react';

const ReviewsSection = () => (
  <div id="reviews-section" className="border-t pt-16">
    <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((review) => (
        <div key={review} className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">5.0</span>
          </div>
          <p className="text-gray-600 mb-3">
            "Great quality product! The fit is perfect and the material feels premium. Highly recommended."
          </p>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-purple-600">A</span>
            </div>
            <span className="ml-2 text-sm font-medium">Anonymous User</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ReviewsSection;
