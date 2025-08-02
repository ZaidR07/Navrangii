"use client";

import { motion } from "framer-motion";
import { Star, ShoppingBag } from "lucide-react";

interface Product {
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  image: string;
  rating: number;
}

const saleProducts: Product[] = [
  {
    name: "Elegant Floral Dress",
    price: "₹2,499",
    originalPrice: "₹4,999",
    discount: "50% OFF",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop&crop=center",
    rating: 4.5
  },
  {
    name: "Diamond Jewelry Set",
    price: "₹3,999",
    originalPrice: "₹7,999",
    discount: "50% OFF",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=400&fit=crop&crop=center",
    rating: 4.8
  },
  {
    name: "Couple Matching Set",
    price: "₹4,499",
    originalPrice: "₹8,999",
    discount: "50% OFF",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=400&fit=crop&crop=center",
    rating: 4.6
  },
  {
    name: "Family Twinning Outfit",
    price: "₹5,999",
    originalPrice: "₹11,999",
    discount: "50% OFF",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&h=400&fit=crop&crop=center",
    rating: 4.7
  },
  {
    name: "Designer Saree",
    price: "₹3,499",
    originalPrice: "₹6,999",
    discount: "50% OFF",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=400&fit=crop&crop=center",
    rating: 4.4
  },
  {
    name: "Bridal Lehenga",
    price: "₹12,999",
    originalPrice: "₹25,999",
    discount: "50% OFF",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=400&fit=crop&crop=center",
    rating: 4.9
  }
];

const getMonthlyTitle = () => {
  const month = new Date().getMonth();
  const rhymingTitles = [
    "Joyful January", "Fabulous February", "Marvelous March", "Amazing April",
    "Magnificent May", "Joyous June", "Jubilant July", "Awesome August",
    "Spectacular September", "Outstanding October", "Noteworthy November", "Dazzling December"
  ];
  return `${rhymingTitles[month]} Sale`;
};

const ProductCard = ({ product, index }: { product: Product; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ scale: 1.05 }}
    className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
  >
    <div className="relative h-80 overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
        {product.discount}
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ))}
        <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-2xl font-bold text-purple-600">{product.price}</span>
          <span className="text-lg text-gray-500 line-through ml-2">{product.originalPrice}</span>
        </div>
      </div>
      <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700">
        <span>Add to Cart</span>
        <ShoppingBag className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </motion.div>
);

const MobileProductCard = ({ product, index }: { product: Product; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-xl"
  >
    <div className="relative h-80 overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
        {product.discount}
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ))}
        <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xl font-bold text-purple-600">{product.price}</span>
          <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function SaleSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-100 to-violet-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-800 mb-4">
            {getMonthlyTitle()}
          </h2>
          <p className="text-xl md:text-2xl text-purple-700 mb-12">
            Up to 70% OFF on Selected Items
          </p>
        </motion.div>
        
        {/* Mobile Carousel */}
        <div className="lg:hidden">
          <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-4">
            {saleProducts.map((product, index) => (
              <MobileProductCard key={index} product={product} index={index} />
            ))}
          </div>
        </div>

        {/* Desktop Grid with View More */}
        <div className="hidden lg:block">
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            {saleProducts.slice(0, 4).map((product, index) => (
              <ProductCard key={index} product={product} index={index} />
            ))}
          </div>
          
          {/* View More Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg border-2 border-white hover:border-purple-200"
            >
              View More Sale Items
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
