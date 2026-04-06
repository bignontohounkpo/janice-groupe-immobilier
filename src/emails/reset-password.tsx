import { Html, Head, Body, Container, Text, Button, Section, Preview } from "@react-email/components"
import * as React from "react"

interface ResetPasswordEmailProps {
  resetUrl: string
}

export default function ResetPasswordEmail({ resetUrl }: ResetPasswordEmailProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Réinitialisez votre mot de passe sur Horizon Bénin Properties</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Horizon Bénin Properties</Text>
          </Section>

          <Section style={content}>
            <Text style={title}>Réinitialisation de votre mot de passe</Text>
            <Text style={text}>
              Vous avez demandé la réinitialisation de votre mot de passe.
              Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
            </Text>

            <Button style={button} href={resetUrl}>
              Réinitialiser mon mot de passe
            </Button>

            <Text style={text}>
              Ce lien est valide pendant <strong>1 heure</strong>. Si vous n&apos;avez pas fait cette demande,
              vous pouvez ignorer cet email.
            </Text>

            <Text style={fallback}>
              Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
              <br />
              <a href={resetUrl} style={link}>{resetUrl}</a>
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} Horizon Bénin Properties &mdash; Cotonou, Bénin
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f7f9",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
}

const container = {
  maxWidth: 480,
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: 8,
  overflow: "hidden",
}

const header = {
  backgroundColor: "#1A5276",
  padding: "24px 32px",
}

const logo = {
  color: "#ffffff",
  fontSize: 18,
  fontWeight: 700,
  margin: 0,
}

const content = {
  padding: "32px",
}

const title = {
  fontSize: 20,
  fontWeight: 700,
  color: "#1A5276",
  marginBottom: 16,
}

const text = {
  fontSize: 15,
  color: "#374151",
  lineHeight: 1.6,
  marginBottom: 20,
}

const button = {
  display: "inline-block",
  backgroundColor: "#f59e0b",
  color: "#111827",
  fontWeight: 600,
  fontSize: 15,
  padding: "12px 32px",
  borderRadius: 8,
  textDecoration: "none",
  marginBottom: 24,
}

const fallback = {
  fontSize: 13,
  color: "#6b7280",
  lineHeight: 1.6,
  marginBottom: 16,
}

const link = {
  color: "#1A5276",
  wordBreak: "break-all" as const,
}

const footer = {
  backgroundColor: "#f9fafb",
  padding: "16px 32px",
  borderTop: "1px solid #e5e7eb",
}

const footerText = {
  fontSize: 12,
  color: "#9ca3af",
  textAlign: "center" as const,
  margin: 0,
}
