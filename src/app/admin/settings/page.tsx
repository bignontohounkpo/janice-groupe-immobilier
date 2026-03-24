import { SettingService } from "@/services/SettingService"
import { SettingsForm } from "./settings-form"

export default async function AdminSettingsPage() {
  // Préchargement des données côté serveur directement depuis le service
  let settings: Record<string, string> = {}
  try {
    settings = await SettingService.getAll()
  } catch (err) {
    console.error("Erreur lors du chargement des paramètres:", err)
  }

  const initialData = {
    name: settings.name || "",
    email: settings.email || "",
    phone: settings.phone || "",
    whatsapp: settings.whatsapp || "",
    address: settings.address || ""
  }

  return <SettingsForm initialData={initialData} />
}
