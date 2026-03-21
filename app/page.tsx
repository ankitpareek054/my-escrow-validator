import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

/** * SERVER ACTION 
 * This runs on the server and saves the data to your Vercel Blob store.
 */
async function joinWaitlist(formData: FormData) {
  'use server'
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;

  const userData = JSON.stringify({
    email,
    role,
    signupDate: new Date().toISOString(),
  });

  try {
    // Creates a unique filename for every signup
    const filename = `waitlist/${email.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    
    await put(filename, userData, {
      access: 'public',
      contentType: 'application/json',
    });

    // This tells Next.js to refresh the page cache
    revalidatePath('/');
  } catch (e) {
    console.error("Blob upload error:", e);
  }
}

/**
 * LANDING PAGE UI
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
        <div className="mb-8 text-center">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Early Access
          </span>
          <h1 className="text-4xl font-black mt-4 tracking-tight">
            Verified <span className="text-blue-600">Escrow</span>
          </h1>
          <p className="text-slate-500 mt-3 text-lg">
            Physical business verification for 100% safe trade.
          </p>
        </div>
        
        <form action={joinWaitlist} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 ml-1">Work Email</label>
            <input 
              name="email" 
              type="email" 
              placeholder="name@company.com" 
              required 
              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 ml-1">I want to...</label>
            <select name="role" className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-100">
              <option value="buyer">Buy physical goods safely</option>
              <option value="seller">Sell as a verified business</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95">
            Join the Waitlist
          </button>
        </form>

        <p className="text-center text-slate-400 text-xs mt-6">
          We manually audit every business. No bots. No fraud.
        </p>
      </div>
      
      <div className="mt-12 text-slate-400 text-sm">
        &copy; 2026 Verified Escrow Network
      </div>
    </main>
  );
}