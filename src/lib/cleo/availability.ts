import { z } from 'zod';
import { Branch, validStay, safeHttps } from './branches';
// Contract for an authorized PMS / channel-manager adapter, NOT an invented Omnihotelier endpoint.
const snapshot = z.object({
  propertyId: z.string(), checkin: z.string(), checkout: z.string(), adults: z.number().int(), children: z.number().int(), checkedAt: z.string().datetime(),
  rooms: z.array(z.object({ name: z.string().min(1).max(100), available: z.number().int().nonnegative(), rate: z.number().nonnegative().optional(), currency: z.literal('IDR').optional() })).max(50),
});
export type Stay = { checkin: string; checkout: string; adults: number; children: number };
export function parseAvailability(raw: unknown, branch: Branch, stay: Stay, now = Date.now()) {
  const result = snapshot.safeParse(raw);
  if (!result.success) return null;
  const data = result.data;
  const age = now - Date.parse(data.checkedAt);
  if (data.propertyId !== branch.propertyId || data.checkin !== stay.checkin || data.checkout !== stay.checkout || data.adults !== stay.adults || data.children !== stay.children || age < -30000 || age > 120000) return null;
  return data;
}
export async function getAvailability(branch: Branch, stay: Stay) {
  if (!validStay(stay.checkin, stay.checkout)) return null;
  const endpoint = safeHttps(process.env[`AVAILABILITY_${branch.key.toUpperCase()}_URL`]);
  const token = process.env[`AVAILABILITY_${branch.key.toUpperCase()}_TOKEN`];
  if (!endpoint || !token) return null;
  try {
    const response = await fetch(endpoint, { method: 'POST', cache: 'no-store', redirect: 'error', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ propertyId: branch.propertyId, ...stay }), signal: AbortSignal.timeout(7000) });
    return response.ok ? parseAvailability(await response.json(), branch, stay) : null;
  } catch { return null; }
}
