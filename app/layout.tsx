import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Signalist",
  description: "Track real-time stock prices with personalized watchlists.",
  metadataBase: new URL('https://stocks-app-s2l1.onrender.com/'),
  keywords: ["stocks", "stock market", "watchlist", "real-time prices", "financial tracker", "trading"],
  
  // OpenGraph tags (Facebook, LinkedIn, iMessage, WhatsApp, Slack, Discord, etc.)
  openGraph: {
    title: "Signalist",
    description: "Track real-time stock prices with personalized watchlists.",
    url: "https://stocks-app-s2l1.onrender.com/",
    siteName: "Signalist",
    images: [
      {
        url: "/assets/images/dashboard.png",
        width: 1200,
        height: 630,
        alt: "Signalist Dashboard - Real-time stock tracking interface",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter/X tags
  twitter: {
    card: "summary_large_image",
    title: "Signalist",
    description: "Track real-time stock prices with personalized watchlists.",
    images: ["/assets/images/dashboard.png"],
    creator: "@signalist",
    site: "@signalist",
  },
  
  // Additional metadata
  alternates: {
    canonical: "https://stocks-app-s2l1.onrender.com/",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
