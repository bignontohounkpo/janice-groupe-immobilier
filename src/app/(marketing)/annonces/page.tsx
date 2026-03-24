import AnnoncesPage from "@/pages/AnnoncesPage"
import { Suspense } from "react"

export default function Page() {
  return (
    <Suspense>
      <AnnoncesPage />
    </Suspense>
  )
}
