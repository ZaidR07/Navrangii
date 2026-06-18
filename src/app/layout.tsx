import type { Metadata } from "next";

import "./globals.css";
import QueryProvider from "@/components/query-provider";
import { ToastContainer } from 'react-toastify';
import { Theme } from "@/components/theme";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";
import CartPopup from "@/components/cart/CartPopup";
import BackToTopButton from "@/components/BackToTopButton";
import BotpressChatbot from "@/components/BotpressChatbot";
import RouteAccessGuard from "@/components/RouteAccessGuard";

export const metadata: Metadata = {
  title: "Navrangi",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className="antialiased"
      >
        <style>{`
          .ReactQueryDevtools button {
            right: 16px !important;
            bottom: 160px !important;
          }

          @media (max-width: 1024px) {
            #bp-web-widget-container,
            .bpw-widget-container,
            .bpw-floating-button {
              top: 76% !important;
              bottom: auto !important;
              transform: translateY(-50%) !important;
              right: 16px !important;
              z-index: 1500 !important;
            }

            .ReactQueryDevtools,
            .ReactQueryDevtools * {
              z-index: 1500 !important;
            }

            .ReactQueryDevtools button {
              top: 86% !important;
              bottom: auto !important;
              right: 16px !important;
            }
          }
        `}</style>
        <QueryProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Theme>
                  <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                  <RouteAccessGuard>{children}</RouteAccessGuard>
                  <BackToTopButton />
                  <CartPopup />
                  
                  <BotpressChatbot />
                </Theme>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
