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
        <QueryProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Theme>
                  <ToastContainer />
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
