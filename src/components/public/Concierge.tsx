'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { MessageCircle, X, Send, Loader2, ArrowUpRight } from 'lucide-react';
import { branches, resolveBranch, jakartaDate } from '@/lib/cleo/branches';
type Message = { role: 'user' | 'assistant'; text: string; links?: { label: string; href: string }[] };
export function Concierge() {
  const params = useParams(); const id = params?.locale === 'id';
  const routeBranch = resolveBranch(typeof params?.slug === 'string' ? params.slug : '');
  const [open, setOpen] = useState(false), [branch, setBranch] = useState(''), [text, setText] = useState(''), [busy, setBusy] = useState(false), [showStay, setShowStay] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [checkin, setCheckin] = useState(''), [checkout, setCheckout] = useState(''), [adults, setAdults] = useState(2), [children, setChildren] = useState(0);
  const end = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null), controller = useRef<AbortController>();
  useEffect(() => { controller.current?.abort(); controller.current = undefined; setBusy(false); setBranch(routeBranch?.key || ''); setMessages([]); }, [routeBranch?.key]);
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }); }, [messages, busy]);
  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  useEffect(() => () => controller.current?.abort(), []);
  async function send(message: string, intent: 'question' | 'availability' = 'question') {
    if (busy || !message.trim()) return;
    setText(''); setBusy(true); setMessages(m => [...m.slice(-18), { role: 'user', text: message }]);
    const current = new AbortController(); controller.current = current;
    const timer = setTimeout(() => current.abort(), 28000);
    try {
      const response = await fetch('/api/concierge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: current.signal, body: JSON.stringify({ message, branch: branch || undefined, locale: id ? 'id' : 'en', intent, stay: showStay ? { checkin, checkout, adults, children } : undefined }) });
      const result = await response.json();
      if (current !== controller.current) return;
      setMessages(m => [...m, { role: 'assistant', text: result.answer || result.error || (id ? 'Coba lagi nanti.' : 'Please try again.'), links: result.links }]);
    } catch { if (current === controller.current) setMessages(m => [...m, { role: 'assistant', text: id ? 'Koneksi terputus. Silakan coba lagi atau hubungi hotel.' : 'Connection interrupted. Please retry or contact the hotel.' }]); }
    finally { clearTimeout(timer); if (current === controller.current) setBusy(false); }
  }
  function changeBranch(value: string) { controller.current?.abort(); controller.current = undefined; setBranch(value); setMessages([]); setBusy(false); }
  return <div className="concierge-root">
    {open && <section role="dialog" aria-modal="false" aria-label="Cleo Concierge" className="concierge-panel" onKeyDown={e => { if(e.key === 'Escape') setOpen(false); }}>
      <header><div><span className="eyebrow">YOUR STAY, MADE SIMPLE</span><h2>Cleo Concierge</h2></div><button aria-label="Close chat" onClick={() => setOpen(false)}><X size={20}/></button></header>
      <div className="concierge-branch"><label htmlFor="chat-branch">{id ? 'Anda ingin membahas cabang mana?' : 'Which hotel can we help with?'}</label><select id="chat-branch" value={branch} onChange={e => changeBranch(e.target.value)}><option value="">{id ? 'Informasi umum Cleo' : 'About Cleo Hotels'}</option>{branches.map(b => <option key={b.key} value={b.key}>{b.name}</option>)}</select></div>
      <div className="concierge-messages" role="log" aria-live="polite"><div className="chat-assistant">{id ? 'Halo! Saya asisten AI Cleo. Tanyakan lokasi, tipe kamar, atau fasilitas. Untuk ketersediaan, pilih hotel dan tanggal menginap.' : 'Hello! I’m Cleo’s AI assistant. Ask about our locations, room types or facilities. For availability, choose a hotel and your stay dates.'}</div>
        {messages.map((m, i) => <div className={`chat-${m.role}`} key={i}><p>{m.text}</p>{m.links?.map(link => <a key={link.href} href={link.href}>{link.label}<ArrowUpRight size={14}/></a>)}</div>)}{busy && <div role="status"><Loader2 size={18} className="animate-spin"/></div>}<div ref={end}/></div>
      <div className="concierge-actions"><button onClick={() => setShowStay(!showStay)} aria-expanded={showStay}>{id ? 'Cek kamar' : 'Check rooms'}</button><button disabled={busy} onClick={() => send(id ? 'Apa fasilitas hotel ini?' : 'What facilities does this hotel have?')}>{id ? 'Fasilitas' : 'Facilities'}</button></div>
      {showStay && <form className="chat-stay" onSubmit={e => { e.preventDefault(); send(id ? 'Cek ketersediaan kamar' : 'Check room availability', 'availability'); }}><label>Check-in<input type="date" required min={jakartaDate()} value={checkin} onChange={e => setCheckin(e.target.value)}/></label><label>Check-out<input type="date" required min={checkin || jakartaDate()} value={checkout} onChange={e => setCheckout(e.target.value)}/></label><label>{id ? 'Dewasa' : 'Adults'}<input type="number" min={1} max={6} required value={adults} onChange={e => setAdults(Number(e.target.value))}/></label><label>{id ? 'Anak' : 'Children'}<input type="number" min={0} max={2} required value={children} onChange={e => setChildren(Number(e.target.value))}/></label><button disabled={busy || !branch} className="cleo-button">{id ? 'Cek cabang pilihan' : 'Check selected hotel'}</button></form>}
      <form className="concierge-compose" onSubmit={e => { e.preventDefault(); send(text); }}><input ref={input} aria-label="Your question" value={text} maxLength={1200} onChange={e => setText(e.target.value)} placeholder={id ? 'Tanyakan tentang Cleo…' : 'Ask about Cleo…'} required/><button aria-label="Send message" disabled={busy || !text.trim()}><Send size={18}/></button></form>
      <small>{id ? 'Asisten AI · Jangan kirim data pribadi atau pembayaran.' : 'AI assistant · Please do not share personal or payment details.'}</small>
    </section>}
    <button className="concierge-toggle" aria-expanded={open} aria-label="Open Cleo Concierge" onClick={() => setOpen(!open)}>{open ? <X size={21}/> : <><MessageCircle size={21}/><span>Ask Cleo</span><span className="chat-online"/></>}</button>
  </div>;
}
