import { getHotels } from '@/actions/getHotels';

/** Keep public booking/contact available when the hotel catalog is offline. */
export async function getPublicHotels() {
  try {
    return await getHotels();
  } catch (error) {
    console.error('Public hotel catalog unavailable:', error);
    return null;
  }
}
