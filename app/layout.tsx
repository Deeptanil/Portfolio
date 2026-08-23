import type { Metadata, Viewport } from "next";
import { Syne, Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://deeptanil.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Deeptanil Sinha | Product Engineer & Creative Technologist",
    template: "%s | Deeptanil Sinha",
  },
  description: "Product Engineer, Designer & Builder crafting high-performance WebGL 3D web experiences, mobile apps, and scalable full-stack software.",
  keywords: [
    "Deeptanil Sinha",
    "Product Engineer",
    "Creative Technologist",
    "Full-Stack Developer",
    "WebGL Developer",
    "Three.js Developer",
    "UI/UX Designer",
    "MIT Bengaluru",
    "Portfolio",
    "STRAYED",
    "Prettiva",
  ],
  authors: [{ name: "Deeptanil Sinha", url: baseUrl }],
  creator: "Deeptanil Sinha",
  publisher: "Deeptanil Sinha",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: baseUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Deeptanil Sinha | Product Engineer & Creative Technologist",
    description: "Product Engineer, Designer & Builder crafting high-performance WebGL 3D web experiences, mobile apps, and scalable full-stack software.",
    url: baseUrl,
    siteName: "Deeptanil Sinha Portfolio",
    images: [
      {
        url: '/Deeptanil.webp',
        width: 1200,
        height: 630,
        alt: 'Deeptanil Sinha - Product Engineer & Creative Technologist',
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deeptanil Sinha | Product Engineer & Creative Technologist",
    description: "Product Engineer, Designer & Builder crafting high-performance WebGL 3D web experiences, mobile apps, and scalable full-stack software.",
    images: ['/Deeptanil.webp'],
    creator: "@deeptanil",
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Deeptanil Sinha",
    "jobTitle": "Product Engineer & Creative Technologist",
    "url": baseUrl,
    "image": `${baseUrl}/Deeptanil.webp`,
    "sameAs": [
      "https://linkedin.com/in/deeptanil",
      "https://github.com/Deeptanil"
    ],
    "alumniOf": "MIT Bengaluru",
    "knowsAbout": [
      "Product Engineering",
      "WebGL",
      "Three.js",
      "Next.js",
      "React",
      "UI/UX Design",
      "Full-Stack Software Architecture"
    ]
  };

  return (
    <html lang="en" className="overscroll-y-none" suppressHydrationWarning>
      <head>
        {/* The 3 custom troika/CSS fonts below are only used by the home page's 3D canvas,
            so their preloads live in app/page.tsx instead of here to avoid loading them
            on /about and /work, which never render the canvas. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${syne.variable} ${cormorant.variable} ${jakarta.variable} font-sans antialiased bg-[#0a0a0c] text-white`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
