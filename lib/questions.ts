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

const BUDGET_SVC_OPTS = ["Moins de 1000 NIS", "1000 a 2000 NIS", "2000 a 4000 NIS", "4000 a 7000 NIS", "7000 a 12000 NIS", "12000 NIS et plus"];
const budgetSvcQ: Question = { id: "budget_svc", label: "Votre budget pour cette prestation", type: "chips", multi: false, opts: BUDGET_SVC_OPTS };

export const COMMON_QUESTIONS: Question[] = [
  { id: "name",    label: "Prenom et nom",                type: "text",     placeholder: "Ex: David Cohen" },
  { id: "phone",   label: "Numero de telephone",          type: "tel",      placeholder: "Ex: 050 123 4567" },
  { id: "email",   label: "Email (facultatif)",           type: "email",    placeholder: "Ex: david@gmail.com", optional: true },
  { id: "region",  label: "Region de l evenement",        type: "chips",    multi: false, opts: REGIONS },
  { id: "date",    label: "Date de l evenement",          type: "date" },
  { id: "guests",  label: "Nombre d invites",             type: "chips",    multi: false, opts: ["Moins de 50", "50 a 100", "100 a 150", "150 a 200", "200 a 300", "300 a 400", "400 et plus"] },
  { id: "budget",  label: "Budget global de l evenement", type: "chips",    multi: false,
    opts: ["Moins de 20 000 NIS", "20 000 a 40 000 NIS", "40 000 a 70 000 NIS", "70 000 a 100 000 NIS", "100 000 a 150 000 NIS", "150 000 NIS et plus"] },
  { id: "style",   label: "Style de l evenement",         type: "chips",    multi: true,  opts: STYLES, optional: true },
  { id: "comment", label: "Informations complementaires", type: "textarea", placeholder: "Details importants...", optional: true },
];

