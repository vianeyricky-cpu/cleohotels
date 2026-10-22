import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Offer { id: string | number; title: string; description: string; image_url?: string; action_link?: string; action_text?: string; }
export function OfferCards({ offers, locale = 'en' }: { offers: Offer[]; locale?: string }) {
  return <div className="offer-grid">{offers.length ? offers.map(offer => <article key={offer.id} className="offer-card">
    <Link className="offer-image" href={offer.action_link || `/${locale}/contact`} aria-label={offer.title}><Image src={offer.image_url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80'} alt={offer.title} fill sizes="(max-width: 700px) 90vw, 33vw" className="object-cover"/><span className="offer-image-label">CLEO OFFERS</span></Link>
    <div className="offer-copy"><h3>{offer.title}</h3><p>{offer.description}</p><Link href={offer.action_link || `/${locale}/contact`} className="outline-button">{offer.action_text || 'SEE MORE'}<ArrowRight size={16}/></Link></div>
  </article>) : <p className="empty-message">{locale === 'id' ? 'Belum ada promo yang tersedia. Hubungi hotel pilihan Anda untuk informasi penawaran.' : 'New offers are on their way. Contact your preferred Cleo Hotel for current packages.'}</p>}</div>;
}
export function OffersSection({ offers, locale }: { offers: Offer[]; locale: string }) {
  return <section className="editorial-section offers-section" id="offers"><div className="page-width"><div className="section-heading heading-with-link"><div><span className="eyebrow">{locale === 'id' ? 'PENAWARAN ISTIMEWA' : 'MAKE MORE OF YOUR STAY'}</span><h2>Offers & Packages</h2><p>Take advantage of our large variety of packages and special offers created by us and designed with your needs in mind.</p></div><Link href={`/${locale}/promos`} className="text-link">{locale === 'id' ? 'Semua penawaran' : 'View all offers'}<ArrowRight size={17}/></Link></div><OfferCards offers={offers} locale={locale}/></div></section>;
}
