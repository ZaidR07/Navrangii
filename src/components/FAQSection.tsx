"use client";

import { motion } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { useState } from "react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: "What does 'Navrangii' mean?",
    answer: "Navrangii symbolizes 'nine colors,' reflecting our philosophy that fashion is not limited to one shade, one mood, or one style – it's an entire spectrum. We celebrate the diversity and individuality that each person brings."
  },
  {
    id: 2,
    question: "What is your return and exchange policy?",
    answer: "We accept returns within 7 days of delivery for unused, unworn items with original tags. Items must be in original condition. Sale and discounted items are final sale. Please refer to our detailed Returns & Exchange Policy page for complete information."
  },
  {
    id: 3,
    question: "How long does shipping take?",
    answer: "We typically process orders within 1-2 business days. Standard shipping takes 3-7 business days depending on your location. We provide tracking information once your order is dispatched."
  },
  {
    id: 4,
    question: "Do you offer size exchanges?",
    answer: "Yes, we offer size exchanges for regular-priced items within 7 days of delivery. The item must be unused and in original condition with tags attached. Please contact us at navrangi879@gmail.com to initiate an exchange."
  },
  {
    id: 5,
    question: "Are your products made in India?",
    answer: "Yes, all our products are proudly made in India using traditional and contemporary craftsmanship. Due to the handmade nature, you may notice subtle variations that add to each piece's unique charm."
  },
  {
    id: 6,
    question: "How do I find the right size?",
    answer: "Each product page has a detailed size guide with measurements for chest, waist, and length. Sizes may vary across styles due to different cuts and designs. We recommend checking the product-specific size guide before ordering."
  },
  {
    id: 7,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. Full payment is required at the time of purchase. All transactions are secure and encrypted."
  },
  {
    id: 8,
    question: "Can I cancel my order?",
    answer: "Orders can be cancelled within 2 hours of placement if they haven't been processed for shipping. During sale periods, we experience high volumes and may be unable to cancel orders due to quick processing times."
  },
  {
    id: 9,
    question: "Do you offer bulk or wholesale orders?",
    answer: "Yes, we offer special pricing for bulk orders and wholesale inquiries. Please contact us at navrangi879@gmail.com or call 8830772745 with your requirements for a customized quote."
  },
  {
    id: 10,
    question: "How should I care for my Navrangii garments?",
    answer: "Each product comes with specific care instructions on the product page and care label. Generally, we recommend gentle machine wash or hand wash in cold water. Follow the care instructions to maintain the longevity and appearance of your garments."
  }
];

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-purple-400 to-rose-400 p-4 rounded-full">
              <HelpCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">FAQs</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-2xl mx-auto px-4">
            Find answers to common questions about Navrangii, our products, and policies
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded-2xl"
              >
                <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <div className="flex-shrink-0">
                  {openFAQ === faq.id ? (
                    <Minus className="h-5 w-5 text-purple-600" />
                  ) : (
                    <Plus className="h-5 w-5 text-purple-600" />
                  )}
                </div>
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openFAQ === faq.id ? "auto" : 0,
                  opacity: openFAQ === faq.id ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
