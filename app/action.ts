'use server'
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

export async function joinWaitlist(formData: FormData) {
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;

  try {
    // This creates the table if it doesn't exist and inserts the user
    await sql`CREATE TABLE IF NOT EXISTS waitlist (id SERIAL PRIMARY KEY, email TEXT UNIQUE, role TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
    await sql`INSERT INTO waitlist (email, role) VALUES (${email}, ${role})`;
    
    revalidatePath('/'); // Refresh the page
    return { success: true };
  } catch (e) {
    return { error: "You're already on the list!" };
  }
}