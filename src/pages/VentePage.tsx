"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import AnnoncesPage from "./AnnoncesPage"

/** Vente page — Annonces page pre-filtered to "vendre" */
const VentePage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Only redirect if type is not already set to "vendre"
    if (searchParams?.get("type") !== "vendre") {
      const params = new URLSearchParams(searchParams?.toString() ?? "")
      params.set("type", "vendre")
      router.replace(`/annonces?${params.toString()}`)
    }
  }, [searchParams, router])

  // Show the AnnoncesPage directly (filters are in URL)
  return <AnnoncesPage />
}

export default VentePage
