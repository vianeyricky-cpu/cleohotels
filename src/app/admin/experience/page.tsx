'use client';
import { useCallback, useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Plus, Trash2, Save, ArrowUp, ArrowDown, Upload } from 'lucide-react';
import { supabaseClient as db } from '@/lib/supabase/client';
import { tourSchema, placementKey, placementTitle, scopedScenes, type TourScene, type TourCatalog, type TourHotel } from '@/lib/cleo/tour';
const TourViewer = dynamic(() => import('@/components/tour/TourViewer'), { ssr: false });
type Hotel = TourHotel;
export default function ExperienceAdmin() {
  const [hotels, setHotels] = useState<Hotel[]>([]), [slug, setSlug] = useState(''), [allowed, setAllowed] = useState(false), [checked, setChecked] = useState(false);
  useEffect(() => { let active = true; (async () => {
    const { data } = await db.auth.getUser();
    if (!active) return;
    setAllowed(data.user?.app_metadata?.cleo_admin === true); setChecked(true);
    if (data.user?.app_metadata?.cleo_admin) { const result = await db.from('Hotel').select('id,slug,name').order('name'); if(active) setHotels(result.data || []); }
  })(); return () => { active = false; }; }, []);
  if (!checked) return <p role="status">Memeriksa akses…</p>;
  if (!allowed) return <div className="admin-experience"><h1>Akses pengelola diperlukan</h1><p>Akun ini belum memiliki peran cleo_admin. Minta pemilik proyek Supabase mengaktifkan app_metadata.cleo_admin untuk akun pengelola, lalu login ulang.</p></div>;
  const hotel = hotels.find(hotel => hotel.slug === slug);
  return <div className="admin-experience"><span className="eyebrow">GUEST EXPERIENCE</span><h1>Concierge & Virtual Tour</h1><p>Informasi dan panorama dikelola terpisah untuk setiap cabang. Jangan masukkan harga atau stok kamar ke FAQ.</p><label>Cabang hotel<select value={slug} onChange={e => { if (!slug || window.confirm('Pindah cabang? Perubahan yang belum disimpan akan hilang.')) setSlug(e.target.value); }}><option value="">Pilih cabang</option>{hotels.map(h => <option key={h.slug} value={h.slug}>{h.name}</option>)}</select></label>{hotel && <ExperienceEditor key={slug} hotel={hotel}/>}</div>;
}
function ExperienceEditor({ hotel }: { hotel: Hotel }) {
  const { id: hotelId, slug, name } = hotel;
  const [catalog, setCatalog] = useState<TourCatalog>({ rooms: [], facilities: [] });
  const [knowledge, setKnowledge] = useState(''), [scenes, setScenes] = useState<TourScene[]>([]), [published, setPublished] = useState(false), [selected, setSelected] = useState('');
  const [busy, setBusy] = useState(false), [loading, setLoading] = useState(true), [status, setStatus] = useState(''), [ready, setReady] = useState(false);
  const [coords, setCoords] = useState<{ scene: string; pitch: number; yaw: number }>(), [target, setTarget] = useState(''), [label, setLabel] = useState('');
  const onView = useCallback((scene: string, pitch: number, yaw: number) => { setSelected(scene); setCoords({ scene, pitch, yaw }); }, []);
  useEffect(() => { let active = true; (async () => {
    const [info, tour, rooms, facilities] = await Promise.all([
      db.from('hotel_concierge').select('knowledge').eq('hotel_slug', slug).maybeSingle(),
      db.from('hotel_tours').select('scenes,published').eq('hotel_slug', slug).maybeSingle(),
      db.from('Room').select('id,hotelId,name').eq('hotelId', hotelId).order('name'),
      db.from('Facility').select('id,hotelId,name').eq('hotelId', hotelId).order('name'),
    ]);
    if (!active) return;
    if (info.error || tour.error || rooms.error || facilities.error) { setStatus('Gagal memuat. Pastikan migrasi database sudah dijalankan dan akun memiliki akses.'); setLoading(false); return; }
    const parsed = tourSchema.safeParse(tour.data?.scenes || []);
    if (!parsed.success) { setStatus('Konfigurasi tur tidak valid. Periksa data sebelum mengedit.'); setLoading(false); return; }
    setCatalog({ rooms: rooms.data || [], facilities: facilities.data || [] });
    setKnowledge(info.data?.knowledge || ''); setScenes(parsed.data); setSelected(parsed.data[0]?.id || ''); setPublished(tour.data?.published || false); setReady(true); setLoading(false);
  })(); return () => { active = false; }; }, [slug, hotelId]);
  const scene = scenes.find(s => s.id === selected);
  const update = (patch: Partial<TourScene>) => setScenes(items => items.map(s => s.id === selected ? { ...s, ...patch } : s));
  async function upload(file?: File) {
    if (!file || !scene) return;
    setBusy(true); setStatus('');
    try {
      if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 20*1024*1024) throw new Error('Gunakan JPG, PNG, atau WebP maksimal 20 MB.');
      const bitmap = await createImageBitmap(file); const valid = Math.abs(bitmap.width / bitmap.height - 2) < 0.05 && bitmap.width <= 8192; bitmap.close();
      if (!valid) throw new Error('Foto harus panorama equirectangular 2:1, lebar maksimal 8192 px. Disarankan 4096×2048.');
      const path = `${encodeURIComponent(slug)}/${crypto.randomUUID()}.${file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1]}`;
      const { error } = await db.storage.from('cleo-panoramas').upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      const { data } = db.storage.from('cleo-panoramas').getPublicUrl(path);
      update({ panorama: data.publicUrl }); setStatus('Foto berhasil diunggah. Simpan tur untuk menerapkan.');
    } catch (e) { setStatus(e instanceof Error ? e.message : 'Upload gagal. Periksa izin storage.'); } finally { setBusy(false); }
  }
  async function saveTour() {
    const result = tourSchema.safeParse(scenes);
    if (!result.success || (published && !scenes.length)) { setStatus('Lengkapi judul, foto panorama, penempatan, dan tujuan hotspot yang valid. Tur kosong tidak dapat dipublikasikan.'); return; }
    setBusy(true);
    const [rooms, facilities] = await Promise.all([
      db.from('Room').select('id,hotelId,name').eq('hotelId', hotelId),
      db.from('Facility').select('id,hotelId,name').eq('hotelId', hotelId),
    ]);
    if (rooms.error || facilities.error) { setStatus('Gagal memeriksa penempatan tur. Coba simpan kembali.'); setBusy(false); return; }
    const latestCatalog = { rooms: rooms.data || [], facilities: facilities.data || [] };
    setCatalog(latestCatalog);
    const invalid = result.data.find(scene => !placementTitle(scene.placement, hotel, latestCatalog));
    if (invalid) { setStatus(`Pilih kembali penempatan untuk “${invalid.title}”. Kamar/fasilitas harus masih tersedia di cabang ini.`); setSelected(invalid.id); setBusy(false); return; }
    const { error } = await db.from('hotel_tours').upsert({ hotel_slug: slug, scenes: result.data, published, updated_at: new Date().toISOString() });
    setStatus(error ? 'Tur gagal disimpan. Periksa akses akun/database.' : published ? 'Tur tersimpan. Tampil sesuai penempatan dan di galeri 360° beranda.' : 'Draf tur tersimpan; belum ditampilkan ke tamu.'); setBusy(false);
  }
  const selectedPlacement = scene ? placementKey(scene.placement) : '';
  const preview = useMemo(() => {
    const selectedScenes = scenes.filter(s => s.panorama && placementKey(s.placement) === selectedPlacement);
    return selectedScenes.length ? scopedScenes(selectedScenes, selectedScenes[0].placement).map(s => ({ ...s, title: s.title || 'Panorama' })) : [];
  }, [scenes, selectedPlacement]);
  const targetOptions = scene?.placement.type === 'room' ? catalog.rooms : catalog.facilities;
  const destination = scene ? placementTitle(scene.placement, hotel, catalog) : undefined;
  const hotspotTargets = scenes.filter(s => s.id !== selected && placementKey(s.placement) === selectedPlacement);
  if (loading) return <p role="status">Memuat cabang…</p>;
  if (!ready) return <p role="alert">{status}</p>;
  return <>
    <section className="admin-card"><h2>Pengetahuan AI · {name}</h2><p>Tulis FAQ yang sudah diverifikasi: jam check-in/out, kebijakan anak, parkir, sarapan, atau aksesibilitas. Informasi ini bersifat publik.</p><textarea aria-label="Hotel knowledge" value={knowledge} maxLength={12000} rows={7} onChange={e => setKnowledge(e.target.value)} placeholder="Pertanyaan: ... Jawaban: ..."/><button className="cleo-button" disabled={busy} onClick={async () => { setBusy(true); const { error } = await db.from('hotel_concierge').upsert({ hotel_slug: slug, knowledge, updated_at: new Date().toISOString() }); setStatus(error ? 'FAQ gagal disimpan.' : 'FAQ tersimpan.'); setBusy(false); }}><Save size={16}/> Simpan FAQ</button></section>
    <section className="admin-card"><div className="flex flex-wrap justify-between gap-4"><div><h2>Virtual tour 360°</h2><p>Pilih tempat tampil setiap panorama. Panorama pertama pada penempatan yang sama menjadi titik masuk tur. Semua tur yang dipublikasikan juga tampil di beranda.</p></div><button className="cleo-button" disabled={busy || scenes.length >= 40} onClick={() => { const s: TourScene = { id: crypto.randomUUID(), title: '', panorama: '', pitch: 0, yaw: 0, hotspots: [], placement: scene?.placement || { type: 'hotel' } }; setScenes(v => [...v,s]); setSelected(s.id); setCoords(undefined); setTarget(''); }}><Plus size={16}/> Tambah panorama</button></div>
    <div className="scene-tabs">{scenes.map((s,i) => <button key={s.id} disabled={busy} aria-pressed={s.id === selected} onClick={() => { setSelected(s.id); setCoords(undefined); setTarget(''); }}>{i+1}. {s.title || 'Panorama baru'} · {placementTitle(s.placement, hotel, catalog) || 'Pilih penempatan'}</button>)}</div>
    {scene && <div className="scene-editor"><label>Nama panorama<input value={scene.title} maxLength={100} disabled={busy} onChange={e => update({ title: e.target.value })}/></label>
      <fieldset className="tour-placement" disabled={busy}>
        <legend>Penempatan panorama</legend>
        <label>Tampilkan di<select value={scene.placement.type} onChange={e => {
          const type = e.target.value as TourScene['placement']['type'];
          update({ placement: type === 'hotel' ? { type } : { type, targetId: '' } }); setCoords(undefined); setTarget('');
        }}><option value="hotel">Umum hotel</option><option value="room">Kamar tertentu</option><option value="facility">Fasilitas tertentu</option></select></label>
        {scene.placement.type !== 'hotel' && <label>{scene.placement.type === 'room' ? 'Pilih kamar' : 'Pilih fasilitas'} · {name}
          <select value={scene.placement.targetId} onChange={e => { if (scene.placement.type !== 'hotel') update({ placement: { type: scene.placement.type, targetId: e.target.value } }); setCoords(undefined); setTarget(''); }}>
            <option value="">Pilih tujuan penempatan</option>
            {scene.placement.targetId && !destination && <option value={scene.placement.targetId}>Tujuan tidak tersedia — pilih ulang</option>}
            {targetOptions.map(item => <option key={item.id} value={String(item.id)}>{item.name}</option>)}
          </select>
          {!targetOptions.length && <span>Belum ada data. Tambahkan {scene.placement.type === 'room' ? 'kamar' : 'fasilitas'} pada cabang ini terlebih dahulu.</span>}
        </label>}
        <p>{destination ? `Tampil di: ${name} → ${scene.placement.type === 'hotel' ? 'Tur umum hotel' : `${scene.placement.type === 'room' ? 'Kamar' : 'Fasilitas'} → ${destination}`}. Juga tersedia di galeri 360° beranda setelah dipublikasikan.` : 'Pilih kamar/fasilitas tujuan sebelum menyimpan.'}</p>
      </fieldset>
      <label>Foto panorama 2:1 (maks. 20 MB)<input aria-label="Upload panorama" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e => { upload(e.target.files?.[0]); e.target.value=''; }}/></label>{scene.panorama && <p className="text-sm text-blue-700 flex items-center gap-2"><Upload size={16}/> Foto sudah tersedia</p>}
      <div className="flex flex-wrap gap-2"><button disabled={busy || scenes[0]?.id === scene.id} onClick={() => setScenes(v => { const a = [...v], i = a.findIndex(s => s.id === selected); [a[i-1],a[i]] = [a[i],a[i-1]]; return a; })}><ArrowUp size={16}/> Lebih awal</button><button disabled={busy || scenes.at(-1)?.id === scene.id} onClick={() => setScenes(v => { const a = [...v], i = a.findIndex(s => s.id === selected); [a[i+1],a[i]] = [a[i],a[i+1]]; return a; })}><ArrowDown size={16}/> Lebih akhir</button><button disabled={busy} onClick={() => { if (!window.confirm('Hapus ruangan dan semua hotspot yang menuju ke ruangan ini?')) return; setScenes(v => v.filter(s => s.id !== selected).map(s => ({ ...s, hotspots: s.hotspots.filter(h => h.target !== selected) }))); setSelected(''); }}><Trash2 size={16}/> Hapus ruangan</button></div>
      <p>Arahkan kamera pada preview, lalu klik “Ambil arah pandang” untuk posisi awal atau hotspot. Hotspot hanya ditampilkan jika tujuannya memiliki penempatan yang sama.</p>
      {coords?.scene === selected && <div className="hotspot-editor"><p>Pitch {coords.pitch}° · Yaw {coords.yaw}°</p><button disabled={busy} onClick={() => update({ pitch: coords.pitch, yaw: coords.yaw })}>Jadikan arah awal</button><label>Tujuan hotspot<select value={target} onChange={e => setTarget(e.target.value)}><option value="">Pilih panorama pada penempatan ini</option>{hotspotTargets.map(s => <option key={s.id} value={s.id}>{s.title || 'Panorama baru'}</option>)}</select></label><label>Label hotspot<input value={label} maxLength={80} onChange={e => setLabel(e.target.value)}/></label><button disabled={busy || !hotspotTargets.some(s => s.id === target) || !label.trim() || scene.hotspots.length >= 30} onClick={() => { update({ hotspots: [...scene.hotspots, { id: crypto.randomUUID(), target, label: label.trim(), pitch: coords.pitch, yaw: coords.yaw }] }); setLabel(''); }}>Tambah hotspot</button></div>}
      <ul>{scene.hotspots.map(h => <li key={h.id}>{h.label} → {scenes.find(s => s.id === h.target)?.title}{!hotspotTargets.some(s => s.id === h.target) && ' (penempatan berbeda; tautan disembunyikan)'} <button disabled={busy} aria-label={`Hapus hotspot ${h.label}`} onClick={() => update({ hotspots: scene.hotspots.filter(s => s.id !== h.id) })}><Trash2 size={14}/></button></li>)}</ul>
    </div>}
    {preview.length > 0 && <TourViewer key={selectedPlacement} scenes={preview} title={destination || name} onView={onView}/>}
    <label className="publish-toggle"><input type="checkbox" disabled={busy} checked={published} onChange={e => setPublished(e.target.checked)}/> Publikasikan sesuai penempatan dan di beranda</label><button className="cleo-button" disabled={busy} onClick={saveTour}><Save size={16}/> {busy ? 'Memproses…' : 'Simpan tur'}</button>
    </section><p role="status" className="admin-status">{status}</p>
  </>;
}
