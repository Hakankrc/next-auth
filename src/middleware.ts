import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // Middleware logic can be added here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    // Protected routes
    "/dashboard/:path*",
    "/profile/:path*",
    "/api/protected/:path*",
  ],
};
