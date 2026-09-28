import { z } from 'zod';
import { safeHttps } from './branches';
const hotspot = z.object({ id: z.string().uuid(), target: z.string().uuid(), label: z.string().trim().min(1).max(80), pitch: z.number().min(-90).max(90), yaw: z.number().min(-180).max(180) });
export const sceneSchema = z.object({ id: z.string().uuid(), title: z.string().trim().min(1).max(100), panorama: z.string().refine(v => !!safeHttps(v), 'Use an HTTPS panorama URL'), pitch: z.number().min(-90).max(90).default(0), yaw: z.number().min(-180).max(180).default(0), hotspots: z.array(hotspot).max(30).default([]) });
export const tourSchema = z.array(sceneSchema).max(40).superRefine((scenes, ctx) => {
  const ids = new Set(scenes.map(s => s.id));
  if (ids.size !== scenes.length) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Duplicate scene ID' });
  for (const scene of scenes) for (const spot of scene.hotspots) if (!ids.has(spot.target) || spot.target === scene.id) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Hotspot must link to another scene in this hotel' });
});
export type TourScene = z.infer<typeof sceneSchema>;
export type PanoramaViewer = {
  destroy(): void; resize(): void; getPitch(): number; getYaw(): number; getHfov(): number;
  setHfov(value: number): void; loadScene(id: string): void; startAutoRotate(speed: number): void; stopAutoRotate(): void;
  on(event: string, handler: (value?: unknown) => void): void;
};
declare global { interface Window { pannellum?: { viewer(node: HTMLElement, config: Record<string, unknown>): PanoramaViewer } } }
