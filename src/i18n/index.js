import ar from './ar.json';
import en from './en.json';

export const DICTIONARIES = { ar, en };
export const SUPPORTED_LANGS = ['ar', 'en'];
export const DEFAULT_LANG = 'ar';

// Look up a dot-path key in the dictionary, with fallback to AR, then to the key itself.
export function getString(lang, key, vars) {
  const dict = DICTIONARIES[lang] || DICTIONARIES[DEFAULT_LANG];
  const fallback = DICTIONARIES[DEFAULT_LANG];
  const path = String(key || '').split('.');

  const lookup = (root) => {
    let cur = root;
    for (const p of path) {
      if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
      else return undefined;
    }
    return typeof cur === 'string' ? cur : undefined;
  };

  let val = lookup(dict);
  if (val === undefined) val = lookup(fallback);
  if (val === undefined) return key;

  if (vars && typeof vars === 'object') {
    val = val.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
  }
  return val;
}

// Western digit -> Arabic-Indic digit map for `lang === 'ar'`.
const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function formatNumber(n, lang) {
  const s = String(n);
  if (lang !== 'ar') return s;
  return s.replace(/\d/g, (d) => AR_DIGITS[+d]);
}

// Recursively unwrap `{ ar, en }` translation pairs in any data structure.
// Useful for localizing JSON data files that ship bilingual fields.
export function localizeData(value, lang) {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map((v) => localizeData(v, lang));
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length <= 2 && 'ar' in value && 'en' in value) {
      return value[lang] ?? value.ar;
    }
    const out = {};
    for (const k of keys) out[k] = localizeData(value[k], lang);
    return out;
  }
  return value;
}
