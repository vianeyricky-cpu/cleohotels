'use client';
import { BookingWidget } from './BookingWidget';
export function SingleBookingWidget({ slug }: { slug: string }) { return <BookingWidget key={slug} defaultHotelSlug={slug} />; }
