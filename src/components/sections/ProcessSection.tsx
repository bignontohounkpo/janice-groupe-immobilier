import { motion } from "framer-motion";
import { PROCESS } from "@/lib/constants";

/** 3-step process section */
const ProcessSection = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground text-center mb-12">
          {PROCESS.TITLE}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROCESS.STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-full bg-accent text-accent-foreground font-heading font-bold text-xl flex items-center justify-center mx-auto mb-5">
                {step.step}
              </div>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
