'use client';
import { useState } from 'react';
import type { TourGroup } from '@/lib/cleo/tour';
import TourViewer from './TourViewer';

export default function TourGallery({ groups, locale }: { groups: TourGroup[]; locale: string }) {
  const [hotel, setHotel] = useState('all'), [category, setCategory] = useState('all'), [selected, setSelected] = useState('');
  const id = locale === 'id';
  const hotels = Array.from(new Map(groups.map(group => [group.hotelSlug, group.hotelName])));
  const filtered = groups.filter(group => (hotel === 'all' || group.hotelSlug === hotel) && (category === 'all' || group.placement.type === category));
  const active = filtered.find(group => group.id === selected) || filtered[0];
  const labels = { hotel: id ? 'Umum hotel' : 'Hotel overview', room: id ? 'Kamar' : 'Rooms', facility: id ? 'Fasilitas' : 'Facilities' };
  if (!groups.length) return null;
  return <section className="tour-gallery mx-auto max-w-7xl px-6 py-20" id="virtual-tours" aria-labelledby="tour-gallery-title">
    <div className="section-heading"><span className="eyebrow">CLEO IN 360°</span><h2 id="tour-gallery-title">{id ? 'Temukan ruang pilihan Anda.' : 'Find your favourite space.'}</h2>
      <p>{id ? 'Jelajahi seluruh tur 360°. Pilih hotel, kamar, atau fasilitas yang ingin Anda lihat.' : 'Explore every 360° tour. Choose a hotel, room, or facility and take a look around.'}</p>
    </div>
    <div className="tour-filters">
      <label>{id ? 'Cabang hotel' : 'Hotel'}<select value={hotel} onChange={event => { setHotel(event.target.value); setSelected(''); }}><option value="all">{id ? 'Semua hotel' : 'All hotels'}</option>{hotels.map(([slug, name]) => <option key={slug} value={slug}>{name}</option>)}</select></label>
      <label>{id ? 'Kategori' : 'Category'}<select value={category} onChange={event => { setCategory(event.target.value); setSelected(''); }}><option value="all">{id ? 'Semua kategori' : 'All categories'}</option>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <p role="status">{filtered.length} {id ? 'pilihan tur' : 'tours'}</p>
    </div>
    <div className="tour-options" aria-label={id ? 'Pilih tur 360°' : 'Choose a 360° tour'}>{filtered.map(group => <button key={group.id} className="tour-option" type="button" aria-pressed={active?.id === group.id} onClick={() => setSelected(group.id)}>
      <img src={group.scenes[0].panorama} alt="" loading="lazy"/>
      <span><small>{group.hotelName} · {labels[group.placement.type]}</small><strong>{group.title}</strong><small>{group.scenes.length} {id ? 'panorama' : 'panoramas'}</small></span>
    </button>)}</div>
    {active ? <div className="tour-gallery-active"><p className="tour-selection-label">{active.hotelName} · {labels[active.placement.type]}{active.placement.type !== 'hotel' && ` · ${active.title}`}</p><TourViewer key={active.id} scenes={active.scenes} title={active.title} bookingHref={`/${locale}/hotels/${active.hotelSlug}#booking`}/></div> : <p className="tour-empty">{id ? 'Belum ada tur untuk pilihan ini. Silakan pilih kategori atau hotel lain.' : 'No tours for this selection yet. Try another hotel or category.'}</p>}
  </section>;
}
