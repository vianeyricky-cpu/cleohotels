import { supabase } from '@/lib/supabase';
import { tourSchema } from '@/lib/cleo/tour';
import TourViewer from './TourViewer';
export async function HotelTour({ slug, name, locale }: { slug: string; name: string; locale: string }) {
  const { data } = await supabase.from('hotel_tours').select('scenes').eq('hotel_slug', slug).eq('published', true).maybeSingle();
  const scenes = tourSchema.safeParse(data?.scenes);
  if (!scenes.success || !scenes.data.length) return null;
  return <section className="mx-auto max-w-7xl px-6 py-16" id="virtual-tour"><div className="section-heading"><span className="eyebrow">EXPLORE BEFORE YOU ARRIVE</span><h2>{locale === 'id' ? 'Lihat lebih dekat, dari mana saja.' : 'A feel for your stay.'}</h2><p>{locale === 'id' ? 'Jelajahi kamar dan fasilitas dalam tur 360°.' : 'Walk through our rooms and spaces in an immersive 360° tour.'}</p></div><TourViewer scenes={scenes.data} title={name} bookingHref={`/${locale}/hotels/${slug}#booking`} /></section>;
}
