import ContactMessage from "@/database/contactMessageSchema";
import connectDB from "@/database/db";
import { validateContactForm } from "@/lib/contactValidation";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const validation = validateContactForm(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Please correct the highlighted fields.", fields: validation.errors },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    await ContactMessage.create(validation.data);

    return NextResponse.json({ message: "Your message was sent successfully." }, { status: 201 });
  } catch (error) {
    console.error("Unable to save contact message", error);
    return NextResponse.json({ error: "Unable to send your message right now." }, { status: 500 });
  }
}
