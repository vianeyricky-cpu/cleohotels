import { createClient } from '@supabase/supabase-js';
import { OfferCards } from '@/components/public/OffersSection';
export const dynamic = 'force-dynamic';
export default async function PromosPage({ params }: { params: { locale: string } }) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
  const { data: promos } = await supabase.from('promos').select('*').order('created_at', { ascending: false });
  return <main id="main-content" className="offers-page"><header className="page-heading page-width"><span className="eyebrow">MAKE MORE OF YOUR STAY</span><h1>Offers & Packages</h1><p>Take advantage of our large variety of packages and special offers created by us and designed with your needs in mind.</p></header><section className="page-width collection-content"><OfferCards offers={promos || []} locale={params.locale}/></section></main>;
}
