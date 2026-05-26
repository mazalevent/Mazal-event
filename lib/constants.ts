export const GOLD = "#C9A84C";
export const IVORY = "#FDFAF4";
export const DARK = "#1A1208";
export const MUTED = "#8B7355";

export type Service = { id: string; label: string; emoji: string };
export const SERVICES: Service[] = [
  { id: "salle",    label: "Salle de fete",         emoji: "🏛" },
  { id: "photo",    label: "Photographe",            emoji: "📸" },
  { id: "video",    label: "Video",                  emoji: "🎬" },
  { id: "dj",       label: "DJ",                     emoji: "🎧" },
  { id: "orch",     label: "Orchestre",              emoji: "🎺" },
  { id: "chant",    label: "Chanteur",               emoji: "🎤" },
  { id: "deco",     label: "Decoration",             emoji: "🌸" },
  { id: "invit",    label: "Invitations",            emoji: "✉" },
  { id: "makeup",   label: "Maquillage Coiffure",    emoji: "💄" },
  { id: "effets",   label: "Effets speciaux",        emoji: "✨" },
];

export type EventType = { id: string; label: string; emoji: string; desc: string };
export const EVENT_TYPES: EventType[] = [
  { id: "mariage", label: "Mariage",    emoji: "💍", desc: "Ceremonie et reception" },
  { id: "bar",     label: "Bar Mitsva", emoji: "✡",  desc: "Celebration religieuse" },
  { id: "bat",     label: "Bat Mitsva", emoji: "🕯",  desc: "Celebration religieuse" },
  { id: "brit",    label: "Brit Mila",  emoji: "👶", desc: "Celebration naissance" },
  { id: "henna",   label: "Henna",      emoji: "🎉", desc: "Soiree traditionnelle" },
];

export const REGIONS = ["Centre", "Tel Aviv", "Jerusalem", "Nord", "Sud", "Sharon"];
export const STYLES = ["Moderne", "Traditionnel", "Luxe", "Oriental", "Simple", "Religieux", "Exterieur", "Bord de mer"];

export type Level = { id: string; label: string; desc: string; star?: boolean };
export const LEVELS: Level[] = [
  { id: "essentiel",  label: "Essentiel",  desc: "L essentiel bien fait" },
  { id: "recommande", label: "Recommande", desc: "Meilleur rapport qualite", star: true },
  { id: "premium",    label: "Premium",    desc: "Excellence absolue" },
];
