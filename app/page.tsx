import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

// No './actions' import here! 

async function joinWaitlist(formData: FormData) {
  'use server'
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;

  try {
    const filename = `waitlist/${email.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    await put(filename, JSON.stringify({ email, role, date: new Date() }), {
      access: 'public',
      contentType: 'application/json',
    });
    revalidatePath('/');
  } catch (e) {
    console.error(e);
  }
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full border p-8 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Verified Physical Escrow</h1>
        <p className="text-gray-600 mb-6">Enter your email to join the waitlist for verified B2B trade.</p>
        <form action={joinWaitlist} className="space-y-4">
          <input name="email" type="email" placeholder="Email" required className="w-full p-3 border rounded-lg" />
          <select name="role" className="w-full p-3 border rounded-lg">
            <option value="buyer">I am a Buyer</option>
            <option value="seller">I am a Seller</option>
          </select>
          <button type="submit" className="w-full bg-black text-white p-3 rounded-lg font-bold">
            Join Waitlist
          </button>
        </form>
      </div>
    </main>
  );
}