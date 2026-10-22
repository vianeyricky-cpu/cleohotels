import { getHotels } from '@/actions/getHotels';
import { createClient } from '@supabase/supabase-js';
import { HotelCollection } from '@/components/public/HotelCollection';
import { OffersSection } from '@/components/public/OffersSection';
export const dynamic = 'force-dynamic';

export default async function HotelsIndexPage({ params }: { params: { locale: string } }) {
  const hotels = await getHotels();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
  const { data: promos } = await supabase.from('promos').select('*').order('created_at', { ascending: false }).limit(3);
  return <main id="main-content" className="collection-page">
    <header className="page-heading page-width"><span className="eyebrow">OUR COLLECTIONS</span><h1>Discover Cleo Locations</h1><p>Choose the perfect location for your stay in Surabaya. Each Cleo Hotel offers a unique experience, combining <em>smart comfort</em> with strategic convenience.</p><div className="collection-meta"><span>SURABAYA, INDONESIA</span><span>{hotels.length} {params.locale === 'id' ? 'HOTEL' : 'HOTELS'}</span></div></header>
    <section className="page-width collection-content"><HotelCollection hotels={hotels} locale={params.locale} detailed/></section>
    <OffersSection offers={promos || []} locale={params.locale}/>
  </main>;
}
