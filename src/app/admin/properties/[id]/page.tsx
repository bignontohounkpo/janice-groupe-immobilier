import PropertyForm from "@/components/admin/form/PropertyForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/properties"
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Modifier le bien</h1>
          <p className="text-muted-foreground">Mettre à jour les informations de l'annonce</p>
        </div>
      </div>

      <PropertyForm id={id} />
    </div>
  )
}
