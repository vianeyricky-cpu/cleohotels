import type { TourGroup } from '@/lib/cleo/tour';
import TourViewer from './TourViewer';
export function HotelTour({ groups, locale }: { groups: TourGroup[]; locale: string }) {
  const general = groups.find(group => group.placement.type === 'hotel');
  if (!general) return null;
  return <section className="mx-auto max-w-7xl px-6 py-16" id="virtual-tour">
    <div className="section-heading"><span className="eyebrow">360° HOTEL TOUR</span>
      <h2>{locale === 'id' ? 'Lihat lebih dekat, dari mana saja.' : 'A feel for your stay.'}</h2>
      <p>{locale === 'id' ? 'Jelajahi suasana umum hotel sebelum Anda tiba.' : 'Discover the hotel before you arrive.'}</p>
    </div>
    <TourViewer scenes={general.scenes} title={general.title} bookingHref={`/${locale}/hotels/${general.hotelSlug}#booking`} />
  </section>;
}
