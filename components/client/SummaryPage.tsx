"use client";

import { useState } from "react";
import { SERVICES, GOLD, DARK, MUTED, type EventType } from "@/lib/constants";
import { getFieldLabel } from "@/lib/questions";
import type { FormsData } from "./FormsOrchestrator";

type Props = {
  eventType: EventType;
  services: string[];
  formsData: FormsData;
  onBack: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  error?: string | null;
};

function ServiceDetailPanel({ data }: { data: Record<string, unknown> }) {
  const entries = Object.keys(data).filter((k) => k !== "comment" && k !== "level");
  return (
    <div style={{ background: "#FDF8EE", borderRadius: "0 0 16px 16px", padding: "16px 20px", borderTop: "1px solid rgba(201,168,76,.15)" }}>
      {data.level !== undefined && data.level !== null && data.level !== "" && (
        <div style={{ marginBottom: 10 }}>
          <span className="lbl">Niveau</span>
          <span className="badge bg">{String(data.level)}</span>
        </div>
      )}
      {entries.map((k) => {
        const v = data[k];
        if (v === null || v === undefined || v === "") return null;
        const display = Array.isArray(v) ? v.join(", ") : typeof v === "number" ? v + " NIS" : String(v);
        if (!display) return null;
        return (
          <div key={k} style={{ marginBottom: 8 }}>
            <span className="lbl" style={{ marginBottom: 2 }}>{getFieldLabel(k)}</span>
            <div style={{ fontSize: 13, color: DARK, lineHeight: 1.5 }}>{display}</div>
          </div>
        );
      })}
      {typeof data.comment === "string" && data.comment.length > 0 && (
        <div style={{ marginTop: 4, paddingTop: 10, borderTop: "1px solid rgba(201,168,76,.15)" }}>
          <span className="lbl">Note</span>
          <div style={{ fontSize: 13, color: MUTED, fontStyle: "italic" }}>{data.comment}</div>
        </div>
      )}
    </div>
  );
}

export function SummaryPage({ eventType, services, formsData, onBack, onSubmit, submitting, error }: Props) {
  const serviceList = SERVICES.filter((s) => services.includes(s.id));
  const c = formsData.common as Record<string, unknown>;
  const [openSvc, setOpenSvc] = useState<string | null>(null);

  return (
    <div className="page" style={{ padding: "24px 20px", maxWidth: 520, margin: "0 auto" }}>
      <button className="btn-back" onClick={onBack} style={{ marginBottom: 24 }} disabled={submitting}>Retour</button>
      <div style={{ marginBottom: 32 }}>
        <div className="badge bg" style={{ marginBottom: 12 }}>Étape 4 / 4</div>
        <h2 className="serif" style={{ fontSize: 34, fontWeight: 300, marginBottom: 8 }}>
          Votre demande est <em style={{ color: GOLD }}>prête</em>
        </h2>
        <p style={{ color: MUTED, fontSize: 14 }}>Vérifiez avant d'envoyer</p>
      </div>

      <div className="card" style={{ marginBottom: 16, cursor: "default" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <span style={{ fontSize: 34 }}>{eventType.emoji}</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{String(c.name || "")}</div>
            <div style={{ fontSize: 15 }}>{eventType.label}</div>
            {typeof c.date === "string" && c.date && (
              <div style={{ fontSize: 13, color: MUTED }}>{new Date(c.date).toLocaleDateString("fr-FR")}</div>
            )}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {Boolean(c.phone) && (
            <div><span className="lbl">Tel</span><div style={{ fontSize: 14 }}>{String(c.phone)}</div></div>
          )}
          {Boolean(c.email) && (
            <div><span className="lbl">Email</span><div style={{ fontSize: 14 }}>{String(c.email)}</div></div>
          )}
          {Boolean(c.region) && (
            <div><span className="lbl">Region</span><div style={{ fontSize: 14 }}>{String(c.region)}</div></div>
          )}
          {Boolean(c.guests) && (
            <div><span className="lbl">Invites</span><div style={{ fontSize: 14 }}>{String(c.guests)}</div></div>
          )}
          {Boolean(c.budget) && (
            <div style={{ gridColumn: "1/-1" }}>
              <span className="lbl">Budget événement</span>
              <div style={{ fontSize: 14, color: GOLD, fontWeight: 600 }}>{String(c.budget)}</div>
            </div>
          )}
          {Array.isArray(c.style) && c.style.length > 0 && (
            <div style={{ gridColumn: "1/-1" }}>
              <span className="lbl">Style</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                {(c.style as string[]).map((s) => <span key={s} className="badge bg">{s}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <span className="lbl" style={{ display: "block", marginBottom: 12 }}>Prestations — Cliquez pour voir les détails</span>
        {serviceList.map((s) => {
          const d = (formsData.services && formsData.services[s.id]) || {};
          const isOpen = openSvc === s.id;
          return (
            <div key={s.id} style={{ borderRadius: 16, border: "1.5px solid " + (isOpen ? "#C9A84C" : "#EDE0C4"), marginBottom: 8, overflow: "hidden", transition: "border-color .2s" }}>
              <div
                onClick={() => setOpenSvc(isOpen ? null : s.id)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", cursor: "pointer", background: isOpen ? "linear-gradient(135deg,#FDF8EE,#F7EDD8)" : "white" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{s.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{s.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {(d as { level?: string }).level && <span className="badge bg">{(d as { level: string }).level}</span>}
                  <span style={{ color: GOLD, fontSize: 16, transition: "transform .2s", display: "inline-block", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                </div>
              </div>
              {isOpen && <ServiceDetailPanel data={d as Record<string, unknown>} />}
            </div>
          );
        })}
      </div>

      <div style={{ background: "#FDF8EE", border: "1px solid rgba(201,168,76,.2)", borderRadius: 16, padding: 20, marginBottom: 28, textAlign: "center" }}>
        <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>
          Nous allons sélectionner jusqu'à 3 propositions adaptées pour chaque prestation.
        </div>
      </div>
      {error && (
        <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 12, padding: "12px 16px", marginBottom: 16, color: "#991B1B", fontSize: 13 }}>
          {error}
        </div>
      )}
      <button className="btn-gold" onClick={onSubmit} disabled={submitting}>
        {submitting ? "Envoi en cours..." : "Envoyer ma demande"}
      </button>
    </div>
  );
}
