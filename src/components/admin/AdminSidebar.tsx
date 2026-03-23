"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Session } from "next-auth"
import { LayoutDashboard, Building2, Tag, Settings, LogOut, X } from "lucide-react"

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  user: Session["user"]
}

const navItems = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Biens", icon: Building2 },
  { href: "/admin/categories", label: "Catégories", icon: Tag },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
]

import { signOut } from "next-auth/react"

export default function AdminSidebar({ isOpen, onClose, user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <>
      {/* Overlay Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-[#1A5276] text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="font-bold text-xl leading-tight">
              Janice Group<br />International
            </h1>
            <button className="lg:hidden text-white/80 hover:text-white" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          <span className="inline-block px-2 py-1 bg-white/20 rounded text-xs font-semibold uppercase tracking-wider">
            Administration
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            // For properties/categories, also match sub-routes for active state
            const isActive = pathname ? (item.href === "/admin" 
              ? pathname === "/admin" 
              : pathname.startsWith(item.href)) : false;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-white/10 border-l-[3px] border-white font-medium" 
                    : "hover:bg-white/5 text-white/80 hover:text-white border-l-[3px] border-transparent"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-sm text-white truncate">{user?.name || "Administrateur"}</p>
              <p className="text-xs text-white/60 truncate">{user?.email || "admin@horizonbenin.com"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}
