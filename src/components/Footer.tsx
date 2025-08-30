"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex space-x-2 ">
              <Image
                src="/logo.png"
                alt="Darshu Fashion Logo"
                width={400}
                height={120}
                className="h-[100px] w-auto object-contain filter brightness-0 invert"
                priority
              />
            </div>
            <p className="text-gray-400 mb-4">
              Navrangii is more than just a fashion brand – it's the vibrant journey of a passion turned into fashion. 
              We celebrate diversity, self-expression, and individuality through our "nine colors" philosophy.
            </p>
            <div className="mb-6">
              <a 
                href="/about" 
                className="text-purple-400 hover:text-white transition-colors font-medium inline-flex items-center"
              >
                Know More →
              </a>
            </div>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
              <Instagram className="h-6 w-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
              <Youtube className="h-6 w-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-6">Categories</h3>
            <ul className="space-y-3">
              {["Women's Fashion", "Jewelry Collection", "Couple Outfits", "Family Twinning", "Bridal Wear"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Support */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="/returns-policy" className="text-gray-400 hover:text-white transition-colors">
                  Returns & Exchange
                </a>
              </li>
              <li>
                <a href="/terms-conditions" className="text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Care Instructions
                </a>
              </li>
              <li>
                <a
                  href="/#faq"
                  onClick={(e) => {
                    // If on home page, smooth scroll instead of full navigation
                    if (typeof window !== 'undefined' && window.location.pathname === '/') {
                      e.preventDefault();
                      const el = document.getElementById('faq');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-purple-400" />
                <a
                  href="tel:+918830772745"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Call 8830772745"
                >
                  Call: 8830772745
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-purple-400" />
                <a
                  href="https://wa.me/918830772745"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="WhatsApp Chat"
                >
                  WhatsApp: 8830772745
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-purple-400" />
                <a
                  href="mailto:darshufashion879@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Email darshufashion879@gmail.com"
                >
                  darshufashion879@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-purple-400" />
                <span className="text-gray-400">Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Special Offers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="grid md:grid-cols-2 gap-8 text-center">
            <div>
              <h4 className="text-lg font-semibold text-purple-400 mb-2">Free Shipping</h4>
              <p className="text-gray-400">On orders above Rs 999</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-purple-400 mb-2">7-Day Return Period</h4>
              <p className="text-gray-400">Hassle-free returns within 7 days</p>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Darshu Fashion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
