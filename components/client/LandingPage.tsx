"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const GOLD = "#C9A84C";
const DARK = "#1A1208";
const MUTED = "#8B7355";

const HERO_IMG = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=2000&q=80";
const GALLERY = [
  {
    type: "Mariage",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
    desc: "Cérémonie & réception",
  },
  {
    type: "Bar / Bat Mitsva",
    img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80",
    desc: "Célébration religieuse & fête",
  },
  {
    type: "Brit Mila & Henna",
    img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
    desc: "Moments d'intimité familiale",
  },
];

const STEPS = [
  { num: "01", title: "Vous nous dites tout", desc: "Type d'événement, prestations, budget, style. 5 minutes suffisent.", icon: "💬" },
  { num: "02", title: "On sélectionne pour vous", desc: "Notre équipe contacte les meilleurs prestataires adaptés à vos critères.", icon: "🎯" },
  { num: "03", title: "Vous choisissez", desc: "Jusqu'à 3 propositions par prestation. Vous décidez, on met en relation.", icon: "✨" },
];

const FEATURES = [
  { icon: "🎯", title: "3 propositions", desc: "Sélectionnées pour vous" },
  { icon: "✓", title: "Vérifiés", desc: "Adaptés à vos critères" },
  { icon: "⚡", title: "Sous 24h", desc: "Rapide et efficace" },
  { icon: "💬", title: "Gratuit", desc: "Sans engagement" },
];

