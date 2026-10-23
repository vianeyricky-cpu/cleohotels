'use client';
import { useState } from 'react';
import Image from 'next/image';
import { BedDouble, ChevronLeft, ChevronRight, Maximize, Users } from 'lucide-react';
import TourLaunch from '@/components/tour/TourLaunch';
import type { TourGroup } from '@/lib/cleo/tour';
import type { Room } from '@/types';
import { roomFact } from '@/lib/cleo/room';
import { ImageLightbox } from './ImageLightbox';

export function RoomCarousel({ rooms, tours = [], locale = 'en' }: { rooms: Room[]; tours?: TourGroup[]; locale?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const id = locale === 'id';
  if (!rooms?.length) return <div className="empty-message">Kamar untuk hotel ini belum tersedia.</div>;
  const activeRoom = rooms[currentIndex % rooms.length];
  const activeTour = tours.find(group => group.placement.type === 'room' && group.placement.targetId === String(activeRoom.id));
  return <div className="room-carousel" role="region" aria-label={id ? 'Pilihan kamar' : 'Room collection'} aria-roledescription="carousel">
    <div className="section-heading heading-with-link"><div><span className="eyebrow">{id ? 'RUANG UNTUK BERISTIRAHAT' : 'MAKE YOURSELF AT HOME'}</span><h2>Rooms</h2><p>Smartly designed spaces for your maximum comfort.</p></div>
      {rooms.length > 1 && <div className="carousel-controls"><span aria-live="polite">{String(currentIndex + 1).padStart(2, '0')} <span>/ {String(rooms.length).padStart(2, '0')}</span></span><button type="button" onClick={() => setCurrentIndex(index => (index - 1 + rooms.length) % rooms.length)} className="icon-button" aria-label={id ? 'Kamar sebelumnya' : 'Previous room'}><ChevronLeft size={20}/></button><button type="button" onClick={() => setCurrentIndex(index => (index + 1) % rooms.length)} className="icon-button" aria-label={id ? 'Kamar berikutnya' : 'Next room'}><ChevronRight size={20}/></button></div>}
    </div>
    <div className="room-feature" aria-live="polite">
      <button className="room-feature-image" type="button" onClick={() => setSelectedImage(activeRoom.image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80')} aria-label={`${id ? 'Perbesar foto' : 'Enlarge photo'} ${activeRoom.name}`}><Image src={activeRoom.image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80'} alt={activeRoom.name} fill sizes="(max-width: 800px) 100vw, 60vw" className="object-cover"/><span><Maximize size={17}/></span></button>
      <div className="room-feature-copy"><span className="eyebrow">CLEO COMFORT</span><h3>{activeRoom.name}</h3><p>{activeRoom.description || 'Enjoy stylish comfort for a relaxing and restful stay.'}</p><div className="room-specs">{activeRoom.size && <span><Maximize size={18} strokeWidth={1.3}/>{roomFact(activeRoom.size, 'm²')}</span>}{activeRoom.capacity && <span><Users size={18} strokeWidth={1.3}/>{roomFact(activeRoom.capacity, id ? 'tamu' : 'guests')}</span>}{activeRoom.bedType && <span><BedDouble size={18} strokeWidth={1.3}/>{activeRoom.bedType}</span>}</div><TourLaunch key={activeRoom.id} group={activeTour} locale={locale}/></div>
    </div>
    {rooms.length > 1 && <div className="carousel-dots">{rooms.map((room, index) => <button type="button" key={room.id} aria-label={`${id ? 'Lihat kamar' : 'View room'} ${room.name}`} aria-pressed={index === currentIndex} onClick={() => setCurrentIndex(index)}><span/></button>)}</div>}
    {activeRoom.images?.length > 0 && <div className="room-thumbnails"><p>{id ? 'Foto lainnya' : 'More Views'}</p><div>{activeRoom.images.map((src, index) => <button type="button" key={`${src}-${index}`} onClick={() => setSelectedImage(src)} aria-label={`${activeRoom.name}, ${id ? 'foto' : 'view'} ${index + 1}`}><Image src={src} alt={`${activeRoom.name} view ${index + 1}`} fill sizes="130px" className="object-cover"/></button>)}</div></div>}
    <ImageLightbox src={selectedImage} alt={`${activeRoom.name}, enlarged view`} onClose={() => setSelectedImage(null)}/>
  </div>;
}
