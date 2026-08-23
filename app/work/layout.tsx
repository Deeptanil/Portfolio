import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work & Experience',
  description: 'Explore Deeptanil Sinha\'s work experience, software engineering projects, products, and tech stack.',
  openGraph: {
    title: 'Work & Experience | Deeptanil Sinha',
    description: 'Explore Deeptanil Sinha\'s work experience, software engineering projects, products, and tech stack.',
    images: ['/Deeptanil.webp'],
  },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
