# Cleo AI revision — 28 September 2026

Cleo AI is a hotel-only Gemini assistant with a receptionist-like tone. Guests may greet it, thank it, ask follow-up questions, translate Cleo information or request another language without being rejected as off-topic. The language menu includes Indonesian, English, Javanese, Chinese, Japanese, Korean, Arabic, Malay, French, German and Spanish. An explicit supported language request is retained in the current chat; auto mode follows the conversation. The website URL locale only controls links and the initial language.

The browser sends up to eight recent messages, bounded to 1,800 characters each. History is kept in component memory only and cleared when changing hotels. It is not a trusted source of hotel facts and is not written to Supabase. Normal quota checks still apply to language-only requests. Gemini error logs contain only the stage and status/code, not transcripts, credentials or upstream bodies.

## Knowledge sources

Public pages reviewed: English and Indonesian home, hotel listing, all three hotel detail pages, Offers, Our Story, Contact and the shared footer. The three `/hotels/{slug}/rooms` routes were also checked; they returned HTTP 500 when amenities were JSON arrays. The revision supports both JSON arrays and legacy comma-separated amenities.

`src/lib/cleo/knowledge.ts` records the static brand, management and contact facts, with source paths and a review date. Each AI question also reads current public Supabase data:

- `Hotel`, related `Room` and `Facility`: branch catalog, descriptions, amenities, room dimensions/capacity and indicative published prices.
- `hotel_concierge`: the selected branch's existing admin FAQ.
- `promos`: current website offer copy. No applicability to a branch is assumed when unspecified; a past end date must not be presented as valid today.
- `PromoPopup`: active public announcement text only.
- `hotel_tours`: only whether a published tour exists; no draft content or media is sent.

`PromoLeads`, authentication users, private settings and secret keys are never part of the context. No production tables or FAQ records are overwritten by this revision. Update the existing hotel/room/facility/promo managers or `/admin/experience` to maintain facts. Static Contact/About text changes should also update the checked-in knowledge module.

### Source discrepancy requiring hotel confirmation

The Tunjungan detail page/catalog says “Jl. Basuki Rahmat”, while the Contact page says “Jl. Tunjungan No. 55, Surabaya”. The assistant must identify the inconsistency and recommend confirmation with the Tunjungan team, rather than inventing a corrected address. Phone: +62 31 5323 330. Published descriptions referring to a spa do not establish opening hours, pricing or inclusions.

## Booking and inventory

Booking buttons remain application-generated and bound to the explicitly selected branch. Room catalog rows and advertised prices are not live stock or final date-specific rates. Stock requests bypass normal generated answers where recognized; model-classified stock requests also use the validated availability adapter. Other languages may translate that authoritative response without altering counts, dates or uncertainty. Without an authorized adapter the stock is explicitly unknown.

## Header

Desktop navigation uses 16px text with proportional spacing, 14px language/reservation controls, and 18px mobile links. Home and hero pages begin with a transparent header; dark hero pages use white text/logo for contrast. Scrolling past 24px adds a white surface. Opening the mobile menu also adds a white surface. Non-hero pages keep a readable white header. Home no longer has a blank top strip above the hero. Reduced-motion preferences disable the header transition.
