import { motion } from "framer-motion";
import { STATS } from "@/lib/constants";

/** Animated stats counters */
const StatsSection = () => {
  return (
    <section className="section-padding bg-primary">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="text-center"
            >
              <div className="font-heading font-extrabold text-4xl md:text-5xl text-accent mb-2">
                {stat.value}
              </div>
              <div className="text-primary-foreground/80 text-sm font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
