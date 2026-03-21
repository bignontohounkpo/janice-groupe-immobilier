import HeroSection from "@/components/sections/HeroSection"
import ServicesSection from "@/components/sections/ServicesSection"
import FeaturedProperties from "@/components/sections/FeaturedProperties"
import StatsSection from "@/components/sections/StatsSection"
import ProcessSection from "@/components/sections/ProcessSection"
import TestimonialsSection from "@/components/sections/TestimonialsSection"
import CTASection from "@/components/sections/CTASection"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <FeaturedProperties />
      <StatsSection />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection />

      {/* JSON-LD LocalBusiness */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "Janice Groupe International Immobilier",
            telephone: "+229 97507052",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Cotonou",
              addressCountry: "BJ",
            },
          }),
        }}
      />
    </>
  )
}
