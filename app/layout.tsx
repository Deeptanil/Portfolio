import type { Metadata, Viewport } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const soriaFont = localFont({
  src: "../public/soria-font.ttf",
  variable: "--font-soria",
});

const vercettiFont = localFont({
  src: "../public/Vercetti-Regular.woff",
  variable: "--font-vercetti",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com/'),
  title: "Deeptanil Sinha ✌️",
  description: "Creative Full-Stack Developer, Founder of STRAYED, Co-Founder of Prettiva & Co.",
  keywords: "Deeptanil Sinha, Full-Stack Developer, React, Three.js, Creative Developer, Web Development, JavaScript, TypeScript, Portfolio",
  authors: [{ name: "Deeptanil Sinha" }],
  creator: "Deeptanil Sinha",
  publisher: "Deeptanil Sinha",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Deeptanil Sinha - Creative Full-Stack Developer",
    description: "Combining design, engineering, and business strategy.",
    siteName: "Deeptanil Sinha's Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deeptanil Sinha - Creative Full-Stack Developer",
    description: "Combining design, engineering, and business strategy.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
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
        className={`${soriaFont.variable} ${vercettiFont.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
