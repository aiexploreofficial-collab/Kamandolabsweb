import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Middleware uses ONLY the edge-safe auth config (no bcrypt, no Prisma).
 * The full auth.ts with Credentials provider runs in Node.js runtime only.
 */
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    /*
     * Match all admin routes for protection.
     * Exclude: api/auth, _next, static assets
     */
    "/((?!api/auth|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2)).*)",
  ],
};
