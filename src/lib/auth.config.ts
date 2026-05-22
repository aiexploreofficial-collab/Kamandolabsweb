import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config — used by middleware
 * No DB calls, no bcrypt, no Node.js-only APIs here
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  providers: [], // Populated in auth.ts (Node.js runtime)
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname === "/admin/login";

      // Allow login page for everyone
      if (isLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin/dashboard", nextUrl));
        }
        return true;
      }

      // Protect all /admin routes
      if (isAdminRoute) {
        return isLoggedIn;
      }

      // Public routes — always accessible
      return true;
    },
  },
} satisfies NextAuthConfig;
