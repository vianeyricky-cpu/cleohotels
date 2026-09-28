'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
export function ScrollReveal() {
  const path = usePathname();
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const elements = document.querySelectorAll<HTMLElement>('.cleo-site main > section:not(:first-of-type):not(:has(#booking)), .cleo-site .section-heading');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.04, rootMargin: '0px 0px 40px 0px' });
    elements.forEach(node => { if (node.getBoundingClientRect().top > window.innerHeight) { node.classList.add('scroll-reveal'); observer.observe(node); } });
    return () => { observer.disconnect(); elements.forEach(node => node.classList.remove('scroll-reveal', 'is-visible')); };
  }, [path]);
  return null;
}
