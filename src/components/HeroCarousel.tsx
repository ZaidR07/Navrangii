"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface HeroImage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  bgColor: string;
  textColor: string;
  images: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

const heroImages: HeroImage[] = [
  {
    id: 1,
    title: "Elegant Evening Collection",
    subtitle: "Sophisticated Outfits for Special Occasions",
    description: "Discover our premium collection of evening wear designed for the modern woman.",
    bgColor: "from-purple-600 to-violet-700",
    textColor: "text-white",
    images: {
      mobile: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&crop=center",
      tablet: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=600&fit=crop&crop=center",
      desktop: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1920&h=1080&fit=crop&crop=center"
    }
  },
  {
    id: 2,
    title: "Sparkling Jewelry Sets",
    subtitle: "Exquisite Pieces that Shine Bright",
    description: "Handcrafted jewelry collections that add elegance to every outfit.",
    bgColor: "from-indigo-600 to-purple-700",
    textColor: "text-white",
    images: {
      mobile: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=600&fit=crop&crop=center",
      tablet: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=600&fit=crop&crop=center",
      desktop: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1920&h=1080&fit=crop&crop=center"
    }
  },
  {
    id: 3,
    title: "Perfect Couple Matching",
    subtitle: "Coordinated Sets for Special Moments",
    description: "Beautiful matching outfits designed for couples who love to coordinate.",
    bgColor: "from-violet-600 to-purple-700",
    textColor: "text-white",
    images: {
      mobile: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&crop=center",
      tablet: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&crop=center",
      desktop: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&crop=center"
    }
  },
  {
    id: 4,
    title: "Family Twinning Collection",
    subtitle: "Matching Outfits for the Whole Family",
    description: "Create memorable moments with our family twinning collection.",
    bgColor: "from-purple-700 to-indigo-700",
    textColor: "text-white",
    images: {
      mobile: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop&crop=center",
      tablet: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop&crop=center",
      desktop: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop&crop=center"
    }
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <section className="relative h-[60vh] md:h-[70vh] lg:h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image with Responsive Sources */}
          <div className="absolute inset-0">
            {/* Mobile Image */}
            <img
              src={heroImages[currentSlide].images.mobile}
              alt={heroImages[currentSlide].title}
              className="block md:hidden w-full h-full object-cover"
            />
            {/* Tablet Image */}
            <img
              src={heroImages[currentSlide].images.tablet}
              alt={heroImages[currentSlide].title}
              className="hidden md:block lg:hidden w-full h-full object-cover"
            />
            {/* Desktop Image */}
            <img
              src={heroImages[currentSlide].images.desktop}
              alt={heroImages[currentSlide].title}
              className="hidden lg:block w-full h-full object-cover"
            />
          </div>
          
          {/* Subtle visual element overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center text-white/20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-16 w-16 md:h-24 md:w-24 lg:h-32 lg:w-32 mx-auto opacity-30" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex space-x-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
