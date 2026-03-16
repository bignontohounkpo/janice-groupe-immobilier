import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home, Briefcase, GraduationCap, HardHat, PartyPopper, CalendarCheck,
  ShieldCheck, Users, Clock, BadgeCheck, ArrowRight,
} from "lucide-react";
import { CLEANING_SERVICES } from "@/lib/cleaningData";
import type { CleaningService } from "@/types/cleaning";

/** Map icon name strings to Lucide components */
const ICON_MAP: Record<string, React.ElementType> = {
  Home, Briefcase, GraduationCap, HardHat, PartyPopper, CalendarCheck,
};

/** Single service card with hover effect */
const ServiceCard = ({ service }: { service: CleaningService }) => {
  const Icon = ICON_MAP[service.icon] ?? Home;

  return (
    <Link to={`/nettoyage/${service.slug}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="group relative bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:border-b-4 hover:border-b-accent h-full flex flex-col"
      >
        {/* Badge */}
        <span className="absolute top-4 right-4 text-xs font-semibold bg-accent/10 text-accent px-3 py-1 rounded-full">
          {service.badge}
        </span>

        {/* Icon */}
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="text-primary" size={28} />
        </div>

        {/* Content */}
        <h3 className="font-heading text-lg font-bold text-foreground mb-2">{service.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed flex-1">{service.shortDescription}</p>

        {/* Link hint */}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
          En savoir plus <ArrowRight size={16} />
        </span>
      </motion.div>
    </Link>
  );
};

/** "Pourquoi nous choisir" arguments */
const WHY_US = [
  { icon: ShieldCheck, title: "Produits certifiés", text: "Produits d'entretien professionnels, écologiques et sans danger pour votre famille." },
  { icon: Users, title: "Équipe formée & fiable", text: "Personnel sélectionné, formé et encadré. Discrétion et ponctualité garanties." },
  { icon: Clock, title: "Horaires flexibles", text: "Nous intervenons selon vos disponibilités, y compris tôt le matin ou en soirée." },
  { icon: BadgeCheck, title: "Satisfaction garantie", text: "Pas satisfait ? Nous revenons sans frais supplémentaires. Votre tranquillité est notre priorité." },
];

/** Page listing all 6 cleaning services */
const NettoyagePage = () => {
  return (
    <main className="min-h-screen">
      {/* ── Hero ───────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Des espaces propres, une image qui inspire confiance
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl mb-8 leading-relaxed">
            Particuliers, entreprises, établissements scolaires : nous prenons en charge
            l'entretien de vos locaux avec rigueur et professionnalisme.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-accent text-accent-foreground font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Demander un devis gratuit
          </Link>
        </div>
      </section>

      {/* ── Service Grid ───────────────────────── */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container-custom">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            Nos services de nettoyage
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CLEANING_SERVICES.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ──────────────────────── */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="container-custom">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            Pourquoi nous faire confiance ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_US.map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="text-accent" size={28} />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ──────────────────────────── */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            Besoin d'un devis rapide ?
          </h2>
          <p className="text-primary-foreground/80 mb-8 leading-relaxed">
            Décrivez-nous votre besoin en 2 minutes. Notre équipe vous recontacte
            sous 24h avec une proposition adaptée à votre budget.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-accent text-accent-foreground font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Obtenir mon devis gratuit
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NettoyagePage;
