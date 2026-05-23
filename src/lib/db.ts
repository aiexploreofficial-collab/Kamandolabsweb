import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Auto-routing fallback for Vercel/IPv4 environments connecting to IPv6-only Supabase direct host
let databaseUrl = process.env.DATABASE_URL || "";
if (databaseUrl.includes("db.mfdoidfpxaxxcabieupx.supabase.co:5432")) {
  databaseUrl = "postgresql://postgres.mfdoidfpxaxxcabieupx:SpartanHard%402105@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
