import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HERO } from "@/lib/constants";

/** Hero section with gradient overlay, headline and CTAs */
const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')",
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 gradient-hero" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          {/* Badge */}
          <span className="inline-block bg-accent/20 text-accent-foreground text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-accent/30">
            {HERO.BADGE}
          </span>

          <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight text-primary-foreground mb-6">
            {HERO.TITLE}
          </h1>

          <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed mb-8">
            {HERO.SUBTITLE}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/annonces"
              className="bg-accent text-accent-foreground font-semibold text-base px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity text-center"
            >
              {HERO.CTA_PRIMARY}
            </Link>
            <Link
              to="/contact"
              className="border-2 border-primary-foreground/80 text-primary-foreground font-semibold text-base px-8 py-3.5 rounded-full hover:bg-primary-foreground/10 transition-colors text-center"
            >
              {HERO.CTA_SECONDARY}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
