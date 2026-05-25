import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Digitally Cooked — AI-Powered Social Media Content",
  description:
    "Fill out one brand profile. Get 40 platform-perfect posts with hooks, captions, CTAs, hashtags, and AI-generated images — automatically, every month.",
  keywords:
    "AI social media, content generation, automated posts, Instagram content, TikTok, LinkedIn, Facebook, YouTube, social media AI",
  openGraph: {
    title: "Digitally Cooked — Your Month of Content, Cooked in Minutes.",
    description:
      "One brand profile. 40 ready-to-post pieces of content. Hooks, captions, CTAs, hashtags + AI images — for every platform.",
    type: "website",
    siteName: "Digitally Cooked",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digitally Cooked — AI-Powered Social Media Content",
    description: "40 posts. One form. Done in minutes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
