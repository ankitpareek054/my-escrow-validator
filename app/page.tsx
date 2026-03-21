'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { put } from '@vercel/blob';

// Data for Activity Feed
const locations = ['🇩🇪 Berlin', '🇨🇳 Shenzhen', '🇮🇳 Mumbai', '🇺🇸 Los Angeles', '🇯🇵 Osaka', '🇧🇷 São Paulo', '🇻🇳 Hanoi'];
const categories = ['Electronics', 'Raw Textiles', 'Industrial Machinery', 'Auto Parts', 'Chemicals'];

export default function LandingPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [liveEvents, setLiveEvents] = useState<string[]>([]);

  // Live Feed Logic
  useEffect(() => {
    const addEvent = () => {
      const loc = locations[Math.floor(Math.random() * locations.length)];
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLiveEvents(prev => [`🟢 Audit Success: ${loc} warehouse verified for [${cat}] @ ${time}`, ...prev].slice(0, 3));
    };
    addEvent();
    const interval = setInterval(addEvent, 7000);
    return () => clearInterval(interval);
  }, []);

  // 3D Tilt Logic
  const x = useMotionValue(200);
  const y = useMotionValue(200);
  const rotateX = useTransform(y, [0, 400], [10, -10]);
  const rotateY = useTransform(x, [0, 400], [-10, 10]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const formData = new FormData(e.currentTarget);
    try {
      const email = formData.get('email') as string;
      const filename = `waitlist/${email.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
      await put(filename, JSON.stringify({ email, role: formData.get('role'), date: new Date() }), {
        access: 'public',
        token: process.env.NEXT_PUBLIC_BLOB_TOKEN 
      });
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 font-sans pb-20">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full opacity-30" />
      </div>

      {/* --- LIVE FEED HEADER --- */}
      <div className="w-full bg-white/5 border-b border-white/10 py-3 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-6">
          <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live Audits
          </span>
          <div className="flex gap-8 overflow-hidden">
            <AnimatePresence mode="popLayout">
              {liveEvents.map((event, i) => (
                <motion.span key={event} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-xs font-mono text-gray-500 whitespace-nowrap">
                  {event}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 pt-20 lg:pt-32 grid lg:grid-cols-2 gap-16 items-start">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 bg-gradient-to-br from-white via-white to-gray-600 bg-clip-text text-transparent">
            Trade What <br/> You Can <span className="text-blue-500 italic">Verify.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-lg mb-12 leading-relaxed">
            The world's first escrow platform built on **Physical Audits.** We don't just check IDs; we verify warehouses and stock in person so your capital stays protected.
          </p>
          
          <div className="flex flex-wrap gap-4 opacity-60">
            <div className="flex items-center gap-2 text-sm border border-white/10 px-4 py-2 rounded-full">🛡️ ISO 27001 Compliant</div>
            <div className="flex items-center gap-2 text-sm border border-white/10 px-4 py-2 rounded-full">🤝 Multi-Sig Escrow</div>
          </div>
        </motion.div>

        {/* 3D Form Card */}
        <motion.div 
          className="perspective-1000 sticky top-20"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            x.set(e.clientX - rect.left); y.set(e.clientY - rect.top);
          }}
          onMouseLeave={() => { x.set(200); y.set(200); }}
          style={{ rotateX, rotateY }}
        >
          <div className="bg-[#0d1117] p-10 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors" />
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-[400px] flex flex-col justify-center text-center">
                  <div className="text-6xl mb-6">🚀</div>
                  <h3 className="text-3xl font-bold mb-4 text-blue-400">You're on the Inside.</h3>
                  <p className="text-gray-400 text-sm">We'll notify you as soon as our next batch of verified suppliers goes live.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                  <h3 className="text-3xl font-bold tracking-tight">Join the Verified Network.</h3>
                  <p className="text-sm text-gray-500">Be the first to trade via physically audited channels.</p>
                  
                  <div className="space-y-4">
                    <input name="email" type="email" required placeholder="Work Email" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    <select name="role" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none appearance-none cursor-pointer">
                      <option value="buyer">I want to Buy Safely</option>
                      <option value="seller">I want to Sell as Verified</option>
                    </select>
                  </div>

                  <div className="relative group/btn pt-4">
                    <div className="absolute -inset-1 bg-blue-600 rounded-2xl blur opacity-20 group-hover/btn:opacity-60 transition duration-500" />
                    <button disabled={status === 'loading'} className="relative w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl active:scale-[0.98]">
                      {status === 'loading' ? 'Encrypting...' : 'SECURE ACCESS'}
                    </button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* --- THE VERIFICATION LOOP (New Content) --- */}
      <section className="max-w-7xl mx-auto px-6 pt-40 pb-20">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Trust but <span className="text-blue-500 underline decoration-blue-500/30">Verify.</span></h2>
          <p className="text-gray-500 max-w-2xl mx-auto italic">"Digital verification is a lie. Physical presence is the only truth in global trade."</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Physical Site Audits" 
            desc="Our network of 1,200+ local agents visits every supplier's factory. We check business licenses, production lines, and current inventory levels." 
            icon="🏢"
            badge="Phase 1"
          />
          <FeatureCard 
            title="Smart-Contract Escrow" 
            desc="Funds are locked in a digital vault. Neither the buyer nor the seller can move them until the shipping tracking matches the verified physical SKU." 
            icon="🔐"
            badge="Phase 2"
          />
          <FeatureCard 
            title="Timestamped Proof" 
            desc="Sellers must upload a 360° video of the goods being loaded, tagged with GPS and time metadata, before a single dollar is released." 
            icon="📦"
            badge="Phase 3"
          />
        </div>
      </section>

      {/* --- COMPARISON SECTION --- */}
      <section className="max-w-5xl mx-auto px-6 py-20 bg-white/5 rounded-[40px] border border-white/10 mt-20 overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
         <h3 className="text-2xl font-bold mb-10 text-center">Standard Trade vs. Verified Escrow</h3>
         <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm md:text-base">
            <div className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Criteria</div>
            <div className="text-red-400 font-bold uppercase tracking-widest text-[10px] hidden md:block">Traditional Wire</div>
            <div className="text-blue-400 font-bold uppercase tracking-widest text-[10px]">Verified Network</div>
            
            <div className="py-4 border-t border-white/5">Seller Verification</div>
            <div className="py-4 border-t border-white/5 text-gray-500 hidden md:block">Self-Reported</div>
            <div className="py-4 border-t border-white/5 font-bold">On-Site Physical Audit</div>

            <div className="py-4 border-t border-white/5">Fund Safety</div>
            <div className="py-4 border-t border-white/5 text-gray-500 hidden md:block">Immediate Loss</div>
            <div className="py-4 border-t border-white/5 font-bold">Vault Locked</div>

            <div className="py-4 border-t border-white/5">Resolution</div>
            <div className="py-4 border-t border-white/5 text-gray-500 hidden md:block">Court (Years)</div>
            <div className="py-4 border-t border-white/5 font-bold">Automatic Refund</div>
         </div>
      </section>

      <footer className="mt-40 text-center text-gray-600 text-xs tracking-widest uppercase pb-10">
        Global Physical Trade Protocol © 2026. All Rights Reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, icon, badge }: { title: string, desc: string, icon: string, badge: string }) {
  return (
    <div className="group bg-white/5 border border-white/10 p-10 rounded-[32px] hover:bg-white/[0.08] transition-all duration-500">
      <div className="flex justify-between items-start mb-6">
        <div className="text-4xl group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">{icon}</div>
        <span className="text-[10px] font-black tracking-widest text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md uppercase">{badge}</span>
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm font-medium">{desc}</p>
    </div>
  );
}