import type { Metadata } from "next";

import "./globals.css";
import QueryProvider from "@/components/query-provider";
import { ToastContainer } from 'react-toastify';
import { Theme } from "@/components/theme";



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
          <Theme>
            <ToastContainer />
            {children}
          </Theme>
        </QueryProvider>
      </body>
    </html>
  );
}
