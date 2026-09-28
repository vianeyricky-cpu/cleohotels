'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { branches, resolveBranch, jakartaDate, validStay } from '@/lib/cleo/branches';

export function BookingWidget({ defaultHotelSlug }: { defaultHotelSlug?: string }) {
  const id = useParams()?.locale === 'id';
  const fixed = resolveBranch(defaultHotelSlug);
  const [branch, setBranch] = useState<string>(fixed?.key || '');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const selected = fixed?.key || branch;
  return <form id="booking" className="booking-panel" onSubmit={async event => {
    event.preventDefault(); setError('');
    if (!validStay(checkin, checkout)) { setError(id ? 'Periksa tanggal menginap; maksimal 30 malam.' : 'Check your dates; maximum stay is 30 nights.'); return; }
    setBusy(true);
    try {
      const data = new FormData(event.currentTarget);
      const query = new URLSearchParams({ branch: selected, checkin, checkout, adult: String(data.get('adult')), child: String(data.get('child')), promocode: String(data.get('promocode') || '') });
      const response = await fetch(`/api/booking?${query}`, { signal: AbortSignal.timeout(12000) });
      const result = await response.json();
      if (!response.ok || result.branch !== selected || !result.url) throw new Error(id ? 'Booking belum dapat dihubungi. Silakan coba lagi atau telepon hotel.' : 'Booking is temporarily unavailable. Please retry or call the hotel.');
      window.location.assign(result.url);
    } catch (err) { setError(err instanceof Error ? err.message : 'Please try again.'); } finally { setBusy(false); }
  }}>
    <div className="booking-heading"><span>{id ? 'RENCANAKAN KUNJUNGAN ANDA' : 'MAKE YOURSELF AT HOME'}</span><span>Cleo Hotels · Surabaya</span></div>
    <div className="booking-fields">
      <label>{id ? 'Pilih hotel' : 'Your hotel'}<select aria-label="Hotel" value={selected} onChange={e => setBranch(e.target.value)} required disabled={!!fixed || (!!defaultHotelSlug && !fixed)}><option value="">{id ? 'Pilih cabang' : 'Choose a location'}</option>{branches.map(b => <option key={b.key} value={b.key}>{b.name}</option>)}</select></label>
      <label>Check-in<input aria-label="Check-in" type="date" min={jakartaDate()} required value={checkin} onChange={e => setCheckin(e.target.value)} /></label>
      <label>Check-out<input aria-label="Check-out" type="date" min={checkin || jakartaDate()} required value={checkout} onChange={e => setCheckout(e.target.value)} /></label>
      <label>{id ? 'Dewasa' : 'Adults'}<select name="adult" defaultValue="2">{[1,2,3,4,5,6].map(n => <option key={n}>{n}</option>)}</select></label>
      <label>{id ? 'Anak' : 'Children'}<select name="child" defaultValue="0">{[0,1,2].map(n => <option key={n}>{n}</option>)}</select></label>
      <button className="cleo-button" disabled={busy || !selected}>{busy ? <Loader2 className="animate-spin" size={18}/> : <ArrowUpRight size={18}/>} {id ? 'Cek kamar' : 'Find a room'}</button>
    </div>
    <div className="booking-bottom"><label>{id ? 'Kode promo' : 'Promo code'} <input name="promocode" maxLength={60} placeholder={id ? 'Opsional' : 'Optional'} /></label><span>{id ? 'Harga & ketersediaan dikonfirmasi di booking resmi cabang pilihan.' : 'Rates & availability are confirmed by your selected hotel’s booking system.'}</span></div>
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error} {resolveBranch(selected) && <a href={`tel:${resolveBranch(selected)?.phone}`}>{resolveBranch(selected)?.phone}</a>}</p>}
    {defaultHotelSlug && !fixed && <p role="alert">Cabang belum terpetakan. Hubungi hotel untuk reservasi.</p>}
  </form>;
}
