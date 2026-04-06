"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [invalidToken, setInvalidToken] = useState(false)

  useEffect(() => {
    if (!token) {
      setInvalidToken(true)
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.")
        return
      }

      setSuccess(true)
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  if (invalidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted px-4">
        <div className="w-full max-w-sm">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-card text-center">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle size={28} className="text-destructive" />
              </div>
            </div>
            <h1 className="text-lg font-heading font-bold text-foreground mb-2">Lien invalide</h1>
            <p className="text-muted-foreground text-sm mb-6">
              Ce lien de réinitialisation est invalide ou a expiré.
            </p>
            <Link
              href="/forgot-password"
              className="block w-full py-3 px-4 rounded-lg font-semibold text-sm bg-accent hover:bg-accent/90 text-accent-foreground shadow-card hover:shadow-card-hover transition-all duration-200"
            >
              Refaire une demande
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted px-4">
        <div className="w-full max-w-sm">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-card text-center">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle size={28} className="text-success" />
              </div>
            </div>
            <h1 className="text-lg font-heading font-bold text-foreground mb-2">Mot de passe mis à jour</h1>
            <p className="text-muted-foreground text-sm mb-6">
              Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.
            </p>
            <Link
              href="/login"
              className="block w-full py-3 px-4 rounded-lg font-semibold text-sm bg-accent hover:bg-accent/90 text-accent-foreground shadow-card hover:shadow-card-hover transition-all duration-200"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    )
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
            <h1 className="text-lg font-heading font-bold text-foreground mb-2">Nouveau mot de passe</h1>
            <p className="text-muted-foreground text-sm">
              Choisissez votre nouveau mot de passe.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                Nouveau mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                placeholder="Minimum 8 caractères"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                placeholder="Répétez le mot de passe"
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
              {loading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
            </button>
          </form>
        </div>
        <p className="text-center text-muted-foreground text-xs mt-6">
          &copy; {new Date().getFullYear()} Horizon Bénin Properties
        </p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-muted">
          <div className="text-muted-foreground text-sm">Chargement...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
