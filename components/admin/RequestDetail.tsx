"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { SERVICES, GOLD, DARK, MUTED } from "@/lib/constants";
import { getFieldLabel } from "@/lib/questions";
import { updateStatus, type Status } from "@/app/admin/requests/[id]/updateStatus";
import type { FullRequest } from "@/app/admin/requests/[id]/page";

const STATUS_OPTIONS: Status[] = ["Nouveau", "En selection", "Propositions envoyees"];
const statusStyle: Record<Status, { bg: string; col: string }> = {
  "Nouveau":               { bg: "#EFF6FF", col: "#1D4ED8" },
  "En selection":          { bg: "#FFF7ED", col: "#C2410C" },
  "Propositions envoyees": { bg: "#F0FDF4", col: "#15803D" },
};
type Tab = "details" | "prestataires" | "envoyer";

function str(v: unknown): string { return v != null ? String(v) : ""; }
function isArr(v: unknown): v is unknown[] { return Array.isArray(v); }

function ValDisplay({ v }: { v: unknown }) {
  if (v === null || v === undefined || v === "") return <span style={{ color: MUTED, fontStyle: "italic" }}>—</span>;
  if (isArr(v)) {
    if (v.length === 0) return <span style={{ color: MUTED, fontStyle: "italic" }}>—</span>;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
        {v.map((x, i) => <span key={i} className="badge bg">{String(x)}</span>)}
      </div>
    );
  }
  if (typeof v === "number") return <span>{v} NIS</span>;
  return <span>{str(v)}</span>;
}

function ServiceDetailPanel({ data }: { data: Record<string, unknown> }) {
  const entries = Object.keys(data).filter((k) => k !== "comment" && k !== "level");
  if (entries.length === 0 && !data.comment && !data.level) return null;
  return (
    <div style={{ background: "#FDF8EE", borderRadius: "0 0 16px 16px", padding: "16px 20px", borderTop: "1px solid rgba(201,168,76,.15)" }}>
      {data.level !== undefined && data.level !== null && (
        <div style={{ marginBottom: 12 }}>
          <span className="lbl">Niveau</span>
          <span className="badge bg">{str(data.level)}</span>
        </div>
      )}
      {entries.map((k) => {
        const v = data[k];
        if (v === null || v === undefined || v === "") return null;
        return (
          <div key={k} style={{ marginBottom: 10 }}>
            <span className="lbl" style={{ marginBottom: 2 }}>{getFieldLabel(k)}</span>
            <div style={{ fontSize: 13, color: DARK, lineHeight: 1.5 }}><ValDisplay v={v} /></div>
          </div>
        );
      })}
      {typeof data.comment === "string" && data.comment.length > 0 && (
        <div style={{ marginTop: 8, paddingTop: 10, borderTop: "1px solid rgba(201,168,76,.15)" }}>
          <span className="lbl">Note du client</span>
          <div style={{ fontSize: 13, color: MUTED, fontStyle: "italic", lineHeight: 1.5 }}>{data.comment}</div>
        </div>
      )}
    </div>
  );
}

