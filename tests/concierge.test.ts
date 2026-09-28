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
    if(value.includes('/hotel_concierge?')) return Response.json([]);
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
    assert.match(result.answer,/hanya membantu informasi Cleo/); assert.equal(geminiCalls,1); assert.deepEqual(result.links,[]);
  } finally { globalThis.fetch=original; }
});
test('quota denial prevents Gemini calls',async()=>{
  const original=globalThis.fetch; globalThis.fetch=async()=>Response.json(false);
  try { assert.equal((await POST(req({message:'Hello'}))).status,429); } finally { globalThis.fetch=original; }
});
