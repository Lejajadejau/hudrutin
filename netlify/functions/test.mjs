import { push, json, stockholmNow } from "./_lib.mjs";
export default async req => {
  const { sub } = await req.json();
  try {
    await push(sub, { title: "Det fungerar", body: "Så här ser påminnelsen ut. Tryck för att öppna appen.", url: "/", tag: "test" });
    return json({ ok: true });
  } catch (e) { return json({ error: String(e.statusCode || e.message) }, 500); }
};
export const config = { path: "/api/test" };
