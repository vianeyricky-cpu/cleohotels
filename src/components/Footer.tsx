'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowUpRight, Instagram } from 'lucide-react';

const locations = [
  { name: 'Cleo Jemursari', type: 'Business & Transit Hub', phone: '+62 31 8483 000', href: 'tel:+62318483000' },
  { name: 'Cleo Walikota', type: 'Heritage & Civic Center', phone: '+62 31 5489 000', href: 'tel:+62315489000' },
  { name: 'Cleo Tunjungan', type: 'Lifestyle & Shopping', phone: '+62 31 5323 330', href: 'tel:+62315323330' },
];
export function Footer() {
  const locale = useParams()?.locale === 'id' ? 'id' : 'en';
  const id = locale === 'id';
  return <footer className="site-footer"><div className="page-width">
    <div className="footer-invitation"><div><span className="eyebrow">SMART CHOICE. EASY STAY.</span><h2>{id ? 'Sampai jumpa di Cleo.' : 'Your next stay starts here.'}</h2></div><Link href={`/${locale}#booking`} className="outline-button">{id ? 'Rencanakan kunjungan' : 'Book your stay'}<ArrowUpRight size={17}/></Link></div>
    <div className="footer-grid">
      <div className="footer-brand"><Link href={`/${locale}`} className="footer-logo"><Image src="/logo.png" alt="Cleo Hotels Logo" fill sizes="150px" className="object-contain"/></Link><p>Managed by Tanly Hospitality.<br/>Providing experiences that touch guests' hearts with high value.</p><span className="footer-signature">#EnjoyLife</span><a href="https://instagram.com/cleohotels" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Instagram Cleo Hotels"><Instagram size={19}/>@cleohotels<ArrowUpRight size={14}/></a></div>
      <div className="footer-explore"><h3>{id ? 'Jelajahi' : 'Explore'}</h3><Link href={`/${locale}/hotels`}>{id ? 'Hotel Kami' : 'Our Hotels'}</Link><Link href={`/${locale}/promos`}>Offers & Packages</Link><Link href={`/${locale}/about`}>{id ? 'Tentang Cleo' : 'Our Story'}</Link><Link href={`/${locale}/contact`}>{id ? 'Kontak' : 'Contact Us'}</Link></div>
      <div className="footer-contact"><h3>{id ? 'Hubungi Kami' : 'Contact Us'}</h3><span>{id ? 'Dukungan surel' : 'Email Support'}</span><a href="mailto:info@cleohotels.id">info@cleohotels.id</a><span>{id ? 'Kantor Pusat' : 'Head Office'}</span><p>Surabaya, East Java,<br/>Indonesia</p></div>
      <div className="footer-locations"><h3>{id ? 'Lokasi Kami' : 'Our Locations'}</h3>{locations.map(location => <div key={location.name}><h4>{location.name}</h4><p>{location.type}</p><a href={location.href}>{location.phone}<ArrowUpRight size={13}/></a></div>)}</div>
    </div><div className="footer-bottom"><p>© {new Date().getFullYear()} Cleo Hotels by Tanly Hospitality. All rights reserved.</p><span>Dev. by Askara Indonesia</span></div>
  </div></footer>;
}
