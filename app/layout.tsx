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
  title: "Deeptanil Sinha | Product Engineer",
  description: "Bridging development, UX, and e-commerce. Co-founder of STRAYED and Prettiva & Co. Hands-on experience building production websites, optimizing backends, and using AI-assisted development.",
  keywords: "Deeptanil Sinha, Product Engineer, STRAYED, Prettiva, Full-Stack Developer, UI/UX Design, E-commerce, Web Performance, Bengaluru",
  authors: [{ name: "Deeptanil Sinha" }],
  creator: "Deeptanil Sinha",
  openGraph: {
    title: "Deeptanil Sinha | Product Engineer",
    description: "Bridging development, UX, and e-commerce. Co-founder of STRAYED and Prettiva & Co.",
    siteName: "Deeptanil Sinha Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deeptanil Sinha | Product Engineer",
    description: "Bridging development, UX, and e-commerce. Co-founder of STRAYED and Prettiva & Co.",
  },
};

export const viewport: Viewport = {
  themeColor: "#e65c00",
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
