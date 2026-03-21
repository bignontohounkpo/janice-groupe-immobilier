"use client";

import { motion } from "framer-motion";
import { CTA_SECTION } from "@/lib/constants";
import Link from "next/link";

/** Final CTA banner */
const CTASection = () => {
  return (
    <section className="section-padding gradient-cta">
      <div className="container-custom text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-foreground mb-4">
            {CTA_SECTION.TITLE}
          </h2>
          <p className="text-primary-foreground/85 text-lg leading-relaxed mb-8">
            {CTA_SECTION.TEXT}
          </p>
          <Link
            href="/contact"
            className="inline-block bg-accent text-accent-foreground font-semibold text-base px-10 py-4 rounded-full hover:opacity-90 transition-opacity"
          >
            {CTA_SECTION.BUTTON}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
