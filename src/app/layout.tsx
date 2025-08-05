import type { Metadata } from "next";

import "./globals.css";
import QueryProvider from "@/components/query-provider";
import { ToastContainer } from 'react-toastify';
import { Theme } from "@/components/theme";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/UserContext";



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
              <Theme>
                <ToastContainer />
                {children}
              </Theme>
            </WishlistProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
