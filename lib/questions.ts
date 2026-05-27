import { REGIONS, STYLES } from "./constants";

export type QuestionType = "text" | "tel" | "email" | "date" | "textarea" | "chips" | "tiles" | "range";

export type TileOption = { v: string; l: string; e: string };

export type Question =
  | { id: string; label: string; type: "text" | "tel" | "email"; placeholder?: string; optional?: boolean }
  | { id: string; label: string; type: "date"; optional?: boolean }
  | { id: string; label: string; type: "textarea"; placeholder?: string; optional?: boolean }
  | { id: string; label: string; type: "chips"; multi: boolean; opts: string[]; optional?: boolean }
  | { id: string; label: string; type: "tiles"; multi: boolean; opts: TileOption[]; optional?: boolean }
  | { id: string; label: string; type: "range"; min: number; max: number; step: number; unit: string; marks: { v: number; l: string }[]; optional?: boolean };

// Sources marché Israël 2026 : MazalDay, LiveStreamSimcha, The Israeli Wedding,
// makeup artists Israël. Mariages 100k-250k NIS standard.

export const COMMON_QUESTIONS: Question[] = [
  { id: "name",    label: "Prénom et nom",                  type: "text",     placeholder: "Ex : David Cohen" },
  { id: "phone",   label: "Numéro de téléphone",            type: "tel",      placeholder: "Ex : 050 123 4567" },
  { id: "email",   label: "Email",                          type: "email",    placeholder: "Ex : david@gmail.com" },
  { id: "region",  label: "Région de l'événement",          type: "chips",    multi: false, opts: REGIONS },
  { id: "date",    label: "Date de l'événement",            type: "date" },
  { id: "guests",  label: "Nombre d'invités (si pertinent)", type: "chips",   multi: false, opts: ["Moins de 50", "50 à 100", "100 à 150", "150 à 200", "200 à 300", "300 à 400", "400 et plus"], optional: true },
  { id: "budget",  label: "Budget global de l'événement",   type: "chips",    multi: false,
    opts: ["Moins de 20 000 NIS", "20 000 à 50 000 NIS", "50 000 à 100 000 NIS", "100 000 à 150 000 NIS", "150 000 à 250 000 NIS", "250 000 NIS et plus"] },
  { id: "style",   label: "Style de l'événement",           type: "chips",    multi: true,  opts: STYLES, optional: true },
  { id: "comment", label: "Informations complémentaires",   type: "textarea", placeholder: "Détails importants...", optional: true },
];

// Helper pour générer une question budget chips avec options spécifiques.
function budgetQ(opts: string[]): Question {
  return { id: "budget_svc", label: "Votre budget pour cette prestation", type: "chips", multi: false, opts };
}

