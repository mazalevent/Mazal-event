"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { GOLD, MUTED } from "@/lib/constants";

// Positions fixes pour les sparkles pour eviter l hydration mismatch
const SPARKLES = [
  { left: "10%", top: "20%", size: 6,  delay: 0.4 },
  { left: "80%", top: "15%", size: 8,  delay: 0.6 },
  { left: "15%", top: "60%", size: 5,  delay: 0.8 },
  { left: "85%", top: "50%", size: 7,  delay: 0.5 },
  { left: "50%", top: "10%", size: 4,  delay: 0.9 },
  { left: "30%", top: "75%", size: 6,  delay: 0.7 },
  { left: "70%", top: "70%", size: 5,  delay: 1.0 },
  { left: "60%", top: "30%", size: 4,  delay: 1.1 },
];

export function ThankYouPage() {
  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "radial-gradient(ellipse at 50% 30%, #FDF8EE 0%, #FDFAF4 50%, #F7EDD8 100%)" }}>
      {SPARKLES.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0.4, 1, 0.4], scale: [0, 1, 0.8, 1, 0.8] }}
          transition={{ delay: s.delay, duration: 2.4, repeat: Infinity, repeatDelay: 1.5 }}
          style={{ position: "absolute", left: s.left, top: s.top, width: s.size, height: s.size, borderRadius: "50%", background: GOLD, boxShadow: "0 0 16px " + GOLD, pointerEvents: "none" }}
        />
      ))}

      <div style={{ maxWidth: 520, width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 }}
          style={{ width: 110, height: 110, borderRadius: "50%", background: "linear-gradient(135deg,#C9A84C 0%,#E8C97A 60%,#C9A84C 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, color: "white", margin: "0 auto 32px", boxShadow: "0 16px 60px rgba(201,168,76,.45), 0 0 0 1px rgba(201,168,76,.2)" }}
        >
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 15 }}
          >
            ✓
          </motion.span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="badge bg" style={{ marginBottom: 16 }}>Demande envoyee</div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          className="serif"
          style={{ fontSize: "clamp(38px,6vw,52px)", fontWeight: 300, marginBottom: 12, lineHeight: 1.1 }}
        >
          Merci pour <em style={{ color: GOLD }}>votre confiance</em>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="divider"
          style={{ margin: "20px auto 24px" }}
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          style={{ color: MUTED, fontSize: 16, lineHeight: 1.75, marginBottom: 8, maxWidth: 420, margin: "0 auto 8px" }}
        >
          Votre demande a bien ete enregistree.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.6 }}
          style={{ color: MUTED, fontSize: 16, lineHeight: 1.75, marginBottom: 40, maxWidth: 420, margin: "0 auto 40px" }}
        >
          Vous recevrez bientot{" "}
          <span style={{ color: GOLD, fontWeight: 500 }}>3 propositions selectionnees</span>
          {" "}pour chaque prestation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}
        >
          <Link href="/" className="btn-outline" style={{ display: "inline-block", textDecoration: "none" }}>
            Retour a l accueil
          </Link>
          <Link href="/demande" style={{ fontSize: 12, color: MUTED, textDecoration: "underline" }}>
            Faire une autre demande
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
