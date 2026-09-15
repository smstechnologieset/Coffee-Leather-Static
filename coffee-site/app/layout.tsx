import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Highland Roots Coffee Trading — Premium Ethiopian Specialty Coffee",
    template: "%s | Highland Roots Coffee",
  },
  description:
    "Source premium specialty coffee direct from Ethiopia's highland farms. Request samples, negotiate contracts, and build lasting B2B supply-chain partnerships with Highland Roots Trading PLC.",
  keywords: ["Ethiopian coffee", "specialty coffee", "B2B coffee trading", "Yirgacheffe", "Sidamo", "coffee export"],
  openGraph: {
    siteName: "Highland Roots Coffee Trading",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
