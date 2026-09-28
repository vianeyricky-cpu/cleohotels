'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
export function GlobalLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname(), search = useSearchParams();
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => { setLoading(false); clearTimeout(timer.current); }, [pathname, search]);
  useEffect(() => {
    const handle = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest('a');
      if (!anchor || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      if (anchor.origin !== window.location.origin || anchor.pathname + anchor.search === window.location.pathname + window.location.search) return;
      setLoading(true); clearTimeout(timer.current);
      timer.current = setTimeout(() => setLoading(false), 12000);
    };
    document.addEventListener('click', handle);
    return () => { document.removeEventListener('click', handle); clearTimeout(timer.current); };
  }, []);
  return loading ? <div role="status" aria-label="Loading page" className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/60 backdrop-blur-md"><Image src="/loading-cleo.gif" alt="Loading Cleo Hotels" width={180} height={180} unoptimized /></div> : null;
}
