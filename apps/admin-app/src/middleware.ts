import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/linkedin/:path*",
    "/clients/:path*",
    "/projects/:path*",
    "/invoices/:path*",
    "/settings/:path*",
    // Protect app APIs (exclude NextAuth and cron endpoints)
    "/api/clients/:path*",
    "/api/projects/:path*",
    "/api/invoices/:path*",
    "/api/linkedin/:path*",
  ],
};