export function LandingPage() {
  return (
    <div style={{ background: "#FDFAF4", color: DARK, overflow: "hidden" }}>
      <Hero />
      <HowItWorks />
      <Gallery />
      <Features />
      <Footer />
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <motion.section
      ref={ref}
      style={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden" }}
    >
      <motion.div style={{ position: "absolute", inset: 0, y }}>
        <Image
          src={HERO_IMG}
          alt="Mariage de luxe"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(26,18,8,.35) 0%, rgba(26,18,8,.55) 60%, rgba(26,18,8,.75) 100%)" }} />
      </motion.div>

      <motion.div
        style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", textAlign: "center", opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="badge"
          style={{ background: "rgba(253,250,244,.15)", color: "#FDFAF4", border: "1px solid rgba(253,250,244,.3)", backdropFilter: "blur(8px)", marginBottom: 28 }}
        >
          Israël — Plateforme prestataires événementiels
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="serif"
          style={{ fontSize: "clamp(64px,12vw,140px)", fontWeight: 300, lineHeight: 1, color: "#FDFAF4", marginBottom: 16, letterSpacing: "-0.02em" }}
        >
          Mazal <em style={{ color: GOLD, fontStyle: "italic" }}>Tov&nbsp;!</em>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{ width: 80, height: 1, background: "linear-gradient(90deg,transparent,#C9A84C,transparent)", margin: "16px auto 28px" }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ fontSize: "clamp(17px,2.4vw,22px)", color: "rgba(253,250,244,.9)", fontWeight: 300, maxWidth: 540, lineHeight: 1.55, marginBottom: 44 }}
        >
          Mariage, Bar Mitsva, Brit Mila...
          <br />
          <span style={{ color: "#FDFAF4", fontWeight: 400 }}>On sélectionne les bons prestataires pour vous.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link
            href="/demande"
            className="btn-gold"
            style={{ width: "auto", padding: "18px 52px", textDecoration: "none", display: "inline-block", fontSize: 16 }}
          >
            Trouvons vos prestataires
          </Link>
          <p style={{ marginTop: 18, fontSize: 13, color: "rgba(253,250,244,.7)" }}>
            100% gratuit — Sans engagement — 3 propositions sur mesure
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", color: "#FDFAF4", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", textAlign: "center" }}
      >
        <div style={{ marginBottom: 8 }}>Découvrir</div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          style={{ width: 1, height: 32, background: "rgba(253,250,244,.5)", margin: "0 auto" }}
        />
      </motion.div>
    </motion.section>
  );
}

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function HowItWorks() {
  return (
    <section style={{ padding: "120px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <FadeUp>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div className="badge bg" style={{ marginBottom: 16 }}>Notre méthode</div>
          <h2 className="serif" style={{ fontSize: "clamp(38px,5vw,56px)", fontWeight: 300, lineHeight: 1.1, marginBottom: 12 }}>
            Comment <em style={{ color: GOLD }}>ça marche</em>
          </h2>
          <p style={{ color: MUTED, fontSize: 16, maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
            Trois étapes simples pour une organisation sans stress.
          </p>
        </div>
      </FadeUp>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
        {STEPS.map((step, i) => (
          <FadeUp key={step.num} delay={i * 0.15}>
            <div style={{ background: "white", borderRadius: 24, padding: "40px 28px", border: "1px solid rgba(201,168,76,.15)", boxShadow: "0 4px 30px rgba(0,0,0,.04)", height: "100%", position: "relative" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: GOLD, letterSpacing: ".15em", marginBottom: 16 }}>{step.num}</div>
              <div style={{ fontSize: 40, marginBottom: 20 }}>{step.icon}</div>
              <h3 className="serif" style={{ fontSize: 24, fontWeight: 400, marginBottom: 10, color: DARK }}>{step.title}</h3>
              <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7 }}>{step.desc}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section style={{ padding: "80px 0 120px", background: "linear-gradient(180deg, transparent 0%, rgba(201,168,76,.04) 100%)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <FadeUp>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="badge bg" style={{ marginBottom: 16 }}>Types d&apos;événements</div>
            <h2 className="serif" style={{ fontSize: "clamp(38px,5vw,56px)", fontWeight: 300, lineHeight: 1.1, marginBottom: 12 }}>
              Pour chaque <em style={{ color: GOLD }}>moment</em>
            </h2>
            <p style={{ color: MUTED, fontSize: 16, maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
              Du grand mariage à la cérémonie intime, nous vous mettons en relation avec les bons prestataires.
            </p>
          </div>
        </FadeUp>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {GALLERY.map((item, i) => (
            <FadeUp key={item.type} delay={i * 0.15}>
              <motion.div
                className="gallery-card"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ borderRadius: 20, overflow: "hidden", position: "relative", aspectRatio: "3 / 4", cursor: "pointer", boxShadow: "0 10px 40px rgba(0,0,0,.08)" }}
              >
                <Image
                  src={item.img}
                  alt={item.type}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover", transition: "transform .6s ease" }}
                  className="gallery-img"
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(26,18,8,.85) 100%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 28px", color: "#FDFAF4" }}>
                  <div className="serif" style={{ fontSize: 26, fontWeight: 400, marginBottom: 6, fontStyle: "italic" }}>
                    {item.type}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(253,250,244,.85)", lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section style={{ padding: "100px 24px 120px", maxWidth: 1100, margin: "0 auto" }}>
      <FadeUp>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="badge bg" style={{ marginBottom: 16 }}>Pourquoi nous</div>
          <h2 className="serif" style={{ fontSize: "clamp(38px,5vw,56px)", fontWeight: 300, lineHeight: 1.1, marginBottom: 12 }}>
            Une promesse <em style={{ color: GOLD }}>simple</em>
          </h2>
        </div>
      </FadeUp>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, maxWidth: 900, margin: "0 auto" }}>
        {FEATURES.map((f, i) => (
          <FadeUp key={f.title} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(201,168,76,.18)" }}
              transition={{ duration: 0.3 }}
              style={{ background: "white", borderRadius: 20, padding: 28, border: "1.5px solid rgba(201,168,76,.15)", textAlign: "center", height: "100%" }}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 6, color: DARK }}>{f.title}</div>
              <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{f.desc}</div>
            </motion.div>
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={0.4}>
        <div style={{ textAlign: "center", marginTop: 72 }}>
          <Link
            href="/demande"
            className="btn-gold"
            style={{ width: "auto", padding: "18px 52px", textDecoration: "none", display: "inline-block", fontSize: 16 }}
          >
            Commencer maintenant
          </Link>
          <p style={{ marginTop: 16, fontSize: 12, color: MUTED }}>
            Service 100% gratuit — Réponse sous 24h
          </p>
        </div>
      </FadeUp>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(201,168,76,.15)", padding: "40px 24px", textAlign: "center" }}>
      <div className="serif" style={{ fontSize: 22, fontWeight: 300, marginBottom: 8 }}>
        Mazal <em style={{ color: GOLD }}>Event</em>
      </div>
      <p style={{ fontSize: 12, color: MUTED }}>
        Organisation d&apos;événements en Israël — © {new Date().getFullYear()}
      </p>
    </footer>
  );
}
