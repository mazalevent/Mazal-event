"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { GOLD, DARK, MUTED, type Service, type EventType } from "@/lib/constants";
import { getFieldLabel } from "@/lib/questions";
import { submitOffer } from "./submitOffer";

type Dispo = "Disponible" | "A confirmer" | "Non disponible" | "";
const DISPO_OPTIONS: Dispo[] = ["Disponible", "A confirmer", "Non disponible"];

type Props = {
  token: string;
  service: Service;
  eventType: EventType | null;
  region: string | null;
  commonData: Record<string, unknown>;
  serviceData: Record<string, unknown>;
};

function val(v: unknown): string {
  if (v === null || v === undefined || v === "") return "";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "number") return v + " NIS";
  return String(v);
}

export function PrestataireOfferForm({ token, service, eventType, region, commonData, serviceData }: Props) {
  const [prix, setPrix] = useState<string>("");
  const [description, setDescription] = useState("");
  const [dispo, setDispo] = useState<Dispo>("");
  const [delai, setDelai] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const serviceEntries = Object.keys(serviceData).filter((k) => k !== "comment" && k !== "level");
  const commonDate = typeof commonData.date === "string" && commonData.date
    ? new Date(commonData.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
    : null;

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await submitOffer({
        token,
        prix: prix ? Number(prix) : null,
        description,
        dispo,
        delai,
        note,
      });
      if (res.ok) setSuccess(true);
      else setError(res.error);
    });
  }

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "#FDFAF4", padding: "32px 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 480, width: "100%" }}>
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 14 }}
            style={{ width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg,#C9A84C,#E8C97A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, color: "white", margin: "0 auto 24px", boxShadow: "0 12px 40px rgba(201,168,76,.4)" }}
          >
            ✓
          </motion.div>
          <h2 className="serif" style={{ fontSize: 28, fontWeight: 400, textAlign: "center", marginBottom: 12, color: DARK }}>
            Offre envoyée !
          </h2>
          <p style={{ color: MUTED, fontSize: 14, textAlign: "center", lineHeight: 1.7 }}>
            Mazal Event a bien reçu votre proposition pour ce client. Si elle est retenue parmi les finalistes, vous serez recontacté.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FDFAF4", padding: "32px 20px" }}>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div className="serif" style={{ fontSize: 22, fontWeight: 300, color: DARK }}>
            Mazal <em style={{ color: GOLD }}>Event</em>
          </div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Demande de proposition</div>
        </div>

        <div style={{ background: "white", borderRadius: 20, padding: 24, border: "1.5px solid #EDE0C4", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 36 }}>{service.emoji}</span>
            <div>
              <div style={{ fontSize: 12, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em" }}>Prestation demandée</div>
              <h2 className="serif" style={{ fontSize: 22, fontWeight: 400, color: DARK }}>{service.label}</h2>
            </div>
          </div>
          <div style={{ background: "#FDF8EE", borderRadius: 12, padding: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, fontSize: 13 }}>
            {eventType && (
              <div>
                <span className="lbl">Événement</span>
                <div>{eventType.emoji} {eventType.label}</div>
              </div>
            )}
            {region && (
              <div>
                <span className="lbl">Région</span>
                <div>📍 {region}</div>
              </div>
            )}
            {commonDate && (
              <div>
                <span className="lbl">Date</span>
                <div>📅 {commonDate}</div>
              </div>
            )}
            {Boolean(commonData.guests) && (
              <div>
                <span className="lbl">Invités</span>
                <div>👥 {String(commonData.guests)}</div>
              </div>
            )}
          </div>
        </div>

        {(serviceEntries.length > 0 || Boolean(serviceData.level) || Boolean(serviceData.comment)) && (
          <div style={{ background: "white", borderRadius: 20, padding: 24, border: "1.5px solid #EDE0C4", marginBottom: 24 }}>
            <div className="section-title">Préférences du client</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Boolean(serviceData.level) && (
                <div>
                  <span className="lbl">Niveau souhaité</span>
                  <span className="badge bg">{String(serviceData.level)}</span>
                </div>
              )}
              {serviceEntries.map((k) => {
                const v = serviceData[k];
                if (v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) return null;
                return (
                  <div key={k}>
                    <span className="lbl">{getFieldLabel(k)}</span>
                    <div style={{ fontSize: 13, color: DARK, lineHeight: 1.5 }}>{val(v)}</div>
                  </div>
                );
              })}
              {typeof serviceData.comment === "string" && serviceData.comment && (
                <div style={{ paddingTop: 10, borderTop: "1px solid rgba(201,168,76,.15)" }}>
                  <span className="lbl">Note du client</span>
                  <div style={{ fontSize: 13, color: MUTED, fontStyle: "italic", lineHeight: 1.5 }}>{serviceData.comment}</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ background: "white", borderRadius: 20, padding: 24, border: "1.5px solid #EDE0C4" }}>
          <h3 className="serif" style={{ fontSize: 22, fontWeight: 400, marginBottom: 16, color: DARK }}>
            Votre <em style={{ color: GOLD }}>offre</em>
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <span className="lbl">Prix (NIS) *</span>
              <input
                type="number"
                className="inp"
                placeholder="Ex: 5000"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                min={0}
              />
            </div>
            <div>
              <span className="lbl">Description de votre offre *</span>
              <textarea
                className="inp"
                rows={4}
                placeholder="Détaillez ce qui est inclus, votre expérience, vos références..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <span className="lbl">Disponibilité *</span>
              <div className="chips-wrap">
                {DISPO_OPTIONS.map((d) => (
                  <span
                    key={d}
                    className={dispo === d ? "chip chip-sel" : "chip"}
                    onClick={() => setDispo(d)}
                  >
                    <span className="chip-dot" />
                    {d}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="lbl">Délai de livraison</span>
              <input
                type="text"
                className="inp"
                placeholder="Ex: Sous 48h, ou 2 semaines avant l'événement"
                value={delai}
                onChange={(e) => setDelai(e.target.value)}
              />
            </div>
            <div>
              <span className="lbl">Note supplémentaire</span>
              <textarea
                className="inp"
                rows={2}
                placeholder="Précisions, remises, conditions..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {error && (
              <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "10px 14px", color: "#991B1B", fontSize: 13 }}>
                {error}
              </div>
            )}

            <button onClick={submit} disabled={isPending} className="btn-gold" style={{ marginTop: 4 }}>
              {isPending ? "Envoi en cours..." : "Envoyer mon offre"}
            </button>
            <p style={{ fontSize: 11, color: MUTED, textAlign: "center" }}>
              Votre offre sera transmise au client uniquement si elle est retenue parmi les finalistes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
