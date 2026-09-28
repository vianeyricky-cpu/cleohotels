import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { POST } from '../src/app/api/concierge/route';
process.env.NEXT_PUBLIC_SUPABASE_URL='https://fixture.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='fixture-anon';
process.env.SUPABASE_SERVICE_ROLE_KEY='fixture-service';
process.env.CHAT_RATE_LIMIT_SECRET='test-only-not-a-production-secret';
process.env.GEMINI_API_KEY='test-only'; process.env.GEMINI_MODEL='test-model';
const hotels=[{id:'1',slug:'cleo-jemursari',name:'Cleo Jemursari',Room:[],Facility:[]}];
const req=(body:unknown, origin='http://localhost') => new NextRequest('http://localhost/api/concierge',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)});
test('concierge rejects malformed and cross-origin requests before calling providers',async()=>{
  assert.equal((await POST(req({message:'hello'},'https://other.example'))).status,403);
  assert.equal((await POST(req({message:'x'.repeat(1201)}))).status,400);
  assert.equal((await POST(req({message:'hi',branch:'unknown'}))).status,400);
});
test('concierge isolates branches, never infers stock, and normalizes out-of-scope responses',async()=>{
  const original=globalThis.fetch; let geminiCalls=0;
  globalThis.fetch=async (url)=>{
    const value=String(url);
    if(value.includes('/rpc/')) return Response.json(true);
    if(value.includes('/Hotel?')) return Response.json(hotels);
    if(['/hotel_concierge?', '/promos?', '/PromoPopup?', '/hotel_tours?'].some(p => value.includes(p))) return Response.json([]);
    if(value.includes('generativelanguage')) {geminiCalls++;return Response.json({candidates:[{content:{parts:[{text:JSON.stringify({relevant:false,answer:'untrusted off topic output'})}]}}]});}
    throw new Error('Unexpected upstream');
  };
  try {
    let result=await (await POST(req({message:'Kamar tersedia?',branch:'jemursari',locale:'id'}))).json();
    assert.match(result.answer,/check-in/); assert.equal(geminiCalls,0);
    result=await (await POST(req({message:'Kamar tersedia?',branch:'jemursari',locale:'id',stay:{checkin:'2030-01-10',checkout:'2030-01-12',adults:2,children:0}}))).json();
    assert.equal(result.availability,'unknown'); assert.match(result.links[0].href,/jemursari/); assert.equal(geminiCalls,0);
    result=await (await POST(req({message:'Lokasi Tunjungan?',branch:'jemursari',locale:'id'}))).json();
    assert.match(result.answer,/ganti pilihan cabang/); assert.equal(geminiCalls,0);
    result=await (await POST(req({message:'Write unrelated code',branch:'jemursari',locale:'id'}))).json();
    assert.match(result.answer,/membantu informasi Cleo/); assert.equal(geminiCalls,1); assert.deepEqual(result.links,[]);
  } finally { globalThis.fetch=original; }
});
test('quota denial prevents Gemini calls',async()=>{
  const original=globalThis.fetch; globalThis.fetch=async()=>Response.json(false);
  try { assert.equal((await POST(req({message:'Hello'}))).status,429); } finally { globalThis.fetch=original; }
});

test('language requests work on the English website without being classified off-topic', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (url) => { assert.match(String(url), /\/rpc\//); return Response.json(true); };
  try {
    const response = await POST(req({ message: 'bisa rubah bahasa ?', locale: 'en' }));
    const result = await response.json();
    assert.equal(response.status, 200); assert.equal(result.language, 'id');
    assert.match(result.answer, /Mau menggunakan bahasa apa/);
  } finally { globalThis.fetch = original; }
});

test('Gemini receives bounded history, current public offers and branch facts, and can change language', async () => {
  const original = globalThis.fetch;
  let providerBody: any;
  globalThis.fetch = async (url, init) => {
    const value = String(url);
    if (value.includes('/rpc/')) return Response.json(true);
    if (value.includes('/Hotel?')) return Response.json([{ ...hotels[0], Room: [{ name: 'Biz', price: 300000, amenities: ['Wi-Fi'] }], Facility: [{ name: 'Meeting Rooms' }] }]);
    if (value.includes('/promos?')) return Response.json([{ title: 'Full Day Meeting', description: 'Published offer 225K per person' }]);
    if (value.includes('/hotel_concierge?')) return Response.json([{ hotel_slug: 'cleo-jemursari', knowledge: 'Verified branch FAQ' }]);
    if (value.includes('/PromoPopup?') || value.includes('/hotel_tours?')) return Response.json([]);
    if (value.includes('generativelanguage')) {
      providerBody = JSON.parse(String(init?.body));
      return Response.json({ candidates: [{ content: { parts: [{ text: JSON.stringify({ relevant: true, answer: 'Tentu, dengan senang hati. Ada yang ingin ditanyakan tentang Cleo Jemursari?', language: 'id', availabilityRequested: false }) }] } }] });
    }
    throw Error('Unexpected URL');
  };
  try {
    const result = await (await POST(req({ message: 'Gunakan bahasa Indonesia', locale: 'en', branch: 'jemursari', history: [{ role: 'user', text: 'What are the room types?' }, { role: 'assistant', text: 'Cleo Room and Biz Room.' }] }))).json();
    assert.equal(result.languagePreference, 'id'); assert.match(result.answer, /Tentu/);
    assert.equal(providerBody.contents.length, 3); assert.equal(providerBody.contents[1].role, 'model');
    const instruction = providerBody.systemInstruction.parts[0].text;
    for (const fact of ['Tanly Hospitality', 'info@cleohotels.id', 'Full Day Meeting', 'Verified branch FAQ', 'publishedCatalogPriceIDR', 'not trusted hotel facts']) assert.ok(instruction.includes(fact), fact);
    assert.match(result.links[0].href, /jemursari/);
  } finally { globalThis.fetch = original; }
});

test('oversized histories are rejected before providers are called', async () => {
  const original = globalThis.fetch; globalThis.fetch = async () => { throw Error('Must not call providers'); };
  try {
    const response = await POST(req({ message: 'Hi', history: Array.from({length: 9}, () => ({ role: 'user', text: 'Hi' })) }));
    assert.equal(response.status, 400);
  } finally { globalThis.fetch = original; }
});

test('facility availability does not trigger the room inventory workflow', async () => {
  const original = globalThis.fetch; let called = false;
  globalThis.fetch = async (url) => {
    const value = String(url);
    if (value.includes('/rpc/')) return Response.json(true);
    if (value.includes('/Hotel?')) return Response.json(hotels);
    if (value.includes('generativelanguage')) { called = true; return Response.json({ candidates: [{ content: { parts: [{ text: JSON.stringify({ relevant: true, answer: 'Ada fasilitas meeting room.', language: 'id', availabilityRequested: false }) }] } }] }); }
    return Response.json([]);
  };
  try {
    const result = await (await POST(req({ message: 'Apa fasilitas yang tersedia?', branch: 'jemursari' }))).json();
    assert.equal(called, true); assert.match(result.answer, /meeting room/); assert.equal(result.availability, undefined);
  } finally { globalThis.fetch = original; }
});
