import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { AdminRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: AdminRole;
      email: string;
      name: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: AdminRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: AdminRole;
  }
}
