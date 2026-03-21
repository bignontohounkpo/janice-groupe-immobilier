import NextAuth from "next-auth"
import authConfig from "@/auth.config"

/**
 * Middleware Edge Runtime.
 * N'importe QUE le fichier auth.config.ts (sans Prisma).
 * La vérification se fait uniquement sur le token JWT.
 */
export default NextAuth(authConfig).auth

export const config = {
  matcher: ["/admin/:path*"],
}
