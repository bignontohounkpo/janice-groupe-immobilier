import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma"
import { Resend } from "resend"
import { render } from "@react-email/components"
import ResetPasswordEmail from "@/emails/reset-password"
import crypto from "crypto"

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Adresse email requise." },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    // Toujours retourner un message générique pour ne pas révéler si l'email existe
    if (!user) {
      return NextResponse.json({
        message:
          "Si un compte existe avec cette adresse, un email de réinitialisation a été envoyé.",
      })
    }

    // Invalider les anciens tokens non utilisés pour cet email
    await prisma.passwordResetToken.updateMany({
      where: { email: normalizedEmail, used: false },
      data: { used: true },
    })

    // Générer un token sécurisé
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 heure

    await prisma.passwordResetToken.create({
      data: {
        email: normalizedEmail,
        token,
        expiresAt,
      },
    })

    const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"
    const resetUrl = `${baseUrl}/reset-password?token=${token}`

    const emailHtml = await render(ResetPasswordEmail({ resetUrl }))

    await resend.emails.send({
      from: "Horizon Bénin Properties <onboarding@resend.dev>",
      to: normalizedEmail,
      subject: "Réinitialisez votre mot de passe",
      html: emailHtml,
    })

    return NextResponse.json({
      message:
        "Si un compte existe avec cette adresse, un email de réinitialisation a été envoyé.",
    })
  } catch (error) {
    console.error("[FORGOT_PASSWORD_ERROR]", error)
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    )
  }
}
