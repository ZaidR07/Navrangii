"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Heart, Palette, Users, Target, Eye, Sparkles, Star } from "lucide-react";
import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center text-purple-600 hover:text-purple-700 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-purple-400 to-rose-400 p-6 rounded-full">
              <Palette className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About Navrangii</h1>
          <div className="bg-gradient-to-r from-purple-600 to-rose-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <p className="text-2xl font-bold mb-4">"HAR RANG AAPKE SANG"</p>
            <p className="text-lg text-purple-100">
              More than just a fashion brand – it's the vibrant journey of a passion turned into fashion.
            </p>
          </div>
        </motion.div>

        {/* Brand Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl p-10 mb-12"
        >
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-br from-orange-400 to-pink-500 p-4 rounded-xl mr-6">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                Inspired by the beauty of colors and the diversity they represent, Navrangii stands for 
                <span className="font-semibold text-purple-600"> inclusivity, self-expression, and individuality</span>.
              </p>
              
              <p className="text-gray-700 text-lg leading-relaxed">
                Our name, <span className="font-bold text-rose-600">Navrangii</span>, symbolizes 
                <span className="font-semibold"> "nine colors,"</span> reflecting the idea that fashion is not limited to one 
                shade, one mood, or one style – it's an entire spectrum.
              </p>
              
              <p className="text-gray-700 text-lg leading-relaxed">
                We believe that every person carries their own unique hue, and our designs aim to celebrate that individuality.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-100 to-rose-100 rounded-2xl p-8">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { color: "bg-red-400", name: "Passion" },
                  { color: "bg-orange-400", name: "Energy" },
                  { color: "bg-yellow-400", name: "Joy" },
                  { color: "bg-green-400", name: "Growth" },
                  { color: "bg-blue-400", name: "Trust" },
                  { color: "bg-indigo-400", name: "Wisdom" },
                  { color: "bg-purple-400", name: "Creativity" },
                  { color: "bg-pink-400", name: "Love" },
                  { color: "bg-rose-400", name: "Grace" }
                ].map((color, index) => (
                  <motion.div
                    key={color.name}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`${color.color} w-12 h-12 rounded-full mx-auto mb-2 shadow-lg`}></div>
                    <p className="text-xs font-medium text-gray-600">{color.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Promise Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-purple-600 to-rose-600 rounded-3xl shadow-xl p-10 text-white mb-12"
        >
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-6">Our Promise</h2>
            <p className="text-xl text-purple-100 leading-relaxed max-w-4xl mx-auto">
              With the slogan <span className="font-bold text-white">"Har Rang Aapke Sang"</span>, we promise to walk with you 
              in every color of your life – from bold and playful to elegant and graceful. Each piece is created with love, 
              blending contemporary trends with timeless aesthetics to make fashion not just wearable, but expressive.
            </p>
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-4 rounded-xl mr-4">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              To make fashion a celebration of diversity, creativity, and personal expression by offering styles 
              that resonate with every shade of individuality.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-xl mr-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              To design and deliver vibrant, inclusive, and high-quality fashion that empowers people to embrace 
              their true selves and wear their colors with pride.
            </p>
          </motion.div>
        </div>

        {/* Goals Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-10 mb-12"
        >
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-4 rounded-xl mr-6">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Our Goal</h2>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-rose-50 rounded-2xl p-8">
            <p className="text-gray-700 text-lg leading-relaxed text-center">
              To be the most trusted destination for high quality clothing and accessories for men and women, 
              combining timeless style with exceptional craftsmanship. We aim to inspire confidence and 
              self-expression through carefully curated collections, delivered via a seamless, user-friendly 
              online experience that makes premium fashion accessible to all.
            </p>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-10 mb-12"
        >
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-br from-rose-400 to-pink-500 p-4 rounded-xl mr-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">What We Stand For</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Inclusivity",
                description: "Fashion for every body, every style, every personality",
                color: "from-purple-400 to-violet-500"
              },
              {
                title: "Quality",
                description: "Exceptional craftsmanship in every piece we create",
                color: "from-blue-400 to-indigo-500"
              },
              {
                title: "Expression",
                description: "Empowering you to showcase your unique individuality",
                color: "from-rose-400 to-pink-500"
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`bg-gradient-to-br ${value.color} p-6 rounded-2xl mb-4`}>
                  <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-white/90">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Thank You Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-br from-purple-600 to-rose-600 rounded-3xl shadow-xl p-10 text-white text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-6 rounded-full">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-6">Thank You for Choosing Navrangii</h2>
          <p className="text-xl text-purple-100 mb-8">
            We are providing pure love with the pure heart.
          </p>
          
          <div className="bg-white/10 rounded-2xl p-8">
            <p className="text-3xl font-bold text-white tracking-wider mb-4">
              "HAR RANG AAPKE SANG"
            </p>
            <p className="text-purple-100 text-lg">
              Walking with you in every color of your life
            </p>
          </div>
        </motion.div>

        {/* Back to Shopping */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link 
            href="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-rose-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Palette className="h-5 w-5 mr-2" />
            Explore Our Collections
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
