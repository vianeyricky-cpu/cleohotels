'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

export function ImageLightbox({ src, alt, onClose }: { src: string | null; alt: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!src) { if (node?.open) node.close(); return; }
    node?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [src]);
  return <dialog ref={ref} className="image-lightbox" aria-label={alt} onClose={onClose} onClick={event => { if (event.target === event.currentTarget) ref.current?.close(); }}>
    <button type="button" className="lightbox-close" aria-label="Close image" onClick={() => ref.current?.close()}><X size={25}/></button>
    {src && <div className="lightbox-image"><Image src={src} alt={alt} fill sizes="95vw" className="object-contain"/></div>}
  </dialog>;
}
