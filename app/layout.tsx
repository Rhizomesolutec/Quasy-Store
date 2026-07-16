import type { Metadata } from "next";
import { Cutive_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const cutiveMono = Cutive_Mono({
  weight: "400",
  variable: "--font-cutive-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Quasy Store — Gothic Fine Jewelry",
    template: "%s — Quasy Store",
  },
  description: "A unique vintage aesthetic landing page and premium gothic jewelry store.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cutiveMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#111111] text-[#D8CFC0] font-sans selection:bg-[#8E1F1F] selection:text-[#D8CFC0]">
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            {children}
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
