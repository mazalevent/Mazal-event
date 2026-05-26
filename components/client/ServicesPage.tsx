"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { SERVICES, GOLD, DARK, MUTED } from "@/lib/constants";

const gridVariants = {
  animate: { transition: { staggerChildren: 0.03, delayChildren: 0.15 } },
};
const cellVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

export function ServicesPage({ onConfirm, onBack }: { onConfirm: (selected: string[]) => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.concat([id])));

  return (
    <div className="page" style={{ padding: "24px 20px", maxWidth: 520, margin: "0 auto" }}>
      <button className="btn-back" onClick={onBack} style={{ marginBottom: 24 }}>Retour</button>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 28 }}>
        <div className="badge bg" style={{ marginBottom: 12 }}>Etape 2 / 4</div>
        <h2 className="serif" style={{ fontSize: 34, fontWeight: 300, marginBottom: 8 }}>
          Vos <em style={{ color: GOLD }}>besoins</em>
        </h2>
        <p style={{ color: MUTED, fontSize: 14 }}>Selectionnez tout ce dont vous avez besoin</p>
      </motion.div>
      <motion.div
        variants={gridVariants}
        initial="initial"
        animate="animate"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 100 }}
      >
        {SERVICES.map((s) => {
          const sel = selected.includes(s.id);
          return (
            <motion.div
              key={s.id}
              variants={cellVariants}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className={sel ? "card card-sel" : "card"}
              onClick={() => toggle(s.id)}
              style={{ padding: 16, textAlign: "center", position: "relative", minHeight: 88, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
            >
              {sel && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 25 }} style={{ position: "absolute", top: 10, right: 12, color: GOLD, fontSize: 13, fontWeight: 700 }}>✓</motion.div>}
              <div style={{ fontSize: 26, marginBottom: 8 }}>{s.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: sel ? 500 : 400, color: sel ? DARK : MUTED, lineHeight: 1.3 }}>{s.label}</div>
            </motion.div>
          );
        })}
      </motion.div>
      {selected.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 20px", background: "rgba(253,250,244,.95)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(201,168,76,.15)" }}
        >
          <button className="btn-gold" onClick={() => onConfirm(selected)}>
            Continuer - {selected.length} {selected.length > 1 ? "prestations" : "prestation"}
          </button>
        </motion.div>
      )}
    </div>
  );
}
