export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/linkedin/:path*',
    '/clients/:path*',
    '/projects/:path*',
    '/invoices/:path*',
    '/settings/:path*',
  ],
};
