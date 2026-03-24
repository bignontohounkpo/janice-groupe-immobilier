"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormValues } from "@/lib/validations";
import { toast } from "sonner";
import { useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { submitContactForm } from "@/lib/api";

interface ContactFormProps {
  propertyId?: string;
  compact?: boolean;
}

/** Reusable contact form with validation and honeypot */
const ContactForm = ({ propertyId, compact }: ContactFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { agency } = useSettings();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    if (data.honeypot) return;
    setSubmitting(true);

    try {
      // 1. Garder une trace en base (async, non bloquant)
      submitContactForm({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        propertyId: propertyId,
      }).catch(err => console.error("Erreur sauvegarde contact:", err));

      // 2. Ouvrir WhatsApp avec message pré-rempli
      const whatsappNumber = agency.WHATSAPP.replace("https://wa.me/", "");
      const message = `Bonjour, je suis ${data.name} (${data.phone})

Je souhaite vous contacter pour un projet. Avez-vous un moment ?

${data.message}`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");

      toast.success("Redirection vers WhatsApp...");
      reset();
    } catch {
      toast.error("Erreur lors de l'envoi.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Honeypot */}
      <input type="text" {...register("honeypot")} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <input type="hidden" value={propertyId ?? ""} name="propertyId" />

      <div>
        <input placeholder="Nom complet *" {...register("name")} className={inputClass} aria-label="Nom" />
        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div className={compact ? "" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}>
        <div>
          <input placeholder="Email *" type="email" {...register("email")} className={inputClass} aria-label="Email" />
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className={compact ? "mt-4" : ""}>
          <input placeholder="Téléphone *" type="tel" {...register("phone")} className={inputClass} aria-label="Téléphone" />
          {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <textarea
          placeholder="Votre message *"
          rows={compact ? 3 : 5}
          {...register("message")}
          className={inputClass + " resize-none"}
          aria-label="Message"
        />
        {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-accent text-accent-foreground font-semibold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {submitting ? "Envoi en cours..." : "Envoyer le message"}
      </button>
    </form>
  );
};

export default ContactForm;
