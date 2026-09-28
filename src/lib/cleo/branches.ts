// Property IDs verified against the existing Omnihotelier group 46 integration.
export const branches = [
  { key: 'tunjungan', name: 'Cleo Tunjungan', propertyId: '296', aliases: ['tunjungan', 'basuki-rahmat'], phone: '+62315323330' },
  { key: 'jemursari', name: 'Cleo Jemursari', propertyId: '297', aliases: ['jemursari'], phone: '+62318483000' },
  { key: 'walikota', name: 'Cleo Walikota Mustajab', propertyId: '298', aliases: ['walikota', 'mustajab', 'balaikota'], phone: '+62315489000' },
] as const;
export type Branch = typeof branches[number];
export function resolveBranch(value?: string | null): Branch | undefined {
  const normalized = (value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const matches = branches.filter(branch => branch.aliases.some(alias => normalized.split('-').join(' ').includes(alias.replaceAll('-', ' '))));
  return matches.length === 1 ? matches[0] : undefined;
}
export function jakartaDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
export function validStay(checkin: string, checkout: string, today = jakartaDate()) {
  const valid = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  return valid(checkin) && valid(checkout) && checkin >= today && checkout > checkin && (Date.parse(checkout) - Date.parse(checkin)) / 86400000 <= 30;
}
export function safeHttps(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; } catch { return null; }
}
