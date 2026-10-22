import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import type { Hotel } from '@/types';

export function HotelCollection({ hotels, locale, detailed = false }: { hotels: Hotel[]; locale: string; detailed?: boolean }) {
  const id = locale === 'id';
  return <div className={`hotel-collection ${detailed ? 'is-detailed' : ''}`}>
    {hotels.map((hotel, index) => <article className="hotel-editorial" key={hotel.id}>
      <Link href={`/${locale}/hotels/${hotel.slug}`} className="hotel-image" aria-label={hotel.name}><Image src={hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000'} alt={hotel.name} fill sizes="(max-width: 700px) 90vw, 33vw" className="object-cover"/><span className="image-index">0{index + 1} / SURABAYA</span><span className="image-arrow"><ArrowRight size={22} strokeWidth={1.3}/></span></Link>
      <div className="hotel-copy"><span className="eyebrow">{hotel.tagline || 'Business & Leisure'}</span><h3><Link href={`/${locale}/hotels/${hotel.slug}`}>{hotel.name}</Link></h3>{detailed && <><p className="hotel-address"><MapPin size={16}/>{hotel.address}</p><p>{hotel.description}</p></>}<Link href={`/${locale}/hotels/${hotel.slug}`} className="text-link">{id ? 'Jelajahi hotel' : detailed ? 'View details' : 'Explore hotel'}<ArrowRight size={17}/></Link></div>
    </article>)}
  </div>;
}
