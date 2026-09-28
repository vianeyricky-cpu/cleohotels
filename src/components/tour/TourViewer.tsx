'use client';
import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Maximize, Minimize, Plus, Minus, RotateCw, Pause, ArrowUpRight, RefreshCw } from 'lucide-react';
import type { TourScene, PanoramaViewer } from '@/lib/cleo/tour';
export default function TourViewer({ scenes, title, bookingHref, onView }: { scenes: TourScene[]; title: string; bookingHref?: string; onView?: (scene: string, pitch: number, yaw: number) => void }) {
  const node = useRef<HTMLDivElement>(null), container = useRef<HTMLDivElement>(null), instance = useRef<PanoramaViewer>();
  const [ready, setReady] = useState(false), [started, setStarted] = useState(!!onView), [error, setError] = useState(''), [loading, setLoading] = useState(true), [retry, setRetry] = useState(0);
  const [active, setActive] = useState(scenes[0]?.id), [rotating, setRotating] = useState(false), [fullscreen, setFullscreen] = useState(false);
  useEffect(() => { if (window.pannellum) setReady(true); }, []);
  useEffect(() => {
    const handler = () => setFullscreen(document.fullscreenElement === container.current);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);
  useEffect(() => {
    if (!ready || !started || !node.current || !scenes.length || !window.pannellum) return;
    setLoading(true); setError(''); setActive(scenes[0].id); setRotating(false);
    let viewer: PanoramaViewer | undefined;
    let timer: ReturnType<typeof setTimeout>;
    let observer: ResizeObserver | undefined;
    try {
      viewer = window.pannellum.viewer(node.current, {
        default: { firstScene: scenes[0].id, autoLoad: true, showControls: false, escapeHTML: true, sceneFadeDuration: 700, crossOrigin: 'anonymous', hfov: 105, minHfov: 45, maxHfov: 120 },
        scenes: Object.fromEntries(scenes.map(scene => [scene.id, {
          type: 'equirectangular', panorama: scene.panorama, pitch: scene.pitch, yaw: scene.yaw,
          hotSpots: scene.hotspots.filter(h => scenes.some(s => s.id === h.target)).map(h => ({ pitch: h.pitch, yaw: h.yaw, type: 'scene', sceneId: h.target, text: h.label }))
        }]))
      });
      instance.current = viewer;
      const timeout = () => { clearTimeout(timer); timer = setTimeout(() => { setLoading(false); setError('Panorama belum termuat. Periksa koneksi, format foto 360°, dan izin akses gambar.'); }, 20000); };
      timeout();
      viewer.on('load', () => { clearTimeout(timer); setLoading(false); setError(''); viewer?.resize(); });
      viewer.on('scenechange', scene => { if (typeof scene === 'string') setActive(scene); setLoading(true); setRotating(false); viewer?.stopAutoRotate(); timeout(); });
      viewer.on('error', () => { clearTimeout(timer); setLoading(false); setError('Panorama tidak dapat ditampilkan. Coba kembali atau gunakan perangkat yang mendukung WebGL.'); });
      observer = new ResizeObserver(() => viewer?.resize()); observer.observe(node.current);
    } catch { setLoading(false); setError('Viewer 360° gagal dimuat. Perangkat perlu mendukung WebGL.'); }
    return () => { clearTimeout(timer); observer?.disconnect(); viewer?.destroy(); instance.current = undefined; };
  }, [ready, started, scenes, retry]);
  if (!scenes.length) return null;
  return <div className="tour-viewer" ref={container} aria-label={`Virtual tour ${title}`}>
    <Script src="/vendor/pannellum/pannellum.js" id="cleo-pannellum" onReady={() => setReady(true)} onError={() => setError('Viewer tidak berhasil dimuat. Muat ulang halaman untuk mencoba lagi.')} />
    <div ref={node} className="tour-canvas" />
    {!started && <div className="tour-cover" style={{ backgroundImage: `linear-gradient(0deg,rgba(6,27,48,.82),rgba(6,27,48,.2)),url(${JSON.stringify(scenes[0].panorama)})` }}><span className="eyebrow text-white">A CLOSER LOOK</span><h3>Step inside {title}</h3><button className="cleo-button" onClick={() => setStarted(true)}>Explore in 360° <ArrowUpRight size={18}/></button><p>Drag to look around · Pinch to zoom</p></div>}
    {started && <>
      <div className="tour-title"><span>360° VIRTUAL TOUR</span><strong>{scenes.find(s => s.id === active)?.title}</strong></div>
      {loading && !error && <div className="tour-status" role="status">Loading panorama…</div>}
      {error && <div className="tour-status" role="alert"><p>{error}</p><button onClick={() => setRetry(n => n + 1)}><RefreshCw size={16}/> Coba kembali</button></div>}
      <div className="tour-controls">
        <button aria-label="Zoom in" onClick={() => instance.current?.setHfov(Math.max(45, instance.current.getHfov()-10))}><Plus size={18}/></button>
        <button aria-label="Zoom out" onClick={() => instance.current?.setHfov(Math.min(120, instance.current.getHfov()+10))}><Minus size={18}/></button>
        <button aria-label={rotating ? 'Pause rotation' : 'Auto rotate'} aria-pressed={rotating} onClick={() => { if (rotating) instance.current?.stopAutoRotate(); else instance.current?.startAutoRotate(-1); setRotating(!rotating); }}>{rotating ? <Pause size={18}/> : <RotateCw size={18}/>}</button>
        <button aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} onClick={async () => { try { if (fullscreen) await document.exitFullscreen(); else if (container.current?.requestFullscreen) await container.current.requestFullscreen(); else setError('Fullscreen tidak didukung browser ini.'); } catch { setError('Fullscreen tidak tersedia.'); } }}>{fullscreen ? <Minimize size={18}/> : <Maximize size={18}/>}</button>
        {onView && <button className="tour-capture" onClick={() => { const v = instance.current; if(v) onView(active, Math.round(v.getPitch()*10)/10, Math.round(v.getYaw()*10)/10); }}>Ambil arah pandang</button>}
      </div>
      <div className="tour-scenes" aria-label="Pilih ruangan">{scenes.map(scene => <button key={scene.id} aria-pressed={scene.id === active} onClick={() => instance.current?.loadScene(scene.id)}><img src={scene.panorama} alt="" loading="lazy"/><span>{scene.title}</span></button>)}</div>
      {bookingHref && <a className="tour-book" href={bookingHref}>Book this hotel <ArrowUpRight size={15}/></a>}
    </>}
  </div>;
}