export function RequestDetail({ request }: { request: FullRequest }) {
  const [tab, setTab] = useState<Tab>("details");
  const [status, setStatus] = useState<Status>(request.status);
  const [openSvc, setOpenSvc] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [statusError, setStatusError] = useState<string | null>(null);

  const c = request.forms_data?.common || {};
  const svcData = request.forms_data?.services || {};
  const serviceList = SERVICES.filter((s) => (request.services || []).includes(s.id));
  const ss = statusStyle[status] || statusStyle["Nouveau"];

  function handleStatusChange(newStatus: Status) {
    setStatus(newStatus);
    setStatusError(null);
    startTransition(async () => {
      const res = await updateStatus(request.id, newStatus);
      if (!res.ok) {
        setStatus(request.status);
        setStatusError(res.error ?? "Erreur inconnue");
      }
    });
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "details",      label: "Details" },
    { id: "prestataires", label: "Prestataires" },
    { id: "envoyer",      label: "Envoyer client" },
  ];

  const cDate = typeof c.date === "string" && c.date ? new Date(c.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : null;
  const cGuests = c.guests != null ? str(c.guests) : null;
  const cBudget = c.budget != null ? str(c.budget) : null;
  const cComment = typeof c.comment === "string" && c.comment ? c.comment : null;
  const cStyle = isArr(c.style) && c.style.length > 0 ? c.style as string[] : null;

  return (
    <div className="page" style={{ padding: "24px 20px", maxWidth: 680, margin: "0 auto" }}>
      <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: MUTED, fontSize: 14, textDecoration: "none", marginBottom: 24 }}>
        &larr; Retour aux demandes
      </Link>

      <div style={{ background: "white", borderRadius: 20, padding: 24, border: "1.5px solid #EDE0C4", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 40 }}>{request.event_type?.emoji || "?"}</span>
            <div>
              <h2 className="serif" style={{ fontSize: 24, fontWeight: 400, color: DARK }}>
                {request.event_type?.label || "Evenement"}
              </h2>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
                {new Date(request.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <select value={status} disabled={isPending} onChange={(e) => handleStatusChange(e.target.value as Status)}
              style={{ border: "1.5px solid " + ss.col, borderRadius: 20, padding: "6px 14px", fontSize: 12, fontFamily: "'Jost',sans-serif", color: ss.col, cursor: "pointer", outline: "none", background: ss.bg, fontWeight: 600, opacity: isPending ? 0.6 : 1 }}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {statusError && <div style={{ fontSize: 11, color: "#dc2626" }}>{statusError}</div>}
          </div>
        </div>
        <div style={{ background: "#FDF8EE", borderRadius: 14, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <span className="lbl">Client</span>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{request.client_name || "—"}</div>
            <div style={{ fontSize: 14, color: MUTED, marginTop: 2 }}>{request.client_phone || "—"}</div>
            {request.client_email && <div style={{ fontSize: 13, color: MUTED }}>{request.client_email}</div>}
          </div>
          {request.client_phone && (
            <a href={"https://wa.me/" + request.client_phone.replace(/[^0-9]/g, "").replace(/^0/, "972") + "?text=" + encodeURIComponent("Bonjour " + (request.client_name || "") + " ! Suite a votre demande Mazal Event, nous avons selectionne des prestataires pour vous.")}
              target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 8, background: "#25D366", color: "white", padding: "10px 20px", borderRadius: 50, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
              <span>💬</span> Contacter
            </a>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 0, marginBottom: 20, background: "#F5EDD8", borderRadius: 12, padding: 4 }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: "10px 8px", border: "none", borderRadius: 9, cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: 13, fontWeight: 500, background: tab === t.id ? "white" : "transparent", color: tab === t.id ? DARK : MUTED, boxShadow: tab === t.id ? "0 2px 8px rgba(0,0,0,.08)" : "none", transition: "all .2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "details" && (
        <div>
          <div style={{ background: "white", borderRadius: 20, padding: 24, border: "1.5px solid #EDE0C4", marginBottom: 16 }}>
            <div className="section-title">Informations generales</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {request.region && <div><span className="lbl">Region</span><div style={{ fontSize: 14 }}>📍 {request.region}</div></div>}
              {cDate && <div><span className="lbl">Date</span><div style={{ fontSize: 14 }}>📅 {cDate}</div></div>}
              {cGuests && <div><span className="lbl">Invites</span><div style={{ fontSize: 14 }}>👥 {cGuests}</div></div>}
              {cBudget && (
                <div style={{ gridColumn: "1/-1" }}>
                  <span className="lbl">Budget evenement</span>
                  <div style={{ fontSize: 14, color: GOLD, fontWeight: 600 }}>{cBudget}</div>
                </div>
              )}
              {cStyle && (
                <div style={{ gridColumn: "1/-1" }}>
                  <span className="lbl">Style</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                    {cStyle.map((s) => <span key={s} className="badge bg">{s}</span>)}
                  </div>
                </div>
              )}
              {cComment && (
                <div style={{ gridColumn: "1/-1" }}>
                  <span className="lbl">Commentaire</span>
                  <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.6, marginTop: 4 }}>{cComment}</div>
                </div>
              )}
            </div>
          </div>

          <span className="lbl" style={{ display: "block", marginBottom: 12 }}>Prestations</span>
          {serviceList.map((s) => {
            const d = svcData[s.id] || {};
            const isOpen = openSvc === s.id;
            const dLevel = d.level != null ? str(d.level) : null;
            const dBudget = d.budget_svc != null ? str(d.budget_svc) : null;
            return (
              <div key={s.id} style={{ borderRadius: 16, border: "1.5px solid " + (isOpen ? GOLD : "#EDE0C4"), marginBottom: 8, overflow: "hidden", transition: "border-color .2s" }}>
                <div onClick={() => setOpenSvc(isOpen ? null : s.id)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", cursor: "pointer", background: isOpen ? "linear-gradient(135deg,#FDF8EE,#F7EDD8)" : "white" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{s.emoji}</span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{s.label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {dLevel && <span className="badge bg">{dLevel}</span>}
                    {dBudget && <span style={{ fontSize: 12, color: GOLD, fontWeight: 600 }}>{dBudget}</span>}
                    <span style={{ color: GOLD, fontSize: 16, display: "inline-block", transition: "transform .2s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                  </div>
                </div>
                {isOpen && <ServiceDetailPanel data={d} />}
              </div>
            );
          })}
        </div>
      )}

      {tab === "prestataires" && (
        <div style={{ background: "#FDF8EE", border: "1px solid rgba(201,168,76,.2)", borderRadius: 16, padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🚧</div>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>Phase 4 — En construction</div>
          <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>Inviter des prestataires par email avec un lien unique.</div>
        </div>
      )}

      {tab === "envoyer" && (
        <div style={{ background: "#FDF8EE", border: "1px solid rgba(201,168,76,.2)", borderRadius: 16, padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🚧</div>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>Phase 5 — En construction</div>
          <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>Selectionner les meilleures offres et envoyer au client.</div>
        </div>
      )}
    </div>
  );
}
