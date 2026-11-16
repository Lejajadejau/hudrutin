import { json, vapidKeys } from "./_lib.mjs";
export default async () => json({ key: (await vapidKeys()).publicKey });
export const config = { path: "/api/vapid" };
