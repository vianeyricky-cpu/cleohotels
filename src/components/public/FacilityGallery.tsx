'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Maximize } from 'lucide-react';
import TourLaunch from '@/components/tour/TourLaunch';
import type { TourGroup } from '@/lib/cleo/tour';
import type { Facility } from '@/types';
import { ImageLightbox } from './ImageLightbox';

export function FacilityGallery({ facilities, tours = [], locale = 'en' }: { facilities: Facility[]; tours?: TourGroup[]; locale?: string }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState('Hotel facility');
  const selectImage = (image: string, name: string) => { setSelectedImage(image); setSelectedName(name); };
  if (!facilities?.length) return <div className="empty-message">Fasilitas untuk hotel ini belum ditambahkan.</div>;
  return <><div className="facility-grid">{facilities.map(facility => <article className="facility-card" key={facility.id}>
    <button type="button" className="facility-image" aria-label={`${locale === 'id' ? 'Perbesar foto' : 'Enlarge photo'} ${facility.name}`} onClick={() => selectImage(facility.image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80', facility.name)}><Image src={facility.image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80'} alt={facility.name} fill sizes="(max-width: 800px) 90vw, 33vw" className="object-cover"/>{facility.type && <span className="facility-type">{facility.type}</span>}<span className="facility-zoom"><Maximize size={16}/></span></button>
    <div className="facility-copy">{facility.images?.length > 0 && <div className="facility-thumbnails">{facility.images.map((src, index) => <button type="button" key={`${src}-${index}`} onClick={() => selectImage(src, facility.name)} aria-label={`${facility.name}, view ${index + 1}`}><Image src={src} alt={`${facility.name} view ${index + 1}`} fill sizes="72px" className="object-cover"/></button>)}</div>}<h3>{facility.name}</h3><p>{facility.description}</p><TourLaunch group={tours.find(group => group.placement.type === 'facility' && group.placement.targetId === String(facility.id))} locale={locale}/></div>
  </article>)}</div><ImageLightbox src={selectedImage} alt={selectedName} onClose={() => setSelectedImage(null)}/></>;
}
