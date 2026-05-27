// Validateurs partagés entre formulaires client et Server Actions.

export function isValidEmail(email: string): boolean {
  const e = email.trim();
  if (!e) return false;
  // RFC simplifiée : un seul @, pas d'espace, un point dans le domaine.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

// Téléphone israélien :
// - Mobile : 05X-XXXXXXX (10 chiffres au total avec le 0)
// - Fixe : 0[2,3,4,8,9]-XXXXXXX (9 chiffres au total)
// - International : +972 ou 972, sans le 0 initial
export function isValidIsraeliPhone(phone: string): boolean {
  // Normalise : enlève espaces, tirets, parenthèses, points. Garde le + initial.
  const cleaned = phone.replace(/[\s\-().]/g, "").trim();
  if (!cleaned) return false;

  // Mobile avec 0 : 05[0-9]XXXXXXX
  if (/^05\d{8}$/.test(cleaned)) return true;
  // Fixe avec 0 : 0[234589]XXXXXXX
  if (/^0[234589]\d{7}$/.test(cleaned)) return true;
  // Mobile international avec +972 : +9725[0-9]XXXXXXX
  if (/^\+9725\d{8}$/.test(cleaned)) return true;
  // Fixe international avec +972 : +972[234589]XXXXXXX
  if (/^\+972[234589]\d{7}$/.test(cleaned)) return true;
  // Sans le + mais avec 972
  if (/^9725\d{8}$/.test(cleaned)) return true;
  if (/^972[234589]\d{7}$/.test(cleaned)) return true;

  return false;
}

// Normalise un téléphone israélien vers la forme 0XXXXXXXXX (toujours avec le 0).
// Utile pour stocker proprement et pour générer les liens wa.me.
export function normalizeIsraeliPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-().]/g, "").trim();
  if (cleaned.startsWith("+972")) return "0" + cleaned.slice(4);
  if (cleaned.startsWith("972")) return "0" + cleaned.slice(3);
  return cleaned;
}
