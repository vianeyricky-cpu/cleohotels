import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, Building2, Compass, Gift, Heart, Phone, ShieldCheck, Star } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { getHotels } from '@/actions/getHotels';
import { BookingWidget } from '@/components/public/BookingWidget';
import { HotelCollection } from '@/components/public/HotelCollection';
import { OffersSection } from '@/components/public/OffersSection';
import { PromoModal } from '@/components/PromoModal';
import { getPublishedTourGroups } from '@/lib/cleo/published-tours';
import TourGallery from '@/components/tour/TourGallery';
export const dynamic = 'force-dynamic';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const hotels = await getHotels();
  const id = params.locale === 'id';
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
  const [{ data: setting }, { data: promoPopupData }, { data: promos }] = await Promise.all([
    supabase.from('settings').select('value').eq('key', 'hero_image').maybeSingle(),
    supabase.from('PromoPopup').select('*').eq('is_active', true).maybeSingle(),
    supabase.from('promos').select('*').order('created_at', { ascending: false }).limit(3),
  ]);
  const heroImage = setting?.value || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=3270';
  const tours = await getPublishedTourGroups(hotels);
  const shortcuts = [
    { href: '#hotels', icon: Building2, label: id ? 'Hotel Kami' : 'Our Hotels' },
    { href: '#offers', icon: Gift, label: id ? 'Penawaran' : 'Special Offers' },
    ...(tours.length ? [{ href: '#virtual-tours', icon: Compass, label: id ? 'Jelajah 360°' : 'Explore in 360°' }] : []),
    { href: `/${params.locale}/about`, icon: Heart, label: id ? 'Tentang Cleo' : 'Our Story' },
    { href: `/${params.locale}/contact`, icon: Phone, label: id ? 'Hubungi Kami' : 'Contact Us' },
  ];
  return <main id="main-content" className="home-page">
    <PromoModal promo={promoPopupData}/>
    <section className="home-hero">
      <div className="hero-photo"><Image src={heroImage} alt="Cleo Hotels Surabaya" fill className="object-cover" priority sizes="100vw"/></div><div className="hero-shade"/>
      <div className="hero-content page-width"><span className="eyebrow">CLEO HOTELS · SURABAYA</span><h1>{id ? <>Singgah nyaman.<br/><em>Nikmati perjalanan.</em></> : <>A simpler stay.<br/><em>A brighter day.</em></>}</h1><p>{id ? 'Tiga lokasi strategis. Kenyamanan yang Anda butuhkan. Temukan ruang untuk beristirahat di tengah cerita perjalanan Anda.' : 'Three city locations. Thoughtful comfort. Find your own little escape in the heart of Surabaya.'}</p><Link href={`/${params.locale}/hotels`} className="hero-explore">{id ? 'Temukan hotel Anda' : 'Discover your Cleo'}<ArrowRight size={19}/></Link></div>
      <div className="hero-caption"><span>SMART CHOICE. EASY STAY.</span><strong>#EnjoyLife</strong></div>
      <nav className="hero-shortcuts" aria-label={id ? 'Jelajahi pengalaman Cleo' : 'Explore the Cleo experience'}>{shortcuts.map(item => <Link key={item.href} href={item.href}><item.icon size={27} strokeWidth={1.15}/><span>{item.label}</span></Link>)}</nav>
      <a href="#booking" className="hero-scroll" aria-label={id ? 'Lihat reservasi' : 'Scroll to booking'}><ArrowDown size={17}/></a>
    </section>
    <section className="booking-strip"><div className="page-width"><BookingWidget/></div></section>
    <section className="home-intro page-width"><div><span className="eyebrow">WELCOME TO CLEO</span><h2>{id ? 'Ruang nyaman untuk setiap perjalanan.' : 'Thoughtful comfort. Effortlessly Cleo.'}</h2></div><div className="intro-copy"><p>Cleo Hotels is made for modern travelers who value efficiency, comfort, and great value. Whether you're in Surabaya for business or leisure, enjoy a simple, convenient stay in a strategic city location.</p><div className="intro-signoff"><span>Smart choice. Easy stay.</span><strong>#EnjoyLife</strong></div></div></section>
    <section id="hotels" className="editorial-section hotel-section"><div className="page-width"><div className="section-heading heading-with-link"><div><span className="eyebrow">{id ? 'TEMUKAN TEMPAT SINGGAH ANDA' : 'IN THE HEART OF SURABAYA'}</span><h2>{id ? 'Tiga lokasi. Satu rasa nyaman.' : 'Three locations. Your kind of stay.'}</h2></div><Link href={`/${params.locale}/hotels`} className="text-link">{id ? 'Semua hotel' : 'View all hotels'}<ArrowRight size={17}/></Link></div><HotelCollection hotels={hotels} locale={params.locale}/></div></section>
    <TourGallery groups={tours} locale={params.locale}/>
    <OffersSection offers={promos || []} locale={params.locale}/>
    <section className="values-section"><div className="values-photo"><Image src={hotels.find(hotel => hotel.slug.includes('tunjungan'))?.image_url || heroImage} alt="Cleo Hotel Tunjungan" fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover"/><span>CLEO HOTELS · ENJOY LIFE</span></div><div className="values-content"><span className="eyebrow">OUR VALUES</span><h2>#EnjoyLife<br/><em>with Cleo.</em></h2><div className="value-row"><Heart size={23} strokeWidth={1.3}/><div><h3>Touching Hearts</h3><p>Our mission is to provide experiences that genuinely touch the hearts of our guests through thoughtful service.</p></div></div><div className="value-row"><Star size={23} strokeWidth={1.3}/><div><h3>High Value</h3><p>Smart comfort combined with strategic locations, offering exceptional value for business and transit travelers.</p></div></div><div className="value-row"><ShieldCheck size={23} strokeWidth={1.3}/><div><h3>Trusted Management</h3><p>Proudly managed by Tanly Hospitality, affiliated with Vasa Hotel & Solaris, ensuring quality standards.</p></div></div><Link href={`/${params.locale}/about`} className="text-link">{id ? 'Cerita Cleo' : 'Discover our story'}<ArrowRight size={17}/></Link></div></section>
  </main>;
}
