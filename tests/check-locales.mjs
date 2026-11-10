import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ALL, EN, ROOT, SITE, forEachI18n, readTranslations, urlFor } from '../scripts/build-locales.mjs';

const failures = [];
const check = (name, ok, detail = '') => {
  console.log(`[${ok ? 'PASS' : 'FAIL'}] ${name}${ok || !detail ? '' : ` - ${detail}`}`);
  if (!ok) failures.push(name);
};
const unescape = (v) => v.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const one = (html, re) => [...html.matchAll(re)].map((m) => m[1]);

const source = readFileSync(join(ROOT, 'index.html'), 'utf8');
const translations = readTranslations(source);
const expectedHreflang = [
  ...ALL.map((l) => `${l.html}|${urlFor(l)}`),
  `x-default|${urlFor(EN)}`,
].sort();

for (const loc of ALL) {
  const t = translations[loc.code];
  const page = loc.dir ? readFileSync(join(ROOT, loc.dir, 'index.html'), 'utf8') : source;
  const tag = `[${loc.code}]`;

  check(`${tag} html lang and data-page-lang`, page.includes(`<html lang="${loc.html}" data-page-lang="${loc.code}">`));
  check(`${tag} self canonical`, JSON.stringify(one(page, /<link rel="canonical" href="([^"]*)">/g)) === JSON.stringify([urlFor(loc)]));
  check(`${tag} og:url`, one(page, /<meta property="og:url" content="([^"]*)">/g)[0] === urlFor(loc));
  check(`${tag} og:locale`, one(page, /<meta property="og:locale" content="([^"]*)">/g)[0] === loc.og);
  const hreflang = one(page, /<link rel="alternate" hreflang="([^"]*)" href="([^"]*)">/g);
  const pairs = [...page.matchAll(/<link rel="alternate" hreflang="([^"]*)" href="([^"]*)">/g)].map((m) => `${m[1]}|${m[2]}`).sort();
  check(`${tag} hreflang set is complete and identical`, hreflang.length === 9 && JSON.stringify(pairs) === JSON.stringify(expectedHreflang));
  check(`${tag} no ?lang= in head signals`, !/(canonical|hreflang|og:url)[^>]*\?lang=/.test(page));
  check(`${tag} no relative asset references`, !/(href|src|poster)="assets\//.test(page) || !loc.dir);
  check(`${tag} meta description`, one(page, /<meta name="description" content="([^"]*)">/g)[0] === (loc.dir ? t['meta.description'] : one(source, /<meta name="description" content="([^"]*)">/g)[0]));

  let wrong = 0;
  let total = 0;
  forEachI18n(page, (key, inner) => {
    total++;
    const want = t[key];
    if (!want) return inner;
    const got = key === 'hero.h1' ? inner : unescape(inner);
    if (got !== want) {
      wrong++;
      if (wrong <= 3) console.log(`    ${key}: got ${JSON.stringify(got.slice(0, 60))}`);
    }
    return inner;
  });
  check(`${tag} ${total} data-i18n elements match their translation`, wrong === 0 && total > 150, `${wrong} mismatched`);
}

const en = Object.keys(translations.en);
for (const loc of ALL) {
  const missing = en.filter((k) => !translations[loc.code][k]);
  check(`[${loc.code}] translation keys complete`, missing.length === 0, `${missing.length} missing, e.g. ${missing.slice(0, 3).join(', ')}`);
}

const sitemap = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
const locs = one(sitemap, /<loc>([^<]*)<\/loc>/g);
check('sitemap lists exactly the 8 language URLs', JSON.stringify(locs) === JSON.stringify(ALL.map(urlFor)));
check('sitemap has no ?lang= URLs', !sitemap.includes('?lang='));
check('sitemap hreflang matches pages', (sitemap.match(/hreflang="x-default"/g) || []).length === 8);
check('robots.txt points at sitemap', readFileSync(join(ROOT, 'robots.txt'), 'utf8').includes(`Sitemap: ${SITE}/sitemap.xml`));

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log('\nall locale checks passed');
