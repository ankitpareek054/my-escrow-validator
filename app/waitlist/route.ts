import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const filename = `waitlist/${body.email.replace(/[^a-zA-Z0-9]/g, "_")}.json`;

    const blob = await put(filename, JSON.stringify({
      email: body.email,
      role: body.role,
      date: new Date()
    }), {
      access: "public"
    });

    return Response.json({ success: true, url: blob.url });

  } catch (error) {
    console.error(error);
    return Response.json({ success: false }, { status: 500 });
  }
}