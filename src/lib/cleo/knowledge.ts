// Reviewed against all public pages on 2026-09-28. Variable catalog data is loaded
// from the same public Supabase tables as the website for every AI question.
export const websiteKnowledge = {
  reviewedAt: '2026-09-28',
  sources: ['/en', '/en/about', '/en/contact', '/en/hotels', '/en/promos'],
  brand: {
    name: 'Cleo Hotels', city: 'Surabaya, East Java, Indonesia',
    management: 'Tanly Hospitality', positioning: 'Smart, affordable city stays for business and leisure travelers; minimalist rooms, strategic locations, value for money.',
    websiteClassification: 'The About page describes Cleo as a 2-star brand. This is website copy, not an independently verified certification.',
    values: ['Touching Hearts', 'High Value', 'Trusted Management'],
    slogan: 'Smart choice. Easy stay. #EnjoyLife',
    managementContext: 'The About page also names Vasa Hotels, Solaris Hotels and Taman Dayu Golf & Resort as Tanly brands. Mention this only to explain Cleo’s management; do not offer booking or advice about those properties.',
    contact: { email: 'info@cleohotels.id', instagram: '@cleohotels', headOffice: 'Surabaya, East Java, Indonesia' },
  },
  contacts: [
    { branch: 'jemursari', addressOnContactPage: 'Jl. Raya Jemursari No. 157, Surabaya', phone: '+62318483000', positioning: 'Business & Transit; business and culinary district near Rungkut and the airport. No travel times are published.' },
    { branch: 'walikota', aliases: ['Cleo Walikota Mustajab', 'Cleo Hotel Balaikota Surabaya'], addressOnContactPage: 'Jl. Walikota Mustajab No. 59, Surabaya', phone: '+62315489000', positioning: 'Heritage, civic center and gastronomy; near City Hall.' },
    { branch: 'tunjungan', addressOnContactPage: 'Jl. Tunjungan No. 55, Surabaya', phone: '+62315323330', positioning: 'Lifestyle and shopping; near Tunjungan Plaza.', conflict: 'The current hotel detail/catalog says Jl. Basuki Rahmat, while Contact says Jl. Tunjungan No. 55. If asked for the exact address, explain that the website has inconsistent addresses and ask the guest to confirm with this branch. Do not present either address as verified.' },
  ],
  booking: 'Each of the three branches has a separate official booking system. Guests select the branch, check-in/check-out, adults, children and optional promo code. Final rates, terms and availability are confirmed by that branch’s booking engine. The website’s Room records are room types, never inventory.',
  unknownPolicies: 'No verified check-in/check-out times, breakfast inclusion, pool, parking, pet, smoking, extra-bed, cancellation, refund, payment or airport transfer policies were found in the reviewed static pages. Use current catalog/FAQ if explicitly provided; otherwise ask the hotel. An unlisted amenity is unknown, not proof it is unavailable.',
};
