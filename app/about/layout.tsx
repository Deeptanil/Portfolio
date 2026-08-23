import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn about Deeptanil Sinha - Product Engineer, Creative Technologist, background, engineering philosophy, and personal interests.',
  openGraph: {
    title: 'About Me | Deeptanil Sinha',
    description: 'Learn about Deeptanil Sinha - Product Engineer, Creative Technologist, background, engineering philosophy, and personal interests.',
    images: ['/Deeptanil.webp'],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
