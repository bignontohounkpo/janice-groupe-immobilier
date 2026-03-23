import type { NextAuthConfig } from "next-auth"
import { UserRole } from "@/types/user"

/**
 * Configuration NextAuth compatible Edge Runtime.
 */
export default {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")

      if (isOnAdmin) {
        if (!isLoggedIn) return false // redirige vers /login
        return true
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole;
      }
      return session
    },
  },
  providers: [], // Providers are added in auth.ts (Node runtime only)
} satisfies NextAuthConfig
