import { site } from "../config";

export const absolute = (path: string) => new URL(path, site.url).href;

export const organization = {
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: `${site.url}/`,
  logo: absolute("/apple-touch-icon.png"),
  email: site.email,
  description: site.entity,
  areaServed: { "@type": "Country", name: "Australia" },
  knowsAbout: [
    "Specialty robusta",
    "Fine robusta",
    "Honey processed coffee",
    "Green coffee",
    "Vietnamese coffee",
    "Coffee roasting",
  ],
};

export const website = {
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: site.name,
  url: `${site.url}/`,
  publisher: { "@id": organization["@id"] },
  inLanguage: "en-AU",
};

export function faqPage(items: { q: string; a: string }[], url: string) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absolute(it.path),
    })),
  };
}

export const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });
