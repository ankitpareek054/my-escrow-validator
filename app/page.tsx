import { joinWaitlist } from './actions';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto pt-20 pb-12 px-6 text-center">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-100 rounded-full">
          Validation Phase
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight mb-6">
          Trade Physical Goods with <span className="text-blue-600">Verified</span> Trust.
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          The first escrow platform that physically audits every seller. 
          No ghost suppliers. No wire fraud. Just guaranteed delivery.
        </p>

        {/* The Form */}
        <form action={joinWaitlist} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md mx-auto">
          <div className="space-y-4">
            <input 
              name="email" 
              type="email" 
              placeholder="Enter your work email" 
              required 
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <select name="role" className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none">
              <option value="buyer">I am a Buyer</option>
              <option value="seller">I am a Seller / Business</option>
            </select>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200">
              Get Early Access
            </button>
          </div>
        </form>
      </section>

      {/* Comparison Section */}
      <section className="bg-white py-16 px-6 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Verified Escrow?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-slate-50 rounded-xl">
              <h3 className="font-bold mb-2">Physical On-Site Verification</h3>
              <p className="text-slate-600 text-sm">We don't just check IDs. We verify physical business locations and inventory before they can sell.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl">
              <h3 className="font-bold mb-2">Fund Lock Protection</h3>
              <p className="text-slate-600 text-sm">Your money stays in a secure vault. It only moves once you confirm the physical goods arrived.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}