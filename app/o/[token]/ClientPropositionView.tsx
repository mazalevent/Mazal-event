"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { GOLD, DARK, MUTED, type Service, type EventType } from "@/lib/constants";
import { toggleInterest } from "./interestActions";

type Offer = {
  id: string;
  service_id: string;
  prix: number | null;
  description: string | null;
  dispo: string | null;
  delai: string | null;
  note: string | null;
  prestataire_id: string | null;
};

type Props = {
  token: string;
  clientName: string | null;
  eventType: EventType | null;
  region: string | null;
  services: Service[];
  offresByService: Record<string, Offer[]>;
  prestataires: { id: string; name: string }[];
  initialInterests: Record<string, boolean>;
};

export function ClientPropositionView({ token, clientName, eventType, region, services, offresByService, prestataires, initialInterests }: Props) {
  const [interests, setInterests] = useState<Record<string, boolean>>(initialInterests);
  const [pendingOfferId, setPendingOfferId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function getPresta(id: string | null) {
    if (!id) return null;
    return prestataires.find((p) => p.id === id);
  }

  function handleToggle(offreId: string) {
    const wasInterested = !!interests[offreId];
    const next = !wasInterested;
    setInterests((prev) => ({ ...prev, [offreId]: next }));
    setPendingOfferId(offreId);
    setError(null);

    startTransition(async () => {
      const res = await toggleInterest(token, offreId, next);
      setPendingOfferId(null);
      if (!res.ok) {
        // rollback
        setInterests((prev) => ({ ...prev, [offreId]: wasInterested }));
        setError(res.error);
      }
    });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FDFAF4", padding: "32px 20px 60px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="serif" style={{ fontSize: 22, fontWeight: 300, color: DARK }}>
            Mazal <em style={{ color: GOLD }}>Event</em>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          <div className="badge bg" style={{ marginBottom: 12 }}>Vos propositions sélectionnées</div>
          <h1 className="serif" style={{ fontSize: "clamp(34px,5vw,44px)", fontWeight: 300, marginBottom: 8, color: DARK, lineHeight: 1.15 }}>
            Bonjour <em style={{ color: GOLD }}>{clientName || "à vous"}</em>
          </h1>
          <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.65, maxWidth: 460, margin: "0 auto" }}>
            Voici les offres que nous avons sélectionnées pour votre {eventType?.label?.toLowerCase() || "événement"}
            {region ? " à " + region : ""}. Cliquez « Je suis intéressé » sur celles qui vous parlent — nous reviendrons vers vous rapidement.
          </p>
        </motion.div>

        {error && (
          <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: "#991B1B", fontSize: 13 }}>
            {error}
          </div>
        )}

        {services.map((s, sIdx) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: sIdx * 0.1 }}
            style={{ marginBottom: 28 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 28 }}>{s.emoji}</span>
              <h2 className="serif" style={{ fontSize: 22, fontWeight: 400, color: DARK }}>{s.label}</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {offresByService[s.id].map((o, idx) => {
                const presta = getPresta(o.prestataire_id);
                const sel = !!interests[o.id];
                const isPending = pendingOfferId === o.id;
                return (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    style={{ background: sel ? "linear-gradient(135deg, #FDF8EE, #F7EDD8)" : "white", borderRadius: 16, padding: 20, border: "1.5px solid " + (sel ? GOLD : "#EDE0C4"), transition: "all .3s" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Proposition {idx + 1}</div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: DARK }}>{presta?.name || "Prestataire vérifié"}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 20, fontWeight: 600, color: GOLD }}>{o.prix != null ? o.prix + " NIS" : "—"}</div>
                        {o.dispo && <span className="badge bg" style={{ marginTop: 4, display: "inline-block" }}>{o.dispo}</span>}
                      </div>
                    </div>

                    {o.description && (
                      <p style={{ fontSize: 14, color: DARK, lineHeight: 1.65, marginBottom: 10 }}>{o.description}</p>
                    )}

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12, color: MUTED, marginBottom: 14 }}>
                      {o.delai && <span>⏱ Délai : {o.delai}</span>}
                    </div>

                    {o.note && (
                      <div style={{ background: "rgba(201,168,76,.08)", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: MUTED, fontStyle: "italic", marginBottom: 14 }}>
                        {o.note}
                      </div>
                    )}

                    <button
                      onClick={() => handleToggle(o.id)}
                      disabled={isPending}
                      style={{
                        width: "100%",
                        padding: "12px 20px",
                        borderRadius: 50,
                        border: sel ? "1.5px solid " + GOLD : "1.5px solid " + GOLD,
                        background: sel ? GOLD : "white",
                        color: sel ? "white" : GOLD,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: isPending ? "wait" : "pointer",
                        fontFamily: "'Jost',sans-serif",
                        transition: "all .25s",
                        opacity: isPending ? 0.6 : 1,
                      }}
                    >
                      {isPending ? "..." : sel ? "✓ Vous avez marqué cette offre" : "Je suis intéressé"}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}

        <div style={{ background: "white", border: "1.5px solid " + GOLD, borderRadius: 16, padding: 20, marginTop: 24, textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>💬</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: DARK, marginBottom: 6 }}>
            Une question ?
          </div>
          <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>
            Mazal Event vous recontactera dès que vous aurez marqué les offres qui vous intéressent. Vous pouvez aussi nous appeler directement.
          </div>
        </div>
      </div>
    </div>
  );
}
