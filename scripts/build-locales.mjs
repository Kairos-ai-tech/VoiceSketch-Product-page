import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const SITE = 'https://voicesketch.kairosaitech.com';
export const LASTMOD = '2026-11-10';

export const EN = { code: 'en', dir: '', html: 'en', og: 'en_US', label: 'English' };
export const LOCALES = [
  { code: 'zh-TW', dir: 'zh-tw', html: 'zh-Hant', og: 'zh_TW' },
  { code: 'zh-CN', dir: 'zh-cn', html: 'zh-Hans', og: 'zh_CN' },
  { code: 'ja', dir: 'ja', html: 'ja', og: 'ja_JP' },
  { code: 'ko', dir: 'ko', html: 'ko', og: 'ko_KR' },
  { code: 'fr', dir: 'fr', html: 'fr', og: 'fr_FR' },
  { code: 'es', dir: 'es', html: 'es', og: 'es_ES' },
  { code: 'it', dir: 'it', html: 'it', og: 'it_IT' },
];
export const ALL = [EN, ...LOCALES];

export const urlFor = (loc) => `${SITE}/${loc.dir ? `${loc.dir}/` : ''}`;

export function readTranslations(src) {
  const marker = 'const translations = {';
  const start = src.indexOf(marker);
  if (start < 0) throw new Error('translations object not found');
  const open = start + marker.length - 1;
  let depth = 0;
  let quote = null;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = null;
    } else if (c === '"' || c === "'" || c === '`') {
      quote = c;
    } else if (c === '{') {
      depth++;
    } else if (c === '}' && --depth === 0) {
      return vm.runInNewContext(`(${src.slice(open, i + 1)})`);
    }
  }
  throw new Error('translations object is not closed');
}

export const escapeHtml = (v) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttr = (v) => escapeHtml(v).replace(/"/g, '&quot;');

export function forEachI18n(html, visit) {
  const open = /<([a-zA-Z][\w-]*)\b[^<>]*?\sdata-i18n="([^"]+)"[^<>]*>/g;
  let out = '';
  let last = 0;
  let m;
  while ((m = open.exec(html))) {
    const tag = m[1];
    const innerStart = m.index + m[0].length;
    const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
    re.lastIndex = innerStart;
    let depth = 1;
    let close = -1;
    let r;
    while ((r = re.exec(html))) {
      depth += r[1] ? -1 : 1;
      if (depth === 0) {
        close = r.index;
        break;
      }
    }
    if (close < 0) throw new Error(`unclosed <${tag}> for ${m[2]}`);
    out += html.slice(last, innerStart) + visit(m[2], html.slice(innerStart, close));
    last = close;
    open.lastIndex = close;
  }
  return out + html.slice(last);
}

function setMeta(html, attr, name, value) {
  const re = new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`meta ${name} not found`);
  return html.replace(re, (_, a, b) => `${a}${escapeAttr(value)}${b}`);
}

export function buildPage(src, translations, loc) {
  const t = translations[loc.code];
  const page = forEachI18n(src, (key, inner) => {
    const v = t[key];
    if (!v) return inner;
    return key === 'hero.h1' ? v : escapeHtml(v);
  });
  let html = page
    .replace('<html lang="en" data-page-lang="en">', `<html lang="${loc.html}" data-page-lang="${loc.code}">`)
    .replace(/(href|src|poster)="assets\//g, '$1="/assets/')
    .replace(
      '<link rel="canonical" href="https://voicesketch.kairosaitech.com/">',
      `<link rel="canonical" href="${urlFor(loc)}">`,
    );
  html = setMeta(html, 'name', 'description', t['meta.description']);
  html = setMeta(html, 'property', 'og:title', t['meta.title']);
  html = setMeta(html, 'property', 'og:description', t['meta.description']);
  html = setMeta(html, 'property', 'og:url', urlFor(loc));
  html = setMeta(html, 'name', 'twitter:title', t['meta.title']);
  html = setMeta(html, 'name', 'twitter:description', t['meta.description']);
  const localeLines = [loc, ...ALL.filter((l) => l.code !== loc.code)]
    .map((l, i) => `    <meta property="og:locale${i ? ':alternate' : ''}" content="${l.og}">`)
    .join('\n');
  html = html.replace(/    <meta property="og:locale" content="[^"]*">(\n    <meta property="og:locale:alternate" content="[^"]*">)+/, localeLines);
  return html;
}

export function buildSitemap() {
  const alternates = [...ALL.map((l) => `        <xhtml:link rel="alternate" hreflang="${l.html}" href="${urlFor(l)}"/>`), `        <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(EN)}"/>`].join('\n');
  const entry = (loc) => {
    const image = loc.code === 'en'
      ? `        <image:image>
            <image:loc>${SITE}/assets/logo.png</image:loc>
            <image:title>VoiceSketch App Logo</image:title>
            <image:caption>VoiceSketch - Transform Voice into Visual Learning</image:caption>
        </image:image>\n`
      : '';
    return `    <url>
        <loc>${urlFor(loc)}</loc>
        <lastmod>${LASTMOD}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${loc.code === 'en' ? '1.0' : '0.9'}</priority>
${image}${alternates}
    </url>`;
  };
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${ALL.map(entry).join('\n')}
</urlset>
`;
}

export function syncEnglish(src, translations) {
  return forEachI18n(src, (key, inner) => {
    const v = translations.en[key];
    if (!v) return inner;
    return key === 'hero.h1' ? v : escapeHtml(v);
  });
}

export function buildAll() {
  const src = readFileSync(join(ROOT, 'index.html'), 'utf8');
  const translations = readTranslations(src);
  const files = new Map();
  files.set('index.html', syncEnglish(src, translations));
  for (const loc of LOCALES) files.set(`${loc.dir}/index.html`, buildPage(src, translations, loc));
  files.set('sitemap.xml', buildSitemap());
  return files;
}

function main() {
  const check = process.argv.includes('--check');
  const stale = [];
  for (const [rel, content] of buildAll()) {
    const path = join(ROOT, rel);
    const current = existsSync(path) ? readFileSync(path, 'utf8') : null;
    if (current === content) continue;
    if (check) {
      stale.push(rel);
    } else {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content);
      console.log(`wrote ${rel}`);
    }
  }
  if (stale.length) {
    console.error(`stale generated files (run: node scripts/build-locales.mjs):\n  ${stale.join('\n  ')}`);
    process.exit(1);
  }
  if (check) console.log('generated locale pages are up to date');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
