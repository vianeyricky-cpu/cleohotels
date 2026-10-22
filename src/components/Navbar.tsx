'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, usePathname } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Globe2, Menu, X } from 'lucide-react';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const params = useParams();
  const locale = params?.locale === 'id' ? 'id' : 'en';
  const id = locale === 'id';
  const links = [
    { path: '', label: id ? 'Beranda' : 'Home', detail: 'Welcome to Cleo' },
    { path: '/hotels', label: id ? 'Hotel Kami' : 'Our Hotels', detail: 'Three locations. Your kind of stay.' },
    { path: '/promos', label: id ? 'Penawaran' : 'Offers & Packages', detail: 'A little more for your stay' },
    { path: '/about', label: id ? 'Tentang Cleo' : 'Our Story', detail: 'By Tanly Hospitality' },
    { path: '/contact', label: id ? 'Kontak' : 'Contact', detail: "Let's plan your visit" },
  ];
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 24);
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) { dialog.current?.close(); return; }
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  const languageHref = (pathname || `/${locale}`).replace(/^\/(en|id)(?=\/|$)/, id ? '/en' : '/id');
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const darkHero = isHome || pathname === `/${locale}/about` || new RegExp(`^/${locale}/hotels/[^/]+/?$`).test(pathname || '');
  const overlay = darkHero && !scrolled;
  const bookingHref = new RegExp(`^/${locale}/hotels/[^/]+/?$`).test(pathname || '') ? `${pathname}#booking` : `/${locale}#booking`;
  return <>
    <a href="#main-content" className="skip-link">{id ? 'Langsung ke konten' : 'Skip to content'}</a>
    <header className={`site-nav ${overlay ? 'is-overlay on-dark-hero' : 'has-surface'} ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav-utility"><Link href={`/${locale}/about`}>BY TANLY HOSPITALITY</Link><span className="utility-motto">SMART CHOICE. EASY STAY.</span><div><Link href={`/${locale}/contact`}>{id ? 'Hubungi kami' : 'Contact us'}</Link><Link href={languageHref} className="language-switch" aria-label={id ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}><Globe2 size={13}/>{id ? 'EN' : 'ID'}</Link></div></div>
      <nav className="nav-inner" aria-label={id ? 'Navigasi utama' : 'Main navigation'}>
        <button ref={trigger} className="menu-trigger" onClick={() => setOpen(true)} aria-label={id ? 'Buka menu' : 'Open menu'} aria-expanded={open} aria-controls="site-menu"><Menu size={25} strokeWidth={1.3}/><span>MENU</span></button>
        <Link href={`/${locale}`} className="nav-logo" aria-label="Cleo Hotels"><Image src="/logo.png" alt="Cleo Hotels" fill className="object-contain" priority sizes="132px"/></Link>
        <Link className="cleo-button nav-book" href={bookingHref}>{id ? 'Reservasi' : 'Book your stay'}<ArrowUpRight size={16}/></Link>
      </nav>
    </header>
    <dialog ref={dialog} id="site-menu" className="site-menu" aria-label={id ? 'Menu navigasi' : 'Navigation menu'} onCancel={() => setOpen(false)} onClose={() => { setOpen(false); trigger.current?.focus(); }} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="menu-surface"><div className="menu-top"><span className="eyebrow">CLEO HOTELS · SURABAYA</span><button className="icon-button" onClick={() => setOpen(false)} aria-label={id ? 'Tutup menu' : 'Close menu'}><X size={24}/></button></div>
        <nav aria-label={id ? 'Jelajahi Cleo' : 'Explore Cleo'}>{links.map((link, index) => <Link key={link.path} href={`/${locale}${link.path}`} onClick={() => setOpen(false)} aria-current={pathname === `/${locale}${link.path}` ? 'page' : undefined}><span className="menu-index">0{index + 1}</span><span>{link.label}<small>{id ? '' : link.detail}</small></span><ArrowRight size={22} strokeWidth={1.2}/></Link>)}</nav>
        <div className="menu-bottom"><Link href={bookingHref} className="cleo-button" onClick={() => setOpen(false)}>{id ? 'Rencanakan kunjungan' : 'Plan your stay'}<ArrowUpRight size={16}/></Link><Link href={languageHref} onClick={() => setOpen(false)}><Globe2 size={16}/>{id ? 'English' : 'Bahasa Indonesia'}</Link></div><p className="menu-signature">#EnjoyLife</p>
      </div>
    </dialog>
  </>;
}
