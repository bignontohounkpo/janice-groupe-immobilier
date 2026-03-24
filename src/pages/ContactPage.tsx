"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";
import { useSettings } from "@/context/SettingsContext";

/** Contact page with form and agency info */
const ContactPage = () => {
  const { agency } = useSettings();

  return (
    <main className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
            Parlons de votre projet
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Notre équipe vous répond sous peu. Consultation gratuite et sans engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3 bg-card rounded-2xl shadow-card p-6 md:p-8">
            <ContactForm />
          </div>

          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h2 className="font-heading font-semibold text-lg text-foreground mb-4">
                Nos coordonnées
              </h2>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground">{agency.ADDRESS}</span>
                </li>
                <li>
                  <a href={agency.PHONE_LINK} className="flex items-start gap-3 hover:text-primary transition-colors">
                    <Phone size={18} className="text-accent shrink-0 mt-0.5" />
                    <span className="text-foreground">{agency.PHONE}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${agency.EMAIL}`} className="flex items-start gap-3 hover:text-primary transition-colors">
                    <Mail size={18} className="text-accent shrink-0 mt-0.5" />
                    <span className="text-foreground">{agency.EMAIL}</span>
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={18} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground">Lun - Sam : 8h - 18h</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
              <h3 className="font-heading font-semibold text-lg mb-2">Besoin d'une réponse rapide ?</h3>
              <p className="text-sm text-primary-foreground/80 mb-4">
                Appelez-nous directement ou envoyez-nous un message WhatsApp.
              </p>
              <a
                href={agency.WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-success text-success-foreground font-semibold text-sm px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
              >
                Écrire sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
