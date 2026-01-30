"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-700/30 rounded-full blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                Premium Hotel Collection
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Cool. Clean.
              <span className="block text-gold-400">Connected.</span>
            </h1>
            
            <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
              Elevated stays with curated design, smart comfort, and thoughtful
              service across every destination in Indonesia.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                href="/#hotels"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 font-bold text-sm shadow-xl shadow-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/40 transition-all hover:-translate-y-1"
              >
                Explore Hotels
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-white/20 text-white font-bold text-sm hover:bg-white/5 transition-all">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-gold-400 mb-1">5★</div>
                <div className="text-sm text-white/60">Star Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold-400 mb-1">3+</div>
                <div className="text-sm text-white/60">Locations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold-400 mb-1">100%</div>
                <div className="text-sm text-white/60">Satisfaction</div>
              </div>
            </div>
          </motion.div>

          {/* Right - Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 shadow-2xl overflow-hidden border border-white/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-navy-700 opacity-20 mb-2">CLEO</div>
                  <div className="text-sm text-navy-600 opacity-40">Premium Hotel Experience</div>
                </div>
              </div>
              
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold-400/20 blur-3xl" />
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-2xl p-6 max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center text-white font-bold text-xl">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-navy-950">4.9/5</div>
                  <div className="text-sm text-gray-600">Guest Rating</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
