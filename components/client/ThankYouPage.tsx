import Link from "next/link";
import { GOLD, MUTED } from "@/lib/constants";

export function ThankYouPage() {
  return (
    <div className="page" style={{ padding: "40px 20px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
      <div
        className="pop"
        style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#C9A84C,#E8C97A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 24px", boxShadow: "0 8px 30px rgba(201,168,76,.4)" }}
      >
        ✓
      </div>
      <h2 className="serif" style={{ fontSize: 34, fontWeight: 300, marginBottom: 12 }}>
        Merci pour <em style={{ color: GOLD }}>votre confiance</em>
      </h2>
      <div className="divider" style={{ margin: "16px auto" }} />
      <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
        Votre demande a bien ete enregistree.
        <br />
        Vous recevrez bientot des propositions selectionnees.
      </p>
      <Link href="/demande" className="btn-outline" style={{ display: "inline-block", textDecoration: "none" }}>
        Nouvelle demande
      </Link>
    </div>
  );
}
