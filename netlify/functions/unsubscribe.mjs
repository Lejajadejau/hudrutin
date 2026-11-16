import { store, keyFor, json } from "../lib/shared.mjs";
export default async req => {
  const { endpoint } = await req.json();
  if (endpoint) await store().delete(keyFor(endpoint));
  return json({ ok: true });
};
export const config = { path: "/api/unsubscribe" };
