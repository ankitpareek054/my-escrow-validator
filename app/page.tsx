'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const locations = ['🇩🇪 Berlin', '🇨🇳 Shenzhen', '🇮🇳 Mumbai', '🇺🇸 Los Angeles', '🇯🇵 Osaka', '🇧🇷 São Paulo', '🇻🇳 Hanoi'];
const categories = ['Electronics', 'Raw Textiles', 'Industrial Machinery', 'Auto Parts', 'Chemicals'];

export default function LandingPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [liveEvents, setLiveEvents] = useState<string[]>([]);

  useEffect(() => {
    const addEvent = () => {
      const loc = locations[Math.floor(Math.random() * locations.length)];
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setLiveEvents(prev => [
        `🟢 Audit Success: ${loc} warehouse verified for [${cat}] @ ${time}`,
        ...prev
      ].slice(0, 3));
    };

    addEvent();
    const interval = setInterval(addEvent, 7000);
    return () => clearInterval(interval);
  }, []);

  const x = useMotionValue(200);
  const y = useMotionValue(200);
  const rotateX = useTransform(y, [0, 400], [10, -10]);
  const rotateY = useTransform(x, [0, 400], [-10, 10]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          role: formData.get('role'),
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus('success');

    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-20">

      {/* HEADER */}
      <div className="w-full bg-white/5 border-b border-white/10 py-3 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-6">
          <span className="text-emerald-400 text-xs font-bold">Live Audits</span>

          <div className="flex gap-8">
            <AnimatePresence>
              {liveEvents.map((event) => (
                <motion.span key={event} className="text-xs text-gray-400">
                  {event}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-20 grid lg:grid-cols-2 gap-16">

        <div>
          <h1 className="text-6xl font-black mb-6">
            Trade What You Can <span className="text-blue-500">Verify</span>
          </h1>
        </div>

        {/* FORM */}
        <motion.div
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            x.set(e.clientX - rect.left);
            y.set(e.clientY - rect.top);
          }}
          onMouseLeave={() => {
            x.set(200);
            y.set(200);
          }}
          style={{ rotateX, rotateY }}
        >
          <div className="bg-[#0d1117] p-8 rounded-3xl border border-white/10">

            {status === 'success' ? (
              <div className="text-center">
                <h3 className="text-2xl text-blue-400">You're in 🚀</h3>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">

                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Work Email"
                  className="w-full p-4 rounded-xl bg-black/40"
                />

                <select name="role" className="w-full p-4 rounded-xl bg-black/40">
                  <option value="buyer">I want to Buy Safely</option>
                  <option value="seller">I want to Sell</option>
                </select>

                <button className="w-full bg-blue-600 py-4 rounded-xl">
                  {status === 'loading' ? 'Loading...' : 'SECURE ACCESS'}
                </button>

              </form>
            )}
          </div>
        </motion.div>

      </section>
    </div>
  );
}