import { Link } from "react-router-dom";
import { Building2, Home, TrendingUp, Hammer } from "lucide-react";
import { motion } from "framer-motion";
import { SERVICES } from "@/lib/constants";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  Home,
  TrendingUp,
  Hammer,
};

/** Services section showcasing the four core offerings */
const ServicesSection = () => {
  return (
    <section className="section-padding bg-muted">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
            {SERVICES.TITLE}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {SERVICES.SUBTITLE}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.ITEMS.map((item, i) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-secondary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {item.text}
                </p>
                <Link
                  to={item.href}
                  className="text-secondary font-medium text-sm hover:text-primary transition-colors"
                >
                  {item.link}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
