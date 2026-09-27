# MC Demonz FC — club site

Static site, no build step. Plain HTML, CSS, and ES modules reading from JSON.
English and Spanish.

## Running it in WebStorm

Open the folder as a project, then right-click `index.html` and choose
**Open in Browser**. That serves it on WebStorm's built-in server
(`localhost:63342`), which is required — the page fetches JSON, and browsers
block `fetch()` over `file://`. Double-clicking the file shows an error
message saying the same thing.

## Layout

```
index.html          markup shell — no content, no data
css/styles.css      all styling; palette lives in :root at the top
js/app.js           loads JSON, hash routing, team + language state
js/render.js        one render function per section
js/i18n.js          string picking, templating, date/time formatting
data/i18n.json      every UI label, in both languages
data/club.json      hero text, news, photos, footer contact
data/teams.json     staff, roster, and fixtures for each team
img/                photo files (referenced by data/club.json)
```

## Language

The EN/ES toggle sits in the header. It remembers the choice in
`localStorage`, and on a first visit it follows the browser's language, so a
Spanish-language phone lands on Spanish.

Two kinds of text:

**UI labels** live in `data/i18n.json` — nav, table headers, roles,
positions, result letters. Edit them there once and they change everywhere.

**Content** lives in `club.json` and `teams.json` as either a plain string or
a pair:

```json
"heroTitle": { "en": "Two squads, one field", "es": "Dos equipos, una cancha" }
```

A plain string is used as-is in both languages — right for proper nouns like
`"Somerton Sting"`. If the `es` key is missing, English shows instead, so a
half-translated file still works.

Dates and times are formatted by the browser from the ISO values, so
`2026-09-05` renders as *Sep 5* or *5 sep* with nothing to translate. Result
letters map through `results` in `i18n.json` — W/L/D become G/P/E in Spanish.

## Weekly updates

Almost everything you'll change is in `data/teams.json`.

**After a match** — find the fixture and set:

```json
{ "status": "played", "result": "W 4-2" }
```

Then set the following week's fixture to `"status": "next"` and update the
`record` block. Always write the result with the English letter — `W`, `L`,
or `D`. That letter drives both the color and the Spanish translation.

**Fixture fields**

| Field | Notes |
|---|---|
| `date` | ISO, `"2026-09-05"` |
| `time` | 24-hour, `"09:00"`, or `null` for TBD |
| `home` | `true`, `false`, or `null` for a bye |
| `status` | `played`, `next`, `upcoming`, or `bye` |
| `result` | `"W 4-2"` style; empty until played |

**Practices** — each team has a `practices` array on the Schedule page:

```json
{ "weekday": 2, "start": "17:30", "end": "18:45", "location": "Demonz Field 2" }
```

`weekday` is 0 for Sunday through 6 for Saturday. Times are 24-hour; the
browser formats both the day name and the clock time per language. Add or
remove entries freely — a team with three practice days just gets three rows,
and an empty array shows "No practices scheduled."

**Staff** — `role` is a key, not a label: `head`, `assistant`, `parent`, or
`manager`. The display name comes from `roles` in `i18n.json`. Same idea for
player `position`: `keeper`, `defender`, `midfield`, `forward`. `bio` and
`contact` are optional; leave them empty and the card just shows name and
role.

**Adding a photo** — drop the file in `img/`, then add an entry to `photos`
in `club.json` with `"src": "img/filename.jpg"`. An empty `src` renders a
dashed placeholder box.

**Adding a third team** — add a key under `teams` and add that key to
`order`. The switcher and home page both build from `order`, so no code
changes.

## Deploying

Copy the folder to any static host — GitHub Pages, Netlify, or a plain web
directory. No server-side anything.

## Known placeholders

Team names, players, opponents, venues, phone numbers, and the whole fixture
list are made up. Real so far: the 8U and 9U coaching staff. Replace the rest
in `data/` before this goes anywhere public.
