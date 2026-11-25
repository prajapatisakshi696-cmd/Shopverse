import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopVerse",
  description: "Full-stack e-commerce store built with Next.js, TypeScript and Redux Toolkit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
  <SessionProvider>
    <StoreProvider>
      <Header />
      <div className="min-h-[70vh]">{children}</div>
      <Footer />
    </StoreProvider>
  </SessionProvider>
</body>
    </html>
  );
}