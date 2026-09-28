# Implementation record

- Repository: https://github.com/vianeyricky-cpu/cleohotels
- Base commit: `4bb7e35af0411221a237b8bfb77ef86bb531c059`
- Local branch: `feat/cleo-experience-ai-360`
- Reference viewer: https://github.com/ricky99n-oss/pakdegriya (`components/TourViewer.tsx`, `components/tour360/*`, local Pannellum assets).
- Reference design: the three user-provided images (navy location cards, editorial hotel hero, bright photo/booking layout).
- Initial handoff used a patch because GitHub access was read-only. On 28 September 2026 the owner enabled the integration and the remote branch `feat/cleo-experience-ai-360` was created. See GitHub for the current PR and deployment status; no production merge or database migration was performed during implementation.

## Validation performed

- `npm test`: 9 passing tests; covers branch mapping, unknown/ambiguous branches, dates, stale and mismatched inventory, unsafe URL rejection, hotspot destinations, provider failures, concierge scope/branch conflict and quotas.
- `npm run typecheck`: passed.
- `npm run lint`: passed with no warnings or errors.
- `npm run build`: passed on Next 14.2.35, including the middleware and API routes.
- Production-server smoke test with local, non-production Supabase fixtures: HTTP 200 for home EN/ID, hotel directory, hotel detail, room list, promotions, about, contact and `/admin/experience`. Admin URL remains `/admin/experience`, not a locale rewrite.
- API smoke: invalid branch returns 400; missing chat configuration returns 503 with a user-facing fallback.
- Official Omnihotelier group listing was read successfully; the three branch IDs and booking URLs are recorded in DEPLOYMENT.md. No booking was submitted.

## Not validated here

Browser visual, mobile touch, WebGL panorama, fullscreen, client-side admin save/upload and actual RLS behavior need Vercel Preview / staging verification. Chromium was downloaded, but the workspace denied the Unix socket used by the browser process, so no browser pass or screenshot is claimed. Live Gemini and real availability adapters were not called because their credentials were not available. No Supabase production migration or actual panorama upload was performed.

The new admin write paths are protected by SQL RLS; the migration must be applied and a verified operator assigned the cleo_admin app_metadata claim before use. Existing admin table policies remain the owner's responsibility and are not replaced by this additive migration.

## Architectural decisions

The provider's old Vue calendar mounted globally and selected hotel IDs by timers. The replacement reads the official property list and resolves a booking handoff by branch ID plus matching provider name, preserving its date/guest/promo parameters. Provider outage is treated as an error; no default hotel is substituted.

The AI model receives only published hotel catalog fields and the selected hotel's public FAQ. It does not receive secrets, raw user records, static catalog prices or invented inventory. The app, not the model, supplies branch-specific links. Availability requests use a separate normalized adapter response and validate hotel, dates, occupancy and freshness before displaying stock. A model remains probabilistic; the configuration should be reviewed with hotel operations before production.

Panorama scene configuration is validated before saving and before public rendering. Draft tours are not exposed through the public table policy; public panorama storage is documented. Pannellum JavaScript is served locally so a missing third-party CDN cannot blank the viewer. Panorama loading has a timeout, error UI and retry. Viewer instances, timers and resize observers are cleaned up when leaving a page.
