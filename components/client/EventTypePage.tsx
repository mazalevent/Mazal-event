"use client";

import { motion } from "motion/react";
import { EVENT_TYPES, GOLD, MUTED, type EventType } from "@/lib/constants";

const containerVariants = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export function EventTypePage({ onSelect, onBack }: { onSelect: (e: EventType) => void; onBack: () => void }) {
  return (
    <div className="page" style={{ padding: "24px 20px", maxWidth: 480, margin: "0 auto" }}>
      <button className="btn-back" onClick={onBack} style={{ marginBottom: 32 }}>Retour</button>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 32 }}>
        <div className="badge bg" style={{ marginBottom: 12 }}>Etape 1 / 4</div>
        <h2 className="serif" style={{ fontSize: 36, fontWeight: 300, marginBottom: 8 }}>
          Votre <em style={{ color: GOLD }}>evenement</em>
        </h2>
        <p style={{ color: MUTED, fontSize: 14 }}>Quel type de celebration planifiez-vous ?</p>
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        {EVENT_TYPES.map((evt) => (
          <motion.div
            key={evt.id}
            variants={itemVariants}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="card"
            onClick={() => onSelect(evt)}
            style={{ display: "flex", alignItems: "center", gap: 18, padding: 18 }}
          >
            <span style={{ fontSize: 34 }}>{evt.emoji}</span>
            <div>
              <div style={{ fontWeight: 500, fontSize: 17 }}>{evt.label}</div>
              <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{evt.desc}</div>
            </div>
            <span style={{ marginLeft: "auto", color: GOLD, fontSize: 22 }}>›</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
