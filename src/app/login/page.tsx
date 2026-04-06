"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Email ou mot de passe incorrect.")
      setLoading(false)
    } else {
      router.push("/admin")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 relative">
      <Link
        href="/"
        className="absolute top-6 left-4 md:left-8 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors px-3 py-2 rounded-lg hover:bg-card"
      >
        <ArrowLeft size={20} />
        <span className="font-medium text-sm">Retourner à l&apos;accueil</span>
      </Link>

      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
          <div className="text-center mb-8">
            <h1 className="text-lg font-heading font-bold text-foreground mb-2">Janice Groupe Immobilier</h1>
            <p className="text-muted-foreground text-sm">Espace Administrateur</p>
          </div>

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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                placeholder="••••••••"
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
              {loading ? "Connexion..." : "Se connecter"}
            </button>

            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-secondary transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </form>
        </div>
        <p className="text-center text-muted-foreground text-xs mt-6">
          &copy; {new Date().getFullYear()} Horizon Bénin Properties
        </p>
      </div>
    </div>
  )
}
