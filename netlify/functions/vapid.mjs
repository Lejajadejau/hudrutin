import { json } from "./_lib.mjs";
export default async () => json({ key: process.env.VAPID_PUBLIC_KEY });
export const config = { path: "/api/vapid" };
