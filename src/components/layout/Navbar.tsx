"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Phone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useScrollTop } from "@/hooks/useScrollTop"
import { AGENCY, NAV_LINKS } from "@/lib/constants"
import { cn } from "@/lib/utils"

/** Main navigation bar — sticky with shadow on scroll */
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const scrolled = useScrollTop()
  const pathname = usePathname()

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-sm py-2 hidden md:block">
        <div className="container-custom flex justify-between items-center">
          <span>{AGENCY.ADDRESS}</span>
          <div className="flex items-center gap-4">
            <a href={`mailto:${AGENCY.EMAIL}`} className="hover:underline">{AGENCY.EMAIL}</a>
            <a href={AGENCY.PHONE_LINK} className="flex items-center gap-1 hover:underline">
              <Phone size={14} />
              {AGENCY.PHONE}
            </a>
          </div>
        </div>
      </div>

      <nav
        className={cn(
          "sticky top-0 z-50 bg-card/95 backdrop-blur-md transition-shadow duration-300",
          scrolled && "shadow-navbar"
        )}
      >
        <div className="container-custom flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.webp"
              alt={AGENCY.NAME}
              className="h-20 w-20"
            />
            <span className="sr-only">{AGENCY.NAME}</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-primary border-b-2 border-accent pb-1"
                    : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="bg-accent text-accent-foreground font-semibold text-sm px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Nous contacter
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-card border-t border-border overflow-hidden"
            >
              <div className="container-custom py-4 flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "py-2 text-base font-medium",
                      pathname === link.href ? "text-primary" : "text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href={AGENCY.PHONE_LINK}
                  className="flex items-center gap-2 py-2 text-primary font-medium"
                >
                  <Phone size={18} />
                  {AGENCY.PHONE}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}

export default Navbar