export const SERVICE_QUESTIONS: Record<string, Question[]> = {
  salle: [
    { id: "budget_pp", label: "Budget par personne (NIS)", type: "range", min: 80, max: 600, step: 20, unit: "NIS", marks: [{ v: 80, l: "80" }, { v: 200, l: "200" }, { v: 400, l: "400" }, { v: 600, l: "600" }] },
    { id: "ambiance", label: "Ambiance", type: "chips", multi: false, opts: ["Moderne", "Classique", "Oriental", "Luxe", "Simple"] },
    { id: "traiteur_inclus", label: "Traiteur inclus", type: "chips", multi: false, opts: ["Oui", "Non", "Peu importe"] },
    { id: "casher", label: "Salle casher", type: "chips", multi: false, opts: ["Oui indispensable", "Non", "Peu importe"] },
    { id: "extras", label: "Critères importants", type: "chips", multi: true, opts: ["Parking", "Jardin", "Climatisée", "Vue panoramique"] },
  ],
  photo: [
    { id: "format", label: "Format", type: "tiles", multi: true, opts: [{ v: "photo", l: "Photo uniquement", e: "📷" }, { v: "video", l: "Photo + Vidéo", e: "🎥" }, { v: "drone", l: "Drone", e: "🚁" }, { v: "album", l: "Album imprimé", e: "📖" }] },
    { id: "style_photo", label: "Style", type: "chips", multi: false, opts: ["Naturel", "Cinématique", "Traditionnel", "Luxe"] },
    { id: "duree", label: "Durée", type: "chips", multi: false, opts: ["Cérémonie uniquement", "Soirée uniquement", "Journée complète"] },
    budgetQ(["Moins de 4 000 NIS", "4 000 à 7 000 NIS", "7 000 à 10 000 NIS", "10 000 à 15 000 NIS", "15 000 NIS et plus"]),
  ],
  video: [
    { id: "livrables", label: "Livrables", type: "tiles", multi: true, opts: [{ v: "teaser", l: "Teaser 1 min", e: "⚡" }, { v: "clip", l: "Film court", e: "🎬" }, { v: "long", l: "Film long", e: "🎞" }, { v: "drone", l: "Drone inclus", e: "🚁" }] },
    { id: "style_vid", label: "Style", type: "chips", multi: false, opts: ["Cinématique", "Reportage", "Classique"] },
    budgetQ(["Moins de 3 000 NIS", "3 000 à 5 000 NIS", "5 000 à 8 000 NIS", "8 000 à 12 000 NIS", "12 000 NIS et plus"]),
  ],
  dj: [
    { id: "musique", label: "Style musical", type: "chips", multi: true, opts: ["Israélien", "Oriental", "Hassidique", "Français", "International", "Mixte"] },
    { id: "micro", label: "Animation micro", type: "chips", multi: false, opts: ["Oui", "Non"] },
    { id: "duree_dj", label: "Durée", type: "chips", multi: false, opts: ["2h", "3h", "4h", "5h", "Soirée complète"] },
    { id: "materiel", label: "Matériel inclus", type: "chips", multi: true, opts: ["Sono", "Éclairage", "Machine à fumée", "Confettis"] },
    budgetQ(["Moins de 4 000 NIS", "4 000 à 6 000 NIS", "6 000 à 9 000 NIS", "9 000 à 13 000 NIS", "13 000 NIS et plus"]),
  ],
  orch: [
    { id: "type_orch", label: "Type", type: "tiles", multi: false, opts: [{ v: "complet", l: "Orchestre complet", e: "🎺" }, { v: "trio", l: "Trio / Quartet", e: "🎻" }, { v: "solo", l: "Chanteur solo", e: "🎤" }, { v: "hazan", l: "Hazan", e: "🕍" }, { v: "oriental", l: "Oriental", e: "🥁" }] },
    { id: "moment_orch", label: "Moment", type: "chips", multi: true, opts: ["Houppa", "Entrée", "Cocktail", "Soirée complète"] },
    budgetQ(["Moins de 8 000 NIS", "8 000 à 15 000 NIS", "15 000 à 22 000 NIS", "22 000 à 30 000 NIS", "30 000 NIS et plus"]),
  ],
  chant: [
    { id: "type_chant", label: "Type", type: "chips", multi: false, opts: ["Pop moderne", "Oriental", "Hazan", "Français", "Hassidique"] },
    { id: "moment_chant", label: "Moment", type: "chips", multi: true, opts: ["Houppa", "Entrée", "Soirée complète"] },
    budgetQ(["Moins de 2 500 NIS", "2 500 à 5 000 NIS", "5 000 à 8 000 NIS", "8 000 à 12 000 NIS", "12 000 NIS et plus"]),
  ],
  deco: [
    { id: "style_deco", label: "Style", type: "tiles", multi: false, opts: [{ v: "floral", l: "Floral", e: "🌸" }, { v: "luxe", l: "Luxe et doré", e: "✨" }, { v: "moderne", l: "Moderne", e: "⬜" }, { v: "oriental", l: "Oriental", e: "🏮" }, { v: "boheme", l: "Bohème", e: "🌿" }] },
    { id: "elements", label: "Éléments", type: "chips", multi: true, opts: ["Centre de table", "Houppa décorée", "Arche florale", "Ballons", "Photobooth", "Éclairage"] },
    { id: "palette", label: "Couleurs", type: "chips", multi: true, opts: ["Blanc et or", "Rose poudré", "Champagne", "Bordeaux", "Bleu marine"] },
    budgetQ(["Moins de 3 000 NIS", "3 000 à 6 000 NIS", "6 000 à 10 000 NIS", "10 000 à 15 000 NIS", "15 000 NIS et plus"]),
  ],
  invit: [
    { id: "format_inv", label: "Format", type: "tiles", multi: true, opts: [{ v: "digital", l: "Digital / WhatsApp", e: "📱" }, { v: "print", l: "Impression papier", e: "🖨" }, { v: "video", l: "Vidéo invitation", e: "🎥" }, { v: "box", l: "Box luxe", e: "📦" }] },
    { id: "langue_inv", label: "Langues", type: "chips", multi: true, opts: ["Hébreu", "Français", "Anglais", "Russe", "Arabe"] },
    { id: "style_inv", label: "Style", type: "chips", multi: false, opts: ["Classique", "Moderne", "Oriental", "Luxe et or"] },
    budgetQ(["Moins de 500 NIS", "500 à 1 500 NIS", "1 500 à 3 000 NIS", "3 000 à 5 000 NIS", "5 000 NIS et plus"]),
  ],
  makeup: [
    { id: "pour_qui", label: "Pour qui", type: "chips", multi: true, opts: ["Mariée / Bat-Mitsva", "Maman", "Sœurs", "Famille"] },
    { id: "style_mk", label: "Style", type: "chips", multi: false, opts: ["Naturel", "Smoky", "Oriental", "Nude", "Glamour"] },
    { id: "deplacement", label: "Déplacement", type: "chips", multi: false, opts: ["À domicile", "En salon", "Peu importe"] },
    { id: "coiffure", label: "Coiffure aussi", type: "chips", multi: false, opts: ["Oui les deux", "Maquillage uniquement", "Coiffure uniquement"] },
    budgetQ(["Moins de 800 NIS", "800 à 1 500 NIS", "1 500 à 2 500 NIS", "2 500 à 4 000 NIS", "4 000 NIS et plus"]),
  ],
  effets: [
    { id: "type_effets", label: "Effets", type: "chips", multi: true, opts: ["Fontaines de feu", "Machine à fumée", "Confettis", "Laser show", "Mapping vidéo"] },
    { id: "moment_effets", label: "Moment", type: "chips", multi: true, opts: ["Entrée des mariés", "Première danse", "Houppa", "Finale"] },
    budgetQ(["Moins de 2 000 NIS", "2 000 à 5 000 NIS", "5 000 à 10 000 NIS", "10 000 à 20 000 NIS", "20 000 NIS et plus"]),
  ],
};

export function getFieldLabel(id: string): string {
  const allQ: Question[] = [...COMMON_QUESTIONS];
  Object.keys(SERVICE_QUESTIONS).forEach((k) => {
    SERVICE_QUESTIONS[k].forEach((q) => allQ.push(q));
  });
  const found = allQ.find((q) => q.id === id);
  return found ? found.label : id;
}
