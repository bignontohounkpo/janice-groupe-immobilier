"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.webp"
            alt="Logo Janice Groupe"
            width={120}
            height={120}
            className="h-24 w-auto drop-shadow-sm"
            priority
          />
        </div>

        <div className="relative">
          <h1 className="text-9xl font-extrabold text-[#1A5276]/10 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-6 bg-white rounded-full shadow-lg border border-[#1A5276]/5">
              <Search size={48} className="text-[#F39C12] animate-pulse" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-[#1A5276]">Page Introuvable</h2>
          <p className="text-muted-foreground leading-relaxed">
            Oups ! La page que vous recherchez semble ne pas être disponible. 
            Vérifiez l'URL ou revenez sur nos annonces immobilières.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-8 py-2 text-sm md:text-base bg-[#1A5276] text-white rounded-xl font-semibold hover:bg-[#154360] transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <Home size={20} />
            Accueil
          </Link>
          <button
            onClick={() => typeof window !== 'undefined' && window.history.back()}
            className="flex items-center justify-center gap-2 px-8 py-2 text-sm md:text-base bg-white text-[#1A5276] border-2 border-[#1A5276]/10 rounded-xl font-semibold hover:bg-muted transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
            Page précédente
          </button>
        </div>

        <div className="pt-8 opacity-20 hover:opacity-100 transition-opacity">
          <p className="text-[10px] uppercase tracking-widest text-[#1A5276] font-bold">Janice Groupe International</p>
        </div>
      </motion.div>
    </div>
  )
}
