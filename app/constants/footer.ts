import { FooterLink } from "../types";

export const FOOTER_LINKS: FooterLink[] = [
  {
    name: 'LinkedIn',
    hoverText: 'Connect with me',
    icon: 'icons/linkedin.svg',
    url: 'https://linkedin.com/in/deeptanil',
  },
  {
    name: 'GitHub',
    hoverText: 'Open Source',
    icon: 'icons/github.svg',
    url: 'https://github.com/Deeptanil',
  },
  {
    name: 'Email',
    hoverText: 'Get in touch',
    icon: 'icons/file.svg',
    url: 'mailto:deeptanilsinha27@gmail.com',
  },
  {
    name: 'Resume',
    hoverText: 'Download CV',
    icon: 'icons/file.svg',
    url: '/Deeptanil_Sinha_Resume.pdf',
    download: true,
  },
];
