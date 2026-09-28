import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTourGroups, placementTitle, tourSchema, type TourPlacement } from '../src/lib/cleo/tour';

const hotels = [
  { id: 'hotel-t', slug: 'tunjungan', name: 'Cleo Tunjungan' },
  { id: 'hotel-j', slug: 'jemursari', name: 'Cleo Jemursari' },
];
const catalog = {
  rooms: [{ id: 'biz-t', hotelId: 'hotel-t', name: 'Biz Room' }, { id: 'cleo-t', hotelId: 'hotel-t', name: 'Cleo Room' }, { id: 'biz-j', hotelId: 'hotel-j', name: 'Biz Room' }],
  facilities: [{ id: 'meeting-t', hotelId: 'hotel-t', name: 'Meeting Room' }, { id: 'meeting-j', hotelId: 'hotel-j', name: 'Meeting Room' }],
};
const uuid = (n: number) => `3c03f009-2dc2-4b55-8a85-${String(n).padStart(12, '0')}`;
const scene = (n: number, placement?: TourPlacement) => ({ id: uuid(n), title: `Panorama ${n}`, panorama: `https://example.com/${n}.jpg`, pitch: 5, yaw: 20, hotspots: [], ...(placement ? { placement } : {}) });

test('legacy panoramas remain general hotel tours without modifying saved data', () => {
  const legacy = [scene(1)];
  const before = JSON.stringify(legacy);
  const groups = buildTourGroups(hotels, [{ hotel_slug: 'tunjungan', published: true, scenes: legacy }], catalog);
  assert.equal(groups.length, 1);
  assert.deepEqual(groups[0].placement, { type: 'hotel' });
  assert.equal(groups[0].scenes[0].panorama, legacy[0].panorama);
  assert.equal(groups[0].scenes[0].yaw, 20);
  assert.equal(JSON.stringify(legacy), before);
});

test('identically named rooms and facilities stay within their exact hotel and entity', () => {
  const groups = buildTourGroups(hotels, [
    { hotel_slug: 'tunjungan', published: true, scenes: [scene(1, { type: 'room', targetId: 'biz-t' }), scene(2, { type: 'room', targetId: 'cleo-t' }), scene(3, { type: 'facility', targetId: 'meeting-t' })] },
    { hotel_slug: 'jemursari', published: true, scenes: [scene(4, { type: 'room', targetId: 'biz-j' }), scene(5, { type: 'facility', targetId: 'meeting-j' })] },
  ], catalog);
  assert.equal(groups.length, 5);
  assert.equal(new Set(groups.map(group => group.id)).size, 5);
  assert.deepEqual(groups.filter(group => group.hotelSlug === 'tunjungan').flatMap(group => group.scenes.map(scene => scene.id)), [uuid(1), uuid(2), uuid(3)]);
  assert.deepEqual(groups.find(group => group.id === 'tunjungan:room:biz-t')?.scenes.map(scene => scene.id), [uuid(1)]);
  assert.equal(groups.filter(group => group.placement.type === 'hotel').length, 0);
});

test('missing, deleted, cross-branch and wrong-kind targets are hidden instead of becoming general tours', () => {
  const groups = buildTourGroups(hotels, [{ hotel_slug: 'tunjungan', published: true, scenes: [
    scene(1, { type: 'room', targetId: 'deleted' }), scene(2, { type: 'room', targetId: 'biz-j' }),
    scene(3, { type: 'facility', targetId: 'meeting-j' }), scene(4, { type: 'room', targetId: 'meeting-t' }),
    scene(5, { type: 'facility', targetId: 'biz-t' }), scene(6, { type: 'room', targetId: 'biz-t' }),
  ] }], catalog);
  assert.deepEqual(groups.flatMap(group => group.scenes.map(scene => scene.id)), [uuid(6)]);
  assert.equal(placementTitle({ type: 'room', targetId: 'biz-j' }, hotels[0], catalog), undefined);
});

test('hotspots remain usable within one placement and cannot navigate into other placements', () => {
  const saved = [
    { ...scene(1, { type: 'room', targetId: 'biz-t' }), hotspots: [
      { id: uuid(10), target: uuid(2), label: 'Other angle', pitch: 0, yaw: 10 },
      { id: uuid(11), target: uuid(3), label: 'Unrelated facility', pitch: 0, yaw: 20 },
    ] },
    scene(2, { type: 'room', targetId: 'biz-t' }), scene(3, { type: 'facility', targetId: 'meeting-t' }),
  ];
  const groups = buildTourGroups(hotels, [{ hotel_slug: 'tunjungan', published: true, scenes: saved }], catalog);
  assert.equal(groups[0].scenes.length, 2);
  assert.deepEqual(groups[0].scenes[0].hotspots.map(spot => spot.target), [uuid(2)]);
  assert.equal(saved[0].hotspots.length, 2, 'saved links are preserved for later reassignment');
});

test('homepage includes all published branches but never draft, unknown or malformed tours', () => {
  const groups = buildTourGroups(hotels, [
    { hotel_slug: 'tunjungan', published: true, scenes: [scene(1)] },
    { hotel_slug: 'jemursari', published: false, scenes: [scene(2)] },
    { hotel_slug: 'unknown', published: true, scenes: [scene(3)] },
  ], catalog);
  assert.deepEqual(groups.map(group => group.hotelSlug), ['tunjungan']);
  assert.equal(tourSchema.safeParse([scene(4, { type: 'room', targetId: '' })]).success, false);
  assert.equal(buildTourGroups(hotels, [{ hotel_slug: 'tunjungan', published: true, scenes: [{ ...scene(1), placement: { type: 'other' } }] }], catalog).length, 0);
});

test('reassigning an existing panorama moves its location without changing the photo', () => {
  const existing = scene(1);
  const assigned = { ...existing, placement: { type: 'room' as const, targetId: 'biz-t' } };
  const groups = buildTourGroups(hotels, [{ hotel_slug: 'tunjungan', published: true, scenes: [assigned] }], catalog);
  assert.deepEqual(groups.map(group => group.id), ['tunjungan:room:biz-t']);
  assert.equal(groups[0].scenes[0].panorama, existing.panorama);
  assert.equal(groups[0].scenes[0].id, existing.id);
  assert.equal(placementTitle(assigned.placement, hotels[0], { ...catalog, rooms: catalog.rooms.map(room => room.id === 'biz-t' ? { ...room, name: 'Biz Room Updated' } : room) }), 'Biz Room Updated');
});
