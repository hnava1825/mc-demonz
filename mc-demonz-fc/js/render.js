// Rendering. Every function takes (data, S) where S is the string table
// for the active language, and writes into one element.
// Nothing here fetches or routes — see app.js for that.

import {
  pick, fill, fmtDate, fmtDay, fmtTime, fmtClock, fmtWeekday,
  LANGS, LANG_LABEL
} from "./i18n.js";

const $ = (id) => document.getElementById(id);

/** Escape text before it goes into innerHTML. */
export function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

export function nextFixture(team) {
  return team.fixtures.find((f) => f.status === "next")
      || team.fixtures.find((f) => f.status === "upcoming")
      || null;
}

function teamLabel(team, lang) {
  return `${team.short} ${pick(team.name, lang)}`;
}

/** "Next: vs Somerton Sting, Sep 5 at 9:00 AM" */
function nextLine(team, S, lang) {
  const f = nextFixture(team);
  if (!f) return S.noMatch;
  return fill(S.nextLine, {
    ha: f.home ? S.vs : S.away,
    opponent: pick(f.opponent, lang),
    date: fmtDate(f.date, S.locale),
    time: fmtTime(f.date, f.time, S.locale) || S.status.tbd
  });
}

/* ---------- chrome ---------- */

export function renderLangToggle(lang, onPick) {
  const box = $("lang");
  box.innerHTML = LANGS.map((code) =>
    `<button type="button" data-lang="${code}" aria-pressed="${code === lang}" lang="${code}">` +
    `${LANG_LABEL[code]}</button>`).join("");
  box.querySelectorAll("button").forEach((b) =>
    b.addEventListener("click", () => onPick(b.dataset.lang)));
}

export function renderStatic(S) {
  document.querySelectorAll(".nav a").forEach((a) => {
    a.textContent = S.nav[a.dataset.nav];
  });
  $("showing-label").textContent = S.showing;
  $("subhead-squads").textContent = S.pickSquad;
  $("subhead-news").textContent = S.clubNews;
  $("coaches-lede").textContent = S.coachesLede;
  $("photos-title").textContent = S.photosTitle;
  $("photos-lede").textContent = S.photosLede;
  $("th-date").textContent = S.th.date;
  $("th-match").textContent = S.th.match;
  $("th-kickoff").textContent = S.th.kickoff;
  $("th-result").textContent = S.th.result;
  $("sched-caption").textContent = S.schedCaption;
}

export function renderChrome(club, S, lang) {
  document.title = `${club.name} — 8U & 9U`;
  $("hero-title").textContent = pick(club.heroTitle, lang);
  $("hero-sub").textContent = pick(club.heroSub, lang);

  $("club-news").innerHTML = club.news.map((n) =>
    `<li><time datetime="${esc(n.date)}">${esc(fmtDate(n.date, S.locale))}</time>` +
    `<span>${esc(pick(n.text, lang))}</span></li>`).join("");

  const c = club.contact;
  $("foot").innerHTML =
    `<div>${esc(club.name)} — ${esc(c.location)}<br>${esc(c.email)} · ${esc(c.phone)}</div>` +
    `<div>${esc(S.practicesAt)} ${esc(c.practiceField)}<br>${esc(pick(c.rainoutNote, lang))}</div>`;
}

export function renderSwitcher(data, active, onPick) {
  const seg = $("seg");
  seg.innerHTML = data.order.map((key) =>
    `<button type="button" data-team="${esc(key)}" aria-pressed="${key === active}">` +
    `${esc(data.teams[key].short)}</button>`).join("");
  seg.querySelectorAll("button").forEach((b) =>
    b.addEventListener("click", () => onPick(b.dataset.team)));
}

export function renderDuo(data, S, lang, onPick) {
  const duo = $("duo");
  duo.innerHTML = data.order.map((key) => {
    const t = data.teams[key];
    return `<a href="#schedule" data-team="${esc(key)}">` +
      `<div class="num">${esc(t.short)}</div>` +
      `<div class="nm">${esc(pick(t.name, lang))}</div>` +
      `<div class="fx">${esc(nextLine(t, S, lang))}</div></a>`;
  }).join("");
  duo.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => onPick(a.dataset.team)));
}

/* ---------- sections ---------- */

export function renderCoaches(team, S, lang) {
  $("coach-title").textContent = fill(S.staffTitle, { team: teamLabel(team, lang) });

  // bio and contact are optional — an empty string leaves the line out
  $("staff").innerHTML = team.staff.map((p) => {
    const role = S.roles[p.role] || pick(p.role, lang);
    const bio = pick(p.bio, lang);
    const contact = pick(p.contact, lang);
    const support = p.role === "parent" || p.role === "manager";
    return `<article class="person${support ? " support" : ""}">` +
      `<div class="badge" aria-hidden="true">${esc(p.initials)}</div>` +
      `<div><h3>${esc(p.name)}</h3>` +
      `<div class="role">${esc(role)}</div>` +
      (bio ? `<p>${esc(bio)}</p>` : "") +
      (contact ? `<a href="#">${esc(contact)}</a>` : "") +
      `</div></article>`;
  }).join("");

  const noteText = pick(team.staffNote, lang);
  const note = $("staff-note");
  note.textContent = noteText;
  note.hidden = !noteText;
}

