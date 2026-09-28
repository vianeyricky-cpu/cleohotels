import { z } from 'zod';
import { safeHttps } from './branches';
const hotspot = z.object({ id: z.string().uuid(), target: z.string().uuid(), label: z.string().trim().min(1).max(80), pitch: z.number().min(-90).max(90), yaw: z.number().min(-180).max(180) });
const targetId = z.string().trim().min(1).max(120);
export const placementSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('hotel') }),
  z.object({ type: z.literal('room'), targetId }),
  z.object({ type: z.literal('facility'), targetId }),
]);
export type TourPlacement = z.infer<typeof placementSchema>;
export const sceneSchema = z.object({ id: z.string().uuid(), title: z.string().trim().min(1).max(100), panorama: z.string().refine(v => !!safeHttps(v), 'Use an HTTPS panorama URL'), pitch: z.number().min(-90).max(90).default(0), yaw: z.number().min(-180).max(180).default(0), hotspots: z.array(hotspot).max(30).default([]), placement: placementSchema.default({ type: 'hotel' }) });
export const tourSchema = z.array(sceneSchema).max(40).superRefine((scenes, ctx) => {
  const ids = new Set(scenes.map(s => s.id));
  if (ids.size !== scenes.length) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Duplicate scene ID' });
  for (const scene of scenes) for (const spot of scene.hotspots) if (!ids.has(spot.target) || spot.target === scene.id) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Hotspot must link to another scene in this hotel' });
});
export type TourScene = z.infer<typeof sceneSchema>;
export type TourHotel = { id: string; slug: string; name: string };
export type TourTarget = { id: string; hotelId: string; name: string };
export type TourCatalog = { rooms: TourTarget[]; facilities: TourTarget[] };
export type TourGroup = { id: string; hotelSlug: string; hotelName: string; title: string; placement: TourPlacement; scenes: TourScene[] };

export function placementKey(placement: TourPlacement): string {
  return placement.type === 'hotel' ? 'hotel' : `${placement.type}:${placement.targetId}`;
}

/** Match by persistent ID AND parent hotel. Names can repeat between branches. */
export function placementTitle(placement: TourPlacement, hotel: TourHotel, catalog: TourCatalog): string | undefined {
  if (placement.type === 'hotel') return hotel.name;
  const targets = placement.type === 'room' ? catalog.rooms : catalog.facilities;
  return targets.find(target => String(target.id) === placement.targetId && String(target.hotelId) === String(hotel.id))?.name;
}

export function scopedScenes(scenes: TourScene[], placement: TourPlacement): TourScene[] {
  const selected = scenes.filter(scene => placementKey(scene.placement) === placementKey(placement));
  const ids = new Set(selected.map(scene => scene.id));
  // Keep saved links intact, but never offer navigation into another room/facility.
  return selected.map(scene => ({ ...scene, hotspots: scene.hotspots.filter(spot => ids.has(spot.target)) }));
}

export function buildTourGroups(hotels: TourHotel[], rows: { hotel_slug: string; published: boolean; scenes: unknown }[], catalog: TourCatalog): TourGroup[] {
  const groups: TourGroup[] = [];
  for (const hotel of hotels) {
    const row = rows.find(row => row.hotel_slug === hotel.slug && row.published === true);
    const parsed = tourSchema.safeParse(row?.scenes);
    if (!parsed.success) continue;
    const placements = new Map(parsed.data.map(scene => [placementKey(scene.placement), scene.placement]));
    for (const [key, placement] of placements) {
      const title = placementTitle(placement, hotel, catalog);
      // Deleted targets and IDs from another branch must not become general tours.
      if (!title) continue;
      groups.push({ id: `${hotel.slug}:${key}`, hotelSlug: hotel.slug, hotelName: hotel.name, title, placement, scenes: scopedScenes(parsed.data, placement) });
    }
  }
  return groups;
}
export type PanoramaViewer = {
  destroy(): void; resize(): void; getPitch(): number; getYaw(): number; getHfov(): number;
  setHfov(value: number): void; loadScene(id: string): void; startAutoRotate(speed: number): void; stopAutoRotate(): void;
  on(event: string, handler: (value?: unknown) => void): void;
};
declare global { interface Window { pannellum?: { viewer(node: HTMLElement, config: Record<string, unknown>): PanoramaViewer } } }
