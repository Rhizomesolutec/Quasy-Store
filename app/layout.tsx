import type { Metadata } from "next";
import { Fraunces, DM_Serif_Display, Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { STORE, STORE_ADDRESS } from "@/lib/store";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  variable: "--font-dm-serif",
  subsets: ["latin"],
  display: "swap",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Qusay Store — Gothic Fine Jewelry",
    template: "%s — Qusay Store",
  },
  description:
    "Gothic fine jewelry from Qusay Store, Chalil Moolakkal, Panayi, Anakkayam, Malappuram. WhatsApp orders at +91 8075 814 037.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSerifDisplay.variable} ${pressStart2P.variable} ${vt323.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#070707] text-[#F5F2EF] font-sans selection:bg-[#E50914] selection:text-[#F5F2EF]">
        <CartProvider>
          <WishlistProvider>
            <CustomCursor />
            <Navbar />
            {children}
            <Footer />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "JewelryStore",
                  name: STORE.name,
                  email: STORE.email,
                  telephone: STORE.phoneTel,
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: STORE.addressLine,
                    addressLocality: STORE.city,
                    addressRegion: STORE.region,
                    addressCountry: STORE.country,
                  },
                  url: STORE.mapsUrl,
                  description: STORE_ADDRESS,
                }),
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
