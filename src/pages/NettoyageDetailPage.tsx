"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home, Briefcase, GraduationCap, HardHat, PartyPopper, CalendarCheck,
  Users, Key, Store, Building2, Building, Wrench, Heart, Mic, BookOpen, School,
  CheckCircle, ArrowRight, ChevronRight,
} from "lucide-react";
import { CLEANING_SERVICES, getCleaningServiceBySlug } from "@/lib/cleaningData";
import type { CleaningFormula } from "@/types/cleaning";
import { useEffect } from "react";

/** Map icon name strings → Lucide components (covers all icons used in data) */
const ICON_MAP: Record<string, React.ElementType> = {
  Home, Briefcase, GraduationCap, HardHat, PartyPopper, CalendarCheck,
  Users, Key, Store, Building2, Building, Wrench, Heart, Mic, BookOpen, School,
};

/* ── Sub-components ─────────────────────────────── */

/** Checklist with green check icons */
const IncludedList = ({ items }: { items: string[] }) => (
  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-2 text-sm text-foreground">
        <CheckCircle className="text-success shrink-0 mt-0.5" size={18} />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

/** Vertical timeline for intervention steps */
const StepsTimeline = ({ steps }: { steps: { number: number; title: string; description: string }[] }) => (
  <div className="relative pl-8 space-y-8">
    {/* Vertical line */}
    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />
    {steps.map((step) => (
      <div key={step.number} className="relative">
        {/* Dot */}
        <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
          {step.number}
        </div>
        <h4 className="font-heading font-bold text-foreground mb-1">{step.title}</h4>
        <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
      </div>
    ))}
  </div>
);

/** Profile target cards */
const ProfileGrid = ({ profiles }: { profiles: { icon: string; title: string; description: string }[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
    {profiles.map(({ icon, title, description }) => {
      const Icon = ICON_MAP[icon] ?? Home;
      return (
        <div key={title} className="bg-card rounded-2xl border border-border p-5 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Icon className="text-primary" size={22} />
          </div>
          <h4 className="font-heading font-bold text-foreground text-sm mb-1">{title}</h4>
          <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
        </div>
      );
    })}
  </div>
);

/** Formula pricing card */
const FormulaCard = ({ formula }: { formula: CleaningFormula }) => (
  <div className={`relative bg-card rounded-2xl border p-6 text-center ${formula.isPopular ? "border-accent shadow-lg" : "border-border"}`}>
    {formula.isPopular && (
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-4 py-1 rounded-full">
        Populaire
      </span>
    )}
    <h4 className="font-heading font-bold text-lg text-foreground mb-1">{formula.name}</h4>
    <p className="text-muted-foreground text-sm mb-2">{formula.frequency}</p>
    <p className="text-sm text-foreground mb-3">{formula.included}</p>
    <p className="font-heading font-bold text-primary text-lg">{formula.price}</p>
    <Link
      href="/contact"
      className="mt-4 inline-block bg-primary text-primary-foreground text-sm font-semibold px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
    >
      {formula.price === "Sur devis" ? "Demander un devis" : "Choisir cette formule"}
    </Link>
  </div>
);

/* ── Main Detail Page ───────────────────────────── */

/** Dynamic cleaning service detail page at /nettoyage/:slug */
const NettoyageDetailPage = () => {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const service = slug ? getCleaningServiceBySlug(slug) : undefined;

  /* Update document title for SEO */
  useEffect(() => {
    if (service) {
      document.title = service.seo.metaTitle;
    }
  }, [service]);

  if (!service) {
    if (typeof window !== "undefined") {
      window.location.href = "/nettoyage";
    }
    return null;
  }

  const otherServices = CLEANING_SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <main className="min-h-screen">
      {/* ── 1. Hero with breadcrumb + image ──── */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={service.image}
            alt={service.heroTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
        </div>

        <div className="relative container-custom max-w-4xl mx-auto py-14 md:py-20 text-primary-foreground">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-primary-foreground/70 text-sm mb-6">
            <Link href="/" className="hover:text-primary-foreground transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <Link href="/nettoyage" className="hover:text-primary-foreground transition-colors">Nettoyage</Link>
            <ChevronRight size={14} />
            <span className="text-primary-foreground">{service.title}</span>
          </nav>

          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">{service.heroTitle}</h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed mb-6">{service.heroAccroche}</p>
          <a
            href="#devis"
            className="inline-block bg-accent text-accent-foreground font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Demander un devis
          </a>
        </div>
      </section>

      {/* ── 2. Full description ────────────────── */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container-custom max-w-3xl mx-auto">
          <p className="text-foreground leading-relaxed text-base md:text-lg">{service.fullDescription}</p>
        </div>
      </section>

      {/* ── 3. What's included ─────────────────── */}
      <section className="py-12 md:py-16 bg-muted">
        <div className="container-custom max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-8">Ce qui est inclus</h2>
          <IncludedList items={service.included} />
        </div>
      </section>

      {/* ── 4. Steps timeline ──────────────────── */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container-custom max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-8">Déroulement de l'intervention</h2>
          <StepsTimeline steps={service.steps} />
        </div>
      </section>

      {/* ── 5. Target profiles ─────────────────── */}
      <section className="py-12 md:py-16 bg-muted">
        <div className="container-custom max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-8">Pour qui est ce service ?</h2>
          <ProfileGrid profiles={service.targetProfiles} />
        </div>
      </section>

      {/* ── 6. Formulas / Pricing ──────────────── */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container-custom max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-8 text-center">Formules & Tarification</h2>
          {service.formulas ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {service.formulas.map((formula) => (
                <FormulaCard key={formula.name} formula={formula} />
              ))}
            </div>
          ) : (
            <div className="text-center bg-muted rounded-2xl p-8">
              <p className="text-foreground font-medium">{service.formulaMessage}</p>
              <Link
                href="/contact"
                className="mt-4 inline-block bg-accent text-accent-foreground font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                Contactez-nous
              </Link>
            </div>
          )}
        </div>
      </section>



      {/* ── 8. Other services ──────────────────── */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container-custom">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-8 text-center">Nos autres services de nettoyage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherServices.map((s) => {
              const Icon = ICON_MAP[s.icon] ?? Home;
              return (
                <Link key={s.id} href={`/nettoyage/${s.slug}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="group bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:border-b-4 hover:border-b-accent"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="text-primary" size={22} />
                      <h3 className="font-heading font-bold text-foreground">{s.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">{s.shortDescription}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                      Voir le détail <ArrowRight size={14} />
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default NettoyageDetailPage;
