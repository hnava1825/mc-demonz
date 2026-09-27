// Entry point. Loads the JSON, wires hash routing, keeps the selected
// team and language.

import { LANGS } from "./i18n.js";
import {
  renderStatic, renderChrome, renderLangToggle, renderSwitcher, renderDuo,
  renderCoaches, renderRoster, renderPractices, renderSchedule, renderPhotos
} from "./render.js";

const PAGES = ["home", "coaches", "roster", "schedule", "photos"];
const TEAM_PAGES = ["coaches", "roster", "schedule"];
const TEAM_KEY = "demonz.team";
const LANG_KEY = "demonz.lang";

const state = { club: null, data: null, strings: null, team: null, lang: "en", page: "home" };

async function getJSON(path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${path} returned ${res.status}`);
  return res.json();
}

function remember(key, value) {
  try { localStorage.setItem(key, value); } catch { /* private mode */ }
}

function recall(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

/** Default to Spanish if that is what the browser asks for. */
function initialLang() {
  const saved = recall(LANG_KEY);
  if (LANGS.includes(saved)) return saved;
  const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
  return LANGS.includes(nav) ? nav : "en";
}

function setLang(lang) {
  if (!LANGS.includes(lang)) return;
  state.lang = lang;
  document.documentElement.lang = lang;
  remember(LANG_KEY, lang);
  paint();
}

function setTeam(key) {
  if (!state.data.teams[key]) return;
  state.team = key;
  remember(TEAM_KEY, key);
  paint();
}

function goto(key) {
  state.page = PAGES.includes(key) ? key : "home";
  PAGES.forEach((p) => { document.getElementById(p).hidden = p !== state.page; });
  document.querySelectorAll(".nav a").forEach((a) =>
    a.setAttribute("aria-current", a.dataset.nav === state.page ? "page" : "false"));
  document.getElementById("switcher").hidden = !TEAM_PAGES.includes(state.page);
}

function paint() {
  const S = state.strings[state.lang];
  const team = state.data.teams[state.team];

  renderLangToggle(state.lang, setLang);
  renderStatic(S);
  renderChrome(state.club, S, state.lang);
  renderPhotos(state.club, S, state.lang);
  renderSwitcher(state.data, state.team, setTeam);
  renderDuo(state.data, S, state.lang, setTeam);
  renderCoaches(team, S, state.lang);
  renderRoster(team, S, state.lang);
  renderPractices(team, S, state.lang);
  renderSchedule(team, S, state.lang);
}

function fail(err) {
  console.error(err);
  const S = state.strings ? state.strings[state.lang] : null;
  const boot = document.getElementById("boot");
  boot.className = "error";
  boot.innerHTML = S
    ? `<b>${S.loadErrorTitle}</b><br>${S.loadErrorBody}`
    : "<b>Could not load the team data.</b><br>Open this through a web server, " +
      "not by double-clicking the file — in WebStorm, right-click " +
      "<code>index.html</code> and choose Open in Browser.";
}

async function init() {
  try {
    const [strings, club, data] = await Promise.all([
      getJSON("data/i18n.json"),
      getJSON("data/club.json"),
      getJSON("data/teams.json")
    ]);
    state.strings = strings;
    state.club = club;
    state.data = data;

    state.lang = initialLang();
    document.documentElement.lang = state.lang;

    const savedTeam = recall(TEAM_KEY);
    state.team = data.teams[savedTeam] ? savedTeam : data.order[0];

    paint();
    document.getElementById("boot").remove();

    window.addEventListener("hashchange", () => goto(location.hash.slice(1)));
    goto(location.hash ? location.hash.slice(1) : "home");
  } catch (err) {
    fail(err);
  }
}

init();
