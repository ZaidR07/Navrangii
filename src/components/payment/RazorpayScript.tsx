"use client";

import Script from "next/script";

interface RazorpayScriptProps {
  onLoad?: () => void;
}

export default function RazorpayScript({ onLoad }: RazorpayScriptProps) {
  return (
    <Script
      src="https://checkout.razorpay.com/v1/checkout.js"
      strategy="lazyOnload"
      onLoad={onLoad}
    />
  );
}
