import { joinWaitlist } from './actions';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <section className="max-w-4xl mx-auto pt-20 pb-12 px-6 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6">
          Trade Physical Goods with <span className="text-blue-600">Verified</span> Trust.
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          The first escrow platform that physically audits every seller. 
        </p>

        <form action={joinWaitlist} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md mx-auto">
          <div className="space-y-4">
            <input 
              name="email" 
              type="email" 
              placeholder="Enter your work email" 
              required 
              className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select name="role" className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none">
              <option value="buyer">I am a Buyer</option>
              <option value="seller">I am a Seller / Business</option>
            </select>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
              Get Early Access
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-4">By signing up, you'll be notified when we launch our verified network.</p>
        </form>
      </section>
    </main>
  );
}