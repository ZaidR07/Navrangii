import type { Metadata } from "next";

import "./globals.css";
import QueryProvider from "@/components/query-provider";
import { ToastContainer } from 'react-toastify';
import { Theme } from "@/components/theme";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";
import CartPopup from "@/components/cart/CartPopup";



export const metadata: Metadata = {
  title: "Admin",
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
                  <CartPopup />
                </Theme>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
