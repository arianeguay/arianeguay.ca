import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

// Input validation schema
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
});

// Simple rate limiting 
const rateLimits = new Map<string, { count: number, timestamp: number }>();

// Initialize Resend client
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  try {
    // Basic rate limiting
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const rateLimit = rateLimits.get(ip);

    if (rateLimit) {
      // Reset rate limit after 1 hour
      if (now - rateLimit.timestamp > 3600000) {
        rateLimits.set(ip, { count: 1, timestamp: now });
      } else if (rateLimit.count >= 5) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      } else {
        rateLimits.set(ip, { count: rateLimit.count + 1, timestamp: rateLimit.timestamp });
      }
    } else {
      rateLimits.set(ip, { count: 1, timestamp: now });
    }

    // Parse request body
    const body = await req.json();

    // Validate input
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    const { name, email, message } = result.data;

    // Send email via Resend
    if (resend) {
      const { data, error } = await resend.emails.send({
        from: 'Contact Form <noreply@arianeguay.ca>',
        to: 'your-email@example.com', // Replace with your email
        subject: `New contact form submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      });

      if (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
          { error: 'Failed to send email' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, id: data?.id });
    } else {
      // Mock successful response when Resend API key is not configured
      console.log('RESEND_API_KEY not configured, would send:', { name, email, message });
      return NextResponse.json({ success: true, id: 'mock-email-id' });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