export const SERVICE_QUESTIONS: Record<string, Question[]> = {
  salle: [
    { id: "budget_pp", label: "Budget par personne NIS", type: "range", min: 80, max: 600, step: 20, unit: "NIS", marks: [{ v: 80, l: "80" }, { v: 200, l: "200" }, { v: 400, l: "400" }, { v: 600, l: "600" }] },
    { id: "ambiance", label: "Ambiance", type: "chips", multi: false, opts: ["Moderne", "Classique", "Oriental", "Luxe", "Simple"] },
    { id: "traiteur_inclus", label: "Traiteur inclus", type: "chips", multi: false, opts: ["Oui", "Non", "Peu importe"] },
    { id: "casher", label: "Salle casher", type: "chips", multi: false, opts: ["Oui indispensable", "Non", "Peu importe"] },
    { id: "extras", label: "Criteres importants", type: "chips", multi: true, opts: ["Parking", "Jardin", "Climatisee", "Vue panoramique"] },
  ],
  photo: [
    { id: "format", label: "Format", type: "tiles", multi: true, opts: [{ v: "photo", l: "Photo uniquement", e: "📷" }, { v: "video", l: "Photo + Video", e: "🎥" }, { v: "drone", l: "Drone", e: "🚁" }, { v: "album", l: "Album imprime", e: "📖" }] },
    { id: "style_photo", label: "Style", type: "chips", multi: false, opts: ["Naturel", "Cinematique", "Traditionnel", "Luxe"] },
    { id: "duree", label: "Duree", type: "chips", multi: false, opts: ["Ceremonie uniquement", "Soiree uniquement", "Journee complete"] },
    budgetSvcQ,
  ],
  video: [
    { id: "livrables", label: "Livrables", type: "tiles", multi: true, opts: [{ v: "teaser", l: "Teaser 1 min", e: "⚡" }, { v: "clip", l: "Film court", e: "🎬" }, { v: "long", l: "Film long", e: "🎞" }, { v: "drone", l: "Drone inclus", e: "🚁" }] },
    { id: "style_vid", label: "Style", type: "chips", multi: false, opts: ["Cinematique", "Reportage", "Classique"] },
    budgetSvcQ,
  ],
  dj: [
    { id: "musique", label: "Style musical", type: "chips", multi: true, opts: ["Israelien", "Oriental", "Hassidique", "Francais", "International", "Mixte"] },
    { id: "micro", label: "Animation micro", type: "chips", multi: false, opts: ["Oui", "Non"] },
    { id: "duree_dj", label: "Duree", type: "chips", multi: false, opts: ["2h", "3h", "4h", "5h", "Soiree complete"] },
    { id: "materiel", label: "Materiel inclus", type: "chips", multi: true, opts: ["Sono", "Eclairage", "Machine a fumee", "Confettis"] },
    budgetSvcQ,
  ],
  orch: [
    { id: "type_orch", label: "Type", type: "tiles", multi: false, opts: [{ v: "complet", l: "Orchestre complet", e: "🎺" }, { v: "trio", l: "Trio Quartet", e: "🎻" }, { v: "solo", l: "Chanteur solo", e: "🎤" }, { v: "hazan", l: "Hazan", e: "🕍" }, { v: "oriental", l: "Oriental", e: "🥁" }] },
    { id: "moment_orch", label: "Moment", type: "chips", multi: true, opts: ["Houppa", "Entree", "Cocktail", "Soiree complete"] },
    budgetSvcQ,
  ],
  chant: [
    { id: "type_chant", label: "Type", type: "chips", multi: false, opts: ["Pop Moderne", "Oriental", "Hazan", "Francais", "Hassidique"] },
    { id: "moment_chant", label: "Moment", type: "chips", multi: true, opts: ["Houppa", "Entree", "Soiree complete"] },
    budgetSvcQ,
  ],
  deco: [
    { id: "style_deco", label: "Style", type: "tiles", multi: false, opts: [{ v: "floral", l: "Floral", e: "🌸" }, { v: "luxe", l: "Luxe et dore", e: "✨" }, { v: "moderne", l: "Moderne", e: "⬜" }, { v: "oriental", l: "Oriental", e: "🏮" }, { v: "boheme", l: "Boheme", e: "🌿" }] },
    { id: "elements", label: "Elements", type: "chips", multi: true, opts: ["Centre de table", "Houppa decoree", "Arche florale", "Ballons", "Photobooth", "Eclairage"] },
    { id: "palette", label: "Couleurs", type: "chips", multi: true, opts: ["Blanc et or", "Rose poudre", "Champagne", "Bordeaux", "Bleu marine"] },
    budgetSvcQ,
  ],
  invit: [
    { id: "format_inv", label: "Format", type: "tiles", multi: true, opts: [{ v: "digital", l: "Digital WhatsApp", e: "📱" }, { v: "print", l: "Impression papier", e: "🖨" }, { v: "video", l: "Video invitation", e: "🎥" }, { v: "box", l: "Box luxe", e: "📦" }] },
    { id: "langue_inv", label: "Langues", type: "chips", multi: true, opts: ["Hebreu", "Francais", "Anglais", "Russe", "Arabe"] },
    { id: "style_inv", label: "Style", type: "chips", multi: false, opts: ["Classique", "Moderne", "Oriental", "Luxe et or"] },
    budgetSvcQ,
  ],
  makeup: [
    { id: "pour_qui", label: "Pour qui", type: "chips", multi: true, opts: ["Mariee Bat-Mitsva", "Maman", "Soeurs", "Famille"] },
    { id: "style_mk", label: "Style", type: "chips", multi: false, opts: ["Naturel", "Smoky", "Oriental", "Nude", "Glamour"] },
    { id: "deplacement", label: "Deplacement", type: "chips", multi: false, opts: ["A domicile", "En salon", "Peu importe"] },
    { id: "coiffure", label: "Coiffure aussi", type: "chips", multi: false, opts: ["Oui les deux", "Maquillage uniquement", "Coiffure uniquement"] },
    budgetSvcQ,
  ],
  effets: [
    { id: "type_effets", label: "Effets", type: "chips", multi: true, opts: ["Fontaines de feu", "Machine a fumee", "Confettis", "Laser show", "Mapping video"] },
    { id: "moment_effets", label: "Moment", type: "chips", multi: true, opts: ["Entree des maries", "Premiere danse", "Houppa", "Finale"] },
    budgetSvcQ,
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
