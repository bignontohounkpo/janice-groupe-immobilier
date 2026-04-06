"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.")
        return
      }

      setSent(true)
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 relative">
      <Link
        href="/login"
        className="absolute top-6 left-4 md:left-8 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors px-3 py-2 rounded-lg hover:bg-card"
      >
        <ArrowLeft size={20} />
        <span className="font-medium text-sm">Retour à la connexion</span>
      </Link>

      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
          <div className="text-center mb-8">
            <h1 className="text-lg font-heading font-bold text-foreground mb-2">Mot de passe oublié</h1>
            <p className="text-muted-foreground text-sm">
              {sent
                ? "Vérifiez votre boîte de réception."
                : "Entrez votre email pour recevoir un lien de réinitialisation."}
            </p>
          </div>

          {sent ? (
            <div className="space-y-5">
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
                  <Mail size={28} className="text-success" />
                </div>
              </div>
              <p className="text-foreground text-sm text-center leading-relaxed">
                Un email de réinitialisation a été envoyé à l&apos;adresse <strong>{email}</strong>,
              </p>
              <p className="text-muted-foreground text-xs text-center">
                Vérifiez également vos spams.
              </p>
              <Link
                href="/login"
                className="block w-full text-center py-3 px-4 rounded-lg font-semibold text-sm bg-accent hover:bg-accent/90 text-accent-foreground shadow-card hover:shadow-card-hover transition-all duration-200"
              >
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                  placeholder="contact@gmail.com"
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  loading
                    ? "bg-accent/60 text-accent-foreground cursor-not-allowed"
                    : "bg-accent hover:bg-accent/90 text-accent-foreground shadow-card hover:shadow-card-hover"
                }`}
              >
                {loading ? "Envoi en cours..." : "Envoyer le lien"}
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-muted-foreground text-xs mt-6">
          &copy; {new Date().getFullYear()} Horizon Bénin Properties
        </p>
      </div>
    </div>
  )
}
