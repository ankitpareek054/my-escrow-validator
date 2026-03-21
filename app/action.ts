'use server'
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

export async function joinWaitlist(formData: FormData) {
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;

  // Create a simple data object
  const userData = JSON.stringify({
    email,
    role,
    signupDate: new Date().toISOString(),
  });

  try {
    // This saves a file named "waitlist/email-timestamp.json" in your Blob store
    const filename = `waitlist/${email.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    
    await put(filename, userData, {
      access: 'public', // This makes the file readable in your Vercel dashboard
      contentType: 'application/json',
    });

    revalidatePath('/');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Something went wrong. Please try again." };
  }
}