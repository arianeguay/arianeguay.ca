import { createClient } from 'contentful';
import { SiteSettings } from '../types/settings';

// Mock data to use when Contentful environment variables are not set
export const mockData: { siteSettings: SiteSettings } = {
  siteSettings: {
    sys: { id: 'mock-site-settings' },
    __typename: 'SiteSettings',
    siteName: 'Ariane Guay',
    navCollection: {
      items: [
        {
          sys: { id: 'nav-home' },
          __typename: 'NavItem',
          label: 'Home',
          page: { slug: 'home' } as any,
        },
        {
          sys: { id: 'nav-blog' },
          __typename: 'NavItem',
          label: 'Blog',
          page: { slug: 'blog' } as any,
        },
        {
          sys: { id: 'nav-projects' },
          __typename: 'NavItem',
          label: 'Projects',
          page: { slug: 'projects' } as any,
        },
        {
          sys: { id: 'nav-about' },
          __typename: 'NavItem',
          label: 'About',
          page: { slug: 'about' } as any,
        },
        {
          sys: { id: 'nav-contact' },
          __typename: 'NavItem',
          label: 'Contact',
          page: { slug: 'contact' } as any,
        },
      ],
    },
    footer: {
      copyright: '© 2025 Ariane Guay. All rights reserved.',
    },
    socials: [
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/example' },
      { platform: 'GitHub', url: 'https://github.com/example' },
    ],
    defaultSeo: {
      title: 'Ariane Guay | Personal Website',
      description: 'Personal website and portfolio of Ariane Guay.',
      keywords: ['design', 'development', 'portfolio'],
    },
  },
};

// This client should be used server-side only
const getContentfulClient = () => {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_CDA_TOKEN;

  if (!spaceId || !accessToken) {
    console.warn('Contentful environment variables not found. Using mock data.');
    return null;
  }

  return createClient({
    space: spaceId,
    accessToken,
    host: 'cdn.contentful.com',
  });
};

// Export the client as a singleton
export const cf = getContentfulClient();
