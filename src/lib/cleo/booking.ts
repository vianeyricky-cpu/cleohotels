import { Branch, safeHttps } from './branches';
import { z } from 'zod';
const propertySchema = z.array(z.object({ id: z.union([z.string(), z.number()]), name: z.string(), reservation_link: z.string() }));
export async function officialBookingUrl(branch: Branch): Promise<string | null> {
  try {
    const response = await fetch('https://api.reserveonline.id/api/public/group-property-list?group=46', { cache: 'no-store', signal: AbortSignal.timeout(6000) });
    if (!response.ok) return null;
    const properties = propertySchema.parse(await response.json());
    const property = properties.find(item => String(item.id) === branch.propertyId);
    // Never silently substitute another property's URL.
    if (!property || !branch.aliases.some(alias => property.name.toLowerCase().includes(alias.replaceAll('-', ' ')))) return null;
    return safeHttps(property.reservation_link);
  } catch { return null; }
}
