import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { authConfig } from "@/lib/auth.config";
import { LoginStatus } from "@prisma/client";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/**
 * Check if admin is locked out due to too many failed attempts
 */
async function isLockedOut(email: string): Promise<boolean> {
  const maxAttempts = parseInt(process.env.ADMIN_MAX_LOGIN_ATTEMPTS || "5");
  const lockoutMinutes = parseInt(process.env.ADMIN_LOCKOUT_MINUTES || "15");
  const since = new Date(Date.now() - lockoutMinutes * 60 * 1000);

  const recentFailures = await db.adminLoginLog.count({
    where: {
      email,
      status: LoginStatus.FAILED,
      createdAt: { gte: since },
    },
  });

  return recentFailures >= maxAttempts;
}

/**
 * Log a login attempt
 */
async function logLoginAttempt(
  email: string,
  status: LoginStatus,
  adminId: string | null,
  ipAddress: string,
  userAgent: string | null
): Promise<void> {
  try {
    await db.adminLoginLog.create({
      data: {
        email,
        status,
        adminId,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to log login attempt:", error);
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      name: "Admin Login",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, request) {
        try {
          const parsed = loginSchema.safeParse(credentials);
          if (!parsed.success) return null;

          const { email, password } = parsed.data;

          const ipAddress =
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            request.headers.get("x-real-ip") ||
            "unknown";

          const userAgent = request.headers.get("user-agent");

          // Lockout check
          const locked = await isLockedOut(email);
          if (locked) {
            await logLoginAttempt(
              email,
              LoginStatus.BLOCKED,
              null,
              ipAddress,
              userAgent
            );
            return null;
          }

          // Find admin
          const admin = await db.admin.findUnique({
            where: { email: email.toLowerCase() },
          });

          if (!admin || !admin.isActive) {
            await logLoginAttempt(
              email,
              LoginStatus.FAILED,
              admin?.id || null,
              ipAddress,
              userAgent
            );
            return null;
          }

          // Password verify
          const isValidPassword = await bcrypt.compare(
            password,
            admin.passwordHash
          );

          if (!isValidPassword) {
            await logLoginAttempt(
              email,
              LoginStatus.FAILED,
              admin.id,
              ipAddress,
              userAgent
            );
            return null;
          }

          // Success
          await logLoginAttempt(
            email,
            LoginStatus.SUCCESS,
            admin.id,
            ipAddress,
            userAgent
          );

          await db.admin.update({
            where: { id: admin.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id as string;
        token.email = user.email as string;
        token.name = user.name as string;
        (token as any).role = (user as any).role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as any).role = (token as any).role;
      }

      return session;
    },
  },

  secret: process.env.AUTH_SECRET,

  trustHost: true,
});