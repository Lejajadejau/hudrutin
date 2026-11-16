import { store, push, stockholmNow, message } from "./_lib.mjs";
const toMin = t => { const [h, m] = (t || "0:0").split(":").map(Number); return h * 60 + m; };
export default async () => {
  const s = store(), now = stockholmNow();
  const { blobs } = await s.list();
  for (const { key } of blobs) {
    const rec = await s.get(key, { type: "json" });
    if (!rec) continue;
    let changed = false;
    for (const slot of ["m", "e"]) {
      const t = toMin(slot === "m" ? rec.settings.morning : rec.settings.evening);
      if (now.minutes >= t && now.minutes < t + 60 && rec.last[slot] !== now.date) {
        try {
          await push(rec.sub, message(slot, now.date, rec.settings.acidStart));
          rec.last[slot] = now.date; changed = true;
        } catch (e) {
          if (e.statusCode === 404 || e.statusCode === 410) { await s.delete(key); changed = false; break; }
          console.log("push error", e.statusCode, e.body);
        }
      }
    }
    if (changed) await s.setJSON(key, rec);
  }
};
export const config = { schedule: "*/5 * * * *" };
