"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X, Plus, Image as ImageIcon, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchCategories,
  fetchPropertyBySlug,
  createProperty,
  updateProperty,
  fetchCities,
  searchDistricts,
} from "@/lib/api";
import type { Property } from "@/types/property";
import { Autocomplete } from "@/components/ui/autocomplete";
import { AutocompleteAsync } from "@/components/ui/autocomplete-async";

interface PropertyFormProps {
  id?: string;
}

const TABS = [
  "Informations générales",
  "Localisation & Prix",
  "Caractéristiques",
  "Photos",
];

const EQUIPMENT_LIST = [
  "Climatisation",
  "Wi-Fi",
  "Parking",
  "Piscine",
  "Jardin",
  "Groupe électrogène",
  "Gardiennage 24h",
  "Cuisine équipée",
  "Terrasse",
  "Balcon",
  "Titre foncier",
  "Sécurité",
];

export default function PropertyForm({ id }: PropertyFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(!!id);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [dynamicCities, setDynamicCities] = useState<string[]>([]);

  // Form State
  const [formData, setFormData] = useState<Partial<Property>>({
    title: "",
    description: "",
    offerType: "louer",
    category: "" as any,
    status: "active",
    isFeatured: false,
    price: 0,
    surface: undefined,
    location: "Bénin",
    city: "Cotonou",
    district: "",
    coordinates: { lat: 6.3654, lng: 2.4183 } as any,
    bedrooms: 0,
    bathrooms: 0,
    isFurnished: false,
    amenities: [],
    images: [],
  });

  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  useEffect(() => {
    async function init() {
      try {
        // Charger les catégories et les villes
        const [cats, cities] = await Promise.all([
          fetchCategories(),
          fetchCities(),
        ]);
        setCategories(cats || []);
        setDynamicCities(cities || []);

        if (id) {
          const prop = await fetchPropertyBySlug(id);
          if (prop) {
            setFormData({
              ...prop,
              // handle potentially undefined arrays
              amenities: prop.amenities || [],
              images: prop.images || [],
            });
          } else {
            toast({
              title: "Erreur",
              description: "Bien introuvable",
              variant: "destructive",
            });
            router.push("/admin/properties");
          }
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Erreur de chargement",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [id, router, toast]);

  const handleChange = (field: keyof Property, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoordinatesChange = (field: "lat" | "lng", value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData((prev) => ({
      ...prev,
      coordinates: {
        ...(prev.coordinates as any),
        [field]: numValue,
      },
    }));
  };

  const toggleEquipment = (eq: string) => {
    setFormData((prev) => {
      const amenities = prev.amenities || [];
      if (amenities.includes(eq)) {
        return { ...prev, amenities: amenities.filter((a) => a !== eq) };
      }
      return { ...prev, amenities: [...amenities, eq] };
    });
  };

  const addPhoto = () => {
    if (!newPhotoUrl.startsWith("http")) {
      toast({
        title: "Erreur",
        description: "L'URL doit commencer par http:// ou https://",
        variant: "destructive",
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), newPhotoUrl],
    }));
    setNewPhotoUrl("");
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const setMainPhoto = (index: number) => {
    setFormData((prev) => {
      const imgs = [...(prev.images || [])];
      const [selected] = imgs.splice(index, 1);
      imgs.unshift(selected);
      return { ...prev, images: imgs };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Quick validation
    if (!formData.title || formData.title.length < 5) {
      toast({
        title: "Erreur",
        description: "Le titre doit faire au moins 5 caractères",
        variant: "destructive",
      });
      setActiveTab(0);
      return;
    }
    if (!formData.description || formData.description.length < 50) {
      toast({
        title: "Erreur",
        description: "La description doit faire au moins 50 caractères",
        variant: "destructive",
      });
      setActiveTab(0);
      return;
    }
    if (!formData.images || formData.images.length === 0) {
      toast({
        title: "Erreur",
        description: "Ajoutez au moins une photo",
        variant: "destructive",
      });
      setActiveTab(3);
      return;
    }

    setIsSaving(true);
    try {
      // Create slug if new
      let payload = { ...formData };
      if (!id && payload.title) {
        payload.slug =
          payload.title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "") +
          "-" +
          Date.now().toString().slice(-4);
      }

      if (id) {
        await updateProperty(id, payload);
        toast({ title: "Succès", description: "Bien mis à jour" });
      } else {
        await createProperty(payload);
        toast({ title: "Succès", description: "Bien ajouté avec succès" });
      }
      router.push("/admin/properties");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-border animate-pulse">
        <div className="flex gap-4 mb-8 border-b pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-32 bg-muted rounded-lg"></div>
          ))}
        </div>
        <div className="space-y-6">
          <div className="h-12 bg-muted rounded-xl w-full"></div>
          <div className="h-32 bg-muted rounded-xl w-full"></div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-12 bg-muted rounded-xl"></div>
            <div className="h-12 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-border flex flex-col relative overflow-hidden"
    >
      {/* Tabs Header */}
      <div className="flex overflow-x-auto border-b border-border bg-gray-50/50">
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
              activeTab === idx
                ? "text-[#1A5276] bg-white"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab}
            {activeTab === idx && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1A5276]"></span>
            )}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="p-6 md:p-8 flex-1">
        {/* TAB 1 */}
        {activeTab === 0 && (
          <div className="space-y-6 max-w-3xl animate-in fade-in duration-300">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titre *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input focus:ring-2 focus:ring-[#1A5276] outline-none transition-all"
                placeholder="Ex: Villa moderne avec piscine"
                required
                minLength={5}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Description *</label>
                <span className="text-xs text-muted-foreground">
                  {formData.description?.length || 0} caractères
                </span>
              </div>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input focus:ring-2 focus:ring-[#1A5276] outline-none transition-all min-h-[150px]"
                placeholder="Description détaillée du bien..."
                required
                minLength={50}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium block">
                  Type d'offre *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange("offerType", "louer")}
                    className={`py-2.5 px-4 rounded-xl border font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                      formData.offerType === "louer"
                        ? "bg-[#1A5276] text-white border-[#1A5276]"
                        : "bg-white text-muted-foreground border-input hover:bg-muted"
                    }`}
                  >
                    À louer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("offerType", "vendre")}
                    className={`py-2.5 px-4 rounded-xl border font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                      formData.offerType === "vendre"
                        ? "bg-[#1A5276] text-white border-[#1A5276]"
                        : "bg-white text-muted-foreground border-input hover:bg-muted"
                    }`}
                  >
                    À vendre
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input focus:ring-2 focus:ring-[#1A5276] outline-none transition-all bg-white"
                  required
                >
                  <option value="" disabled>
                    Sélectionner une catégorie
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Statut *</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input focus:ring-2 focus:ring-[#1A5276] outline-none transition-all bg-white"
                  required
                >
                  <option value="active">Disponible</option>
                  <option value="rented">Loué</option>
                  <option value="sold">Vendu</option>
                </select>
              </div>

              <div className="space-y-2 flex flex-col justify-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isFeatured ? "bg-[#F39C12]" : "bg-muted-foreground/30"}`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        handleChange("isFeatured", e.target.checked)
                      }
                    />
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isFeatured ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </div>
                  <span className="text-sm font-medium">En vedette</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2 */}
        {activeTab === 1 && (
          <div className="space-y-6 max-w-3xl animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prix (XOF) *</label>
                <input
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) =>
                    handleChange("price", Number.parseFloat(e.target.value))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-input focus:ring-2 focus:ring-[#1A5276] outline-none transition-all"
                  min={0}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Location = mensuel / Vente = total
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Surface (m²)</label>
                <input
                  type="number"
                  value={formData.surface || ""}
                  onChange={(e) =>
                    handleChange("surface", parseFloat(e.target.value))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-input focus:ring-2 focus:ring-[#1A5276] outline-none transition-all"
                  min={0}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ville *</label>
                <Autocomplete
                  options={dynamicCities}
                  value={formData.city || ""}
                  onChange={(value) => {
                    handleChange("city", value);
                    // Reset district si la ville change
                    if (formData.district) {
                      handleChange("district", "");
                    }
                  }}
                  placeholder="Ex: Cotonou, Parakou..."
                  ariaLabel="Ville"
                />
              </div>

              
              <div className="space-y-2">
                <label className="text-sm font-medium">Quartier *</label>
                <AutocompleteAsync
                  key={formData.city || "no-city"}
                  searchFn={(query) => searchDistricts(query, formData.city)}
                  value={formData.district || ""}
                  onChange={(value) => {
                    handleChange("district", value);
                    handleChange("location", value);
                  }}
                  placeholder="Rechercher un quartier..."
                  ariaLabel="Quartier"
                  searchOnFocus={!!formData.city}
                  initialQuery=""
                  noResultsMessage={
                    formData.city
                      ? "Aucun quartier trouvé pour cette ville"
                      : "Sélectionnez d'abord une ville"
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={(formData.coordinates as any)?.lat || ""}
                  onChange={(e) =>
                    handleCoordinatesChange("lat", e.target.value)
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-input focus:ring-2 focus:ring-[#1A5276] outline-none transition-all"
                  placeholder="6.3654"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={(formData.coordinates as any)?.lng || ""}
                  onChange={(e) =>
                    handleCoordinatesChange("lng", e.target.value)
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-input focus:ring-2 focus:ring-[#1A5276] outline-none transition-all"
                  placeholder="2.4183"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3 */}
        {activeTab === 2 && (
          <div className="space-y-8 max-w-3xl animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Chambres</label>
                <input
                  type="number"
                  value={formData.bedrooms || ""}
                  onChange={(e) =>
                    handleChange("bedrooms", parseInt(e.target.value))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-input focus:ring-2 focus:ring-[#1A5276] outline-none transition-all"
                  min={0}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Salles de bain</label>
                <input
                  type="number"
                  value={formData.bathrooms || ""}
                  onChange={(e) =>
                    handleChange("bathrooms", parseInt(e.target.value))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-input focus:ring-2 focus:ring-[#1A5276] outline-none transition-all"
                  min={0}
                />
              </div>

              <div className="space-y-2 flex flex-col justify-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isFurnished ? "bg-[#1E8449]" : "bg-muted-foreground/30"}`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.isFurnished}
                      onChange={(e) =>
                        handleChange("isFurnished", e.target.checked)
                      }
                    />
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isFurnished ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </div>
                  <span className="text-sm font-medium">Meublé</span>
                </label>
              </div>
            </div>

            <div className="space-y-4 border-t border-border pt-6">
              <label className="text-base font-semibold">
                Équipements et options
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {EQUIPMENT_LIST.map((eq) => (
                  <label
                    key={eq}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        formData.amenities?.includes(eq)
                          ? "bg-[#1A5276] border-[#1A5276] text-white"
                          : "bg-white border-input group-hover:border-[#1A5276]"
                      }`}
                    >
                      {formData.amenities?.includes(eq) && <Check size={14} />}
                    </div>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.amenities?.includes(eq)}
                      onChange={() => toggleEquipment(eq)}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {eq}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4 */}
        {activeTab === 3 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="max-w-xl space-y-4">
              <label className="text-sm font-medium">
                Ajouter une photo (URL)
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-input focus:ring-2 focus:ring-[#1A5276] outline-none transition-all"
                  placeholder="https://..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPhoto();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addPhoto}
                  disabled={!newPhotoUrl}
                  className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  Ajouter
                </button>
              </div>
            </div>

            {formData.images && formData.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-border aspect-square bg-muted"
                  >
                    <img
                      src={img}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onClick={() => setMainPhoto(idx)}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => setMainPhoto(idx)}
                          className="text-white text-xs bg-black/50 px-2 py-1 rounded hover:bg-[#F39C12]"
                        >
                          Rendre principale
                        </button>
                      )}
                    </div>
                    {idx === 0 && (
                      <div className="absolute top-2 left-2 bg-[#F39C12] text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
                        Principale
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-2 right-2 bg-white/90 text-[#E74C3C] p-1.5 rounded-full hover:bg-white hover:text-red-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center text-muted-foreground">
                <ImageIcon size={48} className="mb-4 opacity-50" />
                <p>Aucune photo pour ce bien.</p>
                <p className="text-sm mt-1">
                  La première photo sera utilisée comme image principale.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer sticky */}
      <div className="border-t border-border bg-gray-50/80 backdrop-blur shrink-0 p-4 md:px-8 flex items-center justify-end gap-3 rounded-b-2xl">
        <button
          type="button"
          onClick={() => router.push("/admin/properties")}
          className="px-6 py-2.5 rounded-xl font-medium text-foreground bg-white border border-input hover:bg-muted transition-colors disabled:opacity-50 text-sm"
          disabled={isSaving}
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl font-medium text-white bg-[#F39C12] hover:bg-[#D68910] transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
        >
          {isSaving && <Loader2 size={18} className="animate-spin" />}
          Enregistrer
        </button>
      </div>
    </form>
  );
}
