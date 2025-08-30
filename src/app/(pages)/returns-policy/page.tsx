"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Package, RefreshCw, Shield, Phone, Mail, AlertCircle, CheckCircle, Info } from "lucide-react";
import Link from "next/link";

export default function ReturnsPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center text-purple-600 hover:text-purple-700 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-purple-400 to-rose-400 p-4 rounded-full">
              <RefreshCw className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund & Exchange Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Thank you for shopping with <span className="font-semibold text-purple-600">'Navrangii, Har Rang Aapke Sang'</span>. 
            We aim to ensure that you are completely satisfied with your purchase.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Eligibility Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-lg mr-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Eligibility for Exchange</h2>
            </div>
            
            <p className="text-gray-600 mb-6">We accept returns on eligible items under the following conditions:</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "The item must be unused, unworn, unwashed, and in its original condition",
                "Tags and packaging must be intact",
                "In the event that you receive a product that is Damaged or Defective",
                "In the case that we send the wrong style or size of a product from the one ordered",
                "The return request must be initiated within 7 days of delivery",
                "Only regular-priced items may be returned. Sale or discounted items are final sale"
              ].map((condition, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-1 rounded-full mt-1">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">{condition}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-amber-800 font-medium">Important Notes:</p>
                  <ul className="text-amber-700 text-sm mt-2 space-y-1">
                    <li>• We do not accept exchange and return on discounted products</li>
                    <li>• We experience high volumes during sales and will be unable to cancel orders due to shipment delays</li>
                    <li>• We reserve the right to cancel an order due to non-availability of goods</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Product Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-lg mr-4">
                <Info className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Product Information & Sizing Guidelines</h2>
            </div>

            <div className="space-y-6">
              {/* Handmade Craftsmanship */}
              <div className="border-l-4 border-purple-400 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Handmade Craftsmanship & Natural Variations</h3>
                <p className="text-gray-700">
                  Our products are handmade using various traditional and natural processes. Due to the artisanal nature of our work, 
                  you may notice subtle variations in color, texture, finish, and overall appearance. These are not defects, but rather 
                  unique characteristics that add to the charm and individuality of each piece.
                </p>
              </div>

              {/* Color Accuracy */}
              <div className="border-l-4 border-rose-400 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Color Accuracy Disclaimer</h3>
                <p className="text-gray-700">
                  We make every reasonable effort to accurately represent our products' attributes, including their colors and composition. 
                  However, due to differences in individual screen or monitor settings, the color of the product you receive may vary 
                  slightly from what you see online.
                </p>
              </div>

              {/* Wash & Care */}
              <div className="border-l-4 border-emerald-400 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Wash & Care Instructions</h3>
                <p className="text-gray-700 mb-3">Each product comes with specific wash care instructions, clearly mentioned:</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• On the respective product page on our website</li>
                  <li>• On the care label stitched inside the garment</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  Please follow these instructions carefully to maintain the longevity and look of your garment. 
                  We are not responsible for damage resulting from incorrect washing or handling.
                </p>
              </div>

              {/* Sizing */}
              <div className="border-l-4 border-amber-400 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Sizing & Fit Information</h3>
                <p className="text-gray-700 mb-3">
                  To help you find the perfect fit, each product has its own specific Size Guide available on its product page. 
                  The guide includes essential measurements such as chest, waist, and length, based on the product's unique silhouette.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">Please Note:</p>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Sizes may vary across styles due to differences in cut, fabric, and design</li>
                    <li>• Some garments are intended to be more fitted, while others offer a relaxed fit</li>
                    <li>• Always refer to the product-specific Size Guide before placing your order</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-purple-600 to-rose-600 rounded-2xl shadow-lg p-8 text-white"
          >
            <div className="flex items-center mb-6">
              <div className="bg-white/20 p-3 rounded-lg mr-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Need Assistance?</h2>
            </div>
            
            <p className="text-purple-100 mb-6">
              Our design team is happy to help you select the right size and fit. 
              For damaged or wrong products, please contact us immediately.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-purple-200" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <a href="tel:+918830772745" className="text-purple-200 hover:text-white transition-colors">
                    +91-88307 72745
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-purple-200" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <a href="mailto:darshufashion879@gmail.com" className="text-purple-200 hover:text-white transition-colors">
                    darshufashion879@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white/10 rounded-lg">
              <p className="text-sm text-purple-100">
                <strong>For damaged or wrong products:</strong> Please contact us via email with your order details and photos of the received item.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Back to Shopping */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-rose-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105"
          >
            <Package className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
