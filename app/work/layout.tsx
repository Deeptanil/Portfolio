import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://deeptanil.com';

export const metadata: Metadata = {
  title: 'Work & Experience',
  description: 'Explore Deeptanil Sinha\'s work experience, software engineering projects, products, and tech stack.',
  openGraph: {
    title: 'Work & Experience | Deeptanil Sinha',
    description: 'Explore Deeptanil Sinha\'s work experience, software engineering projects, products, and tech stack.',
    images: ['/Deeptanil.webp'],
  },
};

// Structured data for search engines / AI crawlers - the actual page content lives inside a
// 'use client' component (app/work/page.tsx's WORK_EXPERIENCE array) and is only reliably
// readable here as plain markup, so this mirrors it. Keep this in sync if that list changes.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Deeptanil Sinha",
  "url": `${baseUrl}/work`,
  "worksFor": [
    {
      "@type": "Organization",
      "name": "Prettiva & Co.",
      "url": "https://prettiva.co",
      "member": { "@type": "Person", "name": "Deeptanil Sinha", "jobTitle": "Co-Founder & Digital Director" }
    },
    {
      "@type": "Organization",
      "name": "STRAYED",
      "url": "https://strayed.in",
      "member": { "@type": "Person", "name": "Deeptanil Sinha", "jobTitle": "Co-Founder & Technical Director" }
    }
  ],
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Manipal Institute of Technology, Bengaluru",
    "url": "https://www.manipal.edu/mu/campuses/mahe-bengaluru/academics/institution-list/mit-blr.html"
  },
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "name": "Google UX Design Professional Certificate",
    "url": "https://www.coursera.org/professional-certificates/google-ux-design"
  },
  "knowsAbout": [
    "JavaScript", "Next.js", "React", "Node.js", "Three.js / React Three Fiber",
    "UI/UX Design", "Web Performance Optimization", "SEO", "E-commerce Architecture"
  ]
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
