"use client";

import { EVENT_TYPES, GOLD, MUTED, type EventType } from "@/lib/constants";

export function EventTypePage({ onSelect, onBack }: { onSelect: (e: EventType) => void; onBack: () => void }) {
  return (
    <div className="page" style={{ padding: "24px 20px", maxWidth: 480, margin: "0 auto" }}>
      <button className="btn-back" onClick={onBack} style={{ marginBottom: 32 }}>Retour</button>
      <div style={{ marginBottom: 32 }}>
        <div className="badge bg" style={{ marginBottom: 12 }}>Etape 1 / 4</div>
        <h2 className="serif" style={{ fontSize: 36, fontWeight: 300, marginBottom: 8 }}>
          Votre <em style={{ color: GOLD }}>evenement</em>
        </h2>
        <p style={{ color: MUTED, fontSize: 14 }}>Quel type de celebration planifiez-vous ?</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {EVENT_TYPES.map((evt) => (
          <div key={evt.id} className="card" onClick={() => onSelect(evt)} style={{ display: "flex", alignItems: "center", gap: 18, padding: 18 }}>
            <span style={{ fontSize: 34 }}>{evt.emoji}</span>
            <div>
              <div style={{ fontWeight: 500, fontSize: 17 }}>{evt.label}</div>
              <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{evt.desc}</div>
            </div>
            <span style={{ marginLeft: "auto", color: GOLD, fontSize: 22 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
