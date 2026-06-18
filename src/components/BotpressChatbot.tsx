"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function BotpressChatbot() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <Script
        src="https://cdn.botpress.cloud/webchat/v3.4/inject.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://files.bpcontent.cloud/2025/11/27/12/20251127123627-306P5VYY.js"
        strategy="afterInteractive"
      />
    </>
  );
}
