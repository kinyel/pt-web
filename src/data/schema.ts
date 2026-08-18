/**
 * JSON-LD builders. Every value traces to primetrack-content-inventory.md §1.
 * No claim is added here that is not verified there.
 */
import { company, contact, socials } from './company.ts';

const SITE = 'https://www.primetracknigeria.com';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.name,
  alternateName: company.shortName,
  url: SITE,
  description:
    'GPS vehicle tracking, video telematics, solar trackers and fleet management in Nigeria. NCC-licensed with 24/7 PrimeCARE support.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '4th Floor, L’Monarch Towers, 65C Opebi Road',
    addressLocality: 'Ikeja',
    addressRegion: 'Lagos',
    addressCountry: 'NG',
  },
  telephone: contact.phones.map((p) => p.display),
  email: contact.email,
  sameAs: socials.map((s) => s.href),
  contactPoint: contact.phones.map((phone) => ({
    '@type': 'ContactPoint',
    telephone: phone.display,
    contactType: 'customer service',
    areaServed: 'NG',
    availableLanguage: 'en',
  })),
};

export function productSchema(input: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    url: `${SITE}${input.url}`,
    brand: { '@type': 'Brand', name: company.name },
    // Verified: 3 years from date of purchase, original purchaser (inventory §6.2).
    warranty: {
      '@type': 'WarrantyPromise',
      durationOfWarranty: { '@type': 'QuantitativeValue', value: 3, unitCode: 'ANN' },
    },
  };
}

export function serviceSchema(input: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: `${SITE}${input.url}`,
    provider: { '@type': 'Organization', name: company.name, url: SITE },
    areaServed: { '@type': 'Country', name: 'Nigeria' },
  };
}

export function breadcrumbSchema(items: { label: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ label: 'Home', href: '/' }, ...items].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: `${SITE}${item.href}`,
    })),
  };
}
