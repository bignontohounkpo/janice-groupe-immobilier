"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Plus, ExternalLink, User, LogOut } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface AdminTopbarProps {
  onMenuClick: () => void
  user: any
}

import { signOut } from "next-auth/react"

export default function AdminTopbar({ onMenuClick, user }: AdminTopbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getPageTitle = () => {
    if (!pathname) return "Administration"
    if (pathname === "/admin") return "Vue d'ensemble"
    if (pathname === "/admin/properties") return "Biens immobiliers"
    if (pathname === "/admin/properties/new") return "Ajouter un bien"
    if (pathname.startsWith("/admin/properties/")) return "Modifier le bien"
    if (pathname === "/admin/categories") return "Catégories de biens"
    return "Administration"
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <header className="h-[64px] bg-white border-b border-border shadow-sm flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg lg:hidden"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-semibold text-foreground hidden sm:block">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <Link
          href="/"
          target="_blank"
          className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <ExternalLink size={18} />
          <span>Voir le site</span>
        </Link>
        
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 bg-[#F39C12] hover:bg-[#D68910] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Ajouter un bien</span>
        </Link>

        {/* User Dropdown */}
        <div className="relative ml-2" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border hover:bg-accent transition-colors"
          >
            <User size={20} className="text-muted-foreground" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border py-1 z-50">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground truncate">{user?.name || "Administrateur"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || "admin@horizonbenin.com"}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors text-left"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
