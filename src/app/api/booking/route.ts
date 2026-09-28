import { NextRequest, NextResponse } from 'next/server';
import { resolveBranch, validStay } from '@/lib/cleo/branches';
import { officialBookingUrl } from '@/lib/cleo/booking';
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const branch = resolveBranch(q.get('branch'));
  const checkin = q.get('checkin') || '', checkout = q.get('checkout') || '';
  const adult = Number(q.get('adult') || 1), child = Number(q.get('child') || 0);
  if (!branch || !validStay(checkin, checkout) || !Number.isInteger(adult) || adult < 1 || adult > 6 || !Number.isInteger(child) || child < 0 || child > 2) return NextResponse.json({ error: 'Pilih cabang dan tanggal menginap yang valid (maks. 30 malam).' }, { status: 400 });
  const link = await officialBookingUrl(branch);
  if (!link) return NextResponse.json({ error: 'Booking cabang ini belum dapat dihubungi. Silakan coba lagi atau hubungi hotel.', phone: branch.phone }, { status: 503 });
  const url = new URL(link);
  for (const [key, value] of Object.entries({ checkin, checkout, adult: String(adult), child: String(child), property: branch.propertyId, group_id: '46', promocode: (q.get('promocode') || '').slice(0, 60) })) url.searchParams.set(key, value);
  return NextResponse.json({ url: url.href, branch: branch.key }, { headers: { 'Cache-Control': 'no-store' } });
}
