// Initialize Resend client
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "./email-template";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const API_KEY = process.env.RESEND_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { error: "Missing RESEND_API_KEY on server" },
        { status: 500 },
      );
    }
    const resend = new Resend(API_KEY);

    const subjectHeader = req.headers.get("x-subject");
    const subject = subjectHeader || "Contact form";

    const formData = await req.formData();

    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["ariane.dguay@gmail.com"],
      subject,
      react: EmailTemplate({ formData }),
    });

    if (error) {
      return NextResponse.json(
        { error: (error as any)?.message || String(error) },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message = (error as any)?.message || String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
