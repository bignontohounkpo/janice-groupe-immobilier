import { AGENCY } from "./constants";
import { formatPrice } from "./utils";

/**
 * Génère un lien WhatsApp avec un message pré-rempli
 * @param message Le message à envoyer
 * @param phoneNumber Numéro de téléphone optionnel (sinon utilise le défaut de AGENCY)
 * @returns L'URL wa.me formatée
 */
export function getWhatsAppLink(message?: string, phoneNumber?: string): string {
  let baseUrl = AGENCY.WHATSAPP;
  
  if (phoneNumber) {
    // Si un numéro est fourni, construire le lien wa.me manuellement
    const cleanNumber = phoneNumber.replaceAll(/\s+/g, "").replaceAll("+", "");
    baseUrl = `https://wa.me/${cleanNumber}`;
  }

  if (!message) return baseUrl;
  
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}

/**
 * Génère un message WhatsApp pour un bien immobilier spécifique
 * @param title Titre du bien
 * @param slug Slug du bien (pour le lien)
 * @param price Prix du bien
 * @param location Emplacement du bien
 * @returns Le message formaté
 */
export function getPropertyWhatsAppMessage(title: string, slug: string, price: number, location: string): string {
  const priceFormatted = formatPrice(price);
  
  return `Bonjour Groupe Janice Immobilier, je suis très intéressé par l'annonce suivante :\n\n*${title}*\n *Lieu :* ${location}\n *Prix :* ${priceFormatted}\n\n`;
}
