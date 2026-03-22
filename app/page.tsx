'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const locations = ['🇩🇪 Berlin', '🇨🇳 Shenzhen', '🇮🇳 Mumbai', '🇺🇸 Los Angeles', '🇯🇵 Osaka', '🇧🇷 São Paulo', '🇻🇳 Hanoi'];
const categories = ['Electronics', 'Raw Textiles', 'Industrial Machinery', 'Auto Parts', 'Chemicals'];

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
        `🟢 Audit Verified: ${loc} supplier cleared for ${cat} @ ${time}`,
        ...prev
      ].slice(0, 3));
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
      setTimeout(() => setShowToast(false), 3000);

    } catch {
      setStatus('idle');
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-20">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* LIVE FEED */}
      <div className="w-full bg-white/5 border-b border-white/10 py-2 px-4 text-xs text-gray-400 overflow-hidden">
        <div className="max-w-7xl mx-auto flex gap-6">
          <span className="text-emerald-400 font-bold">LIVE AUDITS</span>
          <div className="flex gap-6 overflow-hidden">
            {liveEvents.map((event) => (
              <span key={event}>{event}</span>
            ))}
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 lg:pt-24 grid lg:grid-cols-2 gap-12 items-center">

        <div>
          <h1 className="text-4xl sm:text-6xl font-black leading-tight mb-6">
            Trade What You Can <br/>
            <span className="text-blue-500">Physically Verify</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg mb-8 leading-relaxed">
            Global trade runs on blind trust — and that’s the problem.
            Suppliers fake inventory. Documents are manipulated. Buyers lose money.
            <br/><br/>
            We replace digital claims with **on-ground verification + escrow protection**.
          </p>

          <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-500">
            <span>✔ Physical warehouse audits</span>
            <span>✔ Escrow-secured payments</span>
            <span>✔ Verified shipment proof</span>
          </div>
        </div>

        {/* FORM */}
        <motion.div
          className="sticky top-16"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            x.set(e.clientX - rect.left);
            y.set(e.clientY - rect.top);
          }}
          onMouseLeave={() => { x.set(200); y.set(200); }}
          style={{ rotateX, rotateY }}
        >
          <div className="bg-[#0d1117] p-6 sm:p-10 rounded-3xl border border-white/10">

            {status === 'success' ? (
              <div className="text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl sm:text-2xl text-blue-400 mb-2">You're on the list</h3>
                <p className="text-gray-400 text-sm">
                  We’ll notify you when verified suppliers go live.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">

                <h3 className="text-xl sm:text-2xl font-bold">Get Early Access</h3>
                <p className="text-gray-500 text-sm">
                  Join buyers and sellers testing a safer way to trade.
                </p>

                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Work Email"
                  className="w-full p-4 rounded-xl bg-black/40 border border-white/10"
                />

                <select
                  name="role"
                  className="w-full p-4 rounded-xl bg-black/40 border border-white/10"
                >
                  <option value="buyer">I want to Buy Safely</option>
                  <option value="seller">I want to Sell as Verified</option>
                </select>

                <button className="w-full bg-blue-600 py-4 rounded-xl font-bold">
                  {status === 'loading' ? 'Securing...' : 'SECURE ACCESS'}
                </button>

              </form>
            )}
          </div>
        </motion.div>

      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-10">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-6 text-left">

          <div className="bg-white/5 p-6 rounded-xl">
            <h3 className="font-bold mb-2">1. On-Ground Verification</h3>
            <p className="text-gray-400 text-sm">
              Local auditors physically inspect factories, warehouses, and inventory before any deal is approved.
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl">
            <h3 className="font-bold mb-2">2. Escrow Protection</h3>
            <p className="text-gray-400 text-sm">
              Your funds are locked and only released when real-world conditions match what was promised.
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl">
            <h3 className="font-bold mb-2">3. Verified Proof</h3>
            <p className="text-gray-400 text-sm">
              GPS-tagged videos and timestamped loading confirmation ensure authenticity before payment release.
            </p>
          </div>

        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Why This Matters</h2>

        <p className="text-gray-400 text-base leading-relaxed max-w-2xl mx-auto">
          Billions are lost every year due to fake suppliers, forged documents, and unverifiable inventory.
          <br/><br/>
          We’re building a system where **truth is physical, not digital** — and trust is earned, not assumed.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="mt-24 text-center text-gray-600 text-xs pb-10">
        Physical Trade Protocol © 2026
      </footer>

      {/* TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-600 px-5 py-3 rounded-xl text-sm shadow-lg"
          >
            ✅ Your request to join the waitlist has been received
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}