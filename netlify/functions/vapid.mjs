import { json, vapidKeys } from "../lib/shared.mjs";
export default async () => json({ key: (await vapidKeys()).publicKey });
export const config = { path: "/api/vapid" };
