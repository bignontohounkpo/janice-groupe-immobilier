"use client"
import { useState, useEffect } from "react"
import { Pencil, Trash2, Check, X, Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { fetchCategories, fetchPropertiesPaginated, createCategory, updateCategory, deleteCategory } from "@/lib/api"
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog"

interface CategoryWithCount {
  id: string
  name: string
  slug: string
  count: number
}

export default function AdminCategoriesPage() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newCatName, setNewCatName] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  
  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  
  // Delete state
  const [deleteId, setDeleteId] = useState<CategoryWithCount | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadData = async () => {
    try {
      const [catsRes, propsRes] = await Promise.all([
        fetchCategories(),
        fetchPropertiesPaginated({ status: "all", pageSize: 1000 } as any)
      ])
      
      const properties = propsRes.properties || []
      const formatted = (catsRes || []).map(cat => ({
        ...cat,
        count: properties.filter(p => p.category === cat.slug).length
      }))
      
      setCategories(formatted)
    } catch (error) {
      console.error(error)
      toast({ title: "Erreur", description: "Impossible de charger les catégories", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName.trim() || newCatName.trim().length < 2) return
    
    setIsAdding(true)
    try {
      await createCategory(newCatName.trim())
      setNewCatName("")
      toast({ title: "Succès", description: "Catégorie ajoutée" })
      await loadData()
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible d'ajouter la catégorie", variant: "destructive" })
    } finally {
      setIsAdding(false)
    }
  }

  const startEditing = (cat: CategoryWithCount) => {
    setEditingId(cat.id)
    setEditingName(cat.name)
  }

  const handleSaveEdit = async (id: string) => {
    if (!editingName.trim() || editingName.trim().length < 2) return
    
    setIsSaving(true)
    try {
      await updateCategory(id, editingName.trim())
      setEditingId(null)
      toast({ title: "Succès", description: "Catégorie mise à jour" })
      await loadData()
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de modifier la catégorie", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteCategory(deleteId.id)
      setDeleteId(null)
      toast({ title: "Succès", description: "Catégorie supprimée" })
      await loadData()
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer la catégorie", variant: "destructive" })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Catégories de biens</h1>
          <p className="text-muted-foreground">{categories.length} catégories au total</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        {/* Adds section */}
        <div className="p-5 border-b border-border bg-gray-50/50">
          <form onSubmit={handleAdd} className="flex gap-3 max-w-md">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Ex: Appartement meublé"
              className="flex-1 px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-[#1A5276] outline-none transition-all text-sm"
              disabled={isAdding}
            />
            <button
              type="submit"
              disabled={isAdding || newCatName.trim().length < 2}
              className="bg-[#1A5276] hover:bg-[#154360] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
            >
              {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Ajouter
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-white uppercase border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium w-1/2">Nom</th>
                <th className="px-6 py-4 font-medium w-32 whitespace-nowrap">Biens liés</th>
                <th className="px-6 py-4 font-medium w-32 text-right">Actions</th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                {[...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-border">
                    <td className="px-6 py-4"><div className="h-5 bg-muted rounded w-1/2"></div></td>
                    <td className="px-6 py-4"><div className="h-5 bg-muted rounded w-8 mx-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-muted rounded w-16 ml-auto"></div></td>
                  </tr>
                ))}
              </tbody>
            ) : categories.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                    Aucune catégorie. Ajoutez votre première catégorie ci-dessus.
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-border">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      {editingId === cat.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="w-full max-w-xs px-3 py-1.5 rounded border border-[#F39C12] outline-none focus:ring-2 focus:ring-[#FAD7A0] text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(cat.id)
                              if (e.key === 'Escape') setEditingId(null)
                            }}
                          />
                        </div>
                      ) : (
                        <span className="font-medium text-foreground">{cat.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center bg-muted px-2.5 py-1 rounded-full text-xs font-semibold text-foreground">
                        {cat.count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingId === cat.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleSaveEdit(cat.id)}
                            disabled={isSaving}
                            className="p-1.5 text-[#1E8449] hover:bg-[#D5F5E3] rounded transition-colors"
                            title="Sauvegarder"
                          >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            disabled={isSaving}
                            className="p-1.5 text-muted-foreground hover:bg-muted rounded transition-colors"
                            title="Annuler"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEditing(cat)}
                            className="p-2 text-muted-foreground hover:text-[#1A5276] hover:bg-[#EAF2FB] rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteId(cat)}
                            className="p-2 text-muted-foreground hover:text-[#E74C3C] hover:bg-[#FADBD8] rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>

      <DeleteConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={`Supprimer '${deleteId?.name}' ?`}
        description="Les biens liés ne seront pas supprimés."
        isLoading={isDeleting}
      />
    </div>
  )
}
