"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SERVICES, GOLD, DARK, MUTED } from "@/lib/constants";
import { createProposition, deleteProposition } from "@/app/admin/requests/[id]/sendActions";
import type { OffreRow, PrestataireLite, PropositionRow } from "@/app/admin/requests/[id]/page";

const MAX_PER_SERVICE = 3;

type Props = {
  requestId: string;
  clientName: string | null;
  clientPhone: string | null;
  clientEmail: string | null;
  serviceIds: string[];
  offres: OffreRow[];
  prestataires: PrestataireLite[];
  propositions: PropositionRow[];
};

export function SendClientTab({ requestId, clientName, clientPhone, clientEmail, serviceIds, offres, prestataires, propositions }: Props) {
  const services = useMemo(() => SERVICES.filter((s) => serviceIds.includes(s.id)), [serviceIds]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Selection helpers
  function toggle(offreId: string, serviceId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(offreId)) {
        next.delete(offreId);
      } else {
        const countForService = offres.filter((o) => o.service_id === serviceId && next.has(o.id)).length;
        if (countForService >= MAX_PER_SERVICE) {
          setError("Maximum " + MAX_PER_SERVICE + " offres par prestation.");
          return prev;
        }
        next.add(offreId);
        setError(null);
      }
      return next;
    });
  }

  function generate() {
    setError(null);
    setGeneratedToken(null);
    const ids = Array.from(selected);
    startTransition(async () => {
      const res = await createProposition(requestId, ids);
      if (res.ok) {
        setGeneratedToken(res.token);
        setSelected(new Set());
      } else {
        setError(res.error);
      }
    });
  }

  const totalSelected = selected.size;
  const hasAnyOffer = offres.length > 0;

  if (!hasAnyOffer) {
    return (
      <div style={{ background: "#FDF8EE", border: "1px solid rgba(201,168,76,.2)", borderRadius: 16, padding: 32, textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>Aucune offre reçue</div>
        <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>
          Invitez des prestataires depuis l&apos;onglet précédent. Quand ils auront soumis leur offre, vous pourrez les sélectionner ici pour les envoyer au client.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {propositions.length > 0 && (
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 14, padding: 16 }}>
          <div className="lbl" style={{ marginBottom: 8 }}>Propositions déjà envoyées</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {propositions.map((p) => (
              <PropositionRowDisplay key={p.token} proposition={p} requestId={requestId} offres={offres} prestataires={prestataires} />
            ))}
          </div>
        </div>
      )}

      <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1.5px solid #EDE0C4" }}>
        <div style={{ marginBottom: 16 }}>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 400, color: DARK }}>
            Cochez les offres à <em style={{ color: GOLD }}>envoyer au client</em>
          </h3>
          <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>
            Jusqu&apos;à {MAX_PER_SERVICE} offres par prestation. Le client verra exactement ce que vous cochez.
          </p>
        </div>

        {services.map((s) => {
          const serviceOffres = offres.filter((o) => o.service_id === s.id);
          if (serviceOffres.length === 0) return null;
          return (
            <div key={s.id} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{s.emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{s.label}</span>
                <span style={{ fontSize: 11, color: MUTED }}>
                  ({serviceOffres.filter((o) => selected.has(o.id)).length} / {MAX_PER_SERVICE} sélectionnée{serviceOffres.filter((o) => selected.has(o.id)).length > 1 ? "s" : ""})
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {serviceOffres.map((o) => {
                  const presta = prestataires.find((p) => p.id === o.prestataire_id);
                  const sel = selected.has(o.id);
                  return (
                    <div
                      key={o.id}
                      onClick={() => toggle(o.id, o.service_id)}
                      style={{ background: sel ? "linear-gradient(135deg,#FDF8EE,#F7EDD8)" : "white", border: "1.5px solid " + (sel ? GOLD : "#EDE0C4"), borderRadius: 12, padding: 14, cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12, transition: "all .2s" }}
                    >
                      <div className={sel ? "check-box check-box-sel" : "check-box"} style={{ marginTop: 2 }}>
                        {sel ? "✓" : ""}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{presta?.name || "Prestataire"}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: GOLD }}>{o.prix != null ? o.prix + " NIS" : "—"}</div>
                        </div>
                        {o.description && <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>{o.description}</div>}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 11, color: MUTED, marginTop: 6 }}>
                          {o.dispo && <span className="badge bg">{o.dispo}</span>}
                          {o.delai && <span>Délai : {o.delai}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {error && (
          <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "10px 14px", marginBottom: 12, color: "#991B1B", fontSize: 13 }}>
            {error}
          </div>
        )}

        <button
          onClick={generate}
          disabled={isPending || totalSelected === 0}
          className="btn-gold"
          style={{ marginTop: 12 }}
        >
          {isPending ? "Génération..." : totalSelected === 0 ? "Sélectionnez des offres" : "Générer le lien (" + totalSelected + " offre" + (totalSelected > 1 ? "s" : "") + ")"}
        </button>
      </div>

      <AnimatePresence>
        {generatedToken && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ background: "linear-gradient(135deg, #FDF8EE, white)", border: "1.5px solid " + GOLD, borderRadius: 16, padding: 20 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>🎉</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: DARK }}>Lien généré</span>
            </div>
            <p style={{ fontSize: 13, color: MUTED, marginBottom: 12 }}>
              Envoyez ce lien à {clientName || "votre client"}. Il pourra voir les offres et cliquer « Je suis intéressé ».
            </p>
            <GeneratedLink token={generatedToken} clientPhone={clientPhone} clientEmail={clientEmail} clientName={clientName} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GeneratedLink({ token, clientPhone, clientEmail, clientName }: { token: string; clientPhone: string | null; clientEmail: string | null; clientName: string | null }) {
  const [url, setUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.origin + "/o/" + token);
  }, [token]);

  function copy() {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function openWhatsApp() {
    if (!clientPhone || !url) return;
    const phone = clientPhone.replace(/[^0-9]/g, "").replace(/^0/, "972");
    const msg = encodeURIComponent("Bonjour " + (clientName || "") + " ! Voici les propositions Mazal Event sélectionnées pour vous : " + url);
    window.open("https://wa.me/" + phone + "?text=" + msg, "_blank");
  }

  function openMailto() {
    if (!clientEmail || !url) return;
    const subject = encodeURIComponent("Vos propositions Mazal Event");
    const body = encodeURIComponent("Bonjour " + (clientName || "") + ",\n\nVoici les propositions sélectionnées pour votre événement :\n\n" + url + "\n\nN'hésitez pas à nous recontacter pour toute question.\n\nL'équipe Mazal Event");
    window.location.href = "mailto:" + clientEmail + "?subject=" + subject + "&body=" + body;
  }

  return (
    <div>
      <div className="link-box">{url}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        <button
          onClick={copy}
          style={{ flex: "1 1 130px", background: copied ? "#F0FDF4" : "white", border: "1.5px solid " + (copied ? "#15803D" : GOLD), color: copied ? "#15803D" : GOLD, borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Jost',sans-serif" }}
        >
          {copied ? "✓ Copié" : "Copier le lien"}
        </button>
        {clientPhone && (
          <button onClick={openWhatsApp} style={{ flex: "1 1 130px", background: "#25D366", border: "none", color: "white", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Jost',sans-serif" }}>
            💬 WhatsApp
          </button>
        )}
        {clientEmail && (
          <button onClick={openMailto} style={{ flex: "1 1 130px", background: "white", border: "1.5px solid " + GOLD, color: GOLD, borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Jost',sans-serif" }}>
            📧 Email
          </button>
        )}
      </div>
    </div>
  );
}

function PropositionRowDisplay({ proposition, requestId, offres, prestataires }: { proposition: PropositionRow; requestId: string; offres: OffreRow[]; prestataires: PrestataireLite[] }) {
  const [url, setUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setUrl(window.location.origin + "/o/" + proposition.token);
  }, [proposition.token]);

  const interestedCount = proposition.interests
    ? Object.values(proposition.interests).filter(Boolean).length
    : 0;
  const linkedOffres = offres.filter((o) => proposition.offre_ids.includes(o.id));

  function copy() {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function cancel() {
    if (!confirm("Supprimer cette proposition envoyée ? Le client ne pourra plus l'ouvrir.")) return;
    startTransition(async () => {
      await deleteProposition(proposition.token, requestId);
    });
  }

  return (
    <div style={{ background: "white", border: "1px solid #BBF7D0", borderRadius: 10, padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <div style={{ fontSize: 12, color: MUTED }}>
          Envoyée le {new Date(proposition.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
          {proposition.opened_at && " · Ouverte ✓"}
          {interestedCount > 0 && (
            <span style={{ color: "#15803D", fontWeight: 600 }}> · {interestedCount} offre{interestedCount > 1 ? "s" : ""} intéressée{interestedCount > 1 ? "s" : ""}</span>
          )}
        </div>
        <button onClick={cancel} style={{ background: "none", border: "none", color: "#dc2626", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>
          Supprimer
        </button>
      </div>
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>
        {linkedOffres.length} offre{linkedOffres.length > 1 ? "s" : ""} :{" "}
        {linkedOffres.map((o, i) => {
          const presta = prestataires.find((p) => p.id === o.prestataire_id);
          const isInterested = proposition.interests?.[o.id];
          return (
            <span key={o.id}>
              {i > 0 && ", "}
              <span style={{ color: isInterested ? "#15803D" : DARK, fontWeight: isInterested ? 600 : 400 }}>
                {presta?.name || "?"}{isInterested ? " ✓" : ""}
              </span>
            </span>
          );
        })}
      </div>
      <button
        onClick={copy}
        style={{ width: "100%", background: copied ? "#F0FDF4" : "white", border: "1px solid " + (copied ? "#15803D" : "#BBF7D0"), color: copied ? "#15803D" : "#15803D", borderRadius: 8, padding: "8px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Jost',sans-serif" }}
      >
        {copied ? "✓ Copié" : "Copier à nouveau le lien"}
      </button>
    </div>
  );
}
