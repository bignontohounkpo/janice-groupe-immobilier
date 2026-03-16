import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quoteSchema, type QuoteFormValues, LOCAL_TYPE_OPTIONS, FREQUENCY_OPTIONS } from "@/lib/cleaningValidation";
import { toast } from "sonner";
import { useState } from "react";

interface QuoteFormProps {
  /** Pre-fill the service name in the message */
  serviceName?: string;
}

/** Quote request form for cleaning services — validated with Zod + honeypot anti-spam */
const QuoteForm = ({ serviceName }: QuoteFormProps) => {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      message: serviceName ? `Demande de devis pour : ${serviceName}` : "",
    },
  });

  const onSubmit = async (data: QuoteFormValues) => {
    if (data.honeypot) return;
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Demande envoyée ! Nous vous recontactons sous 24h.");
      reset();
    } catch {
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Honeypot — hidden from real users */}
      <input type="text" {...register("honeypot")} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {/* Name */}
      <div>
        <input placeholder="Nom complet *" {...register("name")} className={inputClass} aria-label="Nom" />
        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
      </div>

      {/* Phone + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input placeholder="Téléphone *" type="tel" {...register("phone")} className={inputClass} aria-label="Téléphone" />
          {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <input placeholder="Email *" type="email" {...register("email")} className={inputClass} aria-label="Email" />
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>

      {/* Local type + Surface */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <select {...register("localType")} className={inputClass} aria-label="Type de local" defaultValue="">
            <option value="" disabled>Type de local *</option>
            {LOCAL_TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.localType && <p className="text-destructive text-xs mt-1">{errors.localType.message}</p>}
        </div>
        <div>
          <input placeholder="Surface en m² (optionnel)" type="number" {...register("surface")} className={inputClass} aria-label="Surface" />
        </div>
      </div>

      {/* Frequency */}
      <div>
        <select {...register("frequency")} className={inputClass} aria-label="Fréquence souhaitée" defaultValue="">
          <option value="" disabled>Fréquence souhaitée (optionnel)</option>
          {FREQUENCY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <textarea
          placeholder="Décrivez votre besoin *"
          rows={4}
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
        {submitting ? "Envoi en cours..." : "Envoyer ma demande"}
      </button>
    </form>
  );
};

export default QuoteForm;
