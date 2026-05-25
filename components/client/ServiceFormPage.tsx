"use client";

import { useState } from "react";
import { GOLD, MUTED, LEVELS, type Service } from "@/lib/constants";
import { SERVICE_QUESTIONS } from "@/lib/questions";
import { QuestionField } from "@/components/shared/QuestionField";

export type ServiceData = Record<string, unknown>;

type Props = {
  service: Service;
  step: number;
  total: number;
  onConfirm: (d: ServiceData) => void;
  onBack: () => void;
};

export function ServiceFormPage({ service, step, total, onConfirm, onBack }: Props) {
  const [data, setData] = useState<ServiceData>({});
  const set = (id: string, v: unknown) => setData((p) => ({ ...p, [id]: v }));
  const questions = SERVICE_QUESTIONS[service.id] || [];
  const pct = Math.round(((step + 1) / total) * 100);

  return (
    <div className="page" style={{ padding: "24px 20px", maxWidth: 520, margin: "0 auto" }}>
      <button className="btn-back" onClick={onBack} style={{ marginBottom: 20 }}>Retour</button>
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <div className="badge bg">Prestations</div>
          <span style={{ fontSize: 13, color: MUTED }}>{step + 1} / {total}</span>
        </div>
        <div className="pbar"><div className="pfill" style={{ width: pct + "%" }} /></div>
      </div>
      <div style={{ marginBottom: 24, marginTop: 24 }}>
        <span style={{ fontSize: 36 }}>{service.emoji}</span>
        <h2 className="serif" style={{ fontSize: 30, fontWeight: 300, marginTop: 8 }}>
          <em style={{ color: GOLD }}>{service.label}</em>
        </h2>
      </div>
      <div style={{ marginBottom: 28 }}>
        <div className="section-title">Niveau souhaite</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {LEVELS.map((lv) => (
            <div key={lv.id} className={data.level === lv.id ? "lvl lvl-sel" : "lvl"} onClick={() => set("level", lv.id)}>
              {lv.star && <div className="lvl-rec-tag">IDEAL</div>}
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{lv.label}</div>
              <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.3 }}>{lv.desc}</div>
            </div>
          ))}
        </div>
      </div>
      {questions.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div className="section-title">Vos preferences</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {questions.map((q) => (
              <QuestionField key={q.id} q={q} value={data[q.id]} onChange={(v) => set(q.id, v)} />
            ))}
          </div>
        </div>
      )}
      <div style={{ marginBottom: 32 }}>
        <span className="lbl">Commentaire specifique</span>
        <textarea
          className="inp"
          placeholder={"Precisions sur " + service.label + "..."}
          value={(data.comment as string) || ""}
          onChange={(e) => set("comment", e.target.value)}
        />
      </div>
      <button className="btn-gold" onClick={() => onConfirm(data)}>
        {step < total - 1 ? "Prestation suivante" : "Voir le resume"}
      </button>
    </div>
  );
}
