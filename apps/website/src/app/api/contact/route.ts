// Initialize Resend client
import { Resend } from "resend";
import { EmailTemplate } from "./email-template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const API_KEY = process.env.RESEND_API_KEY;
    const resend = new Resend(API_KEY);

    const subjectHeader = req.headers.get("x-subject");
    const subject = subjectHeader || "Contact form";

    const formData = await req.formData();

    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["contact@arianeguay.ca"],
      subject,
      react: EmailTemplate({ formData }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
