"use client"
import { useState, useEffect } from "react"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/context/SettingsContext"
import { updateSettings } from "@/lib/api"

interface SettingsFormProps {
  initialData: {
    name: string
    email: string
    phone: string
    whatsapp: string
    address: string
  }
}

export function SettingsForm({ initialData }: Readonly<SettingsFormProps>) {
  const { toast } = useToast()
  const { refreshSettings } = useSettings()

  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState(initialData)

  // Sync si les données initiales changent (par exemple navigation client)
  useEffect(() => {
    setFormData(initialData)
  }, [initialData])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updateSettings(formData)
      await refreshSettings()
      toast({ title: "Succès", description: "Les paramètres ont été mis à jour avec succès" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erreur", description: "Impossible de mettre à jour les paramètres", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres de l'agence</h1>
        <p className="text-muted-foreground">Gérez les informations de contact affichées sur le site.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">Nom de l'agence</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-[#1A5276] outline-none text-sm transition-all"
                placeholder="Ex: Janice Group International"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email de contact</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-[#1A5276] outline-none text-sm transition-all"
                placeholder="Ex: contact@agence.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">Téléphone</label>
              <input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-[#1A5276] outline-none text-sm transition-all"
                placeholder="Ex: +229 00 00 00 00"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="whatsapp" className="text-sm font-medium text-foreground">Numéro WhatsApp</label>
              <input
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-[#1A5276] outline-none text-sm transition-all"
                placeholder="Ex: 22900000000 (sans le +)"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="address" className="text-sm font-medium text-foreground">Adresse complète</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-[#1A5276] outline-none text-sm transition-all min-h-[100px]"
                placeholder="Ex: 123 Rue de la Paix..."
                required
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end border-t border-border">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#1A5276] hover:bg-[#154360] text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
