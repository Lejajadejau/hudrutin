import * as wp from "web-push";
const webpush = wp.default ?? wp;
import { getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";

export const store = () => getStore("subscriptions");
export const keyFor = endpoint => createHash("sha256").update(endpoint).digest("hex");
export const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });

export function push(sub, payload) {
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:wellanjohan@gmail.com", process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
  return webpush.sendNotification(sub, JSON.stringify(payload), { TTL: 3600, urgency: "high" });
}

/* Samma schema som i appen: vecka 1–2 sön, vecka 3–6 ons+sön, sedan även fre */
export function isAcid(dateStr, acidStart) {
  if (!acidStart) return false;
  const p = s => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d); };
  const days = Math.round((p(dateStr) - p(acidStart)) / 864e5);
  if (days < 0) return false;
  const w = Math.floor(days / 7), dow = new Date(p(dateStr)).getUTCDay();
  if (w < 2) return dow === 0;
  if (w < 6) return dow === 0 || dow === 3;
  return dow === 0 || dow === 3 || dow === 5;
}

export function stockholmNow() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()).map(p => [p.type, p.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

export function message(slot, date, acidStart) {
  if (slot === "m") return { title: "God morgon", body: "Dags för morgonrutinen. Tryck när du är redo.", url: "/?start=m", tag: "morgon" };
  return isAcid(date, acidStart)
    ? { title: "Dags för kvällsrutinen", body: "Ikväll är det mjölksyrakväll. Tryck när du är redo.", url: "/?start=e", tag: "kvall" }
    : { title: "Dags för kvällsrutinen", body: "Tvätta, masken, Epiduo, nattkräm. Tryck när du är redo.", url: "/?start=e", tag: "kvall" };
}
