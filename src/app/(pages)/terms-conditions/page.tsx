"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Shield, FileText, Heart, Lock, CreditCard, Truck, Globe, Copyright } from "lucide-react";
import Link from "next/link";

export default function TermsConditions() {
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
              <FileText className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to <span className="font-semibold text-purple-600">Navrangii</span>, we are committed to protect your privacy and provide transparent policies.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Privacy & Data Protection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-lg mr-4">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Privacy & Data Protection</h2>
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              You may need to create an account on our website, and your given information is very confidential. 
              We do not rent, sell, lend, or otherwise distribute your personal information to anyone for any reason. 
              This includes your contact information, as well as specific order information.
            </p>
          </motion.div>

          {/* Product Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-lg mr-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Product Information</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                All the products are <span className="font-semibold text-purple-600">made in India</span>. 
                While we have made every effort to display as accurately as possible the colours of the products 
                that appear on the Site, we cannot guarantee that your monitor or screen's display of any colour 
                will be completely accurate, as computer monitors and screens of electronic devices vary.
              </p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800">
                  <strong>Important:</strong> Prices are subject to change without any prior notice.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Returns & Payment */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-purple-400 to-violet-500 p-3 rounded-lg mr-4">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Returns & Payment Policy</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Kindly consult our <Link href="/returns-policy" className="text-purple-600 hover:text-purple-700 font-medium underline">Return & Refund Policy</Link> for 
                comprehensive information on returns and exchanges. By proceeding with your order, you acknowledge 
                and accept the terms and conditions outlined therein.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Full payment is required at the time of purchase and must be made using the available payment 
                methods listed on our website. Navrangii reserves the right to cancel any order if the payment 
                is incomplete or cannot be verified.
              </p>
            </div>
          </motion.div>

          {/* Shipping */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 p-3 rounded-lg mr-4">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Shipping & Delivery</h2>
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              All orders will be dispatched to the shipping address specified at the time of checkout. 
              Navrangii assumes no responsibility for any delays, damages, or losses incurred during the shipping process.
            </p>
          </motion.div>

          {/* Legal & Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-3 rounded-lg mr-4">
                <Copyright className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Legal & Copyright</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                These terms are governed by and construed in accordance with the laws of India, 
                without regard to its conflict of law principles.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                All content on the Site, including images, designs, text, logos, and graphics, is the property 
                of Navrangii and is protected by copyright laws. You may not copy, reproduce, or distribute any 
                content without prior written consent.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Navrangii reserves the right to modify or amend these Terms & Conditions, as well as any related 
                policies, at any time without prior notice.
              </p>
            </div>
          </motion.div>

          {/* Thank You Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gradient-to-br from-purple-600 to-rose-600 rounded-2xl shadow-lg p-8 text-white text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Thank You for Choosing Navrangii</h2>
            <p className="text-purple-100 text-lg mb-4">
              We are providing pure love with the pure heart.
            </p>
            
            <div className="bg-white/10 rounded-lg p-6 mt-6">
              <p className="text-2xl font-bold text-white tracking-wider">
                "HAR RANG AAPKE SANG"
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
            <Shield className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
