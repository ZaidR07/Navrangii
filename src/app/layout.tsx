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
        className={`antialiased dark:text-white`}
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
                  {children}
                  <BackToTopButton />
                  <CartPopup />
                  
                  {/* Botpress Chatbot */}
                  <script 
                    src="https://cdn.botpress.cloud/webchat/v3.4/inject.js" 
                    defer
                  />
                  <script 
                    src="https://files.bpcontent.cloud/2025/11/27/12/20251127123627-306P5VYY.js" 
                    defer
                  />
                </Theme>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
