import Link from "next/link";

const GOLD = "#C9A84C";
const DARK = "#1A1208";
const MUTED = "#8B7355";

export function LandingPage() {
  const features = [
    { icon: "🎯", title: "3 propositions", desc: "Sélectionnées pour vous" },
    { icon: "✓",  title: "Vérifiés",       desc: "Adaptés à vos critères" },
    { icon: "⚡", title: "Sous 24h",       desc: "Rapide et efficace" },
    { icon: "💬", title: "Gratuit",        desc: "Sans engagement" },
  ];
  return (
    <div className="page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", background: "radial-gradient(ellipse at 20% 50%,#f0e8d0 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,#ede0c4 0%,transparent 50%),#FDFAF4" }}>
      <div className="orb" style={{ width: 400, height: 400, background: "rgba(201,168,76,.07)", top: -100, right: -120 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px 40px", textAlign: "center", position: "relative" }}>
        <div className="badge bg" style={{ marginBottom: 24 }}>Israël — Organisation d&apos;événements</div>
        <h1 className="serif" style={{ fontSize: "clamp(52px,10vw,82px)", fontWeight: 300, lineHeight: 1.05, color: DARK, marginBottom: 8 }}>
          Mazal <em style={{ color: GOLD }}>Tov !</em>
        </h1>
        <div className="divider" style={{ margin: "20px auto" }} />
        <p style={{ fontSize: "clamp(16px,3vw,19px)", color: MUTED, fontWeight: 300, maxWidth: 460, lineHeight: 1.65, marginBottom: 40 }}>
          Mariage, Bar Mitsva, Brit Mila...
          <br />
          <span style={{ color: DARK, fontWeight: 400 }}>On sélectionne les bons prestataires pour vous.</span>
        </p>
        <Link href="/demande" className="btn-gold" style={{ width: "auto", padding: "16px 48px", textDecoration: "none", display: "inline-block" }}>
          Organisons votre événement
        </Link>
        <p style={{ marginTop: 14, fontSize: 12, color: MUTED }}>Gratuit — Sans engagement — 3 propositions sur mesure</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 56, maxWidth: 440, width: "100%" }}>
          {features.map((f) => (
            <div key={f.title} className="card" style={{ padding: 18, cursor: "default" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 3 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: MUTED }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
