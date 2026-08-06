#!/usr/bin/env node
/**
 * Duplicate-content comparison script.
 *
 * Fetches visible text from the sister Acendia sites (acendia.agency,
 * acendia.uk) and from the local acendia.us site (dev/build server must be
 * running), strips markup, and looks for repeated 8-word phrase shingles
 * between them — flagging anything beyond the approved stoplist (brand
 * terms, service category names, the official tagline).
 *
 * Usage:
 *   BASE_URL=http://localhost:3000 node scripts/check-duplicate-content.mjs
 *
 * Output: DUPLICATE_CONTENT_REPORT.md in the repo root.
 */

import { writeFile } from "node:fs/promises";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const SISTER_SITES = [
  { name: "acendia.agency (NZ)", url: "https://acendia.agency" },
  { name: "acendia.uk (UK/AU)", url: "https://acendia.uk" },
];

const LOCAL_PAGES = [
  "/",
  "/about/",
  "/services/",
  "/services/seo/",
  "/services/local-seo/",
  "/services/technical-seo/",
  "/services/google-business-profile-optimization/",
  "/services/website-design/",
  "/services/website-development/",
  "/services/content-marketing/",
  "/services/lead-generation/",
  "/services/conversion-rate-optimization/",
  "/services/multi-location-seo/",
  "/services/ai-digital-marketing/",
  "/locations/",
  "/industries/",
  "/industries/home-services/",
  "/industries/law-firm-seo/",
  "/free-seo-audit/",
  "/contact/",
  "/insights/local-seo-checklist-for-us-small-businesses/",
];

// Terms excluded from duplication flags: brand name, approved tagline,
// service category names, and generic legal/boilerplate language that
// legitimately repeats across any company's marketing site.
const STOPLIST = [
  "acendia",
  "your business our business",
  "search engine optimization",
  "search engine optimisation",
  "google business profile",
  "local seo",
  "technical seo",
  "website design",
  "website development",
  "content marketing",
  "lead generation",
  "conversion rate optimization",
  "multi-location seo",
  "privacy policy",
  "terms of service",
  "all rights reserved",
];

const SHINGLE_SIZE = 8;

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function shingles(text, size = SHINGLE_SIZE) {
  const words = text.split(" ").filter(Boolean);
  const result = new Set();
  for (let i = 0; i <= words.length - size; i++) {
    const phrase = words.slice(i, i + size).join(" ");
    if (STOPLIST.some((term) => phrase.includes(term))) continue;
    result.add(phrase);
  }
  return result;
}

async function fetchText(url) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Acendia-DuplicateContentCheck/1.0" } });
    if (!res.ok) return null;
    const html = await res.text();
    return stripHtml(html);
  } catch (err) {
    console.error(`Failed to fetch ${url}:`, err.message);
    return null;
  }
}

async function main() {
  console.log("Fetching sister site content...");
  const sisterShingles = new Map(); // phrase -> [siteName]
  for (const site of SISTER_SITES) {
    const text = await fetchText(site.url);
    if (!text) continue;
    for (const phrase of shingles(text)) {
      if (!sisterShingles.has(phrase)) sisterShingles.set(phrase, []);
      sisterShingles.get(phrase).push(site.name);
    }
  }
  console.log(`Collected ${sisterShingles.size} unique sister-site shingles.`);

  console.log(`Fetching local pages from ${BASE_URL}...`);
  const findings = [];
  for (const path of LOCAL_PAGES) {
    const text = await fetchText(`${BASE_URL}${path}`);
    if (!text) {
      findings.push({ path, status: "unreachable", matches: [] });
      continue;
    }
    const localShingles = shingles(text);
    const matches = [];
    for (const phrase of localShingles) {
      if (sisterShingles.has(phrase)) {
        matches.push({ phrase, sources: sisterShingles.get(phrase) });
      }
    }
    findings.push({ path, status: "ok", totalShingles: localShingles.size, matches });
  }

  const totalMatches = findings.reduce((sum, f) => sum + f.matches.length, 0);
  const unreachable = findings.filter((f) => f.status === "unreachable");

  let report = `# Duplicate Content Report\n\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += `**Method**: ${SHINGLE_SIZE}-word phrase shingle comparison between acendia.us pages and the sister Acendia sites, excluding a stoplist of brand terms, service category names, and the approved tagline.\n\n`;
  report += `**Sister sites checked**: ${SISTER_SITES.map((s) => s.name).join(", ")}\n\n`;
  report += `**Local pages checked**: ${LOCAL_PAGES.length}\n\n`;
  report += `**Total flagged phrase matches**: ${totalMatches}\n\n`;

  if (unreachable.length) {
    report += `**Unreachable local pages** (server not running at ${BASE_URL}, or page returned an error): ${unreachable.map((f) => f.path).join(", ")}\n\n`;
  }

  report += `---\n\n`;

  if (totalMatches === 0) {
    report += `## Result: No duplicate phrase matches found\n\nNo ${SHINGLE_SIZE}-word phrase from any checked acendia.us page matches text from acendia.agency or acendia.uk, beyond the approved stoplist terms (brand name, tagline, service category names).\n`;
  } else {
    report += `## Flagged matches\n\n`;
    for (const f of findings) {
      if (f.matches.length === 0) continue;
      report += `### ${f.path}\n\n`;
      for (const m of f.matches) {
        report += `- "${m.phrase}" — also found on: ${m.sources.join(", ")}\n`;
      }
      report += `\n`;
    }
  }

  report += `\n---\n\n## Pages checked with no issues\n\n`;
  for (const f of findings) {
    if (f.status === "ok" && f.matches.length === 0) {
      report += `- ${f.path} (${f.totalShingles} unique phrases checked)\n`;
    }
  }

  await writeFile(new URL("../DUPLICATE_CONTENT_REPORT.md", import.meta.url), report, "utf-8");
  console.log(`\nReport written to DUPLICATE_CONTENT_REPORT.md`);
  console.log(`Total flagged matches: ${totalMatches}`);
}

main();
