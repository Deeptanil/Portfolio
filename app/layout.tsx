import type { Metadata, Viewport } from "next";
import { Syne, Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import "./globals.css";

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://deeptanil.com/'),
  title: "Deeptanil Sinha | Creative Full-Stack Developer",
  description: "Portfolio of Deeptanil Sinha — Creative Full-Stack Developer, Founder of STRAYED, Co-Founder of Prettiva & Co. Combining design aesthetics, engineering precision, and business strategy.",
  keywords: "Deeptanil Sinha, Creative Full-Stack Developer, STRAYED, Prettiva, React, Three.js, Next.js, WebGL, Design Engineering",
  authors: [{ name: "Deeptanil Sinha" }],
  creator: "Deeptanil Sinha",
  openGraph: {
    title: "Deeptanil Sinha | Creative Full-Stack Developer",
    description: "Combining design aesthetics, engineering precision, and business strategy.",
    siteName: "Deeptanil Sinha Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deeptanil Sinha | Creative Full-Stack Developer",
    description: "Combining design aesthetics, engineering precision, and business strategy.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overscroll-y-none">
      <body
        className={`${syne.variable} ${cormorant.variable} ${jakarta.variable} font-sans antialiased bg-[#0a0a0c] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
