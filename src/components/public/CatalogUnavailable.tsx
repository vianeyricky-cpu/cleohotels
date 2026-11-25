import Link from 'next/link';
import { Phone } from 'lucide-react';
import { BookingWidget } from './BookingWidget';
import { branches } from '@/lib/cleo/branches';

export function CatalogUnavailable({ locale, hotelSlug }: { locale: string; hotelSlug?: string }) {
  const id = locale === 'id';
  return <main id="main-content" className="catalog-unavailable page-width">
    <header className="catalog-unavailable-heading">
      <span className="eyebrow">CLEO HOTELS · SURABAYA</span>
      <h1>{id ? 'Rencanakan kunjungan Anda.' : 'Plan your stay with Cleo.'}</h1>
      <p role="status">{id
        ? 'Informasi hotel sementara belum dapat dimuat. Anda tetap dapat mengecek harga dan reservasi melalui booking resmi atau menghubungi hotel langsung.'
        : 'Hotel information is temporarily unavailable. You can still check rates and reservations through our official booking system or contact your hotel directly.'}</p>
    </header>
    <BookingWidget defaultHotelSlug={hotelSlug}/>
    <section className="catalog-contact-section" aria-label={id ? 'Kontak hotel' : 'Hotel contacts'}>
      <h2>{id ? 'Hubungi hotel kami' : 'Contact our hotels'}</h2>
      <div className="catalog-contacts">{branches.map(branch => <article key={branch.key}>
        <h3>{branch.name}</h3>
        <a href={`tel:${branch.phone}`}><Phone size={18} aria-hidden="true"/>{branch.phone}</a>
      </article>)}</div>
      <Link href={`/${locale}/contact`} className="text-link">{id ? 'Informasi kontak selengkapnya' : 'More contact information'}</Link>
    </section>
  </main>;
}
