import NextAuth, { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: {
        host: 'smtp.resend.com',
        port: 465,
        auth: {
          user: 'resend',
          pass: process.env.RESEND_API_KEY,
        },
      },
      from: process.env.RESEND_FROM_EMAIL || 'hello@arianeguay.ca',
      async sendVerificationRequest({ identifier: email, url }) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'hello@arianeguay.ca',
            to: email,
            subject: 'Connexion à votre Admin App',
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <style>
                    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #111114; background: #F9F6F8; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 6px 18px rgba(17,17,20,.10); }
                    h1 { color: #8C0F48; font-size: 28px; margin-bottom: 20px; }
                    p { margin-bottom: 20px; color: #3A3A44; }
                    .button { display: inline-block; background: #8C0F48; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
                    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #827B7F; font-size: 14px; color: #827B7F; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h1>Connexion à votre Admin App</h1>
                    <p>Bonjour,</p>
                    <p>Cliquez sur le bouton ci-dessous pour vous connecter à votre espace de gestion freelance.</p>
                    <a href="${url}" class="button">Se connecter</a>
                    <p>Ce lien est valide pendant 24 heures. Si vous n'avez pas demandé cette connexion, vous pouvez ignorer cet email.</p>
                    <div class="footer">
                      <p>Admin App – Ariane Guay<br/>Cet email a été envoyé de manière automatique, merci de ne pas y répondre.</p>
                    </div>
                  </div>
                </body>
              </html>
            `,
          });
        } catch (error) {
          console.error('Error sending magic link email:', error);
          throw new Error('Failed to send verification email');
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
