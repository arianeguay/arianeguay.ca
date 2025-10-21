// Initialize Resend client
import { Resend } from "resend";
import { EmailTemplate } from "./email-template";

const API_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(API_KEY);

export const sendEmailFromForm = async (
  formData: FormData,
  subject: string,
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["contact@arianeguay.ca"],
      subject: subject,
      react: EmailTemplate({ formData }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
};
