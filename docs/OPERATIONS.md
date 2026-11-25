# Production operations

## Hosting

The live `cleohotels.id` domain is served by **Vercel**, project `cleohotels`
under `rickys-projects-07a23b11`. Production deployments track GitHub `main`
in `vianeyricky-cpu/cleohotels`. The repository also has a legacy cPanel
GitHub Actions deployment; its presence does not identify the live domain's host.

Verify hosting and HTTP status with:

```powershell
curl.exe -I https://cleohotels.id/en
gh api repos/vianeyricky-cpu/cleohotels/deployments?per_page=5
```

## Supabase quota incident — 25 November 2026

Project `esbemfpaslpkhglrenyt` returned HTTP 402 from both its REST and Auth
endpoints with `exceed_cached_egress_quota`. The public hotel lookup threw an
exception, causing HTTP 500 on the home and hotel pages. An accessible admin
shell does not prove its database or authentication services are healthy.

Public pages now show a bilingual reservation/contact page when the hotel
catalog cannot load. They resume the regular catalog automatically when the
upstream service recovers. Admin data errors remain visible rather than being
treated as empty hotel lists. Prices, rooms, promotions and availability are
not fabricated or copied from stale local data.

To restore the full service, the Supabase organization owner must inspect
Usage/Billing and restore its quota. Supabase documents a reset at the next
billing cycle, or immediate restoration by upgrading the plan or disabling
Spend Cap where available. Billing changes require owner approval because
they can introduce recurring or usage-based charges:

- Project dashboard: https://supabase.com/dashboard/project/esbemfpaslpkhglrenyt
- Quota documentation: https://supabase.com/docs/guides/platform/manage-your-usage/egress

Next.js image optimization is enabled with a one-day minimum image cache TTL
to reduce future transfers of original Supabase images to each visitor.
This does not undo usage already accrued or release the current restriction.
Panorama files are still fetched directly by the tour viewer; review their
dimensions and traffic in Supabase Usage after recovery.

After restoring quota, check `/en`, `/id`, both hotel indexes, hotel details,
room lists, images, and admin data access. Verify the reservation handoff without
completing a booking. Do not remove database tables or storage objects to try
to reduce an already accrued bandwidth total.

Hotfix validation: 22 automated tests and the Next.js 14.2.35 production build
(including lint/type checks) passed. HTTP checks covered eight ID/EN public
routes against the restricted upstream and the same eight with an isolated
healthy-data fixture; genuine missing hotels still returned 404. All three
official booking handoffs and local WebP image optimization passed.
