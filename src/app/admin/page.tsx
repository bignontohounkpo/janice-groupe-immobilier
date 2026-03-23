"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Building2, CheckCircle, Key, Star, Pencil, ArrowRight } from "lucide-react"
import StatsCard from "@/components/admin/StatsCard"
import { fetchPropertiesPaginated, fetchCategories } from "@/lib/api"
import type { Property } from "@/types/property"

export default function AdminOverviewPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [propsRes, catsRes] = await Promise.all([
          fetchPropertiesPaginated({ status: "all", pageSize: 1000 } as any),
          fetchCategories()
        ])
        setProperties(propsRes.properties || [])
        setCategories(catsRes || [])
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 w-1/3 bg-muted rounded-xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl shadow-sm border border-border"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="h-96 bg-white rounded-2xl shadow-sm border border-border"></div>
          <div className="h-96 bg-white rounded-2xl shadow-sm border border-border"></div>
        </div>
      </div>
    )
  }

  const totalProps = properties.length
  const availableProps = properties.filter(p => p.status === "active").length
  const rentedSoldProps = properties.filter(p => p.status === "rented" || p.status === "sold").length
  const featuredProps = properties.filter(p => p.isFeatured).length

  // Recent 5 properties
  const recentProperties = [...properties].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5)

  // Categories with counts
  const categoryCounts = categories.map(cat => ({
    ...cat,
    count: properties.filter(p => p.category === cat.slug).length
  }))

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="px-2.5 py-1 bg-[#D5F5E3] text-[#1E8449] rounded-full text-xs font-semibold">Disponible</span>
      case "rented":
        return <span className="px-2.5 py-1 bg-[#FAD7A0] text-[#E67E22] rounded-full text-xs font-semibold">Loué</span>
      case "sold":
        return <span className="px-2.5 py-1 bg-[#FADBD8] text-[#E74C3C] rounded-full text-xs font-semibold">Vendu</span>
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">{status}</span>
    }
  }

  const getOfferTypeBadge = (type: string) => {
    return type === "louer" 
      ? <span className="px-2 py-0.5 bg-[#D6EAF8] text-[#1A5276] rounded text-xs">À louer</span>
      : <span className="px-2 py-0.5 bg-[#D5F5E3] text-[#1E8449] rounded text-xs">À vendre</span>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Vue d'ensemble</h1>
        <p className="text-muted-foreground">Bienvenue sur votre tableau de bord</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard 
          title="Biens immobiliers" 
          value={totalProps} 
          subtitle="Dans votre portefeuille"
          icon={Building2}
          iconBgColor="#EAF2FB"
          iconColor="#1A5276"
        />
        <StatsCard 
          title="Disponibles" 
          value={availableProps} 
          subtitle="Actuellement en ligne"
          icon={CheckCircle}
          iconBgColor="#D5F5E3"
          iconColor="#1E8449"
        />
        <StatsCard 
          title="Loués / Vendus" 
          value={rentedSoldProps} 
          subtitle="Transactions réalisées"
          icon={Key}
          iconBgColor="#FAD7A0"
          iconColor="#E67E22"
        />
        <StatsCard 
          title="En vedette" 
          value={featuredProps} 
          subtitle="Affichés sur l'accueil"
          icon={Star}
          iconBgColor="#E8DAEF"
          iconColor="#7D3C98"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Derniers biens */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border flex justify-between items-center bg-gray-50/50">
            <h2 className="font-semibold text-lg text-foreground">5 derniers biens</h2>
            <Link href="/admin/properties" className="text-sm text-[#F39C12] hover:text-[#D68910] font-medium flex items-center gap-1">
              Voir tous
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="overflow-x-auto flex-1 p-0">
            {recentProperties.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground bg-white uppercase">
                  <tr>
                    <th className="px-5 py-3 font-medium border-b border-border">Bien</th>
                    <th className="px-5 py-3 font-medium border-b border-border">Type</th>
                    <th className="px-5 py-3 font-medium border-b border-border">Prix</th>
                    <th className="px-5 py-3 font-medium border-b border-border">Statut</th>
                    <th className="px-5 py-3 text-right font-medium border-b border-border">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentProperties.map(property => (
                    <tr key={property.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={property.images?.[0] || "/placeholder.svg"} 
                            alt={property.title} 
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-foreground line-clamp-1">{property.title}</p>
                            <span className="inline-block px-1.5 py-0.5 bg-[#F2F3F4] text-[#717D7E] text-[10px] rounded uppercase tracking-wide mt-1 font-medium">
                              {property.category}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {getOfferTypeBadge(property.offerType)}
                      </td>
                      <td className="px-5 py-3 font-medium whitespace-nowrap">
                        {property.price.toLocaleString("fr-FR")} F
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {getStatusBadge(property.status)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link 
                          href={`/admin/properties/${property.id}`}
                          className="inline-flex items-center justify-center p-2 text-muted-foreground hover:text-[#1A5276] hover:bg-[#EAF2FB] rounded-lg transition-colors"
                        >
                          <Pencil size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
                <Building2 size={48} className="text-muted/50 mb-4" />
                <p>Aucun bien enregistré.</p>
              </div>
            )}
          </div>
        </div>

        {/* Catégories */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border flex justify-between items-center bg-gray-50/50">
            <h2 className="font-semibold text-lg text-foreground">Catégories</h2>
            <Link href="/admin/categories" className="text-sm text-[#1A5276] hover:underline font-medium flex items-center gap-1">
              Gérer les catégories
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            {categoryCounts.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground bg-white uppercase">
                  <tr>
                    <th className="px-5 py-3 font-medium border-b border-border">Nom</th>
                    <th className="px-5 py-3 font-medium text-right border-b border-border">Nombre de biens</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {categoryCounts.slice(0, 5).map(cat => (
                    <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 font-medium text-foreground">{cat.name}</td>
                      <td className="px-5 py-4 text-right text-muted-foreground">
                        <span className="inline-flex items-center justify-center bg-muted px-2.5 py-1 rounded-full text-xs font-semibold text-foreground">
                          {cat.count}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
                <CheckCircle size={48} className="text-muted/50 mb-4" />
                <p>Aucune catégorie.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
