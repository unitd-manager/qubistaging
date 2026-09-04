/**
 * SEO Head Component
 * Injects meta tags and JSON-LD into document head
 * Also enforces the qubi favicon on every page, regardless of any
 * per-page/CMS-driven metadata, so the browser tab always shows the qubi logo.
 */

import { useEffect } from 'react';
import { SEOMetadata, JSONLDSchema } from '@/types/seo';
import { toAbsoluteUrl } from '@/lib/urls';

interface SEOHeadProps {
  metadata: SEOMetadata | null;
  jsonLD?: JSONLDSchema | null;
  additionalMeta?: Record<string, string>;
}

// Fixed, site-wide favicon — never sourced from Strapi/CMS metadata.
// Update this single path if the logo file ever changes.
const QUBI_FAVICON_PATH = '/qubi-logo.png?v=3';

export const SEOHead = ({ metadata, jsonLD, additionalMeta = {} }: SEOHeadProps) => {
  // Favicon must be enforced on every render, even if metadata is null
  // (e.g. while SEO data is still loading), so it can't ever be missing or wrong.
  useEffect(() => {
    const ensureFavicon = (rel: string) => {
      let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"][data-qubi-favicon="true"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        link.setAttribute('data-qubi-favicon', 'true');
        document.head.appendChild(link);
      }
      link.setAttribute('href', QUBI_FAVICON_PATH);
      link.setAttribute('type', 'image/png');
    };

    // Remove any other icon links that aren't ours (covers any stray/legacy tags)
    document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach((node) => {
      if (node.getAttribute('data-qubi-favicon') !== 'true') {
        node.remove();
      }
    });

    ensureFavicon('icon');
    ensureFavicon('shortcut icon');
  }, []);

  if (!metadata) {
    return null;
  }

  const {
    title,
    description,
    keywords,
    canonical,
    robots,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
  } = metadata;
  const normalizedCanonical = toAbsoluteUrl(canonical);
  const normalizedOgImage = toAbsoluteUrl(ogImage);
  const normalizedTwitterImage = toAbsoluteUrl(twitterImage);

  useEffect(() => {
    document.title = title;

    const managedNodes: HTMLElement[] = [];

    const appendMeta = (key: string, attr: 'name' | 'property', value: string) => {
      const element = document.createElement('meta');
      element.setAttribute(attr, key);
      element.setAttribute('content', value);
      element.setAttribute('data-seo-head', 'true');
      document.head.appendChild(element);
      managedNodes.push(element);
    };

    const appendLink = (rel: string, href: string) => {
      const element = document.createElement('link');
      element.setAttribute('rel', rel);
      element.setAttribute('href', href);
      element.setAttribute('data-seo-head', 'true');
      document.head.appendChild(element);
      managedNodes.push(element);
    };

    const appendScript = (schema: JSONLDSchema) => {
      const element = document.createElement('script');
      element.setAttribute('type', 'application/ld+json');
      element.setAttribute('data-seo-head', 'true');
      element.textContent = JSON.stringify(schema);
      document.head.appendChild(element);
      managedNodes.push(element);
    };

    document.querySelectorAll('[data-seo-head="true"]').forEach((node) => node.remove());

    appendMeta('description', 'name', description);
    if (keywords) appendMeta('keywords', 'name', keywords);
    if (robots) appendMeta('robots', 'name', robots);
    if (normalizedCanonical) appendLink('canonical', normalizedCanonical);

    appendMeta('og:type', 'property', ogType || 'website');
    appendMeta('og:title', 'property', ogTitle || title);
    appendMeta('og:description', 'property', ogDescription || description);
    if (normalizedOgImage) appendMeta('og:image', 'property', normalizedOgImage);
    if (normalizedCanonical) appendMeta('og:url', 'property', normalizedCanonical);

    appendMeta('twitter:card', 'name', twitterCard || 'summary_large_image');
    appendMeta('twitter:title', 'name', twitterTitle || title);
    appendMeta('twitter:description', 'name', twitterDescription || description);
    if (normalizedTwitterImage) appendMeta('twitter:image', 'name', normalizedTwitterImage);

    Object.entries(additionalMeta).forEach(([key, value]) => appendMeta(key, 'name', value));

    if (jsonLD) appendScript(jsonLD);

    return () => {
      managedNodes.forEach((node) => node.remove());
    };
  }, [
    additionalMeta,
    description,
    jsonLD,
    keywords,
    normalizedCanonical,
    normalizedOgImage,
    normalizedTwitterImage,
    ogDescription,
    ogTitle,
    ogType,
    robots,
    title,
    twitterCard,
    twitterDescription,
    twitterTitle,
  ]);

  return null;
};
