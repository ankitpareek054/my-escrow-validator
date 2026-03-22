import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body.email;
    const role = body.role;

    if (!email) {
      return Response.json({ error: "Email required" }, { status: 400 });
    }

    const filename = `waitlist/${email.replace(/[^a-zA-Z0-9]/g, "_")}.json`;

    const blob = await put(
      filename,
      JSON.stringify({
        email,
        role,
        date: new Date().toISOString(),
      }),
      {
        access: "private",
      }
    );

    return Response.json({
      success: true,
      url: blob.url,
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return Response.json({ error: "Failed to save" }, { status: 500 });
  }
}