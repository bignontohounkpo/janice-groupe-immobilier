import type { NextAuthConfig } from "next-auth"

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
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
      }
      return session
    },
  },
  providers: [], // Providers are added in auth.ts (Node runtime only)
} satisfies NextAuthConfig
