"use client"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { 
  Building2, Plus, Search, X, Pencil, Trash2, 
  ChevronLeft, ChevronRight, Loader2, Image as ImageIcon 
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/useDebounce"
import { 
  fetchPropertiesPaginated, 
  fetchCategories, 
  deleteProperty, 
  updateProperty 
} from "@/lib/api"
import type { Property } from "@/types/property"
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog"

export default function AdminPropertiesPage() {
  const { toast } = useToast()
  
  // Data State
  const [properties, setProperties] = useState<Property[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters State
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 300)
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Selection & Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deleteId, setDeleteId] = useState<Property | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeletingBulk, setIsDeletingBulk] = useState(false)

  const loadData = async () => {
    try {
      const [propsRes, catsRes] = await Promise.all([
        fetchPropertiesPaginated({ status: "all", pageSize: 1000 } as any),
        fetchCategories()
      ])
      setProperties(propsRes.properties || [])
      setCategories(catsRes || [])
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les données", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Derived / Filtered data
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      // Free text search
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase()
        const matchTitle = p.title?.toLowerCase().includes(query)
        const matchLoc = p.location?.toLowerCase().includes(query)
        const matchDist = p.district?.toLowerCase().includes(query)
        if (!matchTitle && !matchLoc && !matchDist) return false
      }
      
      // Type
      if (typeFilter !== "all" && p.offerType !== typeFilter) return false
      
      // Category
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false
      
      // Status
      if (statusFilter !== "all" && p.status !== statusFilter) return false
      
      return true
    })
  }, [properties, debouncedSearch, typeFilter, categoryFilter, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredProperties.slice(start, start + itemsPerPage)
  }, [filteredProperties, currentPage])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, typeFilter, categoryFilter, statusFilter])

  const handleResetFilters = () => {
    setSearchQuery("")
    setTypeFilter("all")
    setCategoryFilter("all")
    setStatusFilter("all")
  }

  // Checkboxes
  const toggleSelectAll = () => {
    if (selectedIds.length === currentItems.length && currentItems.length > 0) {
      setSelectedIds([])
    } else {
      setSelectedIds(currentItems.map(p => p.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // Inline Actions
  const handleToggleFeatured = async (property: Property) => {
    try {
      await updateProperty(property.id, { isFeatured: !property.isFeatured })
      setProperties(prev => prev.map(p => p.id === property.id ? { ...p, isFeatured: !p.isFeatured } : p))
      toast({ title: "Succès", description: "Statut vedette mis à jour" })
    } catch (error) {
      toast({ title: "Erreur", description: "Mise à jour échouée", variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteProperty(deleteId.id)
      setProperties(prev => prev.filter(p => p.id !== deleteId.id))
      setSelectedIds(prev => prev.filter(id => id !== deleteId.id))
      setDeleteId(null)
      toast({ title: "Succès", description: "Bien supprimé" })
    } catch (error) {
      toast({ title: "Erreur", description: "Suppression échouée", variant: "destructive" })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIds.length} biens ? Cette action est irréversible.`)) return
    
    setIsDeletingBulk(true)
    try {
      await Promise.all(selectedIds.map(id => deleteProperty(id)))
      setProperties(prev => prev.filter(p => !selectedIds.includes(p.id)))
      setSelectedIds([])
      toast({ title: "Succès", description: `${selectedIds.length} biens supprimés` })
    } catch (error) {
      toast({ title: "Erreur", description: "Certaines suppressions ont échoué", variant: "destructive" })
    } finally {
      setIsDeletingBulk(false)
    }
  }

  // Helpers
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-1 bg-[#D5F5E3] text-[#1E8449] rounded-md text-xs font-medium">Disponible</span>
      case "rented":
        return <span className="px-2 py-1 bg-[#FAD7A0] text-[#E67E22] rounded-md text-xs font-medium">Loué</span>
      case "sold":
        return <span className="px-2 py-1 bg-[#FADBD8] text-[#E74C3C] rounded-md text-xs font-medium">Vendu</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">{status}</span>
    }
  }

  const getOfferTypeBadge = (type: string) => {
    return type === "louer" 
      ? <span className="px-2 py-1 bg-[#D6EAF8] text-[#1A5276] rounded-md text-xs font-medium">À louer</span>
      : <span className="px-2 py-1 bg-[#D5F5E3] text-[#1E8449] rounded-md text-xs font-medium">À vendre</span>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Biens immobiliers</h1>
          <p className="text-muted-foreground">{properties.length} biens au total</p>
        </div>
        
        {/* Bulk Action / Add button row */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-border shadow-sm">
              <span className="text-sm font-medium">{selectedIds.length} sélectionné(s)</span>
              <div className="w-px h-4 bg-border"></div>
              <button
                onClick={handleBulkDelete}
                disabled={isDeletingBulk}
                className="text-sm text-[#E74C3C] hover:text-[#C0392B] font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isDeletingBulk ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Supprimer
              </button>
            </div>
          )}
          
          <Link 
            href="/admin/properties/new"
            className="hidden md:flex flex-shrink-0 items-center gap-2 bg-[#F39C12] hover:bg-[#D68910] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm ml-auto"
          >
            <Plus size={18} />
            Ajouter un bien
          </Link>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-border p-4 md:p-5 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher (titre, quartier, etc.)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input focus:ring-2 focus:ring-[#1A5276] outline-none transition-all text-sm"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 lg:w-3/5">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-input focus:ring-2 focus:ring-[#1A5276] outline-none transition-all bg-white text-sm"
          >
            <option value="all">Tous les types</option>
            <option value="louer">À louer</option>
            <option value="vendre">À vendre</option>
          </select>

          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-input focus:ring-2 focus:ring-[#1A5276] outline-none transition-all bg-white text-sm"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-input focus:ring-2 focus:ring-[#1A5276] outline-none transition-all bg-white text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Disponible</option>
            <option value="rented">Loué</option>
            <option value="sold">Vendu</option>
          </select>

          <button 
            onClick={handleResetFilters}
            className="shrink-0 p-2.5 inline-flex items-center justify-center rounded-xl bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            title="Réinitialiser les filtres"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground mt-2 mb-4">
        {filteredProperties.length} résultat(s)
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground h-full min-h-[300px]">
              <Loader2 size={32} className="animate-spin mb-4 text-[#1A5276]" />
              <p>Chargement des biens...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-muted-foreground h-full min-h-[300px]">
              <Building2 size={48} className="mb-4 opacity-30" />
              <p className="text-lg font-medium text-foreground mb-1">Aucun bien trouvé</p>
              <p className="mb-4">Aucun bien ne correspond à votre recherche</p>
              <button 
                onClick={handleResetFilters}
                className="text-[#1A5276] hover:underline text-sm font-medium"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-muted-foreground bg-gray-50/50 uppercase border-b border-border">
                <tr>
                  <th className="px-5 py-4 w-12">
                    <input 
                      type="checkbox" 
                      className="rounded border-input text-[#1A5276] focus:ring-[#1A5276] cursor-pointer"
                      checked={currentItems.length > 0 && selectedIds.length === currentItems.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-5 py-4 font-medium">Bien</th>
                  <th className="px-5 py-4 font-medium">Catégorie</th>
                  <th className="px-5 py-4 font-medium">Type</th>
                  <th className="px-5 py-4 font-medium">Prix</th>
                  <th className="px-5 py-4 font-medium">Statut</th>
                  <th className="px-5 py-4 font-medium text-center">Vedette</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentItems.map(property => (
                  <tr key={property.id} className={`transition-colors ${selectedIds.includes(property.id) ? 'bg-[#EAF2FB]/50' : 'hover:bg-muted/30'}`}>
                    <td className="px-5 py-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-input text-[#1A5276] focus:ring-[#1A5276] cursor-pointer"
                        checked={selectedIds.includes(property.id)}
                        onChange={() => toggleSelect(property.id)}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {property.images && property.images.length > 0 ? (
                          <img 
                            src={property.images[0]} 
                            alt={property.title} 
                            className="w-12 h-12 rounded-lg object-cover bg-muted"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                            <ImageIcon size={20} opacity={0.5} />
                          </div>
                        )}
                        <div className="max-w-[200px]">
                          <p className="font-medium text-foreground truncate" title={property.title}>{property.title}</p>
                          <p className="text-xs text-muted-foreground truncate" title={property.district || property.location}>
                            {property.district || property.location || "Non défini"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block px-2 py-1 bg-[#F2F3F4] text-[#717D7E] text-[10px] rounded-md uppercase tracking-wider font-semibold">
                        {property.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {getOfferTypeBadge(property.offerType)}
                    </td>
                    <td className="px-5 py-4 font-medium">
                      {property.price.toLocaleString("fr-FR")} F
                    </td>
                    <td className="px-5 py-4">
                      {getStatusBadge(property.status)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={property.isFeatured}
                            onChange={() => handleToggleFeatured(property)}
                          />
                          <div className="w-9 h-5 bg-muted-foreground/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F39C12]"></div>
                        </label>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {new Date(property.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/properties/${property.id}`}
                          className="p-2 text-muted-foreground hover:text-[#1A5276] hover:bg-[#EAF2FB] rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={18} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(property)}
                          className="p-2 text-muted-foreground hover:text-[#E74C3C] hover:bg-[#FADBD8] rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-border flex items-center justify-between bg-gray-50/50">
            <div className="text-sm text-muted-foreground hidden sm:block">
              Affichage {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredProperties.length)} sur {filteredProperties.length}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-input bg-white text-muted-foreground hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum = i + 1;
                  // Simple sliding window for pagination
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 2 + i;
                    if (pageNum > totalPages) return null;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[36px] h-9 px-3 rounded-lg border text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-[#1A5276] text-white border-[#1A5276]"
                          : "bg-white border-input text-foreground hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-input bg-white text-muted-foreground hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer ce bien ?"
        description="Cette action est irréversible et supprimera définitivement le bien."
        isLoading={isDeleting}
      />
    </div>
  )
}
