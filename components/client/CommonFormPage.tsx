"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { GOLD, MUTED } from "@/lib/constants";
import { COMMON_QUESTIONS } from "@/lib/questions";
import { QuestionField } from "@/components/shared/QuestionField";
import { isValidEmail, isValidIsraeliPhone } from "@/lib/validation";

export type CommonData = Record<string, unknown>;

const fieldsContainer = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};
const fieldVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

export function CommonFormPage({ onConfirm, onBack }: { onConfirm: (d: CommonData) => void; onBack: () => void }) {
  const [data, setData] = useState<CommonData>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const set = (id: string, v: unknown) => setData((p) => ({ ...p, [id]: v }));
  const markTouched = (id: string) => setTouched((t) => ({ ...t, [id]: true }));

  const errors = useMemo<Record<string, string>>(() => {
    const e: Record<string, string> = {};
    const phone = ((data.phone as string) || "").trim();
    if (phone && !isValidIsraeliPhone(phone)) {
      e.phone = "Numéro non valide. Format attendu : 050 123 4567 ou +972 50 123 4567.";
    }
    const email = ((data.email as string) || "").trim();
    if (email && !isValidEmail(email)) {
      e.email = "Email non valide.";
    }
    return e;
  }, [data]);

  const ready = useMemo(() => {
    const allFilled = COMMON_QUESTIONS.every((q) => {
      if (q.optional) return true;
      const v = data[q.id];
      if (v === undefined || v === null || v === "") return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    });
    return allFilled && Object.keys(errors).length === 0;
  }, [data, errors]);

  function handleSubmit() {
    // Force show errors on submit attempt
    const allIds = COMMON_QUESTIONS.map((q) => q.id);
    setTouched(Object.fromEntries(allIds.map((id) => [id, true])));
    if (ready) onConfirm(data);
  }

  return (
    <div className="page" style={{ padding: "24px 20px", maxWidth: 520, margin: "0 auto" }}>
      <button className="btn-back" onClick={onBack} style={{ marginBottom: 24 }}>Retour</button>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 28 }}>
        <div className="badge bg" style={{ marginBottom: 12 }}>Étape 3 / 4</div>
        <h2 className="serif" style={{ fontSize: 32, fontWeight: 300, marginBottom: 8 }}>
          Informations <em style={{ color: GOLD }}>générales</em>
        </h2>
        <p style={{ color: MUTED, fontSize: 14 }}>Ces infos s'appliquent à toutes vos prestations</p>
      </motion.div>
      <motion.div
        variants={fieldsContainer}
        initial="initial"
        animate="animate"
        style={{ display: "flex", flexDirection: "column", gap: 22, marginBottom: 36 }}
      >
        {COMMON_QUESTIONS.map((q) => {
          const err = touched[q.id] ? errors[q.id] : undefined;
          const errorBorder = err ? "1.5px solid #dc2626" : undefined;

          if (q.type === "text" || q.type === "tel" || q.type === "email") {
            return (
              <motion.div key={q.id} variants={fieldVariants}>
                <span className="lbl">{q.label}</span>
                <input
                  type={q.type}
                  className="inp"
                  placeholder={q.placeholder}
                  value={(data[q.id] as string) || ""}
                  onChange={(e) => set(q.id, e.target.value)}
                  onBlur={() => markTouched(q.id)}
                  style={errorBorder ? { borderColor: "#dc2626" } : undefined}
                />
                {err && <div style={{ fontSize: 12, color: "#dc2626", marginTop: 6 }}>{err}</div>}
              </motion.div>
            );
          }
          if (q.type === "date") {
            return (
              <motion.div key={q.id} variants={fieldVariants}>
                <span className="lbl">{q.label}</span>
                <input
                  type="date"
                  className="inp"
                  value={(data[q.id] as string) || ""}
                  onChange={(e) => set(q.id, e.target.value)}
                  onBlur={() => markTouched(q.id)}
                />
              </motion.div>
            );
          }
          if (q.type === "textarea") {
            return (
              <motion.div key={q.id} variants={fieldVariants}>
                <span className="lbl">{q.label}</span>
                <textarea
                  className="inp"
                  placeholder={q.placeholder}
                  value={(data[q.id] as string) || ""}
                  onChange={(e) => set(q.id, e.target.value)}
                  onBlur={() => markTouched(q.id)}
                />
              </motion.div>
            );
          }
          return (
            <motion.div key={q.id} variants={fieldVariants}>
              <QuestionField q={q} value={data[q.id]} onChange={(v) => set(q.id, v)} />
            </motion.div>
          );
        })}
      </motion.div>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="btn-gold"
        onClick={handleSubmit}
        disabled={!ready}
      >
        {ready ? "Personnaliser chaque prestation" : "Remplissez les champs obligatoires"}
      </motion.button>
    </div>
  );
}
