"use client";

import { useState } from "react";
import { motion } from "motion/react";
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

const levelsContainer = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
};
const levelVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
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
        <div className="pbar">
          <motion.div
            className="pfill"
            initial={{ width: 0 }}
            animate={{ width: pct + "%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} style={{ marginBottom: 24, marginTop: 24 }}>
        <span style={{ fontSize: 36 }}>{service.emoji}</span>
        <h2 className="serif" style={{ fontSize: 30, fontWeight: 300, marginTop: 8 }}>
          <em style={{ color: GOLD }}>{service.label}</em>
        </h2>
      </motion.div>
      <div style={{ marginBottom: 28 }}>
        <div className="section-title">Niveau souhaité</div>
        <motion.div
          variants={levelsContainer}
          initial="initial"
          animate="animate"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}
        >
          {LEVELS.map((lv) => (
            <motion.div
              key={lv.id}
              variants={levelVariants}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className={data.level === lv.id ? "lvl lvl-sel" : "lvl"}
              onClick={() => set("level", lv.id)}
            >
              {lv.star && <div className="lvl-rec-tag">IDEAL</div>}
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{lv.label}</div>
              <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.3 }}>{lv.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      {questions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          style={{ marginBottom: 28 }}
        >
          <div className="section-title">Vos préférences</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {questions.map((q) => (
              <QuestionField key={q.id} q={q} value={data[q.id]} onChange={(v) => set(q.id, v)} />
            ))}
          </div>
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        style={{ marginBottom: 32 }}
      >
        <span className="lbl">Commentaire spécifique</span>
        <textarea
          className="inp"
          placeholder={"Précisions sur " + service.label + "..."}
          value={(data.comment as string) || ""}
          onChange={(e) => set("comment", e.target.value)}
        />
      </motion.div>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="btn-gold"
        onClick={() => onConfirm(data)}
      >
        {step < total - 1 ? "Prestation suivante" : "Voir le résumé"}
      </motion.button>
    </div>
  );
}
