"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SERVICES, GOLD, DARK, MUTED, type EventType } from "@/lib/constants";

export type RequestRow = {
  id: string;
  event_type: EventType | null;
  services: string[];
  status: "Nouveau" | "En selection" | "Propositions envoyees";
  client_name: string | null;
  client_phone: string | null;
  client_email: string | null;
  region: string | null;
  created_at: string;
};

type StatusFilter = "all" | RequestRow["status"];

const STATUS_TABS: { v: StatusFilter; l: string }[] = [
  { v: "all",                   l: "Toutes" },
  { v: "Nouveau",               l: "Nouvelles" },
  { v: "En selection",          l: "En sélection" },
  { v: "Propositions envoyees", l: "Envoyées" },
];

const STATUS_LABELS: Record<RequestRow["status"], string> = {
  "Nouveau":               "Nouvelle",
  "En selection":          "En sélection",
  "Propositions envoyees": "Envoyée",
};

const statusStyle = {
  "Nouveau":               { bg: "#EFF6FF", col: "#1D4ED8" },
  "En selection":          { bg: "#FFF7ED", col: "#C2410C" },
  "Propositions envoyees": { bg: "#F0FDF4", col: "#15803D" },
} as const;

export function RequestList({ requests, error }: { requests: RequestRow[]; error?: string }) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const name = (r.client_name || "").toLowerCase();
        const phone = (r.client_phone || "").toLowerCase();
        if (!name.includes(q) && !phone.includes(q)) return false;
      }
      return true;
    });
  }, [requests, status, query]);

  const counts = useMemo(() => {
    const c: Record<StatusFilter, number> = { all: requests.length, "Nouveau": 0, "En selection": 0, "Propositions envoyees": 0 };
    for (const r of requests) c[r.status]++;
    return c;
  }, [requests]);

  return (
    <div className="page" style={{ padding: "24px 20px", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 className="serif" style={{ fontSize: 30, fontWeight: 300 }}>
          Demandes <em style={{ color: GOLD }}>clients</em>
        </h2>
        <p style={{ color: MUTED, fontSize: 14 }}>{requests.length} demande{requests.length !== 1 ? "s" : ""} au total</p>
      </div>

      {error && (
        <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 12, padding: "12px 16px", marginBottom: 16, color: "#991B1B", fontSize: 13 }}>
          Erreur Supabase : {error}
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {STATUS_TABS.map((tab) => {
          const active = status === tab.v;
          return (
            <button key={tab.v} onClick={() => setStatus(tab.v)}
              style={{ padding: "8px 16px", borderRadius: 50, border: "1.5px solid " + (active ? GOLD : "#E8DCC8"), background: active ? "linear-gradient(135deg,#FDF8EE,#F7EDD8)" : "white", color: active ? DARK : MUTED, fontFamily: "'Jost',sans-serif", fontSize: 13, fontWeight: active ? 500 : 400, cursor: "pointer" }}>
              {tab.l} <span style={{ opacity: .7 }}>({counts[tab.v]})</span>
            </button>
          );
        })}
      </div>

      <input type="search" className="inp" placeholder="Rechercher par nom ou téléphone..."
        value={query} onChange={(e) => setQuery(e.target.value)} style={{ marginBottom: 20 }} />

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: MUTED }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p>{requests.length === 0 ? "Aucune demande pour le moment" : "Aucune demande ne correspond"}</p>
        </div>
      ) : (
        filtered.map((req) => {
          const ss = statusStyle[req.status] || statusStyle["Nouveau"];
          return (
            <Link key={req.id} href={"/admin/requests/" + req.id} style={{ textDecoration: "none", display: "block" }}>
              <div className="req-row" style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 28 }}>{req.event_type?.emoji || "?"}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16, color: DARK }}>{req.client_name || "Client"}</div>
                      <div style={{ fontSize: 13, color: MUTED }}>{req.event_type?.label || ""}{req.client_phone ? " — " + req.client_phone : ""}</div>
                      <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
                        {new Date(req.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        {req.region && " · " + req.region}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: ss.bg, color: ss.col }}>
                      {STATUS_LABELS[req.status]}
                    </span>
                    <span style={{ fontSize: 12, color: GOLD, fontWeight: 600 }}>Voir →</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(req.services || []).map((sid) => {
                    const sv = SERVICES.find((x) => x.id === sid);
                    return sv ? <span key={sid} className="badge bg">{sv.emoji} {sv.label}</span> : null;
                  })}
                </div>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
}
