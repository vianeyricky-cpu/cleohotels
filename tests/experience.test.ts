import test from 'node:test';
import assert from 'node:assert/strict';
import { branches, resolveBranch, validStay, safeHttps } from '../src/lib/cleo/branches';
import { parseAvailability } from '../src/lib/cleo/availability';
import { tourSchema } from '../src/lib/cleo/tour';
import { officialBookingUrl } from '../src/lib/cleo/booking';
const stay = { checkin: '2030-01-10', checkout: '2030-01-12', adults: 2, children: 0 };
const now = Date.now();
const payload = { propertyId: '297', ...stay, checkedAt: new Date(now).toISOString(), rooms: [{ name: 'Standard', available: 2 }] };
test('each legacy slug maps to its own property, no default branch for unknown values', () => {
  assert.equal(resolveBranch('cleo-hotel-tunjungan')?.propertyId, '296');
  assert.equal(resolveBranch('cleo-jemursari')?.propertyId, '297');
  assert.equal(resolveBranch('cleo-walikota-mustajab')?.propertyId, '298');
  assert.equal(resolveBranch('Cleo Hotel Balaikota Surabaya')?.propertyId, '298');
  assert.equal(resolveBranch('other-hotel'), undefined);
  assert.equal(resolveBranch('jemursari-tunjungan'), undefined);
});
test('reject past, invalid, reversed, same-day and excessively long stays', () => {
  const today = '2030-01-01';
  assert.ok(validStay(stay.checkin, stay.checkout, today));
  for(const [a,b] of [['2029-12-31','2030-01-02'],['2030-02-30','2030-03-02'],['2030-01-10','2030-01-10'],['2030-01-12','2030-01-10'],['2030-01-10','2030-03-10']]) assert.equal(validStay(a,b,today), false);
});
test('availability accepted only for matching property, dates, occupancy and fresh timestamp', () => {
  assert.ok(parseAvailability(payload, branches[1], stay, now));
  for(const patch of [{ propertyId:'296' },{ checkin:'2030-01-11' },{ adults:1 },{ children:1 },{ checkedAt:new Date(now-121000).toISOString() },{ checkedAt:new Date(now+31000).toISOString() },{ rooms:[{ name:'Standard',available:-1 }] }]) assert.equal(parseAvailability({...payload,...patch},branches[1],stay,now),null);
});
test('reject unsafe URLs', () => { for(const value of ['javascript:alert(1)','http://example.com','https://user:password@example.com']) assert.equal(safeHttps(value),null); });
const a = '3c03f009-2dc2-4b55-8a85-000000000001', b = '3c03f009-2dc2-4b55-8a85-000000000002', c = '3c03f009-2dc2-4b55-8a85-000000000003';
const scenes = [{ id:a,title:'Lobby',panorama:'https://example.com/a.jpg',pitch:0,yaw:0,hotspots:[{id:c,target:b,label:'Room',pitch:0,yaw:30}] },{id:b,title:'Room',panorama:'https://example.com/b.jpg',pitch:0,yaw:0,hotspots:[]}];
test('tour allows valid transitions and rejects cross-tour/deleted scene destinations', () => {
  assert.ok(tourSchema.safeParse(scenes).success);
  assert.equal(tourSchema.safeParse([scenes[0]]).success,false);
  assert.equal(tourSchema.safeParse([scenes[0],scenes[0]]).success,false);
  assert.equal(tourSchema.safeParse([{...scenes[1], panorama:'javascript:alert(1)'}]).success,false);
});
test('official booking lookup selects by ID AND name and fails closed on mismatches/errors', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => Response.json([{id:296,name:'Cleo Hotel Tunjungan',reservation_link:'https://cleohoteltunjunga.reserveonline.id/book/296'}, {id:297,name:'Cleo Hotel Jemursari',reservation_link:'https://cleojemursari.reserveonline.id/book/297'}]);
    assert.equal(await officialBookingUrl(branches[1]), 'https://cleojemursari.reserveonline.id/book/297');
    assert.equal(await officialBookingUrl(branches[2]), null);
    globalThis.fetch = async () => Response.json([{id:297,name:'Cleo Hotel Tunjungan',reservation_link:'https://wrong.example/book/296'}]);
    assert.equal(await officialBookingUrl(branches[1]), null);
    globalThis.fetch = async () => { throw new Error('timeout'); };
    assert.equal(await officialBookingUrl(branches[0]), null);
  } finally { globalThis.fetch = original; }
});
