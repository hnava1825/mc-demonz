// Language helpers.
//
// Content fields in club.json / teams.json may be either a plain string
// (same in both languages, e.g. a proper noun) or an object like
// { "en": "...", "es": "..." }. pick() handles both and falls back to
// English when a Spanish string is missing, so a half-translated file
// still renders.

export const LANGS = ["en", "es"];
export const LANG_LABEL = { en: "EN", es: "ES" };

export function pick(value, lang) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[lang] ?? value.en ?? "";
  }
  return value ?? "";
}

/** fill("{team} roster", { team: "8U" }) -> "8U roster" */
export function fill(template, vars) {
  return String(template).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}

function localDate(isoDate, hhmm) {
  // Build in local time. new Date("2026-08-22") would parse as UTC and
  // can land on the previous day west of Greenwich.
  return new Date(`${isoDate}T${hhmm || "12:00"}:00`);
}

export function fmtDate(isoDate, locale) {
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" })
    .format(localDate(isoDate));
}

export function fmtDay(isoDate, locale) {
  return new Intl.DateTimeFormat(locale, { weekday: "short" })
    .format(localDate(isoDate));
}

export function fmtTime(isoDate, hhmm, locale) {
  if (!hhmm) return null;
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" })
    .format(localDate(isoDate, hhmm));
}

/** A clock time with no date attached, e.g. "5:30 PM" / "5:30 p.m." */
export function fmtClock(hhmm, locale) {
  if (!hhmm) return "";
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" })
    .format(new Date(`2026-01-04T${hhmm}:00`));
}

/** 0 = Sunday … 6 = Saturday. Jan 4 2026 was a Sunday. */
export function fmtWeekday(index, locale, style = "long") {
  const d = new Date(2026, 0, 4 + Number(index));
  const s = new Intl.DateTimeFormat(locale, { weekday: style }).format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);   // Spanish returns lowercase
}
