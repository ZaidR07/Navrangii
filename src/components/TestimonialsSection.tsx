"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  review: string;
  product: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    review: "Absolutely love my Navrangii outfit! The quality is exceptional and the colors are so vibrant. Perfect for our family function. 'Har Rang Aapke Sang' truly lives up to its promise!",
    product: "Family Twinning Set"
  },
  {
    id: 2,
    name: "Rahul & Sneha",
    location: "Delhi",
    rating: 5,
    review: "We ordered matching couple outfits for our anniversary photoshoot. The fabric quality and attention to detail is amazing. Received so many compliments!",
    product: "Couple's Collection"
  },
  {
    id: 3,
    name: "Anjali Patel",
    location: "Bangalore",
    rating: 5,
    review: "The jewelry collection is stunning! Each piece feels premium and the designs are so unique. Fast delivery and beautiful packaging too.",
    product: "Jewelry Collection"
  },
  {
    id: 4,
    name: "Vikram Singh",
    location: "Pune",
    rating: 5,
    review: "Great experience shopping from Navrangii. The men's collection has such stylish options. The fit is perfect and the customer service is excellent.",
    product: "Men's Collection"
  },
  {
    id: 5,
    name: "Meera Gupta",
    location: "Hyderabad",
    rating: 5,
    review: "I'm impressed with the variety and quality. The women's outfits are elegant and comfortable. Navrangii has become my go-to fashion destination!",
    product: "Women's Collection"
  },
  {
    id: 6,
    name: "Arjun & Family",
    location: "Chennai",
    rating: 5,
    review: "Ordered coordinated outfits for our entire family for Diwali. Everyone looked amazing and the quality exceeded our expectations. Highly recommended!",
    product: "Family Twinning"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from our happy customers who have experienced the joy of wearing their colors with Navrangii
          </p>
        </motion.div>

        {/* Desktop Testimonials Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Quote Icon */}
              <div className="flex justify-between items-start mb-4">
                <div className="bg-gradient-to-br from-purple-400 to-rose-400 p-2 rounded-lg">
                  <Quote className="h-5 w-5 text-white" />
                </div>
                
                {/* Rating Stars */}
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                "{testimonial.review}"
              </p>

              {/* Product Tag */}
              <div className="mb-4">
                <span className="inline-block bg-gradient-to-r from-purple-100 to-rose-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  {testimonial.product}
                </span>
              </div>

              {/* Customer Info */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-rose-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 min-w-[280px] flex-shrink-0"
              >
                {/* Quote Icon */}
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-gradient-to-br from-purple-400 to-rose-400 p-2 rounded-lg">
                    <Quote className="h-5 w-5 text-white" />
                  </div>
                  
                  {/* Rating Stars */}
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                  "{testimonial.review}"
                </p>

                {/* Product Tag */}
                <div className="mb-4">
                  <span className="inline-block bg-gradient-to-r from-purple-100 to-rose-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {testimonial.product}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h4>
                      <p className="text-xs text-gray-500">{testimonial.location}</p>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-rose-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        {testimonials.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <button className="bg-gradient-to-r from-purple-600 to-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105">
              View All Reviews
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
