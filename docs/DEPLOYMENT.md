# Cleo Hotels — Experience update

## What is included

- Shared navy / blue visual system, editorial hero, frosted navigation, lightweight scroll blur, mobile navigation and reduced-motion support across public pages. Existing hotel, room, facility, promotion, contact and management routes remain.
- Native booking form: replaces global Bootstrap/Vue injection and timer-based hotel selection. Preserves check-in, check-out, adults, children and promo code. Branch ID + provider hotel name must both match before opening an official booking URL.
- Server-only Gemini concierge with branch-specific facts from Hotel / Room / Facility and an editable FAQ. Availability bypasses free-form generation. Unknown, stale, mismatched and failed inventory responses are never reported as confirmed stock.
- Optional authorized live-inventory adapter for each hotel. The booking widget itself does **not** provide a verified availability API.
- Pannellum 2.5.7 locally served, adapted from the viewer behavior in `ricky99n-oss/pakdegriya`: scene transitions, hotspots, drag / touch, zoom, auto-rotate, fullscreen, gallery, retry and cleanup. The Pakde repository is unchanged.
- `/admin/experience`: per-hotel FAQ and panorama upload, scene order, initial view, hotspot creation/removal, draft/publish and preview. Panorama photos are uploaded directly to Supabase; no Vercel request-size bottleneck.
- Additive Supabase tables, RLS, dedicated storage and an atomic shared request quota. Only accounts with `app_metadata.cleo_admin: true` can write the new experience data.
- Fixes needed for the integration: one persistent browser auth client, root admin middleware exclusion, no nested html/body, working room booking link, corrected font tokens, no forced 3-second navigation wait, compatible ESLint config, and a standard Vercel build command.

## Current status / requirements

This is an implementation branch, not a production deployment. No production database changes, API calls to Gemini, real reservations, or admin-account changes have been performed. Tests use isolated fixtures.

The initial handoff was a patch because GitHub access was read-only. Access was subsequently enabled and the implementation branch is `feat/cleo-experience-ai-360`. Prefer checking out that branch. The original patch can also be applied to a normal local clone:

```bash
git checkout main
git pull --ff-only
git switch -c feat/cleo-experience-ai-360
git apply --check /path/to/cleohotels-changes.patch
git apply /path/to/cleohotels-changes.patch
npm ci --legacy-peer-deps
npm test
npm run typecheck
npm run lint
# Configure environment before the build.
npm run build
git add .
git commit -m "Improve Cleo hotel experience with Gemini concierge and managed 360 tours"
git push -u origin feat/cleo-experience-ai-360
```

If the patch no longer applies cleanly, use the recorded base commit in `IMPLEMENTATION.md` and rebase the branch onto current main before opening a PR. Do not force-push main.

## Vercel environment

Keep existing Supabase / analytics variables. Add these using the Vercel project environment UI, not Git:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Existing project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Existing public anonymous key, protected by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only quota RPC client; never use a NEXT_PUBLIC prefix |
| `GEMINI_API_KEY` | Server-only Google AI Studio API key |
| `GEMINI_MODEL` | An enabled stable text model ID from your Google project; explicitly configured rather than hard-coded |
| `CHAT_RATE_LIMIT_SECRET` | Random server secret, e.g. output of `openssl rand -hex 32` |

Without the required chat configuration, the chat returns a clear temporary-unavailable message and does not send a Gemini request. Booking and tours are independent of Gemini. Quotas: 12 requests/minute/IP hash and 1,000/day/project, shared across Vercel instances. Configure Google project budget alerts as a second limit. Raw IPs and chat messages are not persisted by this feature. Vercel supplies the trusted IP header; do not put a proxy in front without checking its behavior.

Build command: `npm run build`. Legacy `build:standalone` remains available for the old cPanel workflow, but is **not** used for Vercel. Node 20.19+ / 22 LTS recommended. `npm ci --legacy-peer-deps` is needed for this repository's existing dependency peer ranges. Next was updated from 14.1.0 to 14.2.35 as a compatible patch baseline; this is not a claim that Next 14 is currently supported or fully secure. A separate migration to the current supported Next/React release is recommended before a production rollout, with a dependency advisory audit.

## Supabase setup (once, in staging first)