export function renderRoster(team, S, lang) {
  $("roster-title").textContent = fill(S.rosterTitle, { team: teamLabel(team, lang) });
  $("roster-lede").textContent = pick(team.rosterLede, lang);
  $("players").innerHTML = team.players.map((p) => {
    const pos = S.positions[p.position] || pick(p.position, lang);
    return `<div class="player"><div class="shirt">${esc(p.number)}</div>` +
      `<div><b>${esc(p.name)}</b><span>${esc(pos)}</span></div></div>`;
  }).join("");
}

export function renderPractices(team, S, lang) {
  $("practices-title").textContent = S.practicesTitle;
  $("matches-title").textContent = S.matchesTitle;

  const rows = team.practices || [];
  if (!rows.length) {
    $("practices").innerHTML = `<li class="empty">${esc(S.noPractices)}</li>`;
    return;
  }

  $("practices").innerHTML = rows.map((p) => {
    const when = fill(S.timeRange, {
      start: fmtClock(p.start, S.locale),
      end: fmtClock(p.end, S.locale)
    });
    return `<li><b>${esc(fmtWeekday(p.weekday, S.locale))}</b>` +
      `<span class="when">${esc(when)}</span>` +
      `<span class="where">${esc(pick(p.location, lang))}</span></li>`;
  }).join("");
}

export function renderSchedule(team, S, lang) {
  $("sched-title").textContent = fill(S.scheduleTitle, { team: teamLabel(team, lang) });

  const f = nextFixture(team);
  $("next").innerHTML = f
    ? `<div class="next-when">${esc(fmtDay(f.date, S.locale))}, ` +
      `${esc(fmtDate(f.date, S.locale))} — ${esc(fmtTime(f.date, f.time, S.locale) || S.status.tbd)}</div>` +
      `<div class="next-fixture">${esc(fill(S.nextHeadline, {
        ha: f.home ? S.vs : S.away, opponent: pick(f.opponent, lang)
      }))}</div>` +
      `<div class="next-where"><strong>${esc(pick(f.venue, lang))}</strong> — ${esc(S.arriveEarly)}</div>`
    : `<div class="next-fixture">${esc(S.seasonComplete)}</div>`;

  const r = team.record;
  $("record").innerHTML = [
    [r.wins, S.record.wins], [r.losses, S.record.losses],
    [r.draws, S.record.draws], [r.goalsFor, S.record.goalsFor]
  ].map(([n, l]) => `<div><b>${esc(n)}</b><span>${esc(l)}</span></div>`).join("");

  $("fixtures").innerHTML = team.fixtures.map((x) => {
    let result;
    if (x.status === "next") {
      result = `<span class="result" data-r="TBD">${esc(S.status.next)}</span>`;
    } else if (x.status === "bye") {
      result = `<span class="result" data-r="TBD">—</span>`;
    } else if (x.result) {
      const code = x.result[0];                       // W / L / D drives the color
      const shown = (S.results[code] || code) + x.result.slice(1);
      result = `<span class="result" data-r="${esc(code)}">${esc(shown)}</span>`;
    } else {
      result = `<span class="result" data-r="TBD">${esc(S.status.notPlayed)}</span>`;
    }

    const ha = x.home === null ? ""
      : `<span class="ha${x.home ? " home" : ""}">${esc(x.home ? S.homeMark : S.awayMark)}</span>`;

    const time = x.status === "bye" ? "—"
      : (fmtTime(x.date, x.time, S.locale) || S.status.tbd);

    return `<tr${x.status === "next" ? ' data-state="next"' : ""}>` +
      `<td class="date"><b>${esc(fmtDate(x.date, S.locale))}</b>` +
      `<span>${esc(fmtDay(x.date, S.locale))}</span></td>` +
      `<td class="opp">${ha}<b>${esc(pick(x.opponent, lang))}</b> ` +
      `<span class="venue">${esc(pick(x.venue, lang))}</span></td>` +
      `<td>${esc(time)}</td><td>${result}</td></tr>`;
  }).join("");
}

export function renderPhotos(club, S, lang) {
  $("gallery").innerHTML = club.photos.map((p) => {
    const caption = pick(p.caption, lang);
    const inner = p.src
      ? `<img src="${esc(p.src)}" alt="${esc(caption)}" loading="lazy">`
      : esc(S.photoAlt);
    return `<figure><div class="frame">${inner}</div>` +
           `<figcaption>${esc(caption)}</figcaption></figure>`;
  }).join("");
}
