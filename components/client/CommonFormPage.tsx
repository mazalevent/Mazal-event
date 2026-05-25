"use client";

import { useState } from "react";
import { GOLD, MUTED } from "@/lib/constants";
import { COMMON_QUESTIONS } from "@/lib/questions";
import { QuestionField } from "@/components/shared/QuestionField";

export type CommonData = Record<string, unknown>;

export function CommonFormPage({ onConfirm, onBack }: { onConfirm: (d: CommonData) => void; onBack: () => void }) {
  const [data, setData] = useState<CommonData>({});
  const set = (id: string, v: unknown) => setData((p) => ({ ...p, [id]: v }));

  const ready = COMMON_QUESTIONS.every((q) => {
    if (q.optional) return true;
    const v = data[q.id];
    if (v === undefined || v === null || v === "") return false;
    if (Array.isArray(v) && v.length === 0) return false;
    return true;
  });

  return (
    <div className="page" style={{ padding: "24px 20px", maxWidth: 520, margin: "0 auto" }}>
      <button className="btn-back" onClick={onBack} style={{ marginBottom: 24 }}>Retour</button>
      <div style={{ marginBottom: 28 }}>
        <div className="badge bg" style={{ marginBottom: 12 }}>Etape 3 / 4</div>
        <h2 className="serif" style={{ fontSize: 32, fontWeight: 300, marginBottom: 8 }}>
          Informations <em style={{ color: GOLD }}>generales</em>
        </h2>
        <p style={{ color: MUTED, fontSize: 14 }}>Ces infos s appliquent a toutes vos prestations</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22, marginBottom: 36 }}>
        {COMMON_QUESTIONS.map((q) => {
          if (q.type === "text" || q.type === "tel" || q.type === "email") {
            return (
              <div key={q.id}>
                <span className="lbl">{q.label}</span>
                <input
                  type={q.type}
                  className="inp"
                  placeholder={q.placeholder}
                  value={(data[q.id] as string) || ""}
                  onChange={(e) => set(q.id, e.target.value)}
                />
              </div>
            );
          }
          if (q.type === "date") {
            return (
              <div key={q.id}>
                <span className="lbl">{q.label}</span>
                <input
                  type="date"
                  className="inp"
                  value={(data[q.id] as string) || ""}
                  onChange={(e) => set(q.id, e.target.value)}
                />
              </div>
            );
          }
          if (q.type === "textarea") {
            return (
              <div key={q.id}>
                <span className="lbl">{q.label}</span>
                <textarea
                  className="inp"
                  placeholder={q.placeholder}
                  value={(data[q.id] as string) || ""}
                  onChange={(e) => set(q.id, e.target.value)}
                />
              </div>
            );
          }
          return <QuestionField key={q.id} q={q} value={data[q.id]} onChange={(v) => set(q.id, v)} />;
        })}
      </div>
      <button className="btn-gold" onClick={() => onConfirm(data)} disabled={!ready}>
        {ready ? "Personnaliser chaque prestation" : "Remplissez les champs obligatoires"}
      </button>
    </div>
  );
}
