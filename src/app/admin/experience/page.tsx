'use client';
import { useCallback, useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Plus, Trash2, Save, ArrowUp, ArrowDown, Upload } from 'lucide-react';
import { supabaseClient as db } from '@/lib/supabase/client';
import { tourSchema, TourScene } from '@/lib/cleo/tour';
const TourViewer = dynamic(() => import('@/components/tour/TourViewer'), { ssr: false });
type Hotel = { slug: string; name: string };
export default function ExperienceAdmin() {
  const [hotels, setHotels] = useState<Hotel[]>([]), [slug, setSlug] = useState(''), [allowed, setAllowed] = useState(false), [checked, setChecked] = useState(false);
  useEffect(() => { let active = true; (async () => {
    const { data } = await db.auth.getUser();
    if (!active) return;
    setAllowed(data.user?.app_metadata?.cleo_admin === true); setChecked(true);
    if (data.user?.app_metadata?.cleo_admin) { const result = await db.from('Hotel').select('slug,name').order('name'); if(active) setHotels(result.data || []); }
  })(); return () => { active = false; }; }, []);
  if (!checked) return <p role="status">Memeriksa akses…</p>;
  if (!allowed) return <div className="admin-experience"><h1>Akses pengelola diperlukan</h1><p>Akun ini belum memiliki peran cleo_admin. Minta pemilik proyek Supabase mengaktifkan app_metadata.cleo_admin untuk akun pengelola, lalu login ulang.</p></div>;
  return <div className="admin-experience"><span className="eyebrow">GUEST EXPERIENCE</span><h1>Concierge & Virtual Tour</h1><p>Informasi dan panorama dikelola terpisah untuk setiap cabang. Jangan masukkan harga atau stok kamar ke FAQ.</p><label>Cabang hotel<select value={slug} onChange={e => { if (!slug || window.confirm('Pindah cabang? Perubahan yang belum disimpan akan hilang.')) setSlug(e.target.value); }}><option value="">Pilih cabang</option>{hotels.map(h => <option key={h.slug} value={h.slug}>{h.name}</option>)}</select></label>{slug && <ExperienceEditor key={slug} slug={slug} name={hotels.find(h => h.slug === slug)?.name || slug}/>}</div>;
}
function ExperienceEditor({ slug, name }: { slug: string; name: string }) {
  const [knowledge, setKnowledge] = useState(''), [scenes, setScenes] = useState<TourScene[]>([]), [published, setPublished] = useState(false), [selected, setSelected] = useState('');
  const [busy, setBusy] = useState(false), [loading, setLoading] = useState(true), [status, setStatus] = useState(''), [ready, setReady] = useState(false);
  const [coords, setCoords] = useState<{ scene: string; pitch: number; yaw: number }>(), [target, setTarget] = useState(''), [label, setLabel] = useState('');
  const onView = useCallback((scene: string, pitch: number, yaw: number) => { setSelected(scene); setCoords({ scene, pitch, yaw }); }, []);
  useEffect(() => { let active = true; (async () => {
    const [info, tour] = await Promise.all([db.from('hotel_concierge').select('knowledge').eq('hotel_slug', slug).maybeSingle(), db.from('hotel_tours').select('scenes,published').eq('hotel_slug', slug).maybeSingle()]);
    if (!active) return;
    if (info.error || tour.error) { setStatus('Gagal memuat. Pastikan migrasi database sudah dijalankan dan akun memiliki akses.'); setLoading(false); return; }
    const parsed = tourSchema.safeParse(tour.data?.scenes || []);
    if (!parsed.success) { setStatus('Konfigurasi tur tidak valid. Periksa data sebelum mengedit.'); setLoading(false); return; }
    setKnowledge(info.data?.knowledge || ''); setScenes(parsed.data); setSelected(parsed.data[0]?.id || ''); setPublished(tour.data?.published || false); setReady(true); setLoading(false);
  })(); return () => { active = false; }; }, [slug]);
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
    if (!result.success || (published && !scenes.length)) { setStatus('Lengkapi judul, foto panorama, dan tujuan hotspot yang valid. Tur kosong tidak dapat dipublikasikan.'); return; }
    setBusy(true);
    const { error } = await db.from('hotel_tours').upsert({ hotel_slug: slug, scenes: result.data, published, updated_at: new Date().toISOString() });
    setStatus(error ? 'Tur gagal disimpan. Periksa akses akun/database.' : published ? 'Tur tersimpan dan tampil di halaman hotel.' : 'Draf tur tersimpan; belum ditampilkan ke tamu.'); setBusy(false);
  }
  const preview = useMemo(() => scenes.filter(s => s.panorama).map(s => ({ ...s, title: s.title || 'Ruangan', hotspots: s.hotspots.filter(h => scenes.some(t => t.id === h.target && t.panorama)) })), [scenes]);
  if (loading) return <p role="status">Memuat cabang…</p>;
  if (!ready) return <p role="alert">{status}</p>;
  return <>
    <section className="admin-card"><h2>Pengetahuan AI · {name}</h2><p>Tulis FAQ yang sudah diverifikasi: jam check-in/out, kebijakan anak, parkir, sarapan, atau aksesibilitas. Informasi ini bersifat publik.</p><textarea aria-label="Hotel knowledge" value={knowledge} maxLength={12000} rows={7} onChange={e => setKnowledge(e.target.value)} placeholder="Pertanyaan: ... Jawaban: ..."/><button className="cleo-button" disabled={busy} onClick={async () => { setBusy(true); const { error } = await db.from('hotel_concierge').upsert({ hotel_slug: slug, knowledge, updated_at: new Date().toISOString() }); setStatus(error ? 'FAQ gagal disimpan.' : 'FAQ tersimpan.'); setBusy(false); }}><Save size={16}/> Simpan FAQ</button></section>
    <section className="admin-card"><div className="flex flex-wrap justify-between gap-4"><div><h2>Virtual tour 360°</h2><p>Ruangan pertama menjadi titik masuk tur. Foto tidak diubah atau dipotong saat upload.</p></div><button className="cleo-button" disabled={busy || scenes.length >= 40} onClick={() => { const s: TourScene = { id: crypto.randomUUID(), title: '', panorama: '', pitch: 0, yaw: 0, hotspots: [] }; setScenes(v => [...v,s]); setSelected(s.id); }}><Plus size={16}/> Tambah ruangan</button></div>
    <div className="scene-tabs">{scenes.map((s,i) => <button key={s.id} aria-pressed={s.id === selected} onClick={() => { setSelected(s.id); setCoords(undefined); }}>{i+1}. {s.title || 'Ruangan baru'}</button>)}</div>
    {scene && <div className="scene-editor"><label>Nama ruangan<input value={scene.title} maxLength={100} onChange={e => update({ title: e.target.value })}/></label><label>Foto panorama 2:1 (maks. 20 MB)<input aria-label="Upload panorama" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e => { upload(e.target.files?.[0]); e.target.value=''; }}/></label>{scene.panorama && <p className="text-sm text-blue-700 flex items-center gap-2"><Upload size={16}/> Foto sudah tersedia</p>}
      <div className="flex flex-wrap gap-2"><button disabled={busy || scenes[0]?.id === scene.id} onClick={() => setScenes(v => { const a = [...v], i = a.findIndex(s => s.id === selected); [a[i-1],a[i]] = [a[i],a[i-1]]; return a; })}><ArrowUp size={16}/> Lebih awal</button><button disabled={busy || scenes.at(-1)?.id === scene.id} onClick={() => setScenes(v => { const a = [...v], i = a.findIndex(s => s.id === selected); [a[i+1],a[i]] = [a[i],a[i+1]]; return a; })}><ArrowDown size={16}/> Lebih akhir</button><button disabled={busy} onClick={() => { if (!window.confirm('Hapus ruangan dan semua hotspot yang menuju ke ruangan ini?')) return; setScenes(v => v.filter(s => s.id !== selected).map(s => ({ ...s, hotspots: s.hotspots.filter(h => h.target !== selected) }))); setSelected(''); }}><Trash2 size={16}/> Hapus ruangan</button></div>
      <p>Arahkan kamera pada preview, lalu klik “Ambil arah pandang” untuk posisi awal atau hotspot.</p>
      {coords?.scene === selected && <div className="hotspot-editor"><p>Pitch {coords.pitch}° · Yaw {coords.yaw}°</p><button onClick={() => update({ pitch: coords.pitch, yaw: coords.yaw })}>Jadikan arah awal</button><label>Tujuan hotspot<select value={target} onChange={e => setTarget(e.target.value)}><option value="">Pilih ruangan tujuan</option>{scenes.filter(s => s.id !== selected).map(s => <option key={s.id} value={s.id}>{s.title || 'Ruangan baru'}</option>)}</select></label><label>Label hotspot<input value={label} maxLength={80} onChange={e => setLabel(e.target.value)}/></label><button disabled={!target || !label.trim() || scene.hotspots.length >= 30} onClick={() => { update({ hotspots: [...scene.hotspots, { id: crypto.randomUUID(), target, label: label.trim(), pitch: coords.pitch, yaw: coords.yaw }] }); setLabel(''); }}>Tambah hotspot</button></div>}
      <ul>{scene.hotspots.map(h => <li key={h.id}>{h.label} → {scenes.find(s => s.id === h.target)?.title} <button aria-label={`Hapus hotspot ${h.label}`} onClick={() => update({ hotspots: scene.hotspots.filter(s => s.id !== h.id) })}><Trash2 size={14}/></button></li>)}</ul>
    </div>}
    {preview.length > 0 && <TourViewer scenes={preview} title={name} onView={onView}/>}
    <label className="publish-toggle"><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)}/> Publikasikan di halaman hotel</label><button className="cleo-button" disabled={busy} onClick={saveTour}><Save size={16}/> {busy ? 'Memproses…' : 'Simpan tur'}</button>
    </section><p role="status" className="admin-status">{status}</p>
  </>;
}
