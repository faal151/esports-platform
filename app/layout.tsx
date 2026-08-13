import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://esports-platform-rho.vercel.app"
  ),

  title: {
    default: "PINTO ESPORTS.",
    template: "%s | PINTO ESPORTS.",
  },

  description:
    "PINTO ESPORTS — Platform esports untuk player, squad, tournament, dan competitive record.",

  openGraph: {
    title: "PINTO ESPORTS.",
    description:
      "Platform esports untuk player, squad, tournament, dan competitive record.",
    url: "https://esports-platform-rho.vercel.app",
    siteName: "PINTO ESPORTS.",
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "PINTO ESPORTS.",
    description:
      "Platform esports untuk player, squad, tournament, dan competitive record.",
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050505]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}