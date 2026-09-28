import { supabase } from '@/lib/supabase';
import { buildTourGroups, type TourCatalog, type TourHotel } from './tour';

/** Optional catalog reuses the exact room/facility rows rendered by a hotel page. */
export async function getPublishedTourGroups(hotels: TourHotel[], catalog?: TourCatalog) {
  if (!hotels.length) return [];
  const ids = hotels.map(hotel => hotel.id);
  const [tours, rooms, facilities] = await Promise.all([
    supabase.from('hotel_tours').select('hotel_slug,scenes,published').in('hotel_slug', hotels.map(hotel => hotel.slug)).eq('published', true),
    catalog ? Promise.resolve({ data: catalog.rooms }) : supabase.from('Room').select('id,hotelId,name').in('hotelId', ids),
    catalog ? Promise.resolve({ data: catalog.facilities }) : supabase.from('Facility').select('id,hotelId,name').in('hotelId', ids),
  ]);
  return buildTourGroups(hotels, tours.data || [], { rooms: rooms.data || [], facilities: facilities.data || [] });
}
