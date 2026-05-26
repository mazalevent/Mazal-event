export const GOLD = "#C9A84C";
export const IVORY = "#FDFAF4";
export const DARK = "#1A1208";
export const MUTED = "#8B7355";

export type Service = { id: string; label: string; emoji: string };
export const SERVICES: Service[] = [
  { id: "salle",    label: "Salle de fête",          emoji: "🏛" },
  { id: "photo",    label: "Photographe",            emoji: "📸" },
  { id: "video",    label: "Vidéo",                  emoji: "🎬" },
  { id: "dj",       label: "DJ",                     emoji: "🎧" },
  { id: "orch",     label: "Orchestre",              emoji: "🎺" },
  { id: "chant",    label: "Chanteur",               emoji: "🎤" },
  { id: "deco",     label: "Décoration",             emoji: "🌸" },
  { id: "invit",    label: "Invitations",            emoji: "✉" },
  { id: "makeup",   label: "Maquillage Coiffure",    emoji: "💄" },
  { id: "effets",   label: "Effets spéciaux",        emoji: "✨" },
];

export type EventType = { id: string; label: string; emoji: string; desc: string };
export const EVENT_TYPES: EventType[] = [
  { id: "mariage", label: "Mariage",    emoji: "💍", desc: "Cérémonie et réception" },
  { id: "bar",     label: "Bar Mitsva", emoji: "✡",  desc: "Célébration religieuse" },
  { id: "bat",     label: "Bat Mitsva", emoji: "🕯",  desc: "Célébration religieuse" },
  { id: "brit",    label: "Brit Mila",  emoji: "👶", desc: "Célébration de naissance" },
  { id: "henna",   label: "Henna",      emoji: "🎉", desc: "Soirée traditionnelle" },
];

export const REGIONS = ["Centre", "Tel Aviv", "Jérusalem", "Nord", "Sud", "Sharon"];
export const STYLES = ["Moderne", "Traditionnel", "Luxe", "Oriental", "Simple", "Religieux", "Extérieur", "Bord de mer"];

export type Level = { id: string; label: string; desc: string; star?: boolean };
export const LEVELS: Level[] = [
  { id: "essentiel",  label: "Essentiel",  desc: "L'essentiel bien fait" },
  { id: "recommande", label: "Recommandé", desc: "Meilleur rapport qualité", star: true },
  { id: "premium",    label: "Premium",    desc: "Excellence absolue" },
];
