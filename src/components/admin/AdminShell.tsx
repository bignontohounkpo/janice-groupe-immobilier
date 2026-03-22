"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminTopbar from "@/components/admin/AdminTopbar"

interface AdminShellProps {
  children: React.ReactNode
  user: any
}

export default function AdminShell({ children, user }: AdminShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden text-foreground">
      <AdminSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        user={user}
      />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <AdminTopbar 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          user={user}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#F8F9FA]">
          {children}
        </main>
      </div>
    </div>
  )
}