1. Run `supabase/migrations/202609280001_guest_experience.sql` using the Supabase SQL editor or your migration tool. It adds `hotel_concierge`, `hotel_tours`, `concierge_limits`, the quota RPC and the `cleo-panoramas` bucket. It does not rewrite old Hotel/Room/Facility tables. The migration is versioned and intended to run once.
2. Set the admin role for existing trusted operators through Supabase Admin API or the SQL editor. Preserve other metadata. Example (replace the UUID with the verified operator account):

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"cleo_admin":true}'::jsonb
where id = 'REPLACE_WITH_VERIFIED_ADMIN_USER_UUID';
```

3. Sign out and back in to refresh the JWT. Open `/admin/experience`, select a branch, enter verified public FAQ and save.
4. Upload equirectangular 2:1 JPG / PNG / WebP (max 20 MB, max width 8192; 4096×2048 recommended for mobile). Photos are deliberately not cropped or recompressed. Add rooms, order them, and set hotspot directions using the preview camera. The first scene is the entry scene.
5. Save draft, preview, then enable Publish and save. The public hotel page displays only valid published tours. Existing pages gracefully omit the tour if no configuration exists.
6. The panorama bucket is public: do not upload confidential photos, even in draft. Removing a scene does not delete its storage object; this preserves rollback and avoids breaking other published references. Clean up unused files separately after review.

Existing admin CRUD is retained. This migration protects the **new** tables; existing tables/storage still need their own correctly configured RLS. The old client-only admin gate is not a substitute for database authorization.

## Official booking mapping

Verified from the public Omnihotelier group 46 property listing during implementation:

| Site branch | Property ID | Provider name | Booking |
|---|---|---|---|
| Tunjungan | 296 | Cleo Hotel Tunjungan | https://cleohoteltunjunga.reserveonline.id/book/296 |
| Jemursari | 297 | Cleo Hotel Jemursari | https://cleojemursari.reserveonline.id/book/297 |
| Walikota Mustajab | 298 | Cleo Hotel Balaikota Surabaya | https://cleowalikotamustajab.reserveonline.id/book/298 |

At runtime the application fetches this listing again and checks ID and branch aliases. A failed lookup disables the handoff and shows the branch phone instead of substituting another hotel. Booking form inputs are forwarded using the same parameters as the existing provider script (`checkin`, `checkout`, `adult`, `child`, `promocode`, `property`, `group_id`). The provider validates final occupancy, pricing and booking rules.

## Live availability adapter (optional; requires provider access)

Obtain an authorized PMS / channel-manager availability integration for each branch. Do not scrape booking HTML or equate the Room catalog with stock. Configure per-branch HTTPS endpoint and token:

- `AVAILABILITY_TUNJUNGAN_URL`, `AVAILABILITY_TUNJUNGAN_TOKEN`
- `AVAILABILITY_JEMURSARI_URL`, `AVAILABILITY_JEMURSARI_TOKEN`
- `AVAILABILITY_WALIKOTA_URL`, `AVAILABILITY_WALIKOTA_TOKEN`

The server sends a POST with bearer auth:

```json
{"propertyId":"297","checkin":"2030-01-10","checkout":"2030-01-12","adults":2,"children":0}
```

The authorized adapter must return this normalized contract, computed for the **whole stay and occupancy**, not a single night's inventory:

```json
{"propertyId":"297","checkin":"2030-01-10","checkout":"2030-01-12","adults":2,"children":0,"checkedAt":"2030-01-01T10:00:00.000Z","rooms":[{"name":"Standard","available":2}]}
```

Use the actual current `checkedAt` in real responses. Snapshot maximum age is 120 seconds; at most 30 seconds of future clock skew is allowed. Property, dates and guest counts must exactly match. Rate fields are optional and are not used for inventory assertions. Adapter URLs never come from a visitor request and redirects are rejected. On any missing configuration, timeout or mismatch, the response is explicitly `unknown` with the correct branch booking/contact buttons. Live availability does not hold inventory or complete a reservation.

## Review before rollout

- Apply migration in staging; check anonymous reads, denied anonymous/non-admin writes and successful operator writes with actual Supabase accounts.
- Set Gemini environment, ask hotel-specific / unknown-fact / out-of-scope / prompt-injection questions in Indonesian and English. Model grounding reduces mistakes but cannot guarantee every generated answer; review with hotel operations before enabling publicly.
- Test all three booking destinations and guest/date/promo parameters against the real booking engine without completing a reservation.
- Upload real branch-specific panoramas and check touch, hotspot, fullscreen and low-memory mobile behavior.
- Check desktop/mobile pages, promotions, room carousels, facility galleries, language links, existing admin CRUD and analytics with production-like data.
- Use Vercel preview first, then merge through the normal review process.

Rollback: redeploy the previous Vercel release or revert the branch. The additive tables can remain without affecting the old app; unpublish tours in admin if needed. Do not drop storage or tables as part of an emergency rollback.

## Recommended next features

1. Authorized live inventory / rates connection per hotel (highest priority for accurate concierge booking assistance).
2. Conversion analytics for branch selection → booking handoff → tour engagement, with no chat transcripts or personal data by default.
3. Verified bilingual FAQ and consistent translation of the existing English editorial content; the new navigation/booking/chat support ID/EN, while older editorial pages retain their original copy.
4. Hotel-specific WhatsApp handoff only after each branch number is verified; current phone numbers are landlines and must not be assumed to support WhatsApp.
5. Image resizing / caching and multi-resolution panorama tiles if real panoramas make mobile memory or loading time problematic.
