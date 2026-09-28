'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useParams } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
export function Navbar() {
  const [open, setOpen] = useState(false), [scrolled, setScrolled] = useState(false);
  const pathname = usePathname(), params = useParams();
  const locale = params?.locale === 'id' ? 'id' : 'en', id = locale === 'id';
  const links = [{ path: '', label: id ? 'Beranda' : 'Home' }, { path: '/hotels', label: id ? 'Hotel Kami' : 'Our Hotels' }, { path: '/promos', label: id ? 'Penawaran' : 'Offers' }, { path: '/about', label: id ? 'Tentang Cleo' : 'Our Story' }, { path: '/contact', label: id ? 'Kontak' : 'Contact' }];
  useEffect(() => { const handle = () => setScrolled(window.scrollY > 24); handle(); window.addEventListener('scroll', handle, { passive: true }); return () => window.removeEventListener('scroll', handle); }, []);
  useEffect(() => setOpen(false), [pathname]);
  const languageHref = (pathname || `/${locale}`).replace(/^\/(en|id)(?=\/|$)/, id ? '/en' : '/id');
  return <nav className={`site-nav ${scrolled ? 'is-scrolled' : ''}`} aria-label="Main navigation">
    <div className="nav-inner"><Link href={`/${locale}`} className="nav-logo"><Image src="/logo.png" alt="Cleo Hotels" fill className="object-contain object-left" priority/></Link>
      <div className="desktop-nav">{links.map(l => <Link key={l.path} href={`/${locale}${l.path}`} aria-current={pathname === `/${locale}${l.path}` ? 'page' : undefined}>{l.label}</Link>)}</div>
      <div className="nav-actions"><Link href={languageHref} className="language-switch" aria-label={id ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}>{id ? 'EN' : 'ID'}</Link><Link className="cleo-button nav-book" href={`/${locale}#booking`}>{id ? 'Reservasi' : 'Book your stay'}<ArrowUpRight size={16}/></Link><button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-nav">{open ? <X/> : <Menu/>}</button></div>
    </div>
    {open && <div id="mobile-nav" className="mobile-nav" onKeyDown={e => { if(e.key === 'Escape') setOpen(false); }}>{links.map(l => <Link key={l.path} href={`/${locale}${l.path}`} onClick={() => setOpen(false)}>{l.label}</Link>)}<Link href={`/${locale}#booking`} onClick={() => setOpen(false)}>{id ? 'Reservasi' : 'Book your stay'} →</Link></div>}
  </nav>;
}
