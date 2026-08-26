// vite.config.ts
import { defineConfig, loadEnv } from "file:///G:/qubi/qubistaging/node_modules/vite/dist/node/index.js";
import react from "file:///G:/qubi/qubistaging/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import fs from "node:fs/promises";

// src/lib/seo-content.ts
var ALLOWED_TAGS = /* @__PURE__ */ new Set([
  "a",
  "p",
  "br",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "h1",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "ul",
  "ol",
  "li",
  "hr",
  "img",
  "code",
  "pre",
  "span",
  "div"
]);
var escapeHtml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
var sanitizeUrl = (value) => {
  const cleaned = value.trim();
  if (!cleaned || /^javascript:/i.test(cleaned)) return "";
  return cleaned;
};
var sanitizeTagAttributes = (tag, rawAttributes) => {
  const attrs = Array.from(rawAttributes.matchAll(/([a-zA-Z0-9:-]+)(?:\s*=\s*(".*?"|'.*?'|[^\s"'=<>`]+))?/g));
  const safeAttributes = [];
  for (const match of attrs) {
    const name = match[1]?.toLowerCase() ?? "";
    const rawValue = match[2] ?? "";
    const unquotedValue = rawValue.replace(/^['"]|['"]$/g, "");
    if (!name || name.startsWith("on") || name === "style") continue;
    if (tag === "a") {
      if (name !== "href" && name !== "target" && name !== "rel") continue;
      if (name === "href") {
        const safeHref = sanitizeUrl(unquotedValue);
        if (!safeHref) continue;
        safeAttributes.push(`href="${escapeHtml(safeHref)}"`);
        continue;
      }
      if (name === "target") {
        const safeTarget = unquotedValue === "_blank" ? "_blank" : "";
        if (!safeTarget) continue;
        safeAttributes.push(`target="${safeTarget}"`);
        continue;
      }
      if (name === "rel") {
        const safeRel = unquotedValue || "noopener noreferrer";
        safeAttributes.push(`rel="${escapeHtml(safeRel)}"`);
        continue;
      }
    } else if (tag === "img") {
      if (name !== "src" && name !== "alt" && name !== "title") continue;
      if (name === "src") {
        const safeSrc = sanitizeUrl(unquotedValue);
        if (!safeSrc) continue;
        safeAttributes.push(`src="${escapeHtml(safeSrc)}"`);
        continue;
      }
      safeAttributes.push(`${name}="${escapeHtml(unquotedValue)}"`);
    } else if (name === "class") {
      safeAttributes.push(`class="${escapeHtml(unquotedValue)}"`);
    }
  }
  if (tag === "a" && !safeAttributes.some((attr) => attr.startsWith("rel="))) {
    safeAttributes.push('rel="noopener noreferrer"');
  }
  return safeAttributes.length > 0 ? ` ${safeAttributes.join(" ")}` : "";
};
var sanitizeSeoContentHtml = (html) => {
  if (!html) return "";
  const withoutDangerousBlocks = html.replace(
    /<(script|style|iframe|object|embed|link|meta)([\s\S]*?)>([\s\S]*?)<\/\1>/gi,
    ""
  );
  return withoutDangerousBlocks.replace(/<\/?([a-zA-Z0-9-]+)([^>]*)>/g, (fullMatch, rawTagName, rawAttributes) => {
    const tag = String(rawTagName).toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return "";
    const isClosingTag = fullMatch.startsWith("</");
    if (isClosingTag) {
      return `</${tag}>`;
    }
    if (fullMatch.endsWith("/>") || tag === "br" || tag === "hr") {
      return `<${tag}${sanitizeTagAttributes(tag, String(rawAttributes ?? ""))}>`;
    }
    return `<${tag}${sanitizeTagAttributes(tag, String(rawAttributes ?? ""))}>`;
  });
};
var HOME_SEO_SOURCE_SECTION_ID = "qubi-home-seo-source";
var buildHomeSeoContentMarkup = (contentHtml) => `<section id="${HOME_SEO_SOURCE_SECTION_ID}" data-static-home-seo-content="true" class="border-t border-border bg-background">
  <div class="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
    <div class="mx-auto max-w-4xl">
      <div class="blog-content text-base sm:text-lg text-foreground">${contentHtml}</div>
    </div>
  </div>
</section>`;

// vite.bootstrap.ts
var HERO_IMAGE_SIZES = "(min-width: 1024px) 50vw, (min-width: 640px) 90vw, 100vw";
var DEFAULT_HERO_ALT = "qubi platform orchestration diagram showing AI agents, workflows, integrations, and analytics";
var isObject = (value) => typeof value === "object" && value !== null;
var pickList = (body) => {
  if (!isObject(body)) return [];
  if (Array.isArray(body.data)) return body.data.filter(isObject);
  if (Array.isArray(body.results)) return body.results.filter(isObject);
  if (isObject(body.data)) {
    if (Array.isArray(body.data.data)) return body.data.data.filter(isObject);
    if (Array.isArray(body.data.results)) return body.data.results.filter(isObject);
  }
  return [];
};
var sanitizeTextValue = (value) => {
  if (!value) return void 0;
  const cleaned = value.trim().replace(/`/g, "").trim();
  return cleaned || void 0;
};
var sanitizeUrlValue = (value) => {
  const cleaned = sanitizeTextValue(value);
  if (!cleaned) return void 0;
  return cleaned.replace(/^["']+/, "").replace(/["']+$/, "").trim() || void 0;
};
var toAbsoluteUrl = (siteUrl, value) => {
  const cleaned = sanitizeUrlValue(value);
  if (!cleaned) return void 0;
  try {
    return new URL(cleaned).toString();
  } catch {
    return new URL(cleaned.startsWith("/") ? cleaned : `/${cleaned}`, `${siteUrl.replace(/\/$/, "")}/`).toString();
  }
};
var getSeoObject = (value) => {
  if (!isObject(value)) return null;
  if ("attributes" in value && isObject(value.attributes)) {
    return value.attributes;
  }
  if ("data" in value && isObject(value.data) && "attributes" in value.data && isObject(value.data.attributes)) {
    return value.data.attributes;
  }
  return value;
};
var pickString = (obj, keys) => {
  if (!obj) return void 0;
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return void 0;
};
var getMediaUrl = (strapiBase, media) => {
  const assetBase = strapiBase.replace(/\/$/, "");
  if (!media) return void 0;
  if (typeof media === "string") {
    const cleaned = sanitizeUrlValue(media);
    if (!cleaned) return void 0;
    return cleaned.startsWith("http") ? cleaned : `${assetBase}${cleaned}`;
  }
  if (isObject(media) && typeof media.url === "string") {
    const cleaned = sanitizeUrlValue(media.url);
    if (!cleaned) return void 0;
    return cleaned.startsWith("http") ? cleaned : `${assetBase}${cleaned}`;
  }
  if (isObject(media) && "attributes" in media && isObject(media.attributes) && typeof media.attributes.url === "string") {
    const url = sanitizeUrlValue(media.attributes.url);
    if (!url) return void 0;
    return url.startsWith("http") ? url : `${assetBase}${url}`;
  }
  return void 0;
};
var sanitizeJsonValue = (value) => {
  if (typeof value === "string") {
    return sanitizeTextValue(value) ?? value;
  }
  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeJsonValue(entry));
  }
  if (isObject(value)) {
    const out = {};
    for (const [key, entry] of Object.entries(value)) {
      out[key] = sanitizeJsonValue(entry);
    }
    return out;
  }
  return value;
};
var getSeoSchema = (item) => {
  const attrs = isObject(item.attributes) ? item.attributes : item;
  const seo = getSeoObject(attrs.seo);
  if (!seo) return null;
  const rawSchema = seo.schema;
  if (isObject(rawSchema)) return sanitizeJsonValue(rawSchema);
  if (typeof rawSchema === "string") {
    try {
      const parsed = JSON.parse(rawSchema);
      return isObject(parsed) ? sanitizeJsonValue(parsed) : null;
    } catch {
      return null;
    }
  }
  return null;
};
var buildSeoMetadata = (item, path2, siteUrl, strapiBase) => {
  const attrs = item && isObject(item.attributes) ? item.attributes : item ?? {};
  const seo = getSeoObject(attrs.seo);
  const title = sanitizeTextValue(pickString(seo, ["metaTitle", "meta_title", "title", "metaTitleText"])) || sanitizeTextValue(attrs.title) || "Qubi Flow Orchestrator";
  const description = sanitizeTextValue(pickString(seo, ["metaDescription", "meta_description", "description"])) || "Enterprise workflow orchestration platform";
  const keywords = sanitizeTextValue(pickString(seo, ["keywords", "metaKeywords", "meta_keywords", "meta_keyword"]));
  const canonical = toAbsoluteUrl(siteUrl, pickString(seo, ["canonicalURL", "canonical_url", "canonical", "canonicalUrl"]));
  const ogTitle = sanitizeTextValue(pickString(seo, ["ogTitle", "og_title"])) || title;
  const ogDescription = sanitizeTextValue(pickString(seo, ["ogDescription", "og_description"])) || description;
  const ogImageRaw = seo?.ogImage ?? seo?.og_image ?? seo?.metaImage ?? seo?.meta_image;
  const ogImage = getMediaUrl(strapiBase, ogImageRaw);
  const twitterCard = sanitizeTextValue(pickString(seo, ["twitterCard", "twitter_card"])) || "summary_large_image";
  const twitterTitle = sanitizeTextValue(pickString(seo, ["twitterTitle", "twitter_title"])) || ogTitle;
  const twitterDescription = sanitizeTextValue(pickString(seo, ["twitterDescription", "twitter_description"])) || ogDescription;
  const twitterImage = getMediaUrl(strapiBase, seo?.twitterImage ?? seo?.twitter_image ?? ogImageRaw) || ogImage;
  return {
    id: path2,
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogType: "website",
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    canonical,
    robots: "index, follow"
  };
};
var stripHtml = (value) => value ? value.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").trim() : "";
var buildHeroImage = (strapiBase, image) => {
  if (!isObject(image) || typeof image.url !== "string") {
    return void 0;
  }
  const formats = isObject(image.formats) ? image.formats : {};
  const variants = Object.values(formats).filter((format) => isObject(format) && typeof format.url === "string").map((format) => ({
    src: getMediaUrl(strapiBase, format.url) ?? "",
    width: typeof format.width === "number" ? format.width : 0
  })).filter((format) => format.src && format.width > 0).sort((a, b) => a.width - b.width);
  const baseWidth = typeof image.width === "number" ? image.width : variants[variants.length - 1]?.width ?? 1024;
  const baseSource = {
    src: getMediaUrl(strapiBase, image.url) ?? "",
    width: baseWidth
  };
  const sources = [...variants, baseSource].filter(
    (source, index, allSources) => source.src && allSources.findIndex((candidate) => candidate.width === source.width) === index
  );
  const preferredSource = sources.find((source) => source.width >= 1e3) ?? sources.find((source) => source.width >= 750) ?? sources[sources.length - 1];
  if (!preferredSource?.src) {
    return void 0;
  }
  return {
    src: preferredSource.src,
    alt: typeof image.alternativeText === "string" && image.alternativeText || DEFAULT_HERO_ALT,
    width: typeof image.width === "number" ? image.width : 1024,
    height: typeof image.height === "number" ? image.height : 576,
    sizes: HERO_IMAGE_SIZES,
    sources
  };
};
var fetchJson = async (url) => {
  const response = await fetch(url, {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${url}`);
  }
  return await response.json();
};
var fetchFirstItem = async (url) => {
  const body = await fetchJson(url);
  return pickList(body)[0] ?? null;
};
var fetchFirstMatchingPage = async (strapiBase, slugs) => {
  for (const slug of slugs) {
    try {
      const item = await fetchFirstItem(
        `${strapiBase}/api/pages?populate=*&filters[slug][$eq]=${encodeURIComponent(slug)}`
      );
      if (item) return item;
    } catch {
      continue;
    }
  }
  return null;
};
var loadNavbarData = async (strapiBase) => {
  const [sectionsBody, categoriesBody] = await Promise.all([
    fetchJson(
      `${strapiBase}/api/sections?filters[published][$eq]=true&filters[show_in_nav][$eq]=true&sort[0]=sort_order:asc&pagination[pageSize]=100`
    ),
    fetchJson(
      `${strapiBase}/api/categories?filters[published][$eq]=true&filters[show_in_nav][$eq]=true&sort[0]=sort_order:asc&pagination[pageSize]=100`
    )
  ]);
  const sections = pickList(sectionsBody);
  const categories = pickList(categoriesBody);
  const itemsBySection = /* @__PURE__ */ new Map();
  for (const category of categories) {
    const sectionId = typeof category.section_id === "number" ? category.section_id : null;
    const label = typeof category.category_title === "string" ? category.category_title : "";
    const href = sanitizeUrlValue(
      typeof category.internal_link === "string" && category.internal_link || typeof category.external_link === "string" && category.external_link || ""
    ) || "";
    if (!sectionId || !label || !href) continue;
    const items = itemsBySection.get(sectionId) ?? [];
    items.push({ label, href });
    itemsBySection.set(sectionId, items);
  }
  return sections.reduce((acc, section) => {
    if (typeof section.id !== "number" || typeof section.section_title !== "string") {
      return acc;
    }
    const items = itemsBySection.get(section.id) ?? [];
    if (items.length > 0) {
      acc.push({
        title: section.section_title,
        items
      });
      return acc;
    }
    const href = sanitizeUrlValue(
      typeof section.internal_link === "string" && section.internal_link || typeof section.external_link === "string" && section.external_link || ""
    ) || "";
    if (href) {
      acc.push({
        title: section.section_title,
        items: [],
        href
      });
    }
    return acc;
  }, []);
};
var loadBootstrapData = async ({ siteUrl, strapiBase }) => {
  const [navbar, heroSection, demoSection, homePage] = await Promise.all([
    loadNavbarData(strapiBase).catch(() => []),
    fetchFirstItem(
      `${strapiBase}/api/sections?populate=images&filters[published][$eq]=true&filters[section_type][$eq]=hero&sort[0]=sort_order:asc&pagination[pageSize]=1`
    ).catch(() => null),
    fetchFirstItem(
      `${strapiBase}/api/sections?filters[published][$eq]=true&filters[section_type][$eq]=demo_video_section&sort[0]=sort_order:asc&pagination[pageSize]=1`
    ).catch(() => null),
    fetchFirstMatchingPage(strapiBase, ["/", "/home", "home"]).catch(() => null)
  ]);
  const heroImage = buildHeroImage(
    strapiBase,
    isObject(heroSection) && Array.isArray(heroSection.images) ? heroSection.images[0] : void 0
  );
  const hero = heroSection && isObject(heroSection) ? {
    badge: typeof heroSection.template === "string" && heroSection.template || "Agentic Automation Platform",
    heading: typeof heroSection.section_title === "string" && heroSection.section_title || "Design and orchestrate enterprise workflows with qubi",
    subheading: stripHtml(typeof heroSection.description === "string" ? heroSection.description : void 0) || "Connect AI agents, business systems, and human approvals in one enterprise orchestration layer.",
    ctaLabel: typeof heroSection.display_type === "string" && heroSection.display_type || "Book a Demo",
    ctaUrl: sanitizeUrlValue(typeof heroSection.external_link === "string" ? heroSection.external_link : void 0) || "https://meetings.hubspot.com/maheshv",
    image: heroImage
  } : void 0;
  const demo = demoSection && isObject(demoSection) ? {
    videoTitle: typeof demoSection.section_title === "string" && demoSection.section_title || "qubi Platform Full Demo",
    videoDuration: typeof demoSection.description === "string" && demoSection.description || "12 minutes End-to-end execution walkthrough"
  } : void 0;
  const seoContentHtml = homePage && isObject(homePage) && typeof homePage.content === "string" ? sanitizeSeoContentHtml(homePage.content) : "";
  const homeRouteData = {
    seo: {
      metadata: buildSeoMetadata(homePage, "/", siteUrl, strapiBase),
      jsonLD: homePage && isObject(homePage) ? getSeoSchema(homePage) : null
    },
    home: {
      hero,
      demo,
      seoContentHtml
    }
  };
  return {
    navbar,
    routes: {
      "/": homeRouteData,
      "/home": homeRouteData
    }
  };
};
var escapeHtmlAttribute = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var escapeHtmlText = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
var isPathActive = (pathname, href) => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};
var renderChevronDownIcon = () => '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down transition-transform duration-200"><path d="m6 9 6 6 6-6"></path></svg>';
var renderMenuIcon = () => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>';
var renderArrowRightIcon = () => '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
var renderPlayIcon = () => '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play text-primary ml-1"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>';
var buildHeroHeadingMarkup = (heading) => {
  const splitIndex = heading.indexOf("qubi");
  if (splitIndex === -1) return escapeHtmlText(heading);
  const before = escapeHtmlText(heading.slice(0, splitIndex));
  const after = escapeHtmlText(heading.slice(splitIndex + 4));
  return `${before}<span class="text-gradient">qubi</span>${after}`;
};
var buildNavbarMarkup = (navbar, routePath) => {
  const navSections = navbar ?? [];
  const desktopItems = navSections.map((section) => {
    if (section.href) {
      const className2 = isPathActive(routePath, section.href) ? "text-sm font-medium transition-colors text-primary" : "text-sm font-medium transition-colors text-muted-foreground hover:text-primary";
      return `<a href="${escapeHtmlAttribute(section.href)}" class="${className2}">${escapeHtmlText(section.title)}</a>`;
    }
    const isActive = section.items.some((item) => isPathActive(routePath, item.href));
    const className = isActive ? "flex items-center gap-1 text-sm font-medium transition-colors text-primary" : "flex items-center gap-1 text-sm font-medium transition-colors text-muted-foreground hover:text-primary";
    return `<div class="relative"><button class="${className}" aria-expanded="false" aria-haspopup="menu" aria-label="${escapeHtmlAttribute(`${section.title} menu`)}" type="button">${escapeHtmlText(section.title)}${renderChevronDownIcon()}</button></div>`;
  }).join("");
  return `<nav class="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
      <div class="container mx-auto flex items-center justify-between h-[76px] px-4 lg:px-8">
        <a href="/" class="flex items-center gap-2" aria-label="Qubi Flow Orchestrator home">
          <img src="/src/assets/qubi-logo.png" alt="Qubi Flow Orchestrator" width="120" height="100" class="h-14 lg:h-16 w-auto">
        </a>
        <div class="hidden md:flex items-center gap-8">${desktopItems}</div>
        <div class="hidden md:block">
          <a href="https://meetings.hubspot.com/maheshv" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow font-semibold text-base h-11 rounded-md px-8">Book a Demo</a>
        </div>
        <button class="md:hidden p-2 text-foreground" aria-expanded="false" aria-controls="mobile-navigation" aria-label="Open navigation menu" type="button">${renderMenuIcon()}</button>
      </div>
    </nav>`;
};
var buildHeroMarkup = (hero) => {
  if (!hero) return "";
  const srcSet = hero.image?.sources.map((source) => `${source.src} ${source.width}w`).join(", ");
  const heroImageMarkup = hero.image?.src ? `<div class="animate-fade-up-delay-2 relative">
            <div class="relative rounded-2xl overflow-hidden shadow-card-hover">
              <img src="${escapeHtmlAttribute(hero.image.src)}"${srcSet ? ` srcset="${escapeHtmlAttribute(srcSet)}"` : ""}${hero.image.sizes ? ` sizes="${escapeHtmlAttribute(hero.image.sizes)}"` : ""} alt="${escapeHtmlAttribute(hero.image.alt)}" width="${hero.image.width}" height="${hero.image.height}" class="w-full h-auto rounded-2xl" fetchpriority="high" loading="eager" decoding="async">
              <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/20"></div>
            </div>
          </div>` : '<div class="animate-fade-up-delay-2 relative"></div>';
  return `<section class="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      <div class="absolute inset-0 bg-gradient-glow pointer-events-none"></div>
      <div class="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div class="max-w-2xl">
            <div class="animate-fade-up">
              <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
                <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                ${escapeHtmlText(hero.badge)}
              </span>
            </div>
            <h1 class="animate-fade-up-delay-1 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-foreground">${buildHeroHeadingMarkup(hero.heading)}</h1>
            <p class="animate-fade-up-delay-2 mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">${escapeHtmlText(hero.subheading)}</p>
            <div class="animate-fade-up-delay-3 flex flex-wrap gap-4 mt-10">
              <a href="${escapeHtmlAttribute(hero.ctaUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow font-semibold text-base h-11 rounded-md px-8 gap-2 px-8 h-12">${escapeHtmlText(hero.ctaLabel)} ${renderArrowRightIcon()}</a>
            </div>
          </div>
          ${heroImageMarkup}
        </div>
      </div>
    </section>`;
};
var buildDemoMarkup = (demo) => {
  const videoTitle = demo?.videoTitle ?? "qubi Platform Full Demo";
  const videoDuration = demo?.videoDuration ?? "12 minutes End-to-end execution walkthrough";
  return `<section class="py-12 bg-surface-elevated border-y border-border">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <div class="relative rounded-2xl bg-background border border-border shadow-card-hover overflow-hidden aspect-video flex items-center justify-center group cursor-pointer hover:border-primary/30 transition-all duration-300">
            <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <div class="relative text-center">
              <div class="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-all duration-300">
                ${renderPlayIcon()}
              </div>
              <p class="text-foreground font-semibold">${escapeHtmlText(videoTitle)}</p>
              <p class="text-muted-foreground text-sm mt-1">${escapeHtmlText(videoDuration)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>`;
};
var buildDeferredPlaceholder = (minHeight) => `<div style="min-height:${escapeHtmlAttribute(minHeight)}"></div>`;
var buildFooterMarkup = () => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return `<footer class="py-10 bg-background border-t border-border">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <p class="text-sm text-muted-foreground">&copy; ${currentYear} qubi by Qbotica. All rights reserved.</p>
          <div class="flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#" class="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" class="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" class="hover:text-primary transition-colors">Contact Qubi</a>
          </div>
        </div>
      </div>
    </footer>`;
};
var buildHomePrerenderShell = (data, routePath) => {
  const homeData = data.routes?.[routePath]?.home ?? data.routes?.["/"]?.home;
  const heroMarkup = buildHeroMarkup(homeData?.hero);
  const demoMarkup = buildDemoMarkup(homeData?.demo);
  const seoMarkup = homeData?.seoContentHtml ? buildHomeSeoContentMarkup(homeData.seoContentHtml) : "";
  return `<div class="min-h-screen">
      ${buildNavbarMarkup(data.navbar, routePath)}
      <main id="main-content">
        ${heroMarkup}
        ${demoMarkup}
        ${buildDeferredPlaceholder("26rem")}
        ${buildDeferredPlaceholder("30rem")}
        ${buildDeferredPlaceholder("26rem")}
        ${buildDeferredPlaceholder("28rem")}
        ${buildDeferredPlaceholder("28rem")}
        ${buildDeferredPlaceholder("26rem")}
        ${buildDeferredPlaceholder("30rem")}
        ${buildDeferredPlaceholder("26rem")}
        ${seoMarkup}
        ${buildDeferredPlaceholder("22rem")}
      </main>
      ${buildFooterMarkup()}
    </div>`;
};
var serializeBootstrap = (data) => JSON.stringify(data).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
var injectBootstrapIntoHtml = (html, data, options = {}) => {
  let out = html.replace(/\s*<script id="qubi-bootstrap-data">[\s\S]*?<\/script>/i, "").replace(/\s*<link rel="preload" as="image"[^>]*data-qubi-hero-preload="true"[^>]*>/i, "").replace(/\s*<section[^>]*data-static-home-seo-content="true"[\s\S]*?<\/section>/i, "");
  const heroImage = data.routes?.["/"]?.home?.hero?.image;
  const srcSet = heroImage?.sources.map((source) => `${source.src} ${source.width}w`).join(", ");
  const preloadLink = options.preloadHero && heroImage?.src ? `  <link rel="preload" as="image" href="${escapeHtmlAttribute(heroImage.src)}"${srcSet ? ` imagesrcset="${escapeHtmlAttribute(srcSet)}"` : ""}${heroImage.sizes ? ` imagesizes="${escapeHtmlAttribute(heroImage.sizes)}"` : ""} fetchpriority="high" data-qubi-hero-preload="true">
` : "";
  const bootstrapScript = `  <script id="qubi-bootstrap-data">window.__QUBI_BOOTSTRAP__=${serializeBootstrap(data)};</script>
`;
  const prerenderHome = options.routePath === "/" || options.routePath === "/home";
  const rootMarkup = prerenderHome ? `<div id="root" data-prerendered-route="${escapeHtmlAttribute(options.routePath ?? "/")}">${buildHomePrerenderShell(
    data,
    options.routePath ?? "/"
  )}</div>` : '<div id="root"></div>';
  out = out.replace(/<div id="root"><\/div>/i, rootMarkup).replace("</head>", `${preloadLink}${bootstrapScript}</head>`);
  return out;
};

// vite.config.ts
var __vite_injected_original_dirname = "G:\\qubi\\qubistaging";
var isObject2 = (value) => typeof value === "object" && value !== null;
var pickList2 = (body) => {
  if (!isObject2(body)) return [];
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.results)) return body.results;
  if (isObject2(body.data)) {
    if (Array.isArray(body.data.data)) return body.data.data;
    if (Array.isArray(body.data.results)) return body.data.results;
  }
  return [];
};
var getSeoObject2 = (value) => {
  if (!isObject2(value)) return null;
  if ("attributes" in value && isObject2(value.attributes)) {
    return value.attributes;
  }
  if ("data" in value && isObject2(value.data) && "attributes" in value.data && isObject2(value.data.attributes)) {
    return value.data.attributes;
  }
  return value;
};
var pickString2 = (obj, keys) => {
  if (!obj) return void 0;
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return void 0;
};
var sanitizeTextValue2 = (value) => {
  if (!value) return void 0;
  const cleaned = value.trim().replace(/`/g, "").trim();
  return cleaned || void 0;
};
var sanitizeUrlValue2 = (value) => {
  const cleaned = sanitizeTextValue2(value);
  if (!cleaned) return void 0;
  return cleaned.replace(/^["']+/, "").replace(/["']+$/, "").trim() || void 0;
};
var getMediaUrlValue = (strapiBase, value) => {
  if (!value) return void 0;
  if (typeof value === "string") {
    const cleaned = sanitizeUrlValue2(value);
    if (!cleaned) return void 0;
    return cleaned.startsWith("http") ? cleaned : `${strapiBase}${cleaned}`;
  }
  if (isObject2(value) && typeof value.url === "string") {
    const cleaned = sanitizeUrlValue2(value.url);
    if (!cleaned) return void 0;
    return cleaned.startsWith("http") ? cleaned : `${strapiBase}${cleaned}`;
  }
  if (isObject2(value) && "attributes" in value && isObject2(value.attributes) && typeof value.attributes.url === "string") {
    const cleaned = sanitizeUrlValue2(value.attributes.url);
    if (!cleaned) return void 0;
    return cleaned.startsWith("http") ? cleaned : `${strapiBase}${cleaned}`;
  }
  return void 0;
};
var escapeXml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
var buildAbsoluteUrl = (siteUrl, route) => {
  const normalizedSiteUrl = siteUrl.replace(/\/+$/, "");
  const normalizedRoute = route === "/" ? "/" : `/${route.replace(/^\/+/, "").replace(/\/+$/, "")}`;
  return normalizedRoute === "/" ? `${normalizedSiteUrl}/` : `${normalizedSiteUrl}${normalizedRoute}`;
};
var buildSitemapXml = (entries) => {
  const lines = entries.map((entry) => {
    const parts = [`    <loc>${escapeXml(entry.loc)}</loc>`];
    if (entry.lastmod) {
      parts.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
    }
    return ["  <url>", ...parts, "  </url>"].join("\n");
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...lines,
    "</urlset>",
    ""
  ].join("\n");
};
var extractPageSeo = (item, strapiBase) => {
  if (!isObject2(item)) return null;
  const attrs = "attributes" in item && isObject2(item.attributes) ? item.attributes : item;
  const seo = getSeoObject2(attrs.seo);
  if (!seo) return null;
  const title = sanitizeTextValue2(pickString2(seo, ["metaTitle", "meta_title", "title", "metaTitleText"]));
  const description = sanitizeTextValue2(pickString2(seo, ["metaDescription", "meta_description", "description"]));
  const canonical = sanitizeUrlValue2(pickString2(seo, ["canonicalURL", "canonical_url", "canonical", "canonicalUrl"]));
  const ogTitle = sanitizeTextValue2(pickString2(seo, ["ogTitle", "og_title"])) || title;
  const ogDescription = sanitizeTextValue2(pickString2(seo, ["ogDescription", "og_description"])) || description;
  const ogImageRaw = seo?.ogImage ?? seo?.og_image ?? seo?.metaImage ?? seo?.meta_image;
  const ogImage = getMediaUrlValue(strapiBase, ogImageRaw);
  const twitterCard = sanitizeTextValue2(pickString2(seo, ["twitterCard", "twitter_card"])) || "summary_large_image";
  const twitterTitle = sanitizeTextValue2(pickString2(seo, ["twitterTitle", "twitter_title"])) || ogTitle || title;
  const twitterDescription = sanitizeTextValue2(pickString2(seo, ["twitterDescription", "twitter_description"])) || ogDescription || description;
  const twitterImage = getMediaUrlValue(strapiBase, seo?.twitterImage ?? seo?.twitter_image ?? ogImageRaw) || ogImage;
  const rawSchema = seo.schema;
  let jsonLD = null;
  if (isObject2(rawSchema)) {
    jsonLD = rawSchema;
  } else if (typeof rawSchema === "string") {
    try {
      const parsed = JSON.parse(rawSchema);
      jsonLD = isObject2(parsed) ? parsed : null;
    } catch {
      jsonLD = null;
    }
  }
  return {
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    jsonLD
  };
};
var upsertMetaTagByName = (html, name, content) => {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`<meta\\s+name=["']${escapedName}["'][^>]*>`, "i");
  if (re.test(html)) {
    return html.replace(re, `<meta name="${name}" content="${content}">`);
  }
  return html.replace("</head>", `  <meta name="${name}" content="${content}">
</head>`);
};
var upsertMetaTagByProperty = (html, property, content) => {
  const escapedProperty = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`<meta\\s+property=["']${escapedProperty}["'][^>]*>`, "i");
  if (re.test(html)) {
    return html.replace(re, `<meta property="${property}" content="${content}">`);
  }
  return html.replace("</head>", `  <meta property="${property}" content="${content}">
</head>`);
};
var upsertCanonical = (html, href) => {
  const re = /<link\s+rel=["']canonical["'][^>]*>/i;
  if (re.test(html)) {
    return html.replace(re, `<link rel="canonical" href="${href}">`);
  }
  return html.replace("</head>", `  <link rel="canonical" href="${href}">
</head>`);
};
var upsertJsonLd = (html, schema) => {
  const json = JSON.stringify(schema).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  const script = `  <script type="application/ld+json" data-static-seo-schema="true">${json}</script>
`;
  const re = /\s*<script\s+type=["']application\/ld\+json["'][^>]*data-static-seo-schema=["']true["'][^>]*>[\s\S]*?<\/script>/i;
  if (re.test(html)) {
    return html.replace(re, `
${script}`);
  }
  return html.replace("</head>", `${script}</head>`);
};
var applySeoToHtml = (html, seo) => {
  let out = html;
  out = out.replace(/\s*<script\s+type=["']application\/ld\+json["'][^>]*data-static-seo-schema=["']true["'][^>]*>[\s\S]*?<\/script>/i, "");
  if (seo.title) {
    if (/<title>.*<\/title>/i.test(out)) out = out.replace(/<title>.*<\/title>/i, `<title>${seo.title}</title>`);
    else out = out.replace("</head>", `  <title>${seo.title}</title>
</head>`);
  }
  if (seo.description) out = upsertMetaTagByName(out, "description", seo.description);
  if (seo.canonical) {
    out = upsertCanonical(out, seo.canonical);
    out = upsertMetaTagByProperty(out, "og:url", seo.canonical);
  }
  if (seo.ogTitle) out = upsertMetaTagByProperty(out, "og:title", seo.ogTitle);
  if (seo.ogDescription) out = upsertMetaTagByProperty(out, "og:description", seo.ogDescription);
  if (seo.ogImage) out = upsertMetaTagByProperty(out, "og:image", seo.ogImage);
  if (seo.twitterCard) out = upsertMetaTagByName(out, "twitter:card", seo.twitterCard);
  if (seo.twitterTitle) out = upsertMetaTagByName(out, "twitter:title", seo.twitterTitle);
  if (seo.twitterDescription) out = upsertMetaTagByName(out, "twitter:description", seo.twitterDescription);
  if (seo.twitterImage) out = upsertMetaTagByName(out, "twitter:image", seo.twitterImage);
  if (seo.jsonLD) out = upsertJsonLd(out, seo.jsonLD);
  return out;
};
function dynamicSeoHtmlPlugin(mode) {
  const env = loadEnv(mode, process.cwd(), "");
  const strapiBase = (env.VITE_STRAPI_URL || "http://localhost:1337").replace(/\/$/, "");
  const siteUrl = sanitizeUrlValue2(env.VITE_APP_URL) || "http://localhost:8080";
  const cache = /* @__PURE__ */ new Map();
  let bootstrapPromise = null;
  const fetchBootstrap = () => {
    if (!bootstrapPromise) {
      bootstrapPromise = loadBootstrapData({ siteUrl, strapiBase }).catch(() => ({}));
    }
    return bootstrapPromise;
  };
  const fetchSeo = async (slug) => {
    if (cache.has(slug)) return cache.get(slug);
    const slugsToTry = slug === "/" ? ["/", "/home", "home"] : slug === "/home" ? ["/home", "/", "home"] : [slug];
    const urls = slugsToTry.flatMap((entry) => [
      `${strapiBase}/api/pages?filters[slug][$eq]=${encodeURIComponent(entry)}`,
      `${strapiBase}/api/pages?filters[slug][$eq]=${encodeURIComponent(entry)}&populate[seo]=*`,
      `${strapiBase}/api/pages?filters[slug][$eq]=${encodeURIComponent(entry)}&populate=seo`
    ]);
    for (const url of urls) {
      try {
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        if (!res.ok) continue;
        const body = await res.json();
        const items = pickList2(body);
        const item = items[0] ?? null;
        const result = extractPageSeo(item, strapiBase) ?? {};
        cache.set(slug, result);
        return result;
      } catch {
        continue;
      }
    }
    const empty = {};
    cache.set(slug, empty);
    return empty;
  };
  return {
    name: "dynamic-seo-html",
    apply: "serve",
    transformIndexHtml: {
      order: "pre",
      async handler(html, ctx) {
        const url = ctx?.originalUrl || "/";
        const pathname = new URL(url, "http://local").pathname;
        const slug = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
        const seo = await fetchSeo(slug);
        const bootstrap = await fetchBootstrap();
        return injectBootstrapIntoHtml(applySeoToHtml(html, seo), bootstrap, { preloadHero: slug === "/", routePath: slug });
      }
    }
  };
}
function prerenderSeoHtmlPlugin(mode) {
  const env = loadEnv(mode, process.cwd(), "");
  const strapiBase = (env.VITE_STRAPI_URL || "http://localhost:1337").replace(/\/$/, "");
  const siteUrl = sanitizeUrlValue2(env.VITE_APP_URL) || "http://localhost:8080";
  const fallbackRoutes = [
    "/solutions/use-cases",
    "/solutions/industries",
    "/customers",
    "/pricing",
    "/resources/blog",
    "/resources/demo",
    "/resources/newsroom",
    "/resources/faqs"
  ];
  const fetchSeo = async (slug) => {
    const slugsToTry = slug === "/" ? ["/", "/home", "home"] : slug === "/home" ? ["/home", "/", "home"] : [slug];
    const urls = slugsToTry.flatMap((entry) => [
      `${strapiBase}/api/pages?filters[slug][$eq]=${encodeURIComponent(entry)}`,
      `${strapiBase}/api/pages?filters[slug][$eq]=${encodeURIComponent(entry)}&populate[seo]=*`,
      `${strapiBase}/api/pages?filters[slug][$eq]=${encodeURIComponent(entry)}&populate=seo`
    ]);
    for (const url of urls) {
      try {
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        if (!res.ok) continue;
        const body = await res.json();
        const items = pickList2(body);
        const item = items[0] ?? null;
        return extractPageSeo(item, strapiBase) ?? {};
      } catch {
        continue;
      }
    }
    return {};
  };
  const fetchAllPageSlugs = async () => {
    const slugs = [];
    const seen = /* @__PURE__ */ new Set();
    const pickPagination = (body) => {
      if (typeof body !== "object" || body === null) return null;
      const anyBody = body;
      const pag = anyBody?.meta?.pagination ?? anyBody?.pagination;
      if (!pag || typeof pag !== "object") return null;
      const page2 = Number(pag.page ?? 1) || 1;
      const pageSize2 = Number(pag.pageSize ?? 100) || 100;
      const pageCount2 = Number(pag.pageCount ?? 1) || 1;
      const total = Number(pag.total ?? 0) || 0;
      return { page: page2, pageSize: pageSize2, pageCount: pageCount2, total };
    };
    const pageSize = 100;
    let page = 1;
    let pageCount = 1;
    while (page <= pageCount) {
      const url = `${strapiBase}/api/pages?pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) break;
      const body = await res.json();
      const items = pickList2(body);
      for (const item of items) {
        if (!isObject2(item)) continue;
        const rawSlug = item.slug ?? (isObject2(item.attributes) ? item.attributes.slug : void 0);
        if (typeof rawSlug !== "string" || !rawSlug.trim()) continue;
        const normalized = rawSlug.startsWith("/") ? rawSlug : `/${rawSlug}`;
        if (!seen.has(normalized)) {
          seen.add(normalized);
          slugs.push(normalized);
        }
      }
      const pagination = pickPagination(body);
      pageCount = pagination?.pageCount ?? pageCount;
      page += 1;
    }
    return slugs;
  };
  const fetchRedirects = async () => {
    const urls = [
      `${strapiBase}/api/redirects?filters[isActive][$eq]=true&pagination[limit]=1000`,
      `${strapiBase}/api/redirects?pagination[limit]=1000`
    ];
    for (const url of urls) {
      try {
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        if (!res.ok) continue;
        const body = await res.json();
        const items = typeof body === "object" && body !== null && Array.isArray(body.data) && body.data || typeof body === "object" && body !== null && Array.isArray(body.results) && body.results || [];
        const rules = [];
        for (const item of items) {
          if (typeof item !== "object" || item === null) continue;
          const anyItem = item;
          const attrs = anyItem.attributes && typeof anyItem.attributes === "object" && anyItem.attributes || anyItem;
          const from = attrs.from;
          const to = attrs.to;
          if (typeof from !== "string" || typeof to !== "string") continue;
          rules.push({ from, to, type: attrs.type, isActive: attrs.isActive });
        }
        return rules;
      } catch {
        continue;
      }
    }
    return [];
  };
  const normalizePathname = (value) => {
    const raw = sanitizeUrlValue2(value);
    if (!raw) return null;
    let pathname = raw;
    if (/^https?:\/\//i.test(raw)) {
      try {
        pathname = new URL(raw).pathname;
      } catch {
        return null;
      }
    }
    if (!pathname.startsWith("/")) pathname = `/${pathname}`;
    pathname = pathname.replace(/\/+$/, "");
    return pathname || "/";
  };
  return {
    name: "prerender-seo-html",
    apply: "build",
    async closeBundle() {
      const distDir = path.resolve(process.cwd(), "dist");
      const baseIndexPath = path.join(distDir, "index.html");
      const baseHtml = await fs.readFile(baseIndexPath, "utf8");
      const buildDate = (/* @__PURE__ */ new Date()).toISOString();
      const bootstrap = await loadBootstrapData({ siteUrl, strapiBase }).catch(() => ({}));
      const slugsFromStrapi = await fetchAllPageSlugs().catch(() => []);
      const routesToGenerate = Array.from(/* @__PURE__ */ new Set(["/", ...fallbackRoutes, ...slugsFromStrapi]));
      const homeSeo = await fetchSeo("/");
      const homeHtml = injectBootstrapIntoHtml(applySeoToHtml(baseHtml, homeSeo), bootstrap, {
        preloadHero: true,
        routePath: "/"
      });
      await fs.writeFile(baseIndexPath, homeHtml, "utf8");
      for (const route of routesToGenerate) {
        if (route === "/") continue;
        const seo = await fetchSeo(route);
        const html = injectBootstrapIntoHtml(applySeoToHtml(baseHtml, seo), bootstrap, { routePath: route });
        const outDir = path.join(distDir, route.replace(/^\//, ""));
        await fs.mkdir(outDir, { recursive: true });
        await fs.writeFile(path.join(outDir, "index.html"), html, "utf8");
      }
      const sitemapXml = buildSitemapXml(
        routesToGenerate.map((route) => ({
          loc: buildAbsoluteUrl(siteUrl, route),
          lastmod: buildDate
        }))
      );
      await fs.writeFile(path.join(distDir, "sitemap.xml"), sitemapXml, "utf8");
      const redirects = await fetchRedirects().catch(() => []);
      for (const rule of redirects) {
        const fromPath = normalizePathname(rule.from);
        if (!fromPath || fromPath === "/") continue;
        const toUrl = sanitizeUrlValue2(rule.to);
        if (!toUrl) continue;
        const redirectHtml = baseHtml.replace(
          "</head>",
          `  <meta http-equiv="refresh" content="0; url=${toUrl}">
  <link rel="canonical" href="${toUrl}">
  <script>window.location.replace(${JSON.stringify(toUrl)});</script>
</head>`
        );
        const outDir = path.join(distDir, fromPath.replace(/^\//, ""));
        await fs.mkdir(outDir, { recursive: true });
        await fs.writeFile(path.join(outDir, "index.html"), redirectHtml, "utf8");
      }
    }
  };
}
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false
    },
    proxy: {
      "/api": {
        target: "https://qubiadmin.unitdtechnologies.com",
        changeOrigin: true
      },
      "/uploads": {
        target: "https://qubiadmin.unitdtechnologies.com",
        changeOrigin: true
      }
    }
  },
  plugins: [
    react(),
    dynamicSeoHtmlPlugin(mode),
    prerenderSeoHtmlPlugin(mode)
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"]
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, "/");
          if (normalizedId.includes("/src/lib/strapi-api.ts") || normalizedId.includes("/src/lib/urls.ts") || normalizedId.includes("/src/hooks/useSEO.ts") || normalizedId.includes("/src/hooks/use404Tracking.ts") || normalizedId.includes("/src/hooks/useRedirects.ts")) {
            return "app-runtime";
          }
          if (!id.includes("node_modules")) {
            return void 0;
          }
          if (id.includes("react-dom") || id.includes("react-router") || id.includes("/react/")) {
            return "react-core";
          }
          if (id.includes("@tanstack/react-query") || id.includes("axios")) {
            return "data";
          }
          if (id.includes("@radix-ui") || id.includes("sonner") || id.includes("vaul") || id.includes("cmdk")) {
            return "ui";
          }
          if (id.includes("lucide-react")) {
            return "icons";
          }
          return "vendor";
        }
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL2xpYi9zZW8tY29udGVudC50cyIsICJ2aXRlLmJvb3RzdHJhcC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkc6XFxcXHF1YmlcXFxccXViaXN0YWdpbmdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkc6XFxcXHF1YmlcXFxccXViaXN0YWdpbmdcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0c6L3F1YmkvcXViaXN0YWdpbmcvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYsIHR5cGUgUGx1Z2luIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IGZzIGZyb20gXCJub2RlOmZzL3Byb21pc2VzXCI7XHJcblxyXG5pbXBvcnQgeyBpbmplY3RCb290c3RyYXBJbnRvSHRtbCwgbG9hZEJvb3RzdHJhcERhdGEgfSBmcm9tIFwiLi92aXRlLmJvb3RzdHJhcFwiO1xyXG5cclxudHlwZSBIdG1sU2VvRGF0YSA9IHtcclxuICB0aXRsZT86IHN0cmluZztcclxuICBkZXNjcmlwdGlvbj86IHN0cmluZztcclxuICBjYW5vbmljYWw/OiBzdHJpbmc7XHJcbiAgb2dUaXRsZT86IHN0cmluZztcclxuICBvZ0Rlc2NyaXB0aW9uPzogc3RyaW5nO1xyXG4gIG9nSW1hZ2U/OiBzdHJpbmc7XHJcbiAgdHdpdHRlckNhcmQ/OiBzdHJpbmc7XHJcbiAgdHdpdHRlclRpdGxlPzogc3RyaW5nO1xyXG4gIHR3aXR0ZXJEZXNjcmlwdGlvbj86IHN0cmluZztcclxuICB0d2l0dGVySW1hZ2U/OiBzdHJpbmc7XHJcbiAganNvbkxEPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsO1xyXG59O1xyXG5cclxudHlwZSBTaXRlbWFwRW50cnkgPSB7XHJcbiAgbG9jOiBzdHJpbmc7XHJcbiAgbGFzdG1vZD86IHN0cmluZztcclxufTtcclxuXHJcbmNvbnN0IGlzT2JqZWN0ID0gKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPT5cclxuICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGw7XHJcblxyXG5jb25zdCBwaWNrTGlzdCA9IChib2R5OiB1bmtub3duKTogdW5rbm93bltdID0+IHtcclxuICBpZiAoIWlzT2JqZWN0KGJvZHkpKSByZXR1cm4gW107XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkoYm9keS5kYXRhKSkgcmV0dXJuIGJvZHkuZGF0YTtcclxuICBpZiAoQXJyYXkuaXNBcnJheShib2R5LnJlc3VsdHMpKSByZXR1cm4gYm9keS5yZXN1bHRzO1xyXG5cclxuICBpZiAoaXNPYmplY3QoYm9keS5kYXRhKSkge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYm9keS5kYXRhLmRhdGEpKSByZXR1cm4gYm9keS5kYXRhLmRhdGE7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShib2R5LmRhdGEucmVzdWx0cykpIHJldHVybiBib2R5LmRhdGEucmVzdWx0cztcclxuICB9XHJcblxyXG4gIHJldHVybiBbXTtcclxufTtcclxuXHJcbmNvbnN0IGdldFNlb09iamVjdCA9ICh2YWx1ZTogdW5rbm93bik6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCA9PiB7XHJcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHJldHVybiBudWxsO1xyXG4gIGlmIChcImF0dHJpYnV0ZXNcIiBpbiB2YWx1ZSAmJiBpc09iamVjdCgodmFsdWUgYXMgeyBhdHRyaWJ1dGVzPzogdW5rbm93biB9KS5hdHRyaWJ1dGVzKSkge1xyXG4gICAgcmV0dXJuICh2YWx1ZSBhcyB7IGF0dHJpYnV0ZXM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IH0pLmF0dHJpYnV0ZXM7XHJcbiAgfVxyXG4gIGlmIChcclxuICAgIFwiZGF0YVwiIGluIHZhbHVlICYmXHJcbiAgICBpc09iamVjdCgodmFsdWUgYXMgeyBkYXRhPzogdW5rbm93biB9KS5kYXRhKSAmJlxyXG4gICAgXCJhdHRyaWJ1dGVzXCIgaW4gKHZhbHVlIGFzIHsgZGF0YTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfSkuZGF0YSAmJlxyXG4gICAgaXNPYmplY3QoKCh2YWx1ZSBhcyB7IGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IH0pLmRhdGEgYXMgeyBhdHRyaWJ1dGVzPzogdW5rbm93biB9KS5hdHRyaWJ1dGVzKVxyXG4gICkge1xyXG4gICAgcmV0dXJuICgodmFsdWUgYXMgeyBkYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB9KS5kYXRhIGFzIHsgYXR0cmlidXRlczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfSkuYXR0cmlidXRlcztcclxuICB9XHJcbiAgcmV0dXJuIHZhbHVlO1xyXG59O1xyXG5cclxuY29uc3QgcGlja1N0cmluZyA9IChvYmo6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCwga2V5czogc3RyaW5nW10pOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xyXG4gIGlmICghb2JqKSByZXR1cm4gdW5kZWZpbmVkO1xyXG4gIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcclxuICAgIGNvbnN0IHZhbHVlID0gb2JqW2tleV07XHJcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmIHZhbHVlLnRyaW0oKSkgcmV0dXJuIHZhbHVlLnRyaW0oKTtcclxuICB9XHJcbiAgcmV0dXJuIHVuZGVmaW5lZDtcclxufTtcclxuXHJcbmNvbnN0IHNhbml0aXplVGV4dFZhbHVlID0gKHZhbHVlPzogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcclxuICBpZiAoIXZhbHVlKSByZXR1cm4gdW5kZWZpbmVkO1xyXG4gIGNvbnN0IGNsZWFuZWQgPSB2YWx1ZS50cmltKCkucmVwbGFjZSgvYC9nLCBcIlwiKS50cmltKCk7XHJcbiAgcmV0dXJuIGNsZWFuZWQgfHwgdW5kZWZpbmVkO1xyXG59O1xyXG5cclxuY29uc3Qgc2FuaXRpemVVcmxWYWx1ZSA9ICh2YWx1ZT86IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XHJcbiAgY29uc3QgY2xlYW5lZCA9IHNhbml0aXplVGV4dFZhbHVlKHZhbHVlKTtcclxuICBpZiAoIWNsZWFuZWQpIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgcmV0dXJuIGNsZWFuZWQucmVwbGFjZSgvXltcIiddKy8sIFwiXCIpLnJlcGxhY2UoL1tcIiddKyQvLCBcIlwiKS50cmltKCkgfHwgdW5kZWZpbmVkO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0TWVkaWFVcmxWYWx1ZSA9IChzdHJhcGlCYXNlOiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcclxuICBpZiAoIXZhbHVlKSByZXR1cm4gdW5kZWZpbmVkO1xyXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgIGNvbnN0IGNsZWFuZWQgPSBzYW5pdGl6ZVVybFZhbHVlKHZhbHVlKTtcclxuICAgIGlmICghY2xlYW5lZCkgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIHJldHVybiBjbGVhbmVkLnN0YXJ0c1dpdGgoXCJodHRwXCIpID8gY2xlYW5lZCA6IGAke3N0cmFwaUJhc2V9JHtjbGVhbmVkfWA7XHJcbiAgfVxyXG4gIGlmIChpc09iamVjdCh2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlLnVybCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgY29uc3QgY2xlYW5lZCA9IHNhbml0aXplVXJsVmFsdWUodmFsdWUudXJsKTtcclxuICAgIGlmICghY2xlYW5lZCkgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIHJldHVybiBjbGVhbmVkLnN0YXJ0c1dpdGgoXCJodHRwXCIpID8gY2xlYW5lZCA6IGAke3N0cmFwaUJhc2V9JHtjbGVhbmVkfWA7XHJcbiAgfVxyXG4gIGlmIChcclxuICAgIGlzT2JqZWN0KHZhbHVlKSAmJlxyXG4gICAgXCJhdHRyaWJ1dGVzXCIgaW4gdmFsdWUgJiZcclxuICAgIGlzT2JqZWN0KCh2YWx1ZSBhcyB7IGF0dHJpYnV0ZXM/OiB1bmtub3duIH0pLmF0dHJpYnV0ZXMpICYmXHJcbiAgICB0eXBlb2YgKHZhbHVlIGFzIHsgYXR0cmlidXRlczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfSkuYXR0cmlidXRlcy51cmwgPT09IFwic3RyaW5nXCJcclxuICApIHtcclxuICAgIGNvbnN0IGNsZWFuZWQgPSBzYW5pdGl6ZVVybFZhbHVlKCh2YWx1ZSBhcyB7IGF0dHJpYnV0ZXM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IH0pLmF0dHJpYnV0ZXMudXJsIGFzIHN0cmluZyk7XHJcbiAgICBpZiAoIWNsZWFuZWQpIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICByZXR1cm4gY2xlYW5lZC5zdGFydHNXaXRoKFwiaHR0cFwiKSA/IGNsZWFuZWQgOiBgJHtzdHJhcGlCYXNlfSR7Y2xlYW5lZH1gO1xyXG4gIH1cclxuICByZXR1cm4gdW5kZWZpbmVkO1xyXG59O1xyXG5cclxuY29uc3QgZXNjYXBlWG1sID0gKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcgPT5cclxuICB2YWx1ZVxyXG4gICAgLnJlcGxhY2UoLyYvZywgXCImYW1wO1wiKVxyXG4gICAgLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpXHJcbiAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIilcclxuICAgIC5yZXBsYWNlKC9cIi9nLCBcIiZxdW90O1wiKVxyXG4gICAgLnJlcGxhY2UoLycvZywgXCImYXBvcztcIik7XHJcblxyXG5jb25zdCBidWlsZEFic29sdXRlVXJsID0gKHNpdGVVcmw6IHN0cmluZywgcm91dGU6IHN0cmluZyk6IHN0cmluZyA9PiB7XHJcbiAgY29uc3Qgbm9ybWFsaXplZFNpdGVVcmwgPSBzaXRlVXJsLnJlcGxhY2UoL1xcLyskLywgXCJcIik7XHJcbiAgY29uc3Qgbm9ybWFsaXplZFJvdXRlID0gcm91dGUgPT09IFwiL1wiID8gXCIvXCIgOiBgLyR7cm91dGUucmVwbGFjZSgvXlxcLysvLCBcIlwiKS5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpfWA7XHJcbiAgcmV0dXJuIG5vcm1hbGl6ZWRSb3V0ZSA9PT0gXCIvXCIgPyBgJHtub3JtYWxpemVkU2l0ZVVybH0vYCA6IGAke25vcm1hbGl6ZWRTaXRlVXJsfSR7bm9ybWFsaXplZFJvdXRlfWA7XHJcbn07XHJcblxyXG5jb25zdCBidWlsZFNpdGVtYXBYbWwgPSAoZW50cmllczogU2l0ZW1hcEVudHJ5W10pOiBzdHJpbmcgPT4ge1xyXG4gIGNvbnN0IGxpbmVzID0gZW50cmllcy5tYXAoKGVudHJ5KSA9PiB7XHJcbiAgICBjb25zdCBwYXJ0cyA9IFtgICAgIDxsb2M+JHtlc2NhcGVYbWwoZW50cnkubG9jKX08L2xvYz5gXTtcclxuICAgIGlmIChlbnRyeS5sYXN0bW9kKSB7XHJcbiAgICAgIHBhcnRzLnB1c2goYCAgICA8bGFzdG1vZD4ke2VzY2FwZVhtbChlbnRyeS5sYXN0bW9kKX08L2xhc3Rtb2Q+YCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW1wiICA8dXJsPlwiLCAuLi5wYXJ0cywgXCIgIDwvdXJsPlwiXS5qb2luKFwiXFxuXCIpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gW1xyXG4gICAgJzw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCI/PicsXHJcbiAgICAnPHVybHNldCB4bWxucz1cImh0dHA6Ly93d3cuc2l0ZW1hcHMub3JnL3NjaGVtYXMvc2l0ZW1hcC8wLjlcIj4nLFxyXG4gICAgLi4ubGluZXMsXHJcbiAgICBcIjwvdXJsc2V0PlwiLFxyXG4gICAgXCJcIixcclxuICBdLmpvaW4oXCJcXG5cIik7XHJcbn07XHJcblxyXG5jb25zdCBleHRyYWN0UGFnZVNlbyA9IChpdGVtOiB1bmtub3duLCBzdHJhcGlCYXNlOiBzdHJpbmcpOiBIdG1sU2VvRGF0YSB8IG51bGwgPT4ge1xyXG4gIGlmICghaXNPYmplY3QoaXRlbSkpIHJldHVybiBudWxsO1xyXG5cclxuICBjb25zdCBhdHRycyA9XHJcbiAgICBcImF0dHJpYnV0ZXNcIiBpbiBpdGVtICYmIGlzT2JqZWN0KChpdGVtIGFzIHsgYXR0cmlidXRlcz86IHVua25vd24gfSkuYXR0cmlidXRlcylcclxuICAgICAgPyAoaXRlbSBhcyB7IGF0dHJpYnV0ZXM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IH0pLmF0dHJpYnV0ZXNcclxuICAgICAgOiBpdGVtO1xyXG4gIGNvbnN0IHNlbyA9IGdldFNlb09iamVjdCgoYXR0cnMgYXMgeyBzZW8/OiB1bmtub3duIH0pLnNlbyk7XHJcblxyXG4gIGlmICghc2VvKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgY29uc3QgdGl0bGUgPSBzYW5pdGl6ZVRleHRWYWx1ZShwaWNrU3RyaW5nKHNlbywgW1wibWV0YVRpdGxlXCIsIFwibWV0YV90aXRsZVwiLCBcInRpdGxlXCIsIFwibWV0YVRpdGxlVGV4dFwiXSkpO1xyXG4gIGNvbnN0IGRlc2NyaXB0aW9uID0gc2FuaXRpemVUZXh0VmFsdWUocGlja1N0cmluZyhzZW8sIFtcIm1ldGFEZXNjcmlwdGlvblwiLCBcIm1ldGFfZGVzY3JpcHRpb25cIiwgXCJkZXNjcmlwdGlvblwiXSkpO1xyXG4gIGNvbnN0IGNhbm9uaWNhbCA9IHNhbml0aXplVXJsVmFsdWUocGlja1N0cmluZyhzZW8sIFtcImNhbm9uaWNhbFVSTFwiLCBcImNhbm9uaWNhbF91cmxcIiwgXCJjYW5vbmljYWxcIiwgXCJjYW5vbmljYWxVcmxcIl0pKTtcclxuICBjb25zdCBvZ1RpdGxlID0gc2FuaXRpemVUZXh0VmFsdWUocGlja1N0cmluZyhzZW8sIFtcIm9nVGl0bGVcIiwgXCJvZ190aXRsZVwiXSkpIHx8IHRpdGxlO1xyXG4gIGNvbnN0IG9nRGVzY3JpcHRpb24gPSBzYW5pdGl6ZVRleHRWYWx1ZShwaWNrU3RyaW5nKHNlbywgW1wib2dEZXNjcmlwdGlvblwiLCBcIm9nX2Rlc2NyaXB0aW9uXCJdKSkgfHwgZGVzY3JpcHRpb247XHJcbiAgY29uc3Qgb2dJbWFnZVJhdyA9IHNlbz8ub2dJbWFnZSA/PyBzZW8/Lm9nX2ltYWdlID8/IHNlbz8ubWV0YUltYWdlID8/IHNlbz8ubWV0YV9pbWFnZTtcclxuICBjb25zdCBvZ0ltYWdlID0gZ2V0TWVkaWFVcmxWYWx1ZShzdHJhcGlCYXNlLCBvZ0ltYWdlUmF3KTtcclxuICBjb25zdCB0d2l0dGVyQ2FyZCA9IHNhbml0aXplVGV4dFZhbHVlKHBpY2tTdHJpbmcoc2VvLCBbXCJ0d2l0dGVyQ2FyZFwiLCBcInR3aXR0ZXJfY2FyZFwiXSkpIHx8IFwic3VtbWFyeV9sYXJnZV9pbWFnZVwiO1xyXG4gIGNvbnN0IHR3aXR0ZXJUaXRsZSA9IHNhbml0aXplVGV4dFZhbHVlKHBpY2tTdHJpbmcoc2VvLCBbXCJ0d2l0dGVyVGl0bGVcIiwgXCJ0d2l0dGVyX3RpdGxlXCJdKSkgfHwgb2dUaXRsZSB8fCB0aXRsZTtcclxuICBjb25zdCB0d2l0dGVyRGVzY3JpcHRpb24gPVxyXG4gICAgc2FuaXRpemVUZXh0VmFsdWUocGlja1N0cmluZyhzZW8sIFtcInR3aXR0ZXJEZXNjcmlwdGlvblwiLCBcInR3aXR0ZXJfZGVzY3JpcHRpb25cIl0pKSB8fCBvZ0Rlc2NyaXB0aW9uIHx8IGRlc2NyaXB0aW9uO1xyXG4gIGNvbnN0IHR3aXR0ZXJJbWFnZSA9IGdldE1lZGlhVXJsVmFsdWUoc3RyYXBpQmFzZSwgc2VvPy50d2l0dGVySW1hZ2UgPz8gc2VvPy50d2l0dGVyX2ltYWdlID8/IG9nSW1hZ2VSYXcpIHx8IG9nSW1hZ2U7XHJcbiAgY29uc3QgcmF3U2NoZW1hID0gc2VvLnNjaGVtYTtcclxuICBsZXQganNvbkxEOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwgPSBudWxsO1xyXG4gIGlmIChpc09iamVjdChyYXdTY2hlbWEpKSB7XHJcbiAgICBqc29uTEQgPSByYXdTY2hlbWE7XHJcbiAgfSBlbHNlIGlmICh0eXBlb2YgcmF3U2NoZW1hID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHJhd1NjaGVtYSk7XHJcbiAgICAgIGpzb25MRCA9IGlzT2JqZWN0KHBhcnNlZCkgPyBwYXJzZWQgOiBudWxsO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIGpzb25MRCA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdGl0bGUsXHJcbiAgICBkZXNjcmlwdGlvbixcclxuICAgIGNhbm9uaWNhbCxcclxuICAgIG9nVGl0bGUsXHJcbiAgICBvZ0Rlc2NyaXB0aW9uLFxyXG4gICAgb2dJbWFnZSxcclxuICAgIHR3aXR0ZXJDYXJkLFxyXG4gICAgdHdpdHRlclRpdGxlLFxyXG4gICAgdHdpdHRlckRlc2NyaXB0aW9uLFxyXG4gICAgdHdpdHRlckltYWdlLFxyXG4gICAganNvbkxELFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCB1cHNlcnRNZXRhVGFnQnlOYW1lID0gKGh0bWw6IHN0cmluZywgbmFtZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpID0+IHtcclxuICBjb25zdCBlc2NhcGVkTmFtZSA9IG5hbWUucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xyXG4gIGNvbnN0IHJlID0gbmV3IFJlZ0V4cChgPG1ldGFcXFxccytuYW1lPVtcIiddJHtlc2NhcGVkTmFtZX1bXCInXVtePl0qPmAsIFwiaVwiKTtcclxuICBpZiAocmUudGVzdChodG1sKSkge1xyXG4gICAgcmV0dXJuIGh0bWwucmVwbGFjZShyZSwgYDxtZXRhIG5hbWU9XCIke25hbWV9XCIgY29udGVudD1cIiR7Y29udGVudH1cIj5gKTtcclxuICB9XHJcbiAgcmV0dXJuIGh0bWwucmVwbGFjZShcIjwvaGVhZD5cIiwgYCAgPG1ldGEgbmFtZT1cIiR7bmFtZX1cIiBjb250ZW50PVwiJHtjb250ZW50fVwiPlxcbjwvaGVhZD5gKTtcclxufTtcclxuXHJcbmNvbnN0IHVwc2VydE1ldGFUYWdCeVByb3BlcnR5ID0gKGh0bWw6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgY29udGVudDogc3RyaW5nKSA9PiB7XHJcbiAgY29uc3QgZXNjYXBlZFByb3BlcnR5ID0gcHJvcGVydHkucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xyXG4gIGNvbnN0IHJlID0gbmV3IFJlZ0V4cChgPG1ldGFcXFxccytwcm9wZXJ0eT1bXCInXSR7ZXNjYXBlZFByb3BlcnR5fVtcIiddW14+XSo+YCwgXCJpXCIpO1xyXG4gIGlmIChyZS50ZXN0KGh0bWwpKSB7XHJcbiAgICByZXR1cm4gaHRtbC5yZXBsYWNlKHJlLCBgPG1ldGEgcHJvcGVydHk9XCIke3Byb3BlcnR5fVwiIGNvbnRlbnQ9XCIke2NvbnRlbnR9XCI+YCk7XHJcbiAgfVxyXG4gIHJldHVybiBodG1sLnJlcGxhY2UoXCI8L2hlYWQ+XCIsIGAgIDxtZXRhIHByb3BlcnR5PVwiJHtwcm9wZXJ0eX1cIiBjb250ZW50PVwiJHtjb250ZW50fVwiPlxcbjwvaGVhZD5gKTtcclxufTtcclxuXHJcbmNvbnN0IHVwc2VydENhbm9uaWNhbCA9IChodG1sOiBzdHJpbmcsIGhyZWY6IHN0cmluZykgPT4ge1xyXG4gIGNvbnN0IHJlID0gLzxsaW5rXFxzK3JlbD1bXCInXWNhbm9uaWNhbFtcIiddW14+XSo+L2k7XHJcbiAgaWYgKHJlLnRlc3QoaHRtbCkpIHtcclxuICAgIHJldHVybiBodG1sLnJlcGxhY2UocmUsIGA8bGluayByZWw9XCJjYW5vbmljYWxcIiBocmVmPVwiJHtocmVmfVwiPmApO1xyXG4gIH1cclxuICByZXR1cm4gaHRtbC5yZXBsYWNlKFwiPC9oZWFkPlwiLCBgICA8bGluayByZWw9XCJjYW5vbmljYWxcIiBocmVmPVwiJHtocmVmfVwiPlxcbjwvaGVhZD5gKTtcclxufTtcclxuXHJcbmNvbnN0IHVwc2VydEpzb25MZCA9IChodG1sOiBzdHJpbmcsIHNjaGVtYTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHtcclxuICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkoc2NoZW1hKS5yZXBsYWNlKC88L2csIFwiXFxcXHUwMDNjXCIpLnJlcGxhY2UoL1xcdTIwMjgvZywgXCJcXFxcdTIwMjhcIikucmVwbGFjZSgvXFx1MjAyOS9nLCBcIlxcXFx1MjAyOVwiKTtcclxuICBjb25zdCBzY3JpcHQgPSBgICA8c2NyaXB0IHR5cGU9XCJhcHBsaWNhdGlvbi9sZCtqc29uXCIgZGF0YS1zdGF0aWMtc2VvLXNjaGVtYT1cInRydWVcIj4ke2pzb259PC9zY3JpcHQ+XFxuYDtcclxuICBjb25zdCByZSA9IC9cXHMqPHNjcmlwdFxccyt0eXBlPVtcIiddYXBwbGljYXRpb25cXC9sZFxcK2pzb25bXCInXVtePl0qZGF0YS1zdGF0aWMtc2VvLXNjaGVtYT1bXCInXXRydWVbXCInXVtePl0qPltcXHNcXFNdKj88XFwvc2NyaXB0Pi9pO1xyXG4gIGlmIChyZS50ZXN0KGh0bWwpKSB7XHJcbiAgICByZXR1cm4gaHRtbC5yZXBsYWNlKHJlLCBgXFxuJHtzY3JpcHR9YCk7XHJcbiAgfVxyXG4gIHJldHVybiBodG1sLnJlcGxhY2UoXCI8L2hlYWQ+XCIsIGAke3NjcmlwdH08L2hlYWQ+YCk7XHJcbn07XHJcblxyXG5jb25zdCBhcHBseVNlb1RvSHRtbCA9IChodG1sOiBzdHJpbmcsIHNlbzogSHRtbFNlb0RhdGEpID0+IHtcclxuICBsZXQgb3V0ID0gaHRtbDtcclxuICBvdXQgPSBvdXQucmVwbGFjZSgvXFxzKjxzY3JpcHRcXHMrdHlwZT1bXCInXWFwcGxpY2F0aW9uXFwvbGRcXCtqc29uW1wiJ11bXj5dKmRhdGEtc3RhdGljLXNlby1zY2hlbWE9W1wiJ110cnVlW1wiJ11bXj5dKj5bXFxzXFxTXSo/PFxcL3NjcmlwdD4vaSwgXCJcIik7XHJcbiAgaWYgKHNlby50aXRsZSkge1xyXG4gICAgaWYgKC88dGl0bGU+Lio8XFwvdGl0bGU+L2kudGVzdChvdXQpKSBvdXQgPSBvdXQucmVwbGFjZSgvPHRpdGxlPi4qPFxcL3RpdGxlPi9pLCBgPHRpdGxlPiR7c2VvLnRpdGxlfTwvdGl0bGU+YCk7XHJcbiAgICBlbHNlIG91dCA9IG91dC5yZXBsYWNlKFwiPC9oZWFkPlwiLCBgICA8dGl0bGU+JHtzZW8udGl0bGV9PC90aXRsZT5cXG48L2hlYWQ+YCk7XHJcbiAgfVxyXG4gIGlmIChzZW8uZGVzY3JpcHRpb24pIG91dCA9IHVwc2VydE1ldGFUYWdCeU5hbWUob3V0LCBcImRlc2NyaXB0aW9uXCIsIHNlby5kZXNjcmlwdGlvbik7XHJcbiAgaWYgKHNlby5jYW5vbmljYWwpIHtcclxuICAgIG91dCA9IHVwc2VydENhbm9uaWNhbChvdXQsIHNlby5jYW5vbmljYWwpO1xyXG4gICAgb3V0ID0gdXBzZXJ0TWV0YVRhZ0J5UHJvcGVydHkob3V0LCBcIm9nOnVybFwiLCBzZW8uY2Fub25pY2FsKTtcclxuICB9XHJcbiAgaWYgKHNlby5vZ1RpdGxlKSBvdXQgPSB1cHNlcnRNZXRhVGFnQnlQcm9wZXJ0eShvdXQsIFwib2c6dGl0bGVcIiwgc2VvLm9nVGl0bGUpO1xyXG4gIGlmIChzZW8ub2dEZXNjcmlwdGlvbikgb3V0ID0gdXBzZXJ0TWV0YVRhZ0J5UHJvcGVydHkob3V0LCBcIm9nOmRlc2NyaXB0aW9uXCIsIHNlby5vZ0Rlc2NyaXB0aW9uKTtcclxuICBpZiAoc2VvLm9nSW1hZ2UpIG91dCA9IHVwc2VydE1ldGFUYWdCeVByb3BlcnR5KG91dCwgXCJvZzppbWFnZVwiLCBzZW8ub2dJbWFnZSk7XHJcbiAgaWYgKHNlby50d2l0dGVyQ2FyZCkgb3V0ID0gdXBzZXJ0TWV0YVRhZ0J5TmFtZShvdXQsIFwidHdpdHRlcjpjYXJkXCIsIHNlby50d2l0dGVyQ2FyZCk7XHJcbiAgaWYgKHNlby50d2l0dGVyVGl0bGUpIG91dCA9IHVwc2VydE1ldGFUYWdCeU5hbWUob3V0LCBcInR3aXR0ZXI6dGl0bGVcIiwgc2VvLnR3aXR0ZXJUaXRsZSk7XHJcbiAgaWYgKHNlby50d2l0dGVyRGVzY3JpcHRpb24pIG91dCA9IHVwc2VydE1ldGFUYWdCeU5hbWUob3V0LCBcInR3aXR0ZXI6ZGVzY3JpcHRpb25cIiwgc2VvLnR3aXR0ZXJEZXNjcmlwdGlvbik7XHJcbiAgaWYgKHNlby50d2l0dGVySW1hZ2UpIG91dCA9IHVwc2VydE1ldGFUYWdCeU5hbWUob3V0LCBcInR3aXR0ZXI6aW1hZ2VcIiwgc2VvLnR3aXR0ZXJJbWFnZSk7XHJcbiAgaWYgKHNlby5qc29uTEQpIG91dCA9IHVwc2VydEpzb25MZChvdXQsIHNlby5qc29uTEQpO1xyXG4gIHJldHVybiBvdXQ7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBkeW5hbWljU2VvSHRtbFBsdWdpbihtb2RlOiBzdHJpbmcpOiBQbHVnaW4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgXCJcIik7XHJcbiAgY29uc3Qgc3RyYXBpQmFzZSA9IChlbnYuVklURV9TVFJBUElfVVJMIHx8IFwiaHR0cDovL2xvY2FsaG9zdDoxMzM3XCIpLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcclxuICBjb25zdCBzaXRlVXJsID0gc2FuaXRpemVVcmxWYWx1ZShlbnYuVklURV9BUFBfVVJMKSB8fCBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MFwiO1xyXG5cclxuICBjb25zdCBjYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBIdG1sU2VvRGF0YT4oKTtcclxuICBsZXQgYm9vdHN0cmFwUHJvbWlzZTogUHJvbWlzZTxBd2FpdGVkPFJldHVyblR5cGU8dHlwZW9mIGxvYWRCb290c3RyYXBEYXRhPj4+IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gIGNvbnN0IGZldGNoQm9vdHN0cmFwID0gKCkgPT4ge1xyXG4gICAgaWYgKCFib290c3RyYXBQcm9taXNlKSB7XHJcbiAgICAgIGJvb3RzdHJhcFByb21pc2UgPSBsb2FkQm9vdHN0cmFwRGF0YSh7IHNpdGVVcmwsIHN0cmFwaUJhc2UgfSkuY2F0Y2goKCkgPT4gKHt9KSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYm9vdHN0cmFwUHJvbWlzZTtcclxuICB9O1xyXG5cclxuICBjb25zdCBmZXRjaFNlbyA9IGFzeW5jIChzbHVnOiBzdHJpbmcpID0+IHtcclxuICAgIGlmIChjYWNoZS5oYXMoc2x1ZykpIHJldHVybiBjYWNoZS5nZXQoc2x1ZykhO1xyXG5cclxuICAgIGNvbnN0IHNsdWdzVG9UcnkgPSBzbHVnID09PSBcIi9cIiA/IFtcIi9cIiwgXCIvaG9tZVwiLCBcImhvbWVcIl0gOiBzbHVnID09PSBcIi9ob21lXCIgPyBbXCIvaG9tZVwiLCBcIi9cIiwgXCJob21lXCJdIDogW3NsdWddO1xyXG4gICAgY29uc3QgdXJscyA9IHNsdWdzVG9UcnkuZmxhdE1hcCgoZW50cnkpID0+IFtcclxuICAgICAgYCR7c3RyYXBpQmFzZX0vYXBpL3BhZ2VzP2ZpbHRlcnNbc2x1Z11bJGVxXT0ke2VuY29kZVVSSUNvbXBvbmVudChlbnRyeSl9YCxcclxuICAgICAgYCR7c3RyYXBpQmFzZX0vYXBpL3BhZ2VzP2ZpbHRlcnNbc2x1Z11bJGVxXT0ke2VuY29kZVVSSUNvbXBvbmVudChlbnRyeSl9JnBvcHVsYXRlW3Nlb109KmAsXHJcbiAgICAgIGAke3N0cmFwaUJhc2V9L2FwaS9wYWdlcz9maWx0ZXJzW3NsdWddWyRlcV09JHtlbmNvZGVVUklDb21wb25lbnQoZW50cnkpfSZwb3B1bGF0ZT1zZW9gLFxyXG4gICAgXSk7XHJcblxyXG4gICAgZm9yIChjb25zdCB1cmwgb2YgdXJscykge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHVybCwgeyBoZWFkZXJzOiB7IEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSB9KTtcclxuICAgICAgICBpZiAoIXJlcy5vaykgY29udGludWU7XHJcbiAgICAgICAgY29uc3QgYm9keSA9IChhd2FpdCByZXMuanNvbigpKSBhcyB1bmtub3duO1xyXG4gICAgICAgIGNvbnN0IGl0ZW1zID0gcGlja0xpc3QoYm9keSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtc1swXSA/PyBudWxsO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGV4dHJhY3RQYWdlU2VvKGl0ZW0sIHN0cmFwaUJhc2UpID8/IHt9O1xyXG5cclxuICAgICAgICBjYWNoZS5zZXQoc2x1ZywgcmVzdWx0KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICB9IGNhdGNoIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGVtcHR5ID0ge307XHJcbiAgICBjYWNoZS5zZXQoc2x1ZywgZW1wdHkpO1xyXG4gICAgcmV0dXJuIGVtcHR5O1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiBcImR5bmFtaWMtc2VvLWh0bWxcIixcclxuICAgIGFwcGx5OiBcInNlcnZlXCIsXHJcbiAgICB0cmFuc2Zvcm1JbmRleEh0bWw6IHtcclxuICAgICAgb3JkZXI6IFwicHJlXCIsXHJcbiAgICAgIGFzeW5jIGhhbmRsZXIoaHRtbCwgY3R4KSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gY3R4Py5vcmlnaW5hbFVybCB8fCBcIi9cIjtcclxuICAgICAgICBjb25zdCBwYXRobmFtZSA9IG5ldyBVUkwodXJsLCBcImh0dHA6Ly9sb2NhbFwiKS5wYXRobmFtZTtcclxuICAgICAgICBjb25zdCBzbHVnID0gcGF0aG5hbWUgPT09IFwiL1wiID8gXCIvXCIgOiBwYXRobmFtZS5yZXBsYWNlKC9cXC8kLywgXCJcIik7XHJcbiAgICAgICAgY29uc3Qgc2VvID0gYXdhaXQgZmV0Y2hTZW8oc2x1Zyk7XHJcbiAgICAgICAgY29uc3QgYm9vdHN0cmFwID0gYXdhaXQgZmV0Y2hCb290c3RyYXAoKTtcclxuICAgICAgICByZXR1cm4gaW5qZWN0Qm9vdHN0cmFwSW50b0h0bWwoYXBwbHlTZW9Ub0h0bWwoaHRtbCwgc2VvKSwgYm9vdHN0cmFwLCB7IHByZWxvYWRIZXJvOiBzbHVnID09PSBcIi9cIiwgcm91dGVQYXRoOiBzbHVnIH0pO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBwcmVyZW5kZXJTZW9IdG1sUGx1Z2luKG1vZGU6IHN0cmluZyk6IFBsdWdpbiB7XHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCBcIlwiKTtcclxuICBjb25zdCBzdHJhcGlCYXNlID0gKGVudi5WSVRFX1NUUkFQSV9VUkwgfHwgXCJodHRwOi8vbG9jYWxob3N0OjEzMzdcIikucmVwbGFjZSgvXFwvJC8sIFwiXCIpO1xyXG4gIGNvbnN0IHNpdGVVcmwgPSBzYW5pdGl6ZVVybFZhbHVlKGVudi5WSVRFX0FQUF9VUkwpIHx8IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwXCI7XHJcblxyXG4gIGNvbnN0IGZhbGxiYWNrUm91dGVzID0gW1xyXG4gICAgXCIvc29sdXRpb25zL3VzZS1jYXNlc1wiLFxyXG4gICAgXCIvc29sdXRpb25zL2luZHVzdHJpZXNcIixcclxuICAgIFwiL2N1c3RvbWVyc1wiLFxyXG4gICAgXCIvcHJpY2luZ1wiLFxyXG4gICAgXCIvcmVzb3VyY2VzL2Jsb2dcIixcclxuICAgIFwiL3Jlc291cmNlcy9kZW1vXCIsXHJcbiAgICBcIi9yZXNvdXJjZXMvbmV3c3Jvb21cIixcclxuICAgIFwiL3Jlc291cmNlcy9mYXFzXCIsXHJcbiAgXTtcclxuXHJcbiAgY29uc3QgZmV0Y2hTZW8gPSBhc3luYyAoc2x1Zzogc3RyaW5nKSA9PiB7XHJcbiAgICBjb25zdCBzbHVnc1RvVHJ5ID0gc2x1ZyA9PT0gXCIvXCIgPyBbXCIvXCIsIFwiL2hvbWVcIiwgXCJob21lXCJdIDogc2x1ZyA9PT0gXCIvaG9tZVwiID8gW1wiL2hvbWVcIiwgXCIvXCIsIFwiaG9tZVwiXSA6IFtzbHVnXTtcclxuICAgIGNvbnN0IHVybHMgPSBzbHVnc1RvVHJ5LmZsYXRNYXAoKGVudHJ5KSA9PiBbXHJcbiAgICAgIGAke3N0cmFwaUJhc2V9L2FwaS9wYWdlcz9maWx0ZXJzW3NsdWddWyRlcV09JHtlbmNvZGVVUklDb21wb25lbnQoZW50cnkpfWAsXHJcbiAgICAgIGAke3N0cmFwaUJhc2V9L2FwaS9wYWdlcz9maWx0ZXJzW3NsdWddWyRlcV09JHtlbmNvZGVVUklDb21wb25lbnQoZW50cnkpfSZwb3B1bGF0ZVtzZW9dPSpgLFxyXG4gICAgICBgJHtzdHJhcGlCYXNlfS9hcGkvcGFnZXM/ZmlsdGVyc1tzbHVnXVskZXFdPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGVudHJ5KX0mcG9wdWxhdGU9c2VvYCxcclxuICAgIF0pO1xyXG5cclxuICAgIGZvciAoY29uc3QgdXJsIG9mIHVybHMpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmwsIHsgaGVhZGVyczogeyBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiIH0gfSk7XHJcbiAgICAgICAgaWYgKCFyZXMub2spIGNvbnRpbnVlO1xyXG4gICAgICAgIGNvbnN0IGJvZHkgPSAoYXdhaXQgcmVzLmpzb24oKSkgYXMgdW5rbm93bjtcclxuICAgICAgICBjb25zdCBpdGVtcyA9IHBpY2tMaXN0KGJvZHkpO1xyXG5cclxuICAgICAgICBjb25zdCBpdGVtID0gaXRlbXNbMF0gPz8gbnVsbDtcclxuICAgICAgICByZXR1cm4gZXh0cmFjdFBhZ2VTZW8oaXRlbSwgc3RyYXBpQmFzZSkgPz8ge307XHJcbiAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge307XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZmV0Y2hBbGxQYWdlU2x1Z3MgPSBhc3luYyAoKTogUHJvbWlzZTxzdHJpbmdbXT4gPT4ge1xyXG4gICAgY29uc3Qgc2x1Z3M6IHN0cmluZ1tdID0gW107XHJcbiAgICBjb25zdCBzZWVuID0gbmV3IFNldDxzdHJpbmc+KCk7XHJcblxyXG4gICAgY29uc3QgcGlja1BhZ2luYXRpb24gPSAoYm9keTogdW5rbm93bik6IHsgcGFnZTogbnVtYmVyOyBwYWdlU2l6ZTogbnVtYmVyOyBwYWdlQ291bnQ6IG51bWJlcjsgdG90YWw6IG51bWJlciB9IHwgbnVsbCA9PiB7XHJcbiAgICAgIGlmICh0eXBlb2YgYm9keSAhPT0gXCJvYmplY3RcIiB8fCBib2R5ID09PSBudWxsKSByZXR1cm4gbnVsbDtcclxuICAgICAgY29uc3QgYW55Qm9keSA9IGJvZHkgYXMgYW55O1xyXG4gICAgICBjb25zdCBwYWcgPSBhbnlCb2R5Py5tZXRhPy5wYWdpbmF0aW9uID8/IGFueUJvZHk/LnBhZ2luYXRpb247XHJcbiAgICAgIGlmICghcGFnIHx8IHR5cGVvZiBwYWcgIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xyXG4gICAgICBjb25zdCBwYWdlID0gTnVtYmVyKHBhZy5wYWdlID8/IDEpIHx8IDE7XHJcbiAgICAgIGNvbnN0IHBhZ2VTaXplID0gTnVtYmVyKHBhZy5wYWdlU2l6ZSA/PyAxMDApIHx8IDEwMDtcclxuICAgICAgY29uc3QgcGFnZUNvdW50ID0gTnVtYmVyKHBhZy5wYWdlQ291bnQgPz8gMSkgfHwgMTtcclxuICAgICAgY29uc3QgdG90YWwgPSBOdW1iZXIocGFnLnRvdGFsID8/IDApIHx8IDA7XHJcbiAgICAgIHJldHVybiB7IHBhZ2UsIHBhZ2VTaXplLCBwYWdlQ291bnQsIHRvdGFsIH07XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHBhZ2VTaXplID0gMTAwO1xyXG4gICAgbGV0IHBhZ2UgPSAxO1xyXG4gICAgbGV0IHBhZ2VDb3VudCA9IDE7XHJcblxyXG4gICAgd2hpbGUgKHBhZ2UgPD0gcGFnZUNvdW50KSB7XHJcbiAgICAgIGNvbnN0IHVybCA9IGAke3N0cmFwaUJhc2V9L2FwaS9wYWdlcz9wYWdpbmF0aW9uW3BhZ2VdPSR7cGFnZX0mcGFnaW5hdGlvbltwYWdlU2l6ZV09JHtwYWdlU2l6ZX1gO1xyXG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmwsIHsgaGVhZGVyczogeyBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiIH0gfSk7XHJcbiAgICAgIGlmICghcmVzLm9rKSBicmVhaztcclxuICAgICAgY29uc3QgYm9keSA9IChhd2FpdCByZXMuanNvbigpKSBhcyB1bmtub3duO1xyXG5cclxuICAgICAgY29uc3QgaXRlbXMgPSBwaWNrTGlzdChib2R5KTtcclxuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XHJcbiAgICAgICAgaWYgKCFpc09iamVjdChpdGVtKSkgY29udGludWU7XHJcbiAgICAgICAgY29uc3QgcmF3U2x1ZyA9IGl0ZW0uc2x1ZyA/PyAoaXNPYmplY3QoaXRlbS5hdHRyaWJ1dGVzKSA/IGl0ZW0uYXR0cmlidXRlcy5zbHVnIDogdW5kZWZpbmVkKTtcclxuICAgICAgICBpZiAodHlwZW9mIHJhd1NsdWcgIT09IFwic3RyaW5nXCIgfHwgIXJhd1NsdWcudHJpbSgpKSBjb250aW51ZTtcclxuICAgICAgICBjb25zdCBub3JtYWxpemVkID0gcmF3U2x1Zy5zdGFydHNXaXRoKFwiL1wiKSA/IHJhd1NsdWcgOiBgLyR7cmF3U2x1Z31gO1xyXG4gICAgICAgIGlmICghc2Vlbi5oYXMobm9ybWFsaXplZCkpIHtcclxuICAgICAgICAgIHNlZW4uYWRkKG5vcm1hbGl6ZWQpO1xyXG4gICAgICAgICAgc2x1Z3MucHVzaChub3JtYWxpemVkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHBhZ2luYXRpb24gPSBwaWNrUGFnaW5hdGlvbihib2R5KTtcclxuICAgICAgcGFnZUNvdW50ID0gcGFnaW5hdGlvbj8ucGFnZUNvdW50ID8/IHBhZ2VDb3VudDtcclxuICAgICAgcGFnZSArPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzbHVncztcclxuICB9O1xyXG5cclxuICBjb25zdCBmZXRjaFJlZGlyZWN0cyA9IGFzeW5jICgpOiBQcm9taXNlPEFycmF5PHsgZnJvbTogc3RyaW5nOyB0bzogc3RyaW5nOyB0eXBlPzogc3RyaW5nOyBpc0FjdGl2ZT86IGJvb2xlYW4gfT4+ID0+IHtcclxuICAgIGNvbnN0IHVybHMgPSBbXHJcbiAgICAgIGAke3N0cmFwaUJhc2V9L2FwaS9yZWRpcmVjdHM/ZmlsdGVyc1tpc0FjdGl2ZV1bJGVxXT10cnVlJnBhZ2luYXRpb25bbGltaXRdPTEwMDBgLFxyXG4gICAgICBgJHtzdHJhcGlCYXNlfS9hcGkvcmVkaXJlY3RzP3BhZ2luYXRpb25bbGltaXRdPTEwMDBgLFxyXG4gICAgXTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHVybCBvZiB1cmxzKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsLCB7IGhlYWRlcnM6IHsgQWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb25cIiB9IH0pO1xyXG4gICAgICAgIGlmICghcmVzLm9rKSBjb250aW51ZTtcclxuICAgICAgICBjb25zdCBib2R5ID0gKGF3YWl0IHJlcy5qc29uKCkpIGFzIHVua25vd247XHJcblxyXG4gICAgICAgIGNvbnN0IGl0ZW1zID1cclxuICAgICAgICAgICh0eXBlb2YgYm9keSA9PT0gXCJvYmplY3RcIiAmJiBib2R5ICE9PSBudWxsICYmIEFycmF5LmlzQXJyYXkoKGJvZHkgYXMgYW55KS5kYXRhKSAmJiAoYm9keSBhcyBhbnkpLmRhdGEpIHx8XHJcbiAgICAgICAgICAodHlwZW9mIGJvZHkgPT09IFwib2JqZWN0XCIgJiYgYm9keSAhPT0gbnVsbCAmJiBBcnJheS5pc0FycmF5KChib2R5IGFzIGFueSkucmVzdWx0cykgJiYgKGJvZHkgYXMgYW55KS5yZXN1bHRzKSB8fFxyXG4gICAgICAgICAgW107XHJcblxyXG4gICAgICAgIGNvbnN0IHJ1bGVzOiBBcnJheTx7IGZyb206IHN0cmluZzsgdG86IHN0cmluZzsgdHlwZT86IHN0cmluZzsgaXNBY3RpdmU/OiBib29sZWFuIH0+ID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIgfHwgaXRlbSA9PT0gbnVsbCkgY29udGludWU7XHJcbiAgICAgICAgICBjb25zdCBhbnlJdGVtID0gaXRlbSBhcyBhbnk7XHJcbiAgICAgICAgICBjb25zdCBhdHRycyA9IChhbnlJdGVtLmF0dHJpYnV0ZXMgJiYgdHlwZW9mIGFueUl0ZW0uYXR0cmlidXRlcyA9PT0gXCJvYmplY3RcIiAmJiBhbnlJdGVtLmF0dHJpYnV0ZXMpIHx8IGFueUl0ZW07XHJcbiAgICAgICAgICBjb25zdCBmcm9tID0gYXR0cnMuZnJvbTtcclxuICAgICAgICAgIGNvbnN0IHRvID0gYXR0cnMudG87XHJcbiAgICAgICAgICBpZiAodHlwZW9mIGZyb20gIT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHRvICE9PSBcInN0cmluZ1wiKSBjb250aW51ZTtcclxuICAgICAgICAgIHJ1bGVzLnB1c2goeyBmcm9tLCB0bywgdHlwZTogYXR0cnMudHlwZSwgaXNBY3RpdmU6IGF0dHJzLmlzQWN0aXZlIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJ1bGVzO1xyXG4gICAgICB9IGNhdGNoIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBbXTtcclxuICB9O1xyXG5cclxuICBjb25zdCBub3JtYWxpemVQYXRobmFtZSA9ICh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCA9PiB7XHJcbiAgICBjb25zdCByYXcgPSBzYW5pdGl6ZVVybFZhbHVlKHZhbHVlKTtcclxuICAgIGlmICghcmF3KSByZXR1cm4gbnVsbDtcclxuICAgIGxldCBwYXRobmFtZSA9IHJhdztcclxuICAgIGlmICgvXmh0dHBzPzpcXC9cXC8vaS50ZXN0KHJhdykpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBwYXRobmFtZSA9IG5ldyBVUkwocmF3KS5wYXRobmFtZTtcclxuICAgICAgfSBjYXRjaCB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghcGF0aG5hbWUuc3RhcnRzV2l0aChcIi9cIikpIHBhdGhuYW1lID0gYC8ke3BhdGhuYW1lfWA7XHJcbiAgICBwYXRobmFtZSA9IHBhdGhuYW1lLnJlcGxhY2UoL1xcLyskLywgXCJcIik7XHJcbiAgICByZXR1cm4gcGF0aG5hbWUgfHwgXCIvXCI7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWU6IFwicHJlcmVuZGVyLXNlby1odG1sXCIsXHJcbiAgICBhcHBseTogXCJidWlsZFwiLFxyXG4gICAgYXN5bmMgY2xvc2VCdW5kbGUoKSB7XHJcbiAgICAgIGNvbnN0IGRpc3REaXIgPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgXCJkaXN0XCIpO1xyXG4gICAgICBjb25zdCBiYXNlSW5kZXhQYXRoID0gcGF0aC5qb2luKGRpc3REaXIsIFwiaW5kZXguaHRtbFwiKTtcclxuICAgICAgY29uc3QgYmFzZUh0bWwgPSBhd2FpdCBmcy5yZWFkRmlsZShiYXNlSW5kZXhQYXRoLCBcInV0ZjhcIik7XHJcbiAgICAgIGNvbnN0IGJ1aWxkRGF0ZSA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcclxuICAgICAgY29uc3QgYm9vdHN0cmFwID0gYXdhaXQgbG9hZEJvb3RzdHJhcERhdGEoeyBzaXRlVXJsLCBzdHJhcGlCYXNlIH0pLmNhdGNoKCgpID0+ICh7fSkpO1xyXG5cclxuICAgICAgY29uc3Qgc2x1Z3NGcm9tU3RyYXBpID0gYXdhaXQgZmV0Y2hBbGxQYWdlU2x1Z3MoKS5jYXRjaCgoKSA9PiBbXSk7XHJcbiAgICAgIGNvbnN0IHJvdXRlc1RvR2VuZXJhdGUgPSBBcnJheS5mcm9tKG5ldyBTZXQoW1wiL1wiLCAuLi5mYWxsYmFja1JvdXRlcywgLi4uc2x1Z3NGcm9tU3RyYXBpXSkpO1xyXG5cclxuICAgICAgY29uc3QgaG9tZVNlbyA9IGF3YWl0IGZldGNoU2VvKFwiL1wiKTtcclxuICAgICAgY29uc3QgaG9tZUh0bWwgPSBpbmplY3RCb290c3RyYXBJbnRvSHRtbChhcHBseVNlb1RvSHRtbChiYXNlSHRtbCwgaG9tZVNlbyksIGJvb3RzdHJhcCwge1xyXG4gICAgICAgIHByZWxvYWRIZXJvOiB0cnVlLFxyXG4gICAgICAgIHJvdXRlUGF0aDogXCIvXCIsXHJcbiAgICAgIH0pO1xyXG4gICAgICBhd2FpdCBmcy53cml0ZUZpbGUoYmFzZUluZGV4UGF0aCwgaG9tZUh0bWwsIFwidXRmOFwiKTtcclxuXHJcbiAgICAgIGZvciAoY29uc3Qgcm91dGUgb2Ygcm91dGVzVG9HZW5lcmF0ZSkge1xyXG4gICAgICAgIGlmIChyb3V0ZSA9PT0gXCIvXCIpIGNvbnRpbnVlO1xyXG4gICAgICAgIGNvbnN0IHNlbyA9IGF3YWl0IGZldGNoU2VvKHJvdXRlKTtcclxuICAgICAgICBjb25zdCBodG1sID0gaW5qZWN0Qm9vdHN0cmFwSW50b0h0bWwoYXBwbHlTZW9Ub0h0bWwoYmFzZUh0bWwsIHNlbyksIGJvb3RzdHJhcCwgeyByb3V0ZVBhdGg6IHJvdXRlIH0pO1xyXG4gICAgICAgIGNvbnN0IG91dERpciA9IHBhdGguam9pbihkaXN0RGlyLCByb3V0ZS5yZXBsYWNlKC9eXFwvLywgXCJcIikpO1xyXG4gICAgICAgIGF3YWl0IGZzLm1rZGlyKG91dERpciwgeyByZWN1cnNpdmU6IHRydWUgfSk7XHJcbiAgICAgICAgYXdhaXQgZnMud3JpdGVGaWxlKHBhdGguam9pbihvdXREaXIsIFwiaW5kZXguaHRtbFwiKSwgaHRtbCwgXCJ1dGY4XCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBzaXRlbWFwWG1sID0gYnVpbGRTaXRlbWFwWG1sKFxyXG4gICAgICAgIHJvdXRlc1RvR2VuZXJhdGUubWFwKChyb3V0ZSkgPT4gKHtcclxuICAgICAgICAgIGxvYzogYnVpbGRBYnNvbHV0ZVVybChzaXRlVXJsLCByb3V0ZSksXHJcbiAgICAgICAgICBsYXN0bW9kOiBidWlsZERhdGUsXHJcbiAgICAgICAgfSkpLFxyXG4gICAgICApO1xyXG4gICAgICBhd2FpdCBmcy53cml0ZUZpbGUocGF0aC5qb2luKGRpc3REaXIsIFwic2l0ZW1hcC54bWxcIiksIHNpdGVtYXBYbWwsIFwidXRmOFwiKTtcclxuXHJcbiAgICAgIGNvbnN0IHJlZGlyZWN0cyA9IGF3YWl0IGZldGNoUmVkaXJlY3RzKCkuY2F0Y2goKCkgPT4gW10pO1xyXG4gICAgICBmb3IgKGNvbnN0IHJ1bGUgb2YgcmVkaXJlY3RzKSB7XHJcbiAgICAgICAgY29uc3QgZnJvbVBhdGggPSBub3JtYWxpemVQYXRobmFtZShydWxlLmZyb20pO1xyXG4gICAgICAgIGlmICghZnJvbVBhdGggfHwgZnJvbVBhdGggPT09IFwiL1wiKSBjb250aW51ZTtcclxuICAgICAgICBjb25zdCB0b1VybCA9IHNhbml0aXplVXJsVmFsdWUocnVsZS50byk7XHJcbiAgICAgICAgaWYgKCF0b1VybCkgY29udGludWU7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlZGlyZWN0SHRtbCA9IGJhc2VIdG1sLnJlcGxhY2UoXHJcbiAgICAgICAgICBcIjwvaGVhZD5cIixcclxuICAgICAgICAgIGAgIDxtZXRhIGh0dHAtZXF1aXY9XCJyZWZyZXNoXCIgY29udGVudD1cIjA7IHVybD0ke3RvVXJsfVwiPlxcbiAgPGxpbmsgcmVsPVwiY2Fub25pY2FsXCIgaHJlZj1cIiR7dG9Vcmx9XCI+XFxuICA8c2NyaXB0PndpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKCR7SlNPTi5zdHJpbmdpZnkodG9VcmwpfSk7PC9zY3JpcHQ+XFxuPC9oZWFkPmAsXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3Qgb3V0RGlyID0gcGF0aC5qb2luKGRpc3REaXIsIGZyb21QYXRoLnJlcGxhY2UoL15cXC8vLCBcIlwiKSk7XHJcbiAgICAgICAgYXdhaXQgZnMubWtkaXIob3V0RGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcclxuICAgICAgICBhd2FpdCBmcy53cml0ZUZpbGUocGF0aC5qb2luKG91dERpciwgXCJpbmRleC5odG1sXCIpLCByZWRpcmVjdEh0bWwsIFwidXRmOFwiKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCI6OlwiLFxyXG4gICAgcG9ydDogODA4MCxcclxuICAgIGhtcjoge1xyXG4gICAgICBvdmVybGF5OiBmYWxzZSxcclxuICAgIH0sXHJcbiAgICBwcm94eToge1xyXG4gICAgICBcIi9hcGlcIjoge1xyXG4gICAgICAgIHRhcmdldDogXCJodHRwczovL3F1YmlhZG1pbi51bml0ZHRlY2hub2xvZ2llcy5jb21cIixcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIFwiL3VwbG9hZHNcIjoge1xyXG4gICAgICAgIHRhcmdldDogXCJodHRwczovL3F1YmlhZG1pbi51bml0ZHRlY2hub2xvZ2llcy5jb21cIixcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIGR5bmFtaWNTZW9IdG1sUGx1Z2luKG1vZGUpLFxyXG4gICAgcHJlcmVuZGVyU2VvSHRtbFBsdWdpbihtb2RlKSxcclxuICBdLmZpbHRlcihCb29sZWFuKSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgICBkZWR1cGU6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCIsIFwicmVhY3QvanN4LXJ1bnRpbWVcIiwgXCJyZWFjdC9qc3gtZGV2LXJ1bnRpbWVcIiwgXCJAdGFuc3RhY2svcmVhY3QtcXVlcnlcIiwgXCJAdGFuc3RhY2svcXVlcnktY29yZVwiXSxcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBzb3VyY2VtYXA6IHRydWUsXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xyXG4gICAgICAgICAgY29uc3Qgbm9ybWFsaXplZElkID0gaWQucmVwbGFjZSgvXFxcXC9nLCBcIi9cIik7XHJcblxyXG4gICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICBub3JtYWxpemVkSWQuaW5jbHVkZXMoXCIvc3JjL2xpYi9zdHJhcGktYXBpLnRzXCIpIHx8XHJcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRJZC5pbmNsdWRlcyhcIi9zcmMvbGliL3VybHMudHNcIikgfHxcclxuICAgICAgICAgICAgbm9ybWFsaXplZElkLmluY2x1ZGVzKFwiL3NyYy9ob29rcy91c2VTRU8udHNcIikgfHxcclxuICAgICAgICAgICAgbm9ybWFsaXplZElkLmluY2x1ZGVzKFwiL3NyYy9ob29rcy91c2U0MDRUcmFja2luZy50c1wiKSB8fFxyXG4gICAgICAgICAgICBub3JtYWxpemVkSWQuaW5jbHVkZXMoXCIvc3JjL2hvb2tzL3VzZVJlZGlyZWN0cy50c1wiKVxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImFwcC1ydW50aW1lXCI7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKCFpZC5pbmNsdWRlcyhcIm5vZGVfbW9kdWxlc1wiKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcInJlYWN0LWRvbVwiKSB8fCBpZC5pbmNsdWRlcyhcInJlYWN0LXJvdXRlclwiKSB8fCBpZC5pbmNsdWRlcyhcIi9yZWFjdC9cIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwicmVhY3QtY29yZVwiO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcIkB0YW5zdGFjay9yZWFjdC1xdWVyeVwiKSB8fCBpZC5pbmNsdWRlcyhcImF4aW9zXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImRhdGFcIjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCJAcmFkaXgtdWlcIikgfHwgaWQuaW5jbHVkZXMoXCJzb25uZXJcIikgfHwgaWQuaW5jbHVkZXMoXCJ2YXVsXCIpIHx8IGlkLmluY2x1ZGVzKFwiY21ka1wiKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJ1aVwiO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcImx1Y2lkZS1yZWFjdFwiKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJpY29uc1wiO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiBcInZlbmRvclwiO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pKTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJHOlxcXFxxdWJpXFxcXHF1YmlzdGFnaW5nXFxcXHNyY1xcXFxsaWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkc6XFxcXHF1YmlcXFxccXViaXN0YWdpbmdcXFxcc3JjXFxcXGxpYlxcXFxzZW8tY29udGVudC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRzovcXViaS9xdWJpc3RhZ2luZy9zcmMvbGliL3Nlby1jb250ZW50LnRzXCI7Y29uc3QgQUxMT1dFRF9UQUdTID0gbmV3IFNldChbXHJcbiAgXCJhXCIsXHJcbiAgXCJwXCIsXHJcbiAgXCJiclwiLFxyXG4gIFwic3Ryb25nXCIsXHJcbiAgXCJlbVwiLFxyXG4gIFwiYlwiLFxyXG4gIFwiaVwiLFxyXG4gIFwidVwiLFxyXG4gIFwiaDFcIixcclxuICBcImgyXCIsXHJcbiAgXCJoM1wiLFxyXG4gIFwiaDRcIixcclxuICBcImJsb2NrcXVvdGVcIixcclxuICBcInVsXCIsXHJcbiAgXCJvbFwiLFxyXG4gIFwibGlcIixcclxuICBcImhyXCIsXHJcbiAgXCJpbWdcIixcclxuICBcImNvZGVcIixcclxuICBcInByZVwiLFxyXG4gIFwic3BhblwiLFxyXG4gIFwiZGl2XCIsXHJcbl0pO1xyXG5cclxuY29uc3QgZXNjYXBlSHRtbCA9ICh2YWx1ZTogc3RyaW5nKSA9PlxyXG4gIHZhbHVlXHJcbiAgICAucmVwbGFjZSgvJi9nLCBcIiZhbXA7XCIpXHJcbiAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcclxuICAgIC5yZXBsYWNlKC8+L2csIFwiJmd0O1wiKVxyXG4gICAgLnJlcGxhY2UoL1wiL2csIFwiJnF1b3Q7XCIpXHJcbiAgICAucmVwbGFjZSgvJy9nLCBcIiYjMzk7XCIpO1xyXG5cclxuY29uc3Qgc2FuaXRpemVVcmwgPSAodmFsdWU6IHN0cmluZykgPT4ge1xyXG4gIGNvbnN0IGNsZWFuZWQgPSB2YWx1ZS50cmltKCk7XHJcbiAgaWYgKCFjbGVhbmVkIHx8IC9eamF2YXNjcmlwdDovaS50ZXN0KGNsZWFuZWQpKSByZXR1cm4gXCJcIjtcclxuICByZXR1cm4gY2xlYW5lZDtcclxufTtcclxuXHJcbmNvbnN0IHNhbml0aXplVGFnQXR0cmlidXRlcyA9ICh0YWc6IHN0cmluZywgcmF3QXR0cmlidXRlczogc3RyaW5nKSA9PiB7XHJcbiAgY29uc3QgYXR0cnMgPSBBcnJheS5mcm9tKHJhd0F0dHJpYnV0ZXMubWF0Y2hBbGwoLyhbYS16QS1aMC05Oi1dKykoPzpcXHMqPVxccyooXCIuKj9cInwnLio/J3xbXlxcc1wiJz08PmBdKykpPy9nKSk7XHJcbiAgY29uc3Qgc2FmZUF0dHJpYnV0ZXM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gIGZvciAoY29uc3QgbWF0Y2ggb2YgYXR0cnMpIHtcclxuICAgIGNvbnN0IG5hbWUgPSBtYXRjaFsxXT8udG9Mb3dlckNhc2UoKSA/PyBcIlwiO1xyXG4gICAgY29uc3QgcmF3VmFsdWUgPSBtYXRjaFsyXSA/PyBcIlwiO1xyXG4gICAgY29uc3QgdW5xdW90ZWRWYWx1ZSA9IHJhd1ZhbHVlLnJlcGxhY2UoL15bJ1wiXXxbJ1wiXSQvZywgXCJcIik7XHJcblxyXG4gICAgaWYgKCFuYW1lIHx8IG5hbWUuc3RhcnRzV2l0aChcIm9uXCIpIHx8IG5hbWUgPT09IFwic3R5bGVcIikgY29udGludWU7XHJcblxyXG4gICAgaWYgKHRhZyA9PT0gXCJhXCIpIHtcclxuICAgICAgaWYgKG5hbWUgIT09IFwiaHJlZlwiICYmIG5hbWUgIT09IFwidGFyZ2V0XCIgJiYgbmFtZSAhPT0gXCJyZWxcIikgY29udGludWU7XHJcbiAgICAgIGlmIChuYW1lID09PSBcImhyZWZcIikge1xyXG4gICAgICAgIGNvbnN0IHNhZmVIcmVmID0gc2FuaXRpemVVcmwodW5xdW90ZWRWYWx1ZSk7XHJcbiAgICAgICAgaWYgKCFzYWZlSHJlZikgY29udGludWU7XHJcbiAgICAgICAgc2FmZUF0dHJpYnV0ZXMucHVzaChgaHJlZj1cIiR7ZXNjYXBlSHRtbChzYWZlSHJlZil9XCJgKTtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAobmFtZSA9PT0gXCJ0YXJnZXRcIikge1xyXG4gICAgICAgIGNvbnN0IHNhZmVUYXJnZXQgPSB1bnF1b3RlZFZhbHVlID09PSBcIl9ibGFua1wiID8gXCJfYmxhbmtcIiA6IFwiXCI7XHJcbiAgICAgICAgaWYgKCFzYWZlVGFyZ2V0KSBjb250aW51ZTtcclxuICAgICAgICBzYWZlQXR0cmlidXRlcy5wdXNoKGB0YXJnZXQ9XCIke3NhZmVUYXJnZXR9XCJgKTtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAobmFtZSA9PT0gXCJyZWxcIikge1xyXG4gICAgICAgIGNvbnN0IHNhZmVSZWwgPSB1bnF1b3RlZFZhbHVlIHx8IFwibm9vcGVuZXIgbm9yZWZlcnJlclwiO1xyXG4gICAgICAgIHNhZmVBdHRyaWJ1dGVzLnB1c2goYHJlbD1cIiR7ZXNjYXBlSHRtbChzYWZlUmVsKX1cImApO1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHRhZyA9PT0gXCJpbWdcIikge1xyXG4gICAgICBpZiAobmFtZSAhPT0gXCJzcmNcIiAmJiBuYW1lICE9PSBcImFsdFwiICYmIG5hbWUgIT09IFwidGl0bGVcIikgY29udGludWU7XHJcbiAgICAgIGlmIChuYW1lID09PSBcInNyY1wiKSB7XHJcbiAgICAgICAgY29uc3Qgc2FmZVNyYyA9IHNhbml0aXplVXJsKHVucXVvdGVkVmFsdWUpO1xyXG4gICAgICAgIGlmICghc2FmZVNyYykgY29udGludWU7XHJcbiAgICAgICAgc2FmZUF0dHJpYnV0ZXMucHVzaChgc3JjPVwiJHtlc2NhcGVIdG1sKHNhZmVTcmMpfVwiYCk7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuICAgICAgc2FmZUF0dHJpYnV0ZXMucHVzaChgJHtuYW1lfT1cIiR7ZXNjYXBlSHRtbCh1bnF1b3RlZFZhbHVlKX1cImApO1xyXG4gICAgfSBlbHNlIGlmIChuYW1lID09PSBcImNsYXNzXCIpIHtcclxuICAgICAgc2FmZUF0dHJpYnV0ZXMucHVzaChgY2xhc3M9XCIke2VzY2FwZUh0bWwodW5xdW90ZWRWYWx1ZSl9XCJgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICh0YWcgPT09IFwiYVwiICYmICFzYWZlQXR0cmlidXRlcy5zb21lKChhdHRyKSA9PiBhdHRyLnN0YXJ0c1dpdGgoXCJyZWw9XCIpKSkge1xyXG4gICAgc2FmZUF0dHJpYnV0ZXMucHVzaCgncmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gc2FmZUF0dHJpYnV0ZXMubGVuZ3RoID4gMCA/IGAgJHtzYWZlQXR0cmlidXRlcy5qb2luKFwiIFwiKX1gIDogXCJcIjtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBzYW5pdGl6ZVNlb0NvbnRlbnRIdG1sID0gKGh0bWw/OiBzdHJpbmcgfCBudWxsKSA9PiB7XHJcbiAgaWYgKCFodG1sKSByZXR1cm4gXCJcIjtcclxuXHJcbiAgY29uc3Qgd2l0aG91dERhbmdlcm91c0Jsb2NrcyA9IGh0bWwucmVwbGFjZShcclxuICAgIC88KHNjcmlwdHxzdHlsZXxpZnJhbWV8b2JqZWN0fGVtYmVkfGxpbmt8bWV0YSkoW1xcc1xcU10qPyk+KFtcXHNcXFNdKj8pPFxcL1xcMT4vZ2ksXHJcbiAgICBcIlwiLFxyXG4gICk7XHJcblxyXG4gIHJldHVybiB3aXRob3V0RGFuZ2Vyb3VzQmxvY2tzLnJlcGxhY2UoLzxcXC8/KFthLXpBLVowLTktXSspKFtePl0qKT4vZywgKGZ1bGxNYXRjaCwgcmF3VGFnTmFtZSwgcmF3QXR0cmlidXRlcykgPT4ge1xyXG4gICAgY29uc3QgdGFnID0gU3RyaW5nKHJhd1RhZ05hbWUpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpZiAoIUFMTE9XRURfVEFHUy5oYXModGFnKSkgcmV0dXJuIFwiXCI7XHJcblxyXG4gICAgY29uc3QgaXNDbG9zaW5nVGFnID0gZnVsbE1hdGNoLnN0YXJ0c1dpdGgoXCI8L1wiKTtcclxuICAgIGlmIChpc0Nsb3NpbmdUYWcpIHtcclxuICAgICAgcmV0dXJuIGA8LyR7dGFnfT5gO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmdWxsTWF0Y2guZW5kc1dpdGgoXCIvPlwiKSB8fCB0YWcgPT09IFwiYnJcIiB8fCB0YWcgPT09IFwiaHJcIikge1xyXG4gICAgICByZXR1cm4gYDwke3RhZ30ke3Nhbml0aXplVGFnQXR0cmlidXRlcyh0YWcsIFN0cmluZyhyYXdBdHRyaWJ1dGVzID8/IFwiXCIpKX0+YDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYDwke3RhZ30ke3Nhbml0aXplVGFnQXR0cmlidXRlcyh0YWcsIFN0cmluZyhyYXdBdHRyaWJ1dGVzID8/IFwiXCIpKX0+YDtcclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBIT01FX1NFT19TT1VSQ0VfU0VDVElPTl9JRCA9IFwicXViaS1ob21lLXNlby1zb3VyY2VcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBidWlsZEhvbWVTZW9Db250ZW50TWFya3VwID0gKGNvbnRlbnRIdG1sOiBzdHJpbmcpID0+XHJcbiAgYDxzZWN0aW9uIGlkPVwiJHtIT01FX1NFT19TT1VSQ0VfU0VDVElPTl9JRH1cIiBkYXRhLXN0YXRpYy1ob21lLXNlby1jb250ZW50PVwidHJ1ZVwiIGNsYXNzPVwiYm9yZGVyLXQgYm9yZGVyLWJvcmRlciBiZy1iYWNrZ3JvdW5kXCI+XHJcbiAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBteC1hdXRvIHB4LTQgbGc6cHgtOCBweS0xNiBsZzpweS0yNFwiPlxyXG4gICAgPGRpdiBjbGFzcz1cIm14LWF1dG8gbWF4LXctNHhsXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJibG9nLWNvbnRlbnQgdGV4dC1iYXNlIHNtOnRleHQtbGcgdGV4dC1mb3JlZ3JvdW5kXCI+JHtjb250ZW50SHRtbH08L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L3NlY3Rpb24+YDtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJHOlxcXFxxdWJpXFxcXHF1YmlzdGFnaW5nXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJHOlxcXFxxdWJpXFxcXHF1YmlzdGFnaW5nXFxcXHZpdGUuYm9vdHN0cmFwLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9HOi9xdWJpL3F1YmlzdGFnaW5nL3ZpdGUuYm9vdHN0cmFwLnRzXCI7aW1wb3J0IHsgYnVpbGRIb21lU2VvQ29udGVudE1hcmt1cCwgc2FuaXRpemVTZW9Db250ZW50SHRtbCB9IGZyb20gXCIuL3NyYy9saWIvc2VvLWNvbnRlbnRcIjtcclxuXHJcbnR5cGUgSnNvblZhbHVlID0gc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IG51bGwgfCBKc29uT2JqZWN0IHwgSnNvblZhbHVlW107XHJcbnR5cGUgSnNvbk9iamVjdCA9IHsgW2tleTogc3RyaW5nXTogSnNvblZhbHVlIH07XHJcblxyXG50eXBlIE5hdmJhckxpbmsgPSB7XHJcbiAgbGFiZWw6IHN0cmluZztcclxuICBocmVmOiBzdHJpbmc7XHJcbn07XHJcblxyXG50eXBlIE5hdmJhclNlY3Rpb24gPSB7XHJcbiAgdGl0bGU6IHN0cmluZztcclxuICBpdGVtczogTmF2YmFyTGlua1tdO1xyXG4gIGhyZWY/OiBzdHJpbmc7XHJcbn07XHJcblxyXG50eXBlIFNlb01ldGFkYXRhID0ge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgdGl0bGU6IHN0cmluZztcclxuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIGtleXdvcmRzPzogc3RyaW5nO1xyXG4gIG9nVGl0bGU/OiBzdHJpbmc7XHJcbiAgb2dEZXNjcmlwdGlvbj86IHN0cmluZztcclxuICBvZ0ltYWdlPzogc3RyaW5nO1xyXG4gIG9nVHlwZT86IHN0cmluZztcclxuICB0d2l0dGVyQ2FyZD86IHN0cmluZztcclxuICB0d2l0dGVyVGl0bGU/OiBzdHJpbmc7XHJcbiAgdHdpdHRlckRlc2NyaXB0aW9uPzogc3RyaW5nO1xyXG4gIHR3aXR0ZXJJbWFnZT86IHN0cmluZztcclxuICBjYW5vbmljYWw/OiBzdHJpbmc7XHJcbiAgcm9ib3RzPzogc3RyaW5nO1xyXG59O1xyXG5cclxudHlwZSBIZXJvSW1hZ2VTb3VyY2UgPSB7XHJcbiAgc3JjOiBzdHJpbmc7XHJcbiAgd2lkdGg6IG51bWJlcjtcclxufTtcclxuXHJcbnR5cGUgSGVyb0ltYWdlID0ge1xyXG4gIHNyYzogc3RyaW5nO1xyXG4gIGFsdDogc3RyaW5nO1xyXG4gIHdpZHRoOiBudW1iZXI7XHJcbiAgaGVpZ2h0OiBudW1iZXI7XHJcbiAgc2l6ZXM6IHN0cmluZztcclxuICBzb3VyY2VzOiBIZXJvSW1hZ2VTb3VyY2VbXTtcclxufTtcclxuXHJcbnR5cGUgQm9vdHN0cmFwRGF0YSA9IHtcclxuICBuYXZiYXI/OiBOYXZiYXJTZWN0aW9uW107XHJcbiAgcm91dGVzPzogUmVjb3JkPFxyXG4gICAgc3RyaW5nLFxyXG4gICAge1xyXG4gICAgICBzZW8/OiB7XHJcbiAgICAgICAgbWV0YWRhdGE6IFNlb01ldGFkYXRhO1xyXG4gICAgICAgIGpzb25MRD86IEpzb25PYmplY3QgfCBudWxsO1xyXG4gICAgICB9O1xyXG4gICAgICBob21lPzoge1xyXG4gICAgICAgIGhlcm8/OiB7XHJcbiAgICAgICAgICBiYWRnZTogc3RyaW5nO1xyXG4gICAgICAgICAgaGVhZGluZzogc3RyaW5nO1xyXG4gICAgICAgICAgc3ViaGVhZGluZzogc3RyaW5nO1xyXG4gICAgICAgICAgY3RhTGFiZWw6IHN0cmluZztcclxuICAgICAgICAgIGN0YVVybDogc3RyaW5nO1xyXG4gICAgICAgICAgaW1hZ2U/OiBIZXJvSW1hZ2U7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBkZW1vPzoge1xyXG4gICAgICAgICAgdmlkZW9UaXRsZTogc3RyaW5nO1xyXG4gICAgICAgICAgdmlkZW9EdXJhdGlvbjogc3RyaW5nO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgc2VvQ29udGVudEh0bWw/OiBzdHJpbmc7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgPjtcclxufTtcclxuXHJcbnR5cGUgTG9hZEJvb3RzdHJhcE9wdGlvbnMgPSB7XHJcbiAgc2l0ZVVybDogc3RyaW5nO1xyXG4gIHN0cmFwaUJhc2U6IHN0cmluZztcclxufTtcclxuXHJcbmNvbnN0IEhFUk9fSU1BR0VfU0laRVMgPSBcIihtaW4td2lkdGg6IDEwMjRweCkgNTB2dywgKG1pbi13aWR0aDogNjQwcHgpIDkwdncsIDEwMHZ3XCI7XHJcbmNvbnN0IERFRkFVTFRfSEVST19BTFQgPVxyXG4gIFwicXViaSBwbGF0Zm9ybSBvcmNoZXN0cmF0aW9uIGRpYWdyYW0gc2hvd2luZyBBSSBhZ2VudHMsIHdvcmtmbG93cywgaW50ZWdyYXRpb25zLCBhbmQgYW5hbHl0aWNzXCI7XHJcblxyXG5jb25zdCBpc09iamVjdCA9ICh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0+XHJcbiAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsO1xyXG5cclxuY29uc3QgcGlja0xpc3QgPSAoYm9keTogdW5rbm93bik6IFJlY29yZDxzdHJpbmcsIHVua25vd24+W10gPT4ge1xyXG4gIGlmICghaXNPYmplY3QoYm9keSkpIHJldHVybiBbXTtcclxuICBpZiAoQXJyYXkuaXNBcnJheShib2R5LmRhdGEpKSByZXR1cm4gYm9keS5kYXRhLmZpbHRlcihpc09iamVjdCk7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkoYm9keS5yZXN1bHRzKSkgcmV0dXJuIGJvZHkucmVzdWx0cy5maWx0ZXIoaXNPYmplY3QpO1xyXG5cclxuICBpZiAoaXNPYmplY3QoYm9keS5kYXRhKSkge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYm9keS5kYXRhLmRhdGEpKSByZXR1cm4gYm9keS5kYXRhLmRhdGEuZmlsdGVyKGlzT2JqZWN0KTtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KGJvZHkuZGF0YS5yZXN1bHRzKSkgcmV0dXJuIGJvZHkuZGF0YS5yZXN1bHRzLmZpbHRlcihpc09iamVjdCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gW107XHJcbn07XHJcblxyXG5jb25zdCBzYW5pdGl6ZVRleHRWYWx1ZSA9ICh2YWx1ZT86IHN0cmluZyB8IG51bGwpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xyXG4gIGlmICghdmFsdWUpIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgY29uc3QgY2xlYW5lZCA9IHZhbHVlLnRyaW0oKS5yZXBsYWNlKC9gL2csIFwiXCIpLnRyaW0oKTtcclxuICByZXR1cm4gY2xlYW5lZCB8fCB1bmRlZmluZWQ7XHJcbn07XHJcblxyXG5jb25zdCBzYW5pdGl6ZVVybFZhbHVlID0gKHZhbHVlPzogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XHJcbiAgY29uc3QgY2xlYW5lZCA9IHNhbml0aXplVGV4dFZhbHVlKHZhbHVlKTtcclxuICBpZiAoIWNsZWFuZWQpIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgcmV0dXJuIGNsZWFuZWQucmVwbGFjZSgvXltcIiddKy8sIFwiXCIpLnJlcGxhY2UoL1tcIiddKyQvLCBcIlwiKS50cmltKCkgfHwgdW5kZWZpbmVkO1xyXG59O1xyXG5cclxuY29uc3QgdG9BYnNvbHV0ZVVybCA9IChzaXRlVXJsOiBzdHJpbmcsIHZhbHVlPzogc3RyaW5nIHwgbnVsbCkgPT4ge1xyXG4gIGNvbnN0IGNsZWFuZWQgPSBzYW5pdGl6ZVVybFZhbHVlKHZhbHVlKTtcclxuICBpZiAoIWNsZWFuZWQpIHJldHVybiB1bmRlZmluZWQ7XHJcblxyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gbmV3IFVSTChjbGVhbmVkKS50b1N0cmluZygpO1xyXG4gIH0gY2F0Y2gge1xyXG4gICAgcmV0dXJuIG5ldyBVUkwoY2xlYW5lZC5zdGFydHNXaXRoKFwiL1wiKSA/IGNsZWFuZWQgOiBgLyR7Y2xlYW5lZH1gLCBgJHtzaXRlVXJsLnJlcGxhY2UoL1xcLyQvLCBcIlwiKX0vYCkudG9TdHJpbmcoKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBnZXRTZW9PYmplY3QgPSAodmFsdWU6IHVua25vd24pOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwgPT4ge1xyXG4gIGlmICghaXNPYmplY3QodmFsdWUpKSByZXR1cm4gbnVsbDtcclxuICBpZiAoXCJhdHRyaWJ1dGVzXCIgaW4gdmFsdWUgJiYgaXNPYmplY3QoKHZhbHVlIGFzIHsgYXR0cmlidXRlcz86IHVua25vd24gfSkuYXR0cmlidXRlcykpIHtcclxuICAgIHJldHVybiAodmFsdWUgYXMgeyBhdHRyaWJ1dGVzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB9KS5hdHRyaWJ1dGVzO1xyXG4gIH1cclxuICBpZiAoXHJcbiAgICBcImRhdGFcIiBpbiB2YWx1ZSAmJlxyXG4gICAgaXNPYmplY3QoKHZhbHVlIGFzIHsgZGF0YT86IHVua25vd24gfSkuZGF0YSkgJiZcclxuICAgIFwiYXR0cmlidXRlc1wiIGluICh2YWx1ZSBhcyB7IGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IH0pLmRhdGEgJiZcclxuICAgIGlzT2JqZWN0KCgodmFsdWUgYXMgeyBkYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB9KS5kYXRhIGFzIHsgYXR0cmlidXRlcz86IHVua25vd24gfSkuYXR0cmlidXRlcylcclxuICApIHtcclxuICAgIHJldHVybiAoKHZhbHVlIGFzIHsgZGF0YTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfSkuZGF0YSBhcyB7IGF0dHJpYnV0ZXM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IH0pLmF0dHJpYnV0ZXM7XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZTtcclxufTtcclxuXHJcbmNvbnN0IHBpY2tTdHJpbmcgPSAob2JqOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwsIGtleXM6IHN0cmluZ1tdKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcclxuICBpZiAoIW9iaikgcmV0dXJuIHVuZGVmaW5lZDtcclxuICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IG9ialtrZXldO1xyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiB2YWx1ZS50cmltKCkpIHJldHVybiB2YWx1ZS50cmltKCk7XHJcbiAgfVxyXG4gIHJldHVybiB1bmRlZmluZWQ7XHJcbn07XHJcblxyXG5jb25zdCBnZXRNZWRpYVVybCA9IChzdHJhcGlCYXNlOiBzdHJpbmcsIG1lZGlhOiB1bmtub3duKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcclxuICBjb25zdCBhc3NldEJhc2UgPSBzdHJhcGlCYXNlLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcclxuICBpZiAoIW1lZGlhKSByZXR1cm4gdW5kZWZpbmVkO1xyXG4gIGlmICh0eXBlb2YgbWVkaWEgPT09IFwic3RyaW5nXCIpIHtcclxuICAgIGNvbnN0IGNsZWFuZWQgPSBzYW5pdGl6ZVVybFZhbHVlKG1lZGlhKTtcclxuICAgIGlmICghY2xlYW5lZCkgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIHJldHVybiBjbGVhbmVkLnN0YXJ0c1dpdGgoXCJodHRwXCIpID8gY2xlYW5lZCA6IGAke2Fzc2V0QmFzZX0ke2NsZWFuZWR9YDtcclxuICB9XHJcbiAgaWYgKGlzT2JqZWN0KG1lZGlhKSAmJiB0eXBlb2YgbWVkaWEudXJsID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICBjb25zdCBjbGVhbmVkID0gc2FuaXRpemVVcmxWYWx1ZShtZWRpYS51cmwpO1xyXG4gICAgaWYgKCFjbGVhbmVkKSByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgcmV0dXJuIGNsZWFuZWQuc3RhcnRzV2l0aChcImh0dHBcIikgPyBjbGVhbmVkIDogYCR7YXNzZXRCYXNlfSR7Y2xlYW5lZH1gO1xyXG4gIH1cclxuICBpZiAoXHJcbiAgICBpc09iamVjdChtZWRpYSkgJiZcclxuICAgIFwiYXR0cmlidXRlc1wiIGluIG1lZGlhICYmXHJcbiAgICBpc09iamVjdCgobWVkaWEgYXMgeyBhdHRyaWJ1dGVzPzogdW5rbm93biB9KS5hdHRyaWJ1dGVzKSAmJlxyXG4gICAgdHlwZW9mIChtZWRpYSBhcyB7IGF0dHJpYnV0ZXM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IH0pLmF0dHJpYnV0ZXMudXJsID09PSBcInN0cmluZ1wiXHJcbiAgKSB7XHJcbiAgICBjb25zdCB1cmwgPSBzYW5pdGl6ZVVybFZhbHVlKChtZWRpYSBhcyB7IGF0dHJpYnV0ZXM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IH0pLmF0dHJpYnV0ZXMudXJsIGFzIHN0cmluZyk7XHJcbiAgICBpZiAoIXVybCkgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIHJldHVybiB1cmwuc3RhcnRzV2l0aChcImh0dHBcIikgPyB1cmwgOiBgJHthc3NldEJhc2V9JHt1cmx9YDtcclxuICB9XHJcbiAgcmV0dXJuIHVuZGVmaW5lZDtcclxufTtcclxuXHJcbmNvbnN0IHNhbml0aXplSnNvblZhbHVlID0gKHZhbHVlOiBKc29uVmFsdWUpOiBKc29uVmFsdWUgPT4ge1xyXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgIHJldHVybiBzYW5pdGl6ZVRleHRWYWx1ZSh2YWx1ZSkgPz8gdmFsdWU7XHJcbiAgfVxyXG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgcmV0dXJuIHZhbHVlLm1hcCgoZW50cnkpID0+IHNhbml0aXplSnNvblZhbHVlKGVudHJ5KSk7XHJcbiAgfVxyXG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcclxuICAgIGNvbnN0IG91dDogSnNvbk9iamVjdCA9IHt9O1xyXG4gICAgZm9yIChjb25zdCBba2V5LCBlbnRyeV0gb2YgT2JqZWN0LmVudHJpZXModmFsdWUpKSB7XHJcbiAgICAgIG91dFtrZXldID0gc2FuaXRpemVKc29uVmFsdWUoZW50cnkgYXMgSnNvblZhbHVlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBvdXQ7XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZTtcclxufTtcclxuXHJcbmNvbnN0IGdldFNlb1NjaGVtYSA9IChpdGVtOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik6IEpzb25PYmplY3QgfCBudWxsID0+IHtcclxuICBjb25zdCBhdHRycyA9IGlzT2JqZWN0KGl0ZW0uYXR0cmlidXRlcykgPyBpdGVtLmF0dHJpYnV0ZXMgOiBpdGVtO1xyXG4gIGNvbnN0IHNlbyA9IGdldFNlb09iamVjdCgoYXR0cnMgYXMgeyBzZW8/OiB1bmtub3duIH0pLnNlbyk7XHJcbiAgaWYgKCFzZW8pIHJldHVybiBudWxsO1xyXG5cclxuICBjb25zdCByYXdTY2hlbWEgPSBzZW8uc2NoZW1hO1xyXG4gIGlmIChpc09iamVjdChyYXdTY2hlbWEpKSByZXR1cm4gc2FuaXRpemVKc29uVmFsdWUocmF3U2NoZW1hIGFzIEpzb25WYWx1ZSkgYXMgSnNvbk9iamVjdDtcclxuICBpZiAodHlwZW9mIHJhd1NjaGVtYSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShyYXdTY2hlbWEpO1xyXG4gICAgICByZXR1cm4gaXNPYmplY3QocGFyc2VkKSA/IChzYW5pdGl6ZUpzb25WYWx1ZShwYXJzZWQgYXMgSnNvblZhbHVlKSBhcyBKc29uT2JqZWN0KSA6IG51bGw7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbmNvbnN0IGJ1aWxkU2VvTWV0YWRhdGEgPSAoaXRlbTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsLCBwYXRoOiBzdHJpbmcsIHNpdGVVcmw6IHN0cmluZywgc3RyYXBpQmFzZTogc3RyaW5nKTogU2VvTWV0YWRhdGEgPT4ge1xyXG4gIGNvbnN0IGF0dHJzID0gaXRlbSAmJiBpc09iamVjdChpdGVtLmF0dHJpYnV0ZXMpID8gaXRlbS5hdHRyaWJ1dGVzIDogaXRlbSA/PyB7fTtcclxuICBjb25zdCBzZW8gPSBnZXRTZW9PYmplY3QoKGF0dHJzIGFzIHsgc2VvPzogdW5rbm93biB9KS5zZW8pO1xyXG5cclxuICBjb25zdCB0aXRsZSA9XHJcbiAgICBzYW5pdGl6ZVRleHRWYWx1ZShwaWNrU3RyaW5nKHNlbywgW1wibWV0YVRpdGxlXCIsIFwibWV0YV90aXRsZVwiLCBcInRpdGxlXCIsIFwibWV0YVRpdGxlVGV4dFwiXSkpIHx8XHJcbiAgICBzYW5pdGl6ZVRleHRWYWx1ZSgoYXR0cnMgYXMgeyB0aXRsZT86IHN0cmluZyB9KS50aXRsZSkgfHxcclxuICAgIFwiUXViaSBGbG93IE9yY2hlc3RyYXRvclwiO1xyXG4gIGNvbnN0IGRlc2NyaXB0aW9uID1cclxuICAgIHNhbml0aXplVGV4dFZhbHVlKHBpY2tTdHJpbmcoc2VvLCBbXCJtZXRhRGVzY3JpcHRpb25cIiwgXCJtZXRhX2Rlc2NyaXB0aW9uXCIsIFwiZGVzY3JpcHRpb25cIl0pKSB8fFxyXG4gICAgXCJFbnRlcnByaXNlIHdvcmtmbG93IG9yY2hlc3RyYXRpb24gcGxhdGZvcm1cIjtcclxuICBjb25zdCBrZXl3b3JkcyA9IHNhbml0aXplVGV4dFZhbHVlKHBpY2tTdHJpbmcoc2VvLCBbXCJrZXl3b3Jkc1wiLCBcIm1ldGFLZXl3b3Jkc1wiLCBcIm1ldGFfa2V5d29yZHNcIiwgXCJtZXRhX2tleXdvcmRcIl0pKTtcclxuICBjb25zdCBjYW5vbmljYWwgPSB0b0Fic29sdXRlVXJsKHNpdGVVcmwsIHBpY2tTdHJpbmcoc2VvLCBbXCJjYW5vbmljYWxVUkxcIiwgXCJjYW5vbmljYWxfdXJsXCIsIFwiY2Fub25pY2FsXCIsIFwiY2Fub25pY2FsVXJsXCJdKSk7XHJcbiAgY29uc3Qgb2dUaXRsZSA9IHNhbml0aXplVGV4dFZhbHVlKHBpY2tTdHJpbmcoc2VvLCBbXCJvZ1RpdGxlXCIsIFwib2dfdGl0bGVcIl0pKSB8fCB0aXRsZTtcclxuICBjb25zdCBvZ0Rlc2NyaXB0aW9uID0gc2FuaXRpemVUZXh0VmFsdWUocGlja1N0cmluZyhzZW8sIFtcIm9nRGVzY3JpcHRpb25cIiwgXCJvZ19kZXNjcmlwdGlvblwiXSkpIHx8IGRlc2NyaXB0aW9uO1xyXG4gIGNvbnN0IG9nSW1hZ2VSYXcgPSBzZW8/Lm9nSW1hZ2UgPz8gc2VvPy5vZ19pbWFnZSA/PyBzZW8/Lm1ldGFJbWFnZSA/PyBzZW8/Lm1ldGFfaW1hZ2U7XHJcbiAgY29uc3Qgb2dJbWFnZSA9IGdldE1lZGlhVXJsKHN0cmFwaUJhc2UsIG9nSW1hZ2VSYXcpO1xyXG4gIGNvbnN0IHR3aXR0ZXJDYXJkID0gc2FuaXRpemVUZXh0VmFsdWUocGlja1N0cmluZyhzZW8sIFtcInR3aXR0ZXJDYXJkXCIsIFwidHdpdHRlcl9jYXJkXCJdKSkgfHwgXCJzdW1tYXJ5X2xhcmdlX2ltYWdlXCI7XHJcbiAgY29uc3QgdHdpdHRlclRpdGxlID0gc2FuaXRpemVUZXh0VmFsdWUocGlja1N0cmluZyhzZW8sIFtcInR3aXR0ZXJUaXRsZVwiLCBcInR3aXR0ZXJfdGl0bGVcIl0pKSB8fCBvZ1RpdGxlO1xyXG4gIGNvbnN0IHR3aXR0ZXJEZXNjcmlwdGlvbiA9XHJcbiAgICBzYW5pdGl6ZVRleHRWYWx1ZShwaWNrU3RyaW5nKHNlbywgW1widHdpdHRlckRlc2NyaXB0aW9uXCIsIFwidHdpdHRlcl9kZXNjcmlwdGlvblwiXSkpIHx8IG9nRGVzY3JpcHRpb247XHJcbiAgY29uc3QgdHdpdHRlckltYWdlID0gZ2V0TWVkaWFVcmwoc3RyYXBpQmFzZSwgc2VvPy50d2l0dGVySW1hZ2UgPz8gc2VvPy50d2l0dGVyX2ltYWdlID8/IG9nSW1hZ2VSYXcpIHx8IG9nSW1hZ2U7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpZDogcGF0aCxcclxuICAgIHRpdGxlLFxyXG4gICAgZGVzY3JpcHRpb24sXHJcbiAgICBrZXl3b3JkcyxcclxuICAgIG9nVGl0bGUsXHJcbiAgICBvZ0Rlc2NyaXB0aW9uLFxyXG4gICAgb2dJbWFnZSxcclxuICAgIG9nVHlwZTogXCJ3ZWJzaXRlXCIsXHJcbiAgICB0d2l0dGVyQ2FyZCxcclxuICAgIHR3aXR0ZXJUaXRsZSxcclxuICAgIHR3aXR0ZXJEZXNjcmlwdGlvbixcclxuICAgIHR3aXR0ZXJJbWFnZSxcclxuICAgIGNhbm9uaWNhbCxcclxuICAgIHJvYm90czogXCJpbmRleCwgZm9sbG93XCIsXHJcbiAgfTtcclxufTtcclxuXHJcbmNvbnN0IHN0cmlwSHRtbCA9ICh2YWx1ZT86IHN0cmluZyB8IG51bGwpID0+XHJcbiAgdmFsdWVcclxuICAgID8gdmFsdWVcclxuICAgICAgICAucmVwbGFjZSgvPFtePl0rPi9nLCBcIlwiKVxyXG4gICAgICAgIC5yZXBsYWNlKC8mYW1wOy9nLCBcIiZcIilcclxuICAgICAgICAucmVwbGFjZSgvJmx0Oy9nLCBcIjxcIilcclxuICAgICAgICAucmVwbGFjZSgvJmd0Oy9nLCBcIj5cIilcclxuICAgICAgICAucmVwbGFjZSgvJm5ic3A7L2csIFwiIFwiKVxyXG4gICAgICAgIC50cmltKClcclxuICAgIDogXCJcIjtcclxuXHJcbmNvbnN0IGJ1aWxkSGVyb0ltYWdlID0gKHN0cmFwaUJhc2U6IHN0cmluZywgaW1hZ2U6IHVua25vd24pOiBIZXJvSW1hZ2UgfCB1bmRlZmluZWQgPT4ge1xyXG4gIGlmICghaXNPYmplY3QoaW1hZ2UpIHx8IHR5cGVvZiBpbWFnZS51cmwgIT09IFwic3RyaW5nXCIpIHtcclxuICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICBjb25zdCBmb3JtYXRzID0gaXNPYmplY3QoaW1hZ2UuZm9ybWF0cykgPyBpbWFnZS5mb3JtYXRzIDoge307XHJcbiAgY29uc3QgdmFyaWFudHMgPSBPYmplY3QudmFsdWVzKGZvcm1hdHMpXHJcbiAgICAuZmlsdGVyKChmb3JtYXQpOiBmb3JtYXQgaXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPT4gaXNPYmplY3QoZm9ybWF0KSAmJiB0eXBlb2YgZm9ybWF0LnVybCA9PT0gXCJzdHJpbmdcIilcclxuICAgIC5tYXAoKGZvcm1hdCkgPT4gKHtcclxuICAgICAgc3JjOiBnZXRNZWRpYVVybChzdHJhcGlCYXNlLCBmb3JtYXQudXJsKSA/PyBcIlwiLFxyXG4gICAgICB3aWR0aDogdHlwZW9mIGZvcm1hdC53aWR0aCA9PT0gXCJudW1iZXJcIiA/IGZvcm1hdC53aWR0aCA6IDAsXHJcbiAgICB9KSlcclxuICAgIC5maWx0ZXIoKGZvcm1hdCkgPT4gZm9ybWF0LnNyYyAmJiBmb3JtYXQud2lkdGggPiAwKVxyXG4gICAgLnNvcnQoKGEsIGIpID0+IGEud2lkdGggLSBiLndpZHRoKTtcclxuXHJcbiAgY29uc3QgYmFzZVdpZHRoID0gdHlwZW9mIGltYWdlLndpZHRoID09PSBcIm51bWJlclwiID8gaW1hZ2Uud2lkdGggOiB2YXJpYW50c1t2YXJpYW50cy5sZW5ndGggLSAxXT8ud2lkdGggPz8gMTAyNDtcclxuICBjb25zdCBiYXNlU291cmNlID0ge1xyXG4gICAgc3JjOiBnZXRNZWRpYVVybChzdHJhcGlCYXNlLCBpbWFnZS51cmwpID8/IFwiXCIsXHJcbiAgICB3aWR0aDogYmFzZVdpZHRoLFxyXG4gIH07XHJcbiAgY29uc3Qgc291cmNlcyA9IFsuLi52YXJpYW50cywgYmFzZVNvdXJjZV0uZmlsdGVyKFxyXG4gICAgKHNvdXJjZSwgaW5kZXgsIGFsbFNvdXJjZXMpID0+IHNvdXJjZS5zcmMgJiYgYWxsU291cmNlcy5maW5kSW5kZXgoKGNhbmRpZGF0ZSkgPT4gY2FuZGlkYXRlLndpZHRoID09PSBzb3VyY2Uud2lkdGgpID09PSBpbmRleCxcclxuICApO1xyXG4gIGNvbnN0IHByZWZlcnJlZFNvdXJjZSA9XHJcbiAgICBzb3VyY2VzLmZpbmQoKHNvdXJjZSkgPT4gc291cmNlLndpZHRoID49IDEwMDApID8/XHJcbiAgICBzb3VyY2VzLmZpbmQoKHNvdXJjZSkgPT4gc291cmNlLndpZHRoID49IDc1MCkgPz9cclxuICAgIHNvdXJjZXNbc291cmNlcy5sZW5ndGggLSAxXTtcclxuXHJcbiAgaWYgKCFwcmVmZXJyZWRTb3VyY2U/LnNyYykge1xyXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzcmM6IHByZWZlcnJlZFNvdXJjZS5zcmMsXHJcbiAgICBhbHQ6ICh0eXBlb2YgaW1hZ2UuYWx0ZXJuYXRpdmVUZXh0ID09PSBcInN0cmluZ1wiICYmIGltYWdlLmFsdGVybmF0aXZlVGV4dCkgfHwgREVGQVVMVF9IRVJPX0FMVCxcclxuICAgIHdpZHRoOiB0eXBlb2YgaW1hZ2Uud2lkdGggPT09IFwibnVtYmVyXCIgPyBpbWFnZS53aWR0aCA6IDEwMjQsXHJcbiAgICBoZWlnaHQ6IHR5cGVvZiBpbWFnZS5oZWlnaHQgPT09IFwibnVtYmVyXCIgPyBpbWFnZS5oZWlnaHQgOiA1NzYsXHJcbiAgICBzaXplczogSEVST19JTUFHRV9TSVpFUyxcclxuICAgIHNvdXJjZXMsXHJcbiAgfTtcclxufTtcclxuXHJcbmNvbnN0IGZldGNoSnNvbiA9IGFzeW5jICh1cmw6IHN0cmluZykgPT4ge1xyXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7XHJcbiAgICBoZWFkZXJzOiB7IEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcclxuICB9KTtcclxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFJlcXVlc3QgZmFpbGVkOiAke3Jlc3BvbnNlLnN0YXR1c30gJHt1cmx9YCk7XHJcbiAgfVxyXG4gIHJldHVybiAoYXdhaXQgcmVzcG9uc2UuanNvbigpKSBhcyB1bmtub3duO1xyXG59O1xyXG5cclxuY29uc3QgZmV0Y2hGaXJzdEl0ZW0gPSBhc3luYyAodXJsOiBzdHJpbmcpID0+IHtcclxuICBjb25zdCBib2R5ID0gYXdhaXQgZmV0Y2hKc29uKHVybCk7XHJcbiAgcmV0dXJuIHBpY2tMaXN0KGJvZHkpWzBdID8/IG51bGw7XHJcbn07XHJcblxyXG5jb25zdCBmZXRjaEZpcnN0TWF0Y2hpbmdQYWdlID0gYXN5bmMgKHN0cmFwaUJhc2U6IHN0cmluZywgc2x1Z3M6IHN0cmluZ1tdKSA9PiB7XHJcbiAgZm9yIChjb25zdCBzbHVnIG9mIHNsdWdzKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBpdGVtID0gYXdhaXQgZmV0Y2hGaXJzdEl0ZW0oXHJcbiAgICAgICAgYCR7c3RyYXBpQmFzZX0vYXBpL3BhZ2VzP3BvcHVsYXRlPSomZmlsdGVyc1tzbHVnXVskZXFdPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHNsdWcpfWBcclxuICAgICAgKTtcclxuICAgICAgaWYgKGl0ZW0pIHJldHVybiBpdGVtO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG51bGw7XHJcbn07XHJcblxyXG5jb25zdCBsb2FkTmF2YmFyRGF0YSA9IGFzeW5jIChzdHJhcGlCYXNlOiBzdHJpbmcpOiBQcm9taXNlPE5hdmJhclNlY3Rpb25bXT4gPT4ge1xyXG4gIGNvbnN0IFtzZWN0aW9uc0JvZHksIGNhdGVnb3JpZXNCb2R5XSA9IGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgIGZldGNoSnNvbihcclxuICAgICAgYCR7c3RyYXBpQmFzZX0vYXBpL3NlY3Rpb25zP2ZpbHRlcnNbcHVibGlzaGVkXVskZXFdPXRydWUmZmlsdGVyc1tzaG93X2luX25hdl1bJGVxXT10cnVlJnNvcnRbMF09c29ydF9vcmRlcjphc2MmcGFnaW5hdGlvbltwYWdlU2l6ZV09MTAwYFxyXG4gICAgKSxcclxuICAgIGZldGNoSnNvbihcclxuICAgICAgYCR7c3RyYXBpQmFzZX0vYXBpL2NhdGVnb3JpZXM/ZmlsdGVyc1twdWJsaXNoZWRdWyRlcV09dHJ1ZSZmaWx0ZXJzW3Nob3dfaW5fbmF2XVskZXFdPXRydWUmc29ydFswXT1zb3J0X29yZGVyOmFzYyZwYWdpbmF0aW9uW3BhZ2VTaXplXT0xMDBgXHJcbiAgICApLFxyXG4gIF0pO1xyXG5cclxuICBjb25zdCBzZWN0aW9ucyA9IHBpY2tMaXN0KHNlY3Rpb25zQm9keSk7XHJcbiAgY29uc3QgY2F0ZWdvcmllcyA9IHBpY2tMaXN0KGNhdGVnb3JpZXNCb2R5KTtcclxuICBjb25zdCBpdGVtc0J5U2VjdGlvbiA9IG5ldyBNYXA8bnVtYmVyLCBOYXZiYXJMaW5rW10+KCk7XHJcblxyXG4gIGZvciAoY29uc3QgY2F0ZWdvcnkgb2YgY2F0ZWdvcmllcykge1xyXG4gICAgY29uc3Qgc2VjdGlvbklkID0gdHlwZW9mIGNhdGVnb3J5LnNlY3Rpb25faWQgPT09IFwibnVtYmVyXCIgPyBjYXRlZ29yeS5zZWN0aW9uX2lkIDogbnVsbDtcclxuICAgIGNvbnN0IGxhYmVsID0gdHlwZW9mIGNhdGVnb3J5LmNhdGVnb3J5X3RpdGxlID09PSBcInN0cmluZ1wiID8gY2F0ZWdvcnkuY2F0ZWdvcnlfdGl0bGUgOiBcIlwiO1xyXG4gICAgY29uc3QgaHJlZiA9XHJcbiAgICAgIHNhbml0aXplVXJsVmFsdWUoXHJcbiAgICAgICAgKHR5cGVvZiBjYXRlZ29yeS5pbnRlcm5hbF9saW5rID09PSBcInN0cmluZ1wiICYmIGNhdGVnb3J5LmludGVybmFsX2xpbmspIHx8XHJcbiAgICAgICAgICAodHlwZW9mIGNhdGVnb3J5LmV4dGVybmFsX2xpbmsgPT09IFwic3RyaW5nXCIgJiYgY2F0ZWdvcnkuZXh0ZXJuYWxfbGluaykgfHxcclxuICAgICAgICAgIFwiXCJcclxuICAgICAgKSB8fFxyXG4gICAgICBcIlwiO1xyXG5cclxuICAgIGlmICghc2VjdGlvbklkIHx8ICFsYWJlbCB8fCAhaHJlZikgY29udGludWU7XHJcblxyXG4gICAgY29uc3QgaXRlbXMgPSBpdGVtc0J5U2VjdGlvbi5nZXQoc2VjdGlvbklkKSA/PyBbXTtcclxuICAgIGl0ZW1zLnB1c2goeyBsYWJlbCwgaHJlZiB9KTtcclxuICAgIGl0ZW1zQnlTZWN0aW9uLnNldChzZWN0aW9uSWQsIGl0ZW1zKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBzZWN0aW9ucy5yZWR1Y2U8TmF2YmFyU2VjdGlvbltdPigoYWNjLCBzZWN0aW9uKSA9PiB7XHJcbiAgICBpZiAodHlwZW9mIHNlY3Rpb24uaWQgIT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIHNlY3Rpb24uc2VjdGlvbl90aXRsZSAhPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICByZXR1cm4gYWNjO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGl0ZW1zID0gaXRlbXNCeVNlY3Rpb24uZ2V0KHNlY3Rpb24uaWQpID8/IFtdO1xyXG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgYWNjLnB1c2goe1xyXG4gICAgICAgIHRpdGxlOiBzZWN0aW9uLnNlY3Rpb25fdGl0bGUsXHJcbiAgICAgICAgaXRlbXMsXHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gYWNjO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGhyZWYgPVxyXG4gICAgICBzYW5pdGl6ZVVybFZhbHVlKFxyXG4gICAgICAgICh0eXBlb2Ygc2VjdGlvbi5pbnRlcm5hbF9saW5rID09PSBcInN0cmluZ1wiICYmIHNlY3Rpb24uaW50ZXJuYWxfbGluaykgfHxcclxuICAgICAgICAgICh0eXBlb2Ygc2VjdGlvbi5leHRlcm5hbF9saW5rID09PSBcInN0cmluZ1wiICYmIHNlY3Rpb24uZXh0ZXJuYWxfbGluaykgfHxcclxuICAgICAgICAgIFwiXCJcclxuICAgICAgKSB8fFxyXG4gICAgICBcIlwiO1xyXG4gICAgaWYgKGhyZWYpIHtcclxuICAgICAgYWNjLnB1c2goe1xyXG4gICAgICAgIHRpdGxlOiBzZWN0aW9uLnNlY3Rpb25fdGl0bGUsXHJcbiAgICAgICAgaXRlbXM6IFtdLFxyXG4gICAgICAgIGhyZWYsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhY2M7XHJcbiAgfSwgW10pO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGxvYWRCb290c3RyYXBEYXRhID0gYXN5bmMgKHsgc2l0ZVVybCwgc3RyYXBpQmFzZSB9OiBMb2FkQm9vdHN0cmFwT3B0aW9ucyk6IFByb21pc2U8Qm9vdHN0cmFwRGF0YT4gPT4ge1xyXG4gIGNvbnN0IFtuYXZiYXIsIGhlcm9TZWN0aW9uLCBkZW1vU2VjdGlvbiwgaG9tZVBhZ2VdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xyXG4gICAgbG9hZE5hdmJhckRhdGEoc3RyYXBpQmFzZSkuY2F0Y2goKCkgPT4gW10pLFxyXG4gICAgZmV0Y2hGaXJzdEl0ZW0oXHJcbiAgICAgIGAke3N0cmFwaUJhc2V9L2FwaS9zZWN0aW9ucz9wb3B1bGF0ZT1pbWFnZXMmZmlsdGVyc1twdWJsaXNoZWRdWyRlcV09dHJ1ZSZmaWx0ZXJzW3NlY3Rpb25fdHlwZV1bJGVxXT1oZXJvJnNvcnRbMF09c29ydF9vcmRlcjphc2MmcGFnaW5hdGlvbltwYWdlU2l6ZV09MWBcclxuICAgICkuY2F0Y2goKCkgPT4gbnVsbCksXHJcbiAgICBmZXRjaEZpcnN0SXRlbShcclxuICAgICAgYCR7c3RyYXBpQmFzZX0vYXBpL3NlY3Rpb25zP2ZpbHRlcnNbcHVibGlzaGVkXVskZXFdPXRydWUmZmlsdGVyc1tzZWN0aW9uX3R5cGVdWyRlcV09ZGVtb192aWRlb19zZWN0aW9uJnNvcnRbMF09c29ydF9vcmRlcjphc2MmcGFnaW5hdGlvbltwYWdlU2l6ZV09MWBcclxuICAgICkuY2F0Y2goKCkgPT4gbnVsbCksXHJcbiAgICBmZXRjaEZpcnN0TWF0Y2hpbmdQYWdlKHN0cmFwaUJhc2UsIFtcIi9cIiwgXCIvaG9tZVwiLCBcImhvbWVcIl0pLmNhdGNoKCgpID0+IG51bGwpLFxyXG4gIF0pO1xyXG5cclxuICBjb25zdCBoZXJvSW1hZ2UgPSBidWlsZEhlcm9JbWFnZShcclxuICAgIHN0cmFwaUJhc2UsXHJcbiAgICBpc09iamVjdChoZXJvU2VjdGlvbikgJiYgQXJyYXkuaXNBcnJheShoZXJvU2VjdGlvbi5pbWFnZXMpID8gaGVyb1NlY3Rpb24uaW1hZ2VzWzBdIDogdW5kZWZpbmVkLFxyXG4gICk7XHJcbiAgY29uc3QgaGVybyA9XHJcbiAgICBoZXJvU2VjdGlvbiAmJiBpc09iamVjdChoZXJvU2VjdGlvbilcclxuICAgICAgPyB7XHJcbiAgICAgICAgICBiYWRnZTogKHR5cGVvZiBoZXJvU2VjdGlvbi50ZW1wbGF0ZSA9PT0gXCJzdHJpbmdcIiAmJiBoZXJvU2VjdGlvbi50ZW1wbGF0ZSkgfHwgXCJBZ2VudGljIEF1dG9tYXRpb24gUGxhdGZvcm1cIixcclxuICAgICAgICAgIGhlYWRpbmc6XHJcbiAgICAgICAgICAgICh0eXBlb2YgaGVyb1NlY3Rpb24uc2VjdGlvbl90aXRsZSA9PT0gXCJzdHJpbmdcIiAmJiBoZXJvU2VjdGlvbi5zZWN0aW9uX3RpdGxlKSB8fFxyXG4gICAgICAgICAgICBcIkRlc2lnbiBhbmQgb3JjaGVzdHJhdGUgZW50ZXJwcmlzZSB3b3JrZmxvd3Mgd2l0aCBxdWJpXCIsXHJcbiAgICAgICAgICBzdWJoZWFkaW5nOlxyXG4gICAgICAgICAgICBzdHJpcEh0bWwodHlwZW9mIGhlcm9TZWN0aW9uLmRlc2NyaXB0aW9uID09PSBcInN0cmluZ1wiID8gaGVyb1NlY3Rpb24uZGVzY3JpcHRpb24gOiB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIFwiQ29ubmVjdCBBSSBhZ2VudHMsIGJ1c2luZXNzIHN5c3RlbXMsIGFuZCBodW1hbiBhcHByb3ZhbHMgaW4gb25lIGVudGVycHJpc2Ugb3JjaGVzdHJhdGlvbiBsYXllci5cIixcclxuICAgICAgICAgIGN0YUxhYmVsOiAodHlwZW9mIGhlcm9TZWN0aW9uLmRpc3BsYXlfdHlwZSA9PT0gXCJzdHJpbmdcIiAmJiBoZXJvU2VjdGlvbi5kaXNwbGF5X3R5cGUpIHx8IFwiQm9vayBhIERlbW9cIixcclxuICAgICAgICAgIGN0YVVybDpcclxuICAgICAgICAgICAgc2FuaXRpemVVcmxWYWx1ZSh0eXBlb2YgaGVyb1NlY3Rpb24uZXh0ZXJuYWxfbGluayA9PT0gXCJzdHJpbmdcIiA/IGhlcm9TZWN0aW9uLmV4dGVybmFsX2xpbmsgOiB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIFwiaHR0cHM6Ly9tZWV0aW5ncy5odWJzcG90LmNvbS9tYWhlc2h2XCIsXHJcbiAgICAgICAgICBpbWFnZTogaGVyb0ltYWdlLFxyXG4gICAgICAgIH1cclxuICAgICAgOiB1bmRlZmluZWQ7XHJcblxyXG4gIGNvbnN0IGRlbW8gPVxyXG4gICAgZGVtb1NlY3Rpb24gJiYgaXNPYmplY3QoZGVtb1NlY3Rpb24pXHJcbiAgICAgID8ge1xyXG4gICAgICAgICAgdmlkZW9UaXRsZTpcclxuICAgICAgICAgICAgKHR5cGVvZiBkZW1vU2VjdGlvbi5zZWN0aW9uX3RpdGxlID09PSBcInN0cmluZ1wiICYmIGRlbW9TZWN0aW9uLnNlY3Rpb25fdGl0bGUpIHx8IFwicXViaSBQbGF0Zm9ybSBGdWxsIERlbW9cIixcclxuICAgICAgICAgIHZpZGVvRHVyYXRpb246XHJcbiAgICAgICAgICAgICh0eXBlb2YgZGVtb1NlY3Rpb24uZGVzY3JpcHRpb24gPT09IFwic3RyaW5nXCIgJiYgZGVtb1NlY3Rpb24uZGVzY3JpcHRpb24pIHx8XHJcbiAgICAgICAgICAgIFwiMTIgbWludXRlcyBFbmQtdG8tZW5kIGV4ZWN1dGlvbiB3YWxrdGhyb3VnaFwiLFxyXG4gICAgICAgIH1cclxuICAgICAgOiB1bmRlZmluZWQ7XHJcbiAgY29uc3Qgc2VvQ29udGVudEh0bWwgPVxyXG4gICAgaG9tZVBhZ2UgJiYgaXNPYmplY3QoaG9tZVBhZ2UpICYmIHR5cGVvZiBob21lUGFnZS5jb250ZW50ID09PSBcInN0cmluZ1wiXHJcbiAgICAgID8gc2FuaXRpemVTZW9Db250ZW50SHRtbChob21lUGFnZS5jb250ZW50KVxyXG4gICAgICA6IFwiXCI7XHJcblxyXG4gIGNvbnN0IGhvbWVSb3V0ZURhdGEgPSB7XHJcbiAgICBzZW86IHtcclxuICAgICAgbWV0YWRhdGE6IGJ1aWxkU2VvTWV0YWRhdGEoaG9tZVBhZ2UsIFwiL1wiLCBzaXRlVXJsLCBzdHJhcGlCYXNlKSxcclxuICAgICAganNvbkxEOiBob21lUGFnZSAmJiBpc09iamVjdChob21lUGFnZSkgPyBnZXRTZW9TY2hlbWEoaG9tZVBhZ2UpIDogbnVsbCxcclxuICAgIH0sXHJcbiAgICBob21lOiB7XHJcbiAgICAgIGhlcm8sXHJcbiAgICAgIGRlbW8sXHJcbiAgICAgIHNlb0NvbnRlbnRIdG1sLFxyXG4gICAgfSxcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbmF2YmFyLFxyXG4gICAgcm91dGVzOiB7XHJcbiAgICAgIFwiL1wiOiBob21lUm91dGVEYXRhLFxyXG4gICAgICBcIi9ob21lXCI6IGhvbWVSb3V0ZURhdGEsXHJcbiAgICB9LFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBlc2NhcGVIdG1sQXR0cmlidXRlID0gKHZhbHVlOiBzdHJpbmcpID0+XHJcbiAgdmFsdWUucmVwbGFjZSgvJi9nLCBcIiZhbXA7XCIpLnJlcGxhY2UoL1wiL2csIFwiJnF1b3Q7XCIpLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpLnJlcGxhY2UoLz4vZywgXCImZ3Q7XCIpO1xyXG5cclxuY29uc3QgZXNjYXBlSHRtbFRleHQgPSAodmFsdWU6IHN0cmluZykgPT5cclxuICB2YWx1ZVxyXG4gICAgLnJlcGxhY2UoLyYvZywgXCImYW1wO1wiKVxyXG4gICAgLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpXHJcbiAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIilcclxuICAgIC5yZXBsYWNlKC9cIi9nLCBcIiZxdW90O1wiKVxyXG4gICAgLnJlcGxhY2UoLycvZywgXCImIzM5O1wiKTtcclxuXHJcbmNvbnN0IGlzUGF0aEFjdGl2ZSA9IChwYXRobmFtZTogc3RyaW5nLCBocmVmOiBzdHJpbmcpID0+IHtcclxuICBpZiAoaHJlZiA9PT0gXCIvXCIpIHJldHVybiBwYXRobmFtZSA9PT0gXCIvXCI7XHJcbiAgcmV0dXJuIHBhdGhuYW1lID09PSBocmVmIHx8IHBhdGhuYW1lLnN0YXJ0c1dpdGgoYCR7aHJlZn0vYCk7XHJcbn07XHJcblxyXG5jb25zdCByZW5kZXJDaGV2cm9uRG93bkljb24gPSAoKSA9PlxyXG4gICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgY2xhc3M9XCJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biB0cmFuc2l0aW9uLXRyYW5zZm9ybSBkdXJhdGlvbi0yMDBcIj48cGF0aCBkPVwibTYgOSA2IDYgNi02XCI+PC9wYXRoPjwvc3ZnPic7XHJcblxyXG5jb25zdCByZW5kZXJNZW51SWNvbiA9ICgpID0+XHJcbiAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cImx1Y2lkZSBsdWNpZGUtbWVudVwiPjxsaW5lIHgxPVwiNFwiIHgyPVwiMjBcIiB5MT1cIjEyXCIgeTI9XCIxMlwiPjwvbGluZT48bGluZSB4MT1cIjRcIiB4Mj1cIjIwXCIgeTE9XCI2XCIgeTI9XCI2XCI+PC9saW5lPjxsaW5lIHgxPVwiNFwiIHgyPVwiMjBcIiB5MT1cIjE4XCIgeTI9XCIxOFwiPjwvbGluZT48L3N2Zz4nO1xyXG5cclxuY29uc3QgcmVuZGVyQXJyb3dSaWdodEljb24gPSAoKSA9PlxyXG4gICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgY2xhc3M9XCJsdWNpZGUgbHVjaWRlLWFycm93LXJpZ2h0XCI+PHBhdGggZD1cIk01IDEyaDE0XCI+PC9wYXRoPjxwYXRoIGQ9XCJtMTIgNSA3IDctNyA3XCI+PC9wYXRoPjwvc3ZnPic7XHJcblxyXG5jb25zdCByZW5kZXJQbGF5SWNvbiA9ICgpID0+XHJcbiAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cImx1Y2lkZSBsdWNpZGUtcGxheSB0ZXh0LXByaW1hcnkgbWwtMVwiPjxwb2x5Z29uIHBvaW50cz1cIjYgMyAyMCAxMiA2IDIxIDYgM1wiPjwvcG9seWdvbj48L3N2Zz4nO1xyXG5cclxuY29uc3QgYnVpbGRIZXJvSGVhZGluZ01hcmt1cCA9IChoZWFkaW5nOiBzdHJpbmcpID0+IHtcclxuICBjb25zdCBzcGxpdEluZGV4ID0gaGVhZGluZy5pbmRleE9mKFwicXViaVwiKTtcclxuICBpZiAoc3BsaXRJbmRleCA9PT0gLTEpIHJldHVybiBlc2NhcGVIdG1sVGV4dChoZWFkaW5nKTtcclxuXHJcbiAgY29uc3QgYmVmb3JlID0gZXNjYXBlSHRtbFRleHQoaGVhZGluZy5zbGljZSgwLCBzcGxpdEluZGV4KSk7XHJcbiAgY29uc3QgYWZ0ZXIgPSBlc2NhcGVIdG1sVGV4dChoZWFkaW5nLnNsaWNlKHNwbGl0SW5kZXggKyA0KSk7XHJcbiAgcmV0dXJuIGAke2JlZm9yZX08c3BhbiBjbGFzcz1cInRleHQtZ3JhZGllbnRcIj5xdWJpPC9zcGFuPiR7YWZ0ZXJ9YDtcclxufTtcclxuXHJcbmNvbnN0IGJ1aWxkTmF2YmFyTWFya3VwID0gKG5hdmJhcjogTmF2YmFyU2VjdGlvbltdIHwgdW5kZWZpbmVkLCByb3V0ZVBhdGg6IHN0cmluZykgPT4ge1xyXG4gIGNvbnN0IG5hdlNlY3Rpb25zID0gbmF2YmFyID8/IFtdO1xyXG4gIGNvbnN0IGRlc2t0b3BJdGVtcyA9IG5hdlNlY3Rpb25zXHJcbiAgICAubWFwKChzZWN0aW9uKSA9PiB7XHJcbiAgICAgIGlmIChzZWN0aW9uLmhyZWYpIHtcclxuICAgICAgICBjb25zdCBjbGFzc05hbWUgPSBpc1BhdGhBY3RpdmUocm91dGVQYXRoLCBzZWN0aW9uLmhyZWYpXHJcbiAgICAgICAgICA/IFwidGV4dC1zbSBmb250LW1lZGl1bSB0cmFuc2l0aW9uLWNvbG9ycyB0ZXh0LXByaW1hcnlcIlxyXG4gICAgICAgICAgOiBcInRleHQtc20gZm9udC1tZWRpdW0gdHJhbnNpdGlvbi1jb2xvcnMgdGV4dC1tdXRlZC1mb3JlZ3JvdW5kIGhvdmVyOnRleHQtcHJpbWFyeVwiO1xyXG4gICAgICAgIHJldHVybiBgPGEgaHJlZj1cIiR7ZXNjYXBlSHRtbEF0dHJpYnV0ZShzZWN0aW9uLmhyZWYpfVwiIGNsYXNzPVwiJHtjbGFzc05hbWV9XCI+JHtlc2NhcGVIdG1sVGV4dChzZWN0aW9uLnRpdGxlKX08L2E+YDtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgaXNBY3RpdmUgPSBzZWN0aW9uLml0ZW1zLnNvbWUoKGl0ZW0pID0+IGlzUGF0aEFjdGl2ZShyb3V0ZVBhdGgsIGl0ZW0uaHJlZikpO1xyXG4gICAgICBjb25zdCBjbGFzc05hbWUgPSBpc0FjdGl2ZVxyXG4gICAgICAgID8gXCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRyYW5zaXRpb24tY29sb3JzIHRleHQtcHJpbWFyeVwiXHJcbiAgICAgICAgOiBcImZsZXggaXRlbXMtY2VudGVyIGdhcC0xIHRleHQtc20gZm9udC1tZWRpdW0gdHJhbnNpdGlvbi1jb2xvcnMgdGV4dC1tdXRlZC1mb3JlZ3JvdW5kIGhvdmVyOnRleHQtcHJpbWFyeVwiO1xyXG4gICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJyZWxhdGl2ZVwiPjxidXR0b24gY2xhc3M9XCIke2NsYXNzTmFtZX1cIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiBhcmlhLWhhc3BvcHVwPVwibWVudVwiIGFyaWEtbGFiZWw9XCIke2VzY2FwZUh0bWxBdHRyaWJ1dGUoYCR7c2VjdGlvbi50aXRsZX0gbWVudWApfVwiIHR5cGU9XCJidXR0b25cIj4ke2VzY2FwZUh0bWxUZXh0KHNlY3Rpb24udGl0bGUpfSR7cmVuZGVyQ2hldnJvbkRvd25JY29uKCl9PC9idXR0b24+PC9kaXY+YDtcclxuICAgIH0pXHJcbiAgICAuam9pbihcIlwiKTtcclxuXHJcbiAgcmV0dXJuIGA8bmF2IGNsYXNzPVwiZml4ZWQgdG9wLTAgbGVmdC0wIHJpZ2h0LTAgei01MCBiZy1iYWNrZ3JvdW5kLzkwIGJhY2tkcm9wLWJsdXIteGwgYm9yZGVyLWIgYm9yZGVyLWJvcmRlclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIG14LWF1dG8gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGgtWzc2cHhdIHB4LTQgbGc6cHgtOFwiPlxyXG4gICAgICAgIDxhIGhyZWY9XCIvXCIgY2xhc3M9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiIGFyaWEtbGFiZWw9XCJRdWJpIEZsb3cgT3JjaGVzdHJhdG9yIGhvbWVcIj5cclxuICAgICAgICAgIDxpbWcgc3JjPVwiL3NyYy9hc3NldHMvcXViaS1sb2dvLnBuZ1wiIGFsdD1cIlF1YmkgRmxvdyBPcmNoZXN0cmF0b3JcIiB3aWR0aD1cIjEyMFwiIGhlaWdodD1cIjEwMFwiIGNsYXNzPVwiaC0xNCBsZzpoLTE2IHctYXV0b1wiPlxyXG4gICAgICAgIDwvYT5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiaGlkZGVuIG1kOmZsZXggaXRlbXMtY2VudGVyIGdhcC04XCI+JHtkZXNrdG9wSXRlbXN9PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImhpZGRlbiBtZDpibG9ja1wiPlxyXG4gICAgICAgICAgPGEgaHJlZj1cImh0dHBzOi8vbWVldGluZ3MuaHVic3BvdC5jb20vbWFoZXNodlwiIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIiBjbGFzcz1cImlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMiB3aGl0ZXNwYWNlLW5vd3JhcCByb3VuZGVkLW1kIHRleHQtc20gZm9udC1tZWRpdW0gcmluZy1vZmZzZXQtYmFja2dyb3VuZCB0cmFuc2l0aW9uLWNvbG9ycyBmb2N1cy12aXNpYmxlOm91dGxpbmUtbm9uZSBmb2N1cy12aXNpYmxlOnJpbmctMiBmb2N1cy12aXNpYmxlOnJpbmctcmluZyBmb2N1cy12aXNpYmxlOnJpbmctb2Zmc2V0LTIgZGlzYWJsZWQ6cG9pbnRlci1ldmVudHMtbm9uZSBkaXNhYmxlZDpvcGFjaXR5LTUwIFsmYW1wO19zdmddOnBvaW50ZXItZXZlbnRzLW5vbmUgWyZhbXA7X3N2Z106c2l6ZS00IFsmYW1wO19zdmddOnNocmluay0wIGJnLXByaW1hcnkgdGV4dC1wcmltYXJ5LWZvcmVncm91bmQgaG92ZXI6YmctcHJpbWFyeS85MCBzaGFkb3ctZ2xvdyBmb250LXNlbWlib2xkIHRleHQtYmFzZSBoLTExIHJvdW5kZWQtbWQgcHgtOFwiPkJvb2sgYSBEZW1vPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJtZDpoaWRkZW4gcC0yIHRleHQtZm9yZWdyb3VuZFwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGFyaWEtY29udHJvbHM9XCJtb2JpbGUtbmF2aWdhdGlvblwiIGFyaWEtbGFiZWw9XCJPcGVuIG5hdmlnYXRpb24gbWVudVwiIHR5cGU9XCJidXR0b25cIj4ke3JlbmRlck1lbnVJY29uKCl9PC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9uYXY+YDtcclxufTtcclxuXHJcbmNvbnN0IGJ1aWxkSGVyb01hcmt1cCA9IChoZXJvOiBCb290c3RyYXBEYXRhW1wicm91dGVzXCJdIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgaW5mZXIgUm91dGU+ID8gUm91dGUgZXh0ZW5kcyB7IGhvbWU/OiBpbmZlciBIb21lIH0gPyBIb21lIGV4dGVuZHMgeyBoZXJvPzogaW5mZXIgSGVybyB9ID8gSGVybyA6IG5ldmVyIDogbmV2ZXIgOiBuZXZlcikgPT4ge1xyXG4gIGlmICghaGVybykgcmV0dXJuIFwiXCI7XHJcblxyXG4gIGNvbnN0IHNyY1NldCA9IGhlcm8uaW1hZ2U/LnNvdXJjZXMubWFwKChzb3VyY2UpID0+IGAke3NvdXJjZS5zcmN9ICR7c291cmNlLndpZHRofXdgKS5qb2luKFwiLCBcIik7XHJcbiAgY29uc3QgaGVyb0ltYWdlTWFya3VwID0gaGVyby5pbWFnZT8uc3JjXHJcbiAgICA/IGA8ZGl2IGNsYXNzPVwiYW5pbWF0ZS1mYWRlLXVwLWRlbGF5LTIgcmVsYXRpdmVcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJlbGF0aXZlIHJvdW5kZWQtMnhsIG92ZXJmbG93LWhpZGRlbiBzaGFkb3ctY2FyZC1ob3ZlclwiPlxyXG4gICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtlc2NhcGVIdG1sQXR0cmlidXRlKGhlcm8uaW1hZ2Uuc3JjKX1cIiR7c3JjU2V0ID8gYCBzcmNzZXQ9XCIke2VzY2FwZUh0bWxBdHRyaWJ1dGUoc3JjU2V0KX1cImAgOiBcIlwifSR7XHJcbiAgICAgICAgICAgICAgICBoZXJvLmltYWdlLnNpemVzID8gYCBzaXplcz1cIiR7ZXNjYXBlSHRtbEF0dHJpYnV0ZShoZXJvLmltYWdlLnNpemVzKX1cImAgOiBcIlwiXHJcbiAgICAgICAgICAgICAgfSBhbHQ9XCIke2VzY2FwZUh0bWxBdHRyaWJ1dGUoaGVyby5pbWFnZS5hbHQpfVwiIHdpZHRoPVwiJHtoZXJvLmltYWdlLndpZHRofVwiIGhlaWdodD1cIiR7aGVyby5pbWFnZS5oZWlnaHR9XCIgY2xhc3M9XCJ3LWZ1bGwgaC1hdXRvIHJvdW5kZWQtMnhsXCIgZmV0Y2hwcmlvcml0eT1cImhpZ2hcIiBsb2FkaW5nPVwiZWFnZXJcIiBkZWNvZGluZz1cImFzeW5jXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFic29sdXRlIGluc2V0LTAgcm91bmRlZC0yeGwgcmluZy0xIHJpbmctaW5zZXQgcmluZy1wcmltYXJ5LzIwXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+YFxyXG4gICAgOiAnPGRpdiBjbGFzcz1cImFuaW1hdGUtZmFkZS11cC1kZWxheS0yIHJlbGF0aXZlXCI+PC9kaXY+JztcclxuXHJcbiAgcmV0dXJuIGA8c2VjdGlvbiBjbGFzcz1cInJlbGF0aXZlIG1pbi1oLXNjcmVlbiBmbGV4IGl0ZW1zLWNlbnRlciBwdC0yMCBvdmVyZmxvdy1oaWRkZW4gYmctYmFja2dyb3VuZFwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiYWJzb2x1dGUgaW5zZXQtMCBiZy1ncmFkaWVudC1nbG93IHBvaW50ZXItZXZlbnRzLW5vbmVcIj48L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBteC1hdXRvIHB4LTQgbGc6cHgtOCBweS0xMiBsZzpweS0xNlwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJncmlkIGxnOmdyaWQtY29scy0yIGdhcC0xMiBsZzpnYXAtMTYgaXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibWF4LXctMnhsXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbmltYXRlLWZhZGUtdXBcIj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiBweC00IHB5LTEuNSByb3VuZGVkLWZ1bGwgYmctcHJpbWFyeS8xMCB0ZXh0LXByaW1hcnkgdGV4dC1zbSBmb250LW1lZGl1bSBtYi02IGJvcmRlciBib3JkZXItcHJpbWFyeS8yMFwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ3LTIgaC0yIHJvdW5kZWQtZnVsbCBiZy1wcmltYXJ5IGFuaW1hdGUtcHVsc2VcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAke2VzY2FwZUh0bWxUZXh0KGhlcm8uYmFkZ2UpfVxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxoMSBjbGFzcz1cImFuaW1hdGUtZmFkZS11cC1kZWxheS0xIHRleHQtNHhsIHNtOnRleHQtNXhsIGxnOnRleHQtNnhsIGZvbnQtYm9sZCB0cmFja2luZy10aWdodCBsZWFkaW5nLVsxLjFdIHRleHQtZm9yZWdyb3VuZFwiPiR7YnVpbGRIZXJvSGVhZGluZ01hcmt1cChoZXJvLmhlYWRpbmcpfTwvaDE+XHJcbiAgICAgICAgICAgIDxwIGNsYXNzPVwiYW5pbWF0ZS1mYWRlLXVwLWRlbGF5LTIgbXQtNiB0ZXh0LWxnIHNtOnRleHQteGwgdGV4dC1tdXRlZC1mb3JlZ3JvdW5kIGxlYWRpbmctcmVsYXhlZCBtYXgtdy14bFwiPiR7ZXNjYXBlSHRtbFRleHQoaGVyby5zdWJoZWFkaW5nKX08L3A+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbmltYXRlLWZhZGUtdXAtZGVsYXktMyBmbGV4IGZsZXgtd3JhcCBnYXAtNCBtdC0xMFwiPlxyXG4gICAgICAgICAgICAgIDxhIGhyZWY9XCIke2VzY2FwZUh0bWxBdHRyaWJ1dGUoaGVyby5jdGFVcmwpfVwiIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIiBjbGFzcz1cImlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMiB3aGl0ZXNwYWNlLW5vd3JhcCByb3VuZGVkLW1kIHRleHQtc20gZm9udC1tZWRpdW0gcmluZy1vZmZzZXQtYmFja2dyb3VuZCB0cmFuc2l0aW9uLWNvbG9ycyBmb2N1cy12aXNpYmxlOm91dGxpbmUtbm9uZSBmb2N1cy12aXNpYmxlOnJpbmctMiBmb2N1cy12aXNpYmxlOnJpbmctcmluZyBmb2N1cy12aXNpYmxlOnJpbmctb2Zmc2V0LTIgZGlzYWJsZWQ6cG9pbnRlci1ldmVudHMtbm9uZSBkaXNhYmxlZDpvcGFjaXR5LTUwIFsmYW1wO19zdmddOnBvaW50ZXItZXZlbnRzLW5vbmUgWyZhbXA7X3N2Z106c2l6ZS00IFsmYW1wO19zdmddOnNocmluay0wIGJnLXByaW1hcnkgdGV4dC1wcmltYXJ5LWZvcmVncm91bmQgaG92ZXI6YmctcHJpbWFyeS85MCBzaGFkb3ctZ2xvdyBmb250LXNlbWlib2xkIHRleHQtYmFzZSBoLTExIHJvdW5kZWQtbWQgcHgtOCBnYXAtMiBweC04IGgtMTJcIj4ke2VzY2FwZUh0bWxUZXh0KGhlcm8uY3RhTGFiZWwpfSAke3JlbmRlckFycm93UmlnaHRJY29uKCl9PC9hPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgJHtoZXJvSW1hZ2VNYXJrdXB9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9zZWN0aW9uPmA7XHJcbn07XHJcblxyXG5jb25zdCBidWlsZERlbW9NYXJrdXAgPSAoZGVtbzogQm9vdHN0cmFwRGF0YVtcInJvdXRlc1wiXSBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGluZmVyIFJvdXRlPiA/IFJvdXRlIGV4dGVuZHMgeyBob21lPzogaW5mZXIgSG9tZSB9ID8gSG9tZSBleHRlbmRzIHsgZGVtbz86IGluZmVyIERlbW8gfSA/IERlbW8gOiBuZXZlciA6IG5ldmVyIDogbmV2ZXIpID0+IHtcclxuICBjb25zdCB2aWRlb1RpdGxlID0gZGVtbz8udmlkZW9UaXRsZSA/PyBcInF1YmkgUGxhdGZvcm0gRnVsbCBEZW1vXCI7XHJcbiAgY29uc3QgdmlkZW9EdXJhdGlvbiA9IGRlbW8/LnZpZGVvRHVyYXRpb24gPz8gXCIxMiBtaW51dGVzIEVuZC10by1lbmQgZXhlY3V0aW9uIHdhbGt0aHJvdWdoXCI7XHJcblxyXG4gIHJldHVybiBgPHNlY3Rpb24gY2xhc3M9XCJweS0xMiBiZy1zdXJmYWNlLWVsZXZhdGVkIGJvcmRlci15IGJvcmRlci1ib3JkZXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBteC1hdXRvIHB4LTQgbGc6cHgtOFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtYXgtdy00eGwgbXgtYXV0b1wiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJlbGF0aXZlIHJvdW5kZWQtMnhsIGJnLWJhY2tncm91bmQgYm9yZGVyIGJvcmRlci1ib3JkZXIgc2hhZG93LWNhcmQtaG92ZXIgb3ZlcmZsb3ctaGlkZGVuIGFzcGVjdC12aWRlbyBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBncm91cCBjdXJzb3ItcG9pbnRlciBob3Zlcjpib3JkZXItcHJpbWFyeS8zMCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0zMDBcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFic29sdXRlIGluc2V0LTAgYmctZ3JhZGllbnQtdG8tYnIgZnJvbS1wcmltYXJ5LzUgdG8tdHJhbnNwYXJlbnRcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJlbGF0aXZlIHRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInctMjAgaC0yMCByb3VuZGVkLWZ1bGwgYmctcHJpbWFyeS8xMCBib3JkZXIgYm9yZGVyLXByaW1hcnkvMjAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgbXgtYXV0byBtYi00IGdyb3VwLWhvdmVyOmJnLXByaW1hcnkvMjAgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMzAwXCI+XHJcbiAgICAgICAgICAgICAgICAke3JlbmRlclBsYXlJY29uKCl9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPHAgY2xhc3M9XCJ0ZXh0LWZvcmVncm91bmQgZm9udC1zZW1pYm9sZFwiPiR7ZXNjYXBlSHRtbFRleHQodmlkZW9UaXRsZSl9PC9wPlxyXG4gICAgICAgICAgICAgIDxwIGNsYXNzPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kIHRleHQtc20gbXQtMVwiPiR7ZXNjYXBlSHRtbFRleHQodmlkZW9EdXJhdGlvbil9PC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvc2VjdGlvbj5gO1xyXG59O1xyXG5cclxuY29uc3QgYnVpbGREZWZlcnJlZFBsYWNlaG9sZGVyID0gKG1pbkhlaWdodDogc3RyaW5nKSA9PiBgPGRpdiBzdHlsZT1cIm1pbi1oZWlnaHQ6JHtlc2NhcGVIdG1sQXR0cmlidXRlKG1pbkhlaWdodCl9XCI+PC9kaXY+YDtcclxuXHJcbmNvbnN0IGJ1aWxkRm9vdGVyTWFya3VwID0gKCkgPT4ge1xyXG4gIGNvbnN0IGN1cnJlbnRZZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gIHJldHVybiBgPGZvb3RlciBjbGFzcz1cInB5LTEwIGJnLWJhY2tncm91bmQgYm9yZGVyLXQgYm9yZGVyLWJvcmRlclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIG14LWF1dG8gcHgtNCBsZzpweC04XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggZmxleC1jb2wgbWQ6ZmxleC1yb3cgaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBnYXAtNlwiPlxyXG4gICAgICAgICAgPHAgY2xhc3M9XCJ0ZXh0LXNtIHRleHQtbXV0ZWQtZm9yZWdyb3VuZFwiPiZjb3B5OyAke2N1cnJlbnRZZWFyfSBxdWJpIGJ5IFFib3RpY2EuIEFsbCByaWdodHMgcmVzZXJ2ZWQuPC9wPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggaXRlbXMtY2VudGVyIGdhcC04IHRleHQtc20gdGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCI+XHJcbiAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJob3Zlcjp0ZXh0LXByaW1hcnkgdHJhbnNpdGlvbi1jb2xvcnNcIj5Qcml2YWN5IFBvbGljeTwvYT5cclxuICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cImhvdmVyOnRleHQtcHJpbWFyeSB0cmFuc2l0aW9uLWNvbG9yc1wiPlRlcm1zIG9mIFNlcnZpY2U8L2E+XHJcbiAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJob3Zlcjp0ZXh0LXByaW1hcnkgdHJhbnNpdGlvbi1jb2xvcnNcIj5Db250YWN0IFF1Ymk8L2E+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Zvb3Rlcj5gO1xyXG59O1xyXG5cclxuY29uc3QgYnVpbGRIb21lUHJlcmVuZGVyU2hlbGwgPSAoZGF0YTogQm9vdHN0cmFwRGF0YSwgcm91dGVQYXRoOiBzdHJpbmcpID0+IHtcclxuICBjb25zdCBob21lRGF0YSA9IGRhdGEucm91dGVzPy5bcm91dGVQYXRoXT8uaG9tZSA/PyBkYXRhLnJvdXRlcz8uW1wiL1wiXT8uaG9tZTtcclxuICBjb25zdCBoZXJvTWFya3VwID0gYnVpbGRIZXJvTWFya3VwKGhvbWVEYXRhPy5oZXJvKTtcclxuICBjb25zdCBkZW1vTWFya3VwID0gYnVpbGREZW1vTWFya3VwKGhvbWVEYXRhPy5kZW1vKTtcclxuICBjb25zdCBzZW9NYXJrdXAgPSBob21lRGF0YT8uc2VvQ29udGVudEh0bWwgPyBidWlsZEhvbWVTZW9Db250ZW50TWFya3VwKGhvbWVEYXRhLnNlb0NvbnRlbnRIdG1sKSA6IFwiXCI7XHJcblxyXG4gIHJldHVybiBgPGRpdiBjbGFzcz1cIm1pbi1oLXNjcmVlblwiPlxyXG4gICAgICAke2J1aWxkTmF2YmFyTWFya3VwKGRhdGEubmF2YmFyLCByb3V0ZVBhdGgpfVxyXG4gICAgICA8bWFpbiBpZD1cIm1haW4tY29udGVudFwiPlxyXG4gICAgICAgICR7aGVyb01hcmt1cH1cclxuICAgICAgICAke2RlbW9NYXJrdXB9XHJcbiAgICAgICAgJHtidWlsZERlZmVycmVkUGxhY2Vob2xkZXIoXCIyNnJlbVwiKX1cclxuICAgICAgICAke2J1aWxkRGVmZXJyZWRQbGFjZWhvbGRlcihcIjMwcmVtXCIpfVxyXG4gICAgICAgICR7YnVpbGREZWZlcnJlZFBsYWNlaG9sZGVyKFwiMjZyZW1cIil9XHJcbiAgICAgICAgJHtidWlsZERlZmVycmVkUGxhY2Vob2xkZXIoXCIyOHJlbVwiKX1cclxuICAgICAgICAke2J1aWxkRGVmZXJyZWRQbGFjZWhvbGRlcihcIjI4cmVtXCIpfVxyXG4gICAgICAgICR7YnVpbGREZWZlcnJlZFBsYWNlaG9sZGVyKFwiMjZyZW1cIil9XHJcbiAgICAgICAgJHtidWlsZERlZmVycmVkUGxhY2Vob2xkZXIoXCIzMHJlbVwiKX1cclxuICAgICAgICAke2J1aWxkRGVmZXJyZWRQbGFjZWhvbGRlcihcIjI2cmVtXCIpfVxyXG4gICAgICAgICR7c2VvTWFya3VwfVxyXG4gICAgICAgICR7YnVpbGREZWZlcnJlZFBsYWNlaG9sZGVyKFwiMjJyZW1cIil9XHJcbiAgICAgIDwvbWFpbj5cclxuICAgICAgJHtidWlsZEZvb3Rlck1hcmt1cCgpfVxyXG4gICAgPC9kaXY+YDtcclxufTtcclxuXHJcbmNvbnN0IHNlcmlhbGl6ZUJvb3RzdHJhcCA9IChkYXRhOiBCb290c3RyYXBEYXRhKSA9PlxyXG4gIEpTT04uc3RyaW5naWZ5KGRhdGEpLnJlcGxhY2UoLzwvZywgXCJcXFxcdTAwM2NcIikucmVwbGFjZSgvXFx1MjAyOC9nLCBcIlxcXFx1MjAyOFwiKS5yZXBsYWNlKC9cXHUyMDI5L2csIFwiXFxcXHUyMDI5XCIpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluamVjdEJvb3RzdHJhcEludG9IdG1sID0gKFxyXG4gIGh0bWw6IHN0cmluZyxcclxuICBkYXRhOiBCb290c3RyYXBEYXRhLFxyXG4gIG9wdGlvbnM6IHsgcHJlbG9hZEhlcm8/OiBib29sZWFuOyByb3V0ZVBhdGg/OiBzdHJpbmcgfSA9IHt9LFxyXG4pID0+IHtcclxuICBsZXQgb3V0ID0gaHRtbFxyXG4gICAgLnJlcGxhY2UoL1xccyo8c2NyaXB0IGlkPVwicXViaS1ib290c3RyYXAtZGF0YVwiPltcXHNcXFNdKj88XFwvc2NyaXB0Pi9pLCBcIlwiKVxyXG4gICAgLnJlcGxhY2UoL1xccyo8bGluayByZWw9XCJwcmVsb2FkXCIgYXM9XCJpbWFnZVwiW14+XSpkYXRhLXF1YmktaGVyby1wcmVsb2FkPVwidHJ1ZVwiW14+XSo+L2ksIFwiXCIpXHJcbiAgICAucmVwbGFjZSgvXFxzKjxzZWN0aW9uW14+XSpkYXRhLXN0YXRpYy1ob21lLXNlby1jb250ZW50PVwidHJ1ZVwiW1xcc1xcU10qPzxcXC9zZWN0aW9uPi9pLCBcIlwiKTtcclxuXHJcbiAgY29uc3QgaGVyb0ltYWdlID0gZGF0YS5yb3V0ZXM/LltcIi9cIl0/LmhvbWU/Lmhlcm8/LmltYWdlO1xyXG4gIGNvbnN0IHNyY1NldCA9IGhlcm9JbWFnZT8uc291cmNlcy5tYXAoKHNvdXJjZSkgPT4gYCR7c291cmNlLnNyY30gJHtzb3VyY2Uud2lkdGh9d2ApLmpvaW4oXCIsIFwiKTtcclxuICBjb25zdCBwcmVsb2FkTGluayA9XHJcbiAgICBvcHRpb25zLnByZWxvYWRIZXJvICYmIGhlcm9JbWFnZT8uc3JjXHJcbiAgICAgID8gYCAgPGxpbmsgcmVsPVwicHJlbG9hZFwiIGFzPVwiaW1hZ2VcIiBocmVmPVwiJHtlc2NhcGVIdG1sQXR0cmlidXRlKGhlcm9JbWFnZS5zcmMpfVwiJHtcclxuICAgICAgICAgIHNyY1NldCA/IGAgaW1hZ2VzcmNzZXQ9XCIke2VzY2FwZUh0bWxBdHRyaWJ1dGUoc3JjU2V0KX1cImAgOiBcIlwiXHJcbiAgICAgICAgfSR7aGVyb0ltYWdlLnNpemVzID8gYCBpbWFnZXNpemVzPVwiJHtlc2NhcGVIdG1sQXR0cmlidXRlKGhlcm9JbWFnZS5zaXplcyl9XCJgIDogXCJcIn0gZmV0Y2hwcmlvcml0eT1cImhpZ2hcIiBkYXRhLXF1YmktaGVyby1wcmVsb2FkPVwidHJ1ZVwiPlxcbmBcclxuICAgICAgOiBcIlwiO1xyXG4gIGNvbnN0IGJvb3RzdHJhcFNjcmlwdCA9IGAgIDxzY3JpcHQgaWQ9XCJxdWJpLWJvb3RzdHJhcC1kYXRhXCI+d2luZG93Ll9fUVVCSV9CT09UU1RSQVBfXz0ke3NlcmlhbGl6ZUJvb3RzdHJhcChkYXRhKX07PC9zY3JpcHQ+XFxuYDtcclxuICBjb25zdCBwcmVyZW5kZXJIb21lID0gb3B0aW9ucy5yb3V0ZVBhdGggPT09IFwiL1wiIHx8IG9wdGlvbnMucm91dGVQYXRoID09PSBcIi9ob21lXCI7XHJcbiAgY29uc3Qgcm9vdE1hcmt1cCA9IHByZXJlbmRlckhvbWVcclxuICAgID8gYDxkaXYgaWQ9XCJyb290XCIgZGF0YS1wcmVyZW5kZXJlZC1yb3V0ZT1cIiR7ZXNjYXBlSHRtbEF0dHJpYnV0ZShvcHRpb25zLnJvdXRlUGF0aCA/PyBcIi9cIil9XCI+JHtidWlsZEhvbWVQcmVyZW5kZXJTaGVsbChcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIG9wdGlvbnMucm91dGVQYXRoID8/IFwiL1wiLFxyXG4gICAgICApfTwvZGl2PmBcclxuICAgIDogJzxkaXYgaWQ9XCJyb290XCI+PC9kaXY+JztcclxuXHJcbiAgb3V0ID0gb3V0XHJcbiAgICAucmVwbGFjZSgvPGRpdiBpZD1cInJvb3RcIj48XFwvZGl2Pi9pLCByb290TWFya3VwKVxyXG4gICAgLnJlcGxhY2UoXCI8L2hlYWQ+XCIsIGAke3ByZWxvYWRMaW5rfSR7Ym9vdHN0cmFwU2NyaXB0fTwvaGVhZD5gKTtcclxuXHJcbiAgcmV0dXJuIG91dDtcclxufTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpUCxTQUFTLGNBQWMsZUFBNEI7QUFDcFMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixPQUFPLFFBQVE7OztBQ0g4UCxJQUFNLGVBQWUsb0JBQUksSUFBSTtBQUFBLEVBQ3hTO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0YsQ0FBQztBQUVELElBQU0sYUFBYSxDQUFDLFVB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LE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxJQUNYO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDaEI7QUFBQSxNQUNBLFlBQVk7QUFBQSxRQUNWLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNoQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixxQkFBcUIsSUFBSTtBQUFBLElBQ3pCLHVCQUF1QixJQUFJO0FBQUEsRUFDN0IsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxJQUNBLFFBQVEsQ0FBQyxTQUFTLGFBQWEscUJBQXFCLHlCQUF5Qix5QkFBeUIsc0JBQXNCO0FBQUEsRUFDOUg7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGFBQWEsSUFBSTtBQUNmLGdCQUFNLGVBQWUsR0FBRyxRQUFRLE9BQU8sR0FBRztBQUUxQyxjQUNFLGFBQWEsU0FBUyx3QkFBd0IsS0FDOUMsYUFBYSxTQUFTLGtCQUFrQixLQUN4QyxhQUFhLFNBQVMsc0JBQXNCLEtBQzVDLGFBQWEsU0FBUyw4QkFBOEIsS0FDcEQsYUFBYSxTQUFTLDRCQUE0QixHQUNsRDtBQUNBLG1CQUFPO0FBQUEsVUFDVDtBQUVBLGNBQUksQ0FBQyxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBQ2hDLG1CQUFPO0FBQUEsVUFDVDtBQUVBLGNBQUksR0FBRyxTQUFTLFdBQVcsS0FBSyxHQUFHLFNBQVMsY0FBYyxLQUFLLEdBQUcsU0FBUyxTQUFTLEdBQUc7QUFDckYsbUJBQU87QUFBQSxVQUNUO0FBRUEsY0FBSSxHQUFHLFNBQVMsdUJBQXVCLEtBQUssR0FBRyxTQUFTLE9BQU8sR0FBRztBQUNoRSxtQkFBTztBQUFBLFVBQ1Q7QUFFQSxjQUFJLEdBQUcsU0FBUyxXQUFXLEtBQUssR0FBRyxTQUFTLFFBQVEsS0FBSyxHQUFHLFNBQVMsTUFBTSxLQUFLLEdBQUcsU0FBUyxNQUFNLEdBQUc7QUFDbkcsbUJBQU87QUFBQSxVQUNUO0FBRUEsY0FBSSxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBQy9CLG1CQUFPO0FBQUEsVUFDVDtBQUVBLGlCQUFPO0FBQUEsUUFDVDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbInBhdGgiLCAiY2xhc3NOYW1lIiwgImlzT2JqZWN0IiwgInBpY2tMaXN0IiwgImdldFNlb09iamVjdCIsICJwaWNrU3RyaW5nIiwgInNhbml0aXplVGV4dFZhbHVlIiwgInNhbml0aXplVXJsVmFsdWUiLCAicGFnZSIsICJwYWdlU2l6ZSIsICJwYWdlQ291bnQiXQp9Cg==
