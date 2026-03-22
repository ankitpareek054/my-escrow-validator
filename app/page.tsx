'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const locations = ['🇩🇪 Berlin', '🇨🇳 Shenzhen', '🇮🇳 Mumbai', '🇺🇸 LA', '🇯🇵 Osaka', '🇧🇷 São Paulo'];
const categories = ['Electronics', 'Textiles', 'Machinery', 'Auto Parts'];

export default function LandingPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [liveEvents, setLiveEvents] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const addEvent = () => {
      const loc = locations[Math.floor(Math.random() * locations.length)];
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setLiveEvents(prev => [
        `🟢 ${loc} verified for ${cat} @ ${time}`,
        ...prev
      ].slice(0, 2));
    };

    addEvent();
    const interval = setInterval(addEvent, 6000);
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

    if (!res.ok) throw new Error();

    setStatus('success');
    setShowToast(true);

    // auto hide after 3 sec
    setTimeout(() => setShowToast(false), 3000);

  } catch {
    setStatus('idle');
  }
}

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {/* LIVE BAR */}
      <div className="bg-white/5 border-b border-white/10 py-2 px-4 text-xs text-gray-400">
        <AnimatePresence>
          {liveEvents.map(event => (
            <motion.div key={event}>{event}</motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* HERO */}
      <section className="px-4 pt-10 pb-6 text-center">
        <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-4">
          Stop Trusting <span className="text-red-500">Screens</span><br/>
          Trust <span className="text-blue-500">Reality</span>
        </h1>

        <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto mb-6 leading-relaxed">
          Fake suppliers. Fake inventory. Real money lost.
          <br/><br/>
          We verify suppliers physically before your money moves.
        </p>
      </section>

      {/* FORM */}
      <section className="px-4 pb-10">
        <motion.div
          className="max-w-md mx-auto"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            x.set(e.clientX - rect.left);
            y.set(e.clientY - rect.top);
          }}
          onMouseLeave={() => { x.set(200); y.set(200); }}
          style={{ rotateX, rotateY }}
        >
          <div className="bg-[#0d1117] p-6 rounded-2xl border border-white/10">

            {status === 'success' ? (
              <div className="text-center">
                <h3 className="text-xl text-blue-400 mb-2">You're in 🚀</h3>
                <p className="text-gray-400 text-sm">
                  We’ll notify you when verified suppliers go live.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">

                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Work Email"
                  className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-sm"
                />

                <select
                  name="role"
                  className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-sm"
                >
                  <option value="buyer">I want to Buy Safely</option>
                  <option value="seller">I want to Sell</option>
                </select>

                <button className="w-full bg-blue-600 py-4 rounded-xl font-bold text-sm">
                  {status === 'loading' ? 'Securing...' : 'SECURE ACCESS'}
                </button>

              </form>
            )}
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 py-10 text-center">
        <h2 className="text-2xl font-bold mb-6">How it works</h2>

        <div className="space-y-4 text-left max-w-md mx-auto">

          <div className="bg-white/5 p-4 rounded-xl">
            <h3 className="font-bold text-sm mb-1">1. Physical Verification</h3>
            <p className="text-gray-400 text-xs">
              Real people verify warehouses and stock on-site.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl">
            <h3 className="font-bold text-sm mb-1">2. Escrow Protection</h3>
            <p className="text-gray-400 text-xs">
              Funds are locked until verified shipment.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl">
            <h3 className="font-bold text-sm mb-1">3. Verified Delivery</h3>
            <p className="text-gray-400 text-xs">
              Proof with GPS + timestamp before release.
            </p>
          </div>

        </div>
      </section>

      {/* TRUST */}
      <section className="px-4 pb-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Why this matters</h2>

        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
          Billions are lost due to fake suppliers and false claims.
          <br/><br/>
          We replace blind trust with verified truth.
        </p>
      </section>

      <footer className="text-center text-gray-600 text-xs pb-6">
        © 2026 Physical Trade Protocol
      </footer>

    </div>
  );
}