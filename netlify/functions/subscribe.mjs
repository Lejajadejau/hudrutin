import { store, keyFor, json } from "../lib/shared.mjs";
export default async req => {
  const { sub, settings } = await req.json();
  if (!sub || !sub.endpoint) return json({ error: "Prenumeration saknas" }, 400);
  const s = store(), k = keyFor(sub.endpoint);
  const old = (await s.get(k, { type: "json" })) || {};
  await s.setJSON(k, { sub, settings: { morning: "07:00", evening: "21:30", ...settings }, last: old.last || {} });
  return json({ ok: true });
};
export const config = { path: "/api/subscribe" };
