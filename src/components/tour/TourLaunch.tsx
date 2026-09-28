'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { RotateCw, X } from 'lucide-react';
import type { TourGroup } from '@/lib/cleo/tour';
import TourViewer from './TourViewer';

export default function TourLaunch({ group, locale = 'en' }: { group?: TourGroup; locale?: string }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  if (!group) return null;
  return <>
    <button ref={trigger} type="button" className="tour-launch" onClick={() => setOpen(true)} aria-haspopup="dialog">
      <RotateCw size={18}/><span>{locale === 'id' ? 'Lihat 360°' : 'Explore 360°'} · {group.title}</span>
    </button>
    {open && createPortal(<TourDialog group={group} locale={locale} onClose={() => { setOpen(false); trigger.current?.focus(); }}/>, document.body)}
  </>;
}

function TourDialog({ group, locale, onClose }: { group: TourGroup; locale: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  return <dialog ref={dialog} className="tour-dialog" aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="tour-dialog-content">
      <header className="tour-dialog-heading"><div><p>{group.hotelName}</p><h2 id={titleId}>{group.title} · 360°</h2></div>
        <button type="button" autoFocus onClick={onClose} aria-label={locale === 'id' ? 'Tutup tur' : 'Close tour'}><X size={22}/></button>
      </header>
      <TourViewer scenes={group.scenes} title={group.title} autoStart bookingHref={`/${locale}/hotels/${group.hotelSlug}#booking`}/>
    </div>
  </dialog>;
}
