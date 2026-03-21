"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import AnnoncesPage from "./AnnoncesPage"

/** Location page — Annonces page pre-filtered to "louer" */
const LocationPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Only redirect if type is not already set to "louer"
    if (searchParams?.get("type") !== "louer") {
      const params = new URLSearchParams(searchParams?.toString() ?? "")
      params.set("type", "louer")
      router.replace(`/annonces?${params.toString()}`)
    }
  }, [searchParams, router])

  // Show the AnnoncesPage directly (filters are in URL)
  return <AnnoncesPage />
}

export default LocationPage
