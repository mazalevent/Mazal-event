"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { SERVICES, GOLD, DARK, MUTED } from "@/lib/constants";
import { createInvite, deleteInvite } from "@/app/admin/requests/[id]/inviteActions";
import type { PrestataireLite, InviteRow, OffreRow } from "@/app/admin/requests/[id]/page";

type Props = {
  requestId: string;
  serviceIds: string[];
  prestataires: PrestataireLite[];
  invites: InviteRow[];
  offres: OffreRow[];
};

export function PrestatairesTab({ requestId, serviceIds, prestataires, invites, offres }: Props) {
  const services = useMemo(() => SERVICES.filter((s) => serviceIds.includes(s.id)), [serviceIds]);

  if (services.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: MUTED }}>
        Aucune prestation demandée.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {services.map((s) => (
        <ServiceSection
          key={s.id}
          requestId={requestId}
          service={s}
          prestataires={prestataires.filter((p) => p.services.includes(s.id))}
          invites={invites.filter((i) => i.service_id === s.id)}
          offres={offres.filter((o) => o.service_id === s.id)}
        />
      ))}
    </div>
  );
}

function ServiceSection({
  requestId,
  service,
  prestataires,
  invites,
  offres,
}: {
  requestId: string;
  service: { id: string; label: string; emoji: string };
  prestataires: PrestataireLite[];
  invites: InviteRow[];
  offres: OffreRow[];
}) {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function invite(prestataireId: string) {
    setError(null);
    startTransition(async () => {
      const res = await createInvite(requestId, service.id, prestataireId);
      if (!res.ok) setError(res.error);
      else setSelectorOpen(false);
    });
  }

  function cancelInvite(token: string) {
    if (!confirm("Annuler cette invitation ?")) return;
    startTransition(async () => {
      await deleteInvite(token, requestId);
    });
  }

  const alreadyInvitedIds = new Set(invites.map((i) => i.prestataire_id).filter(Boolean));
  const availablePrestataires = prestataires.filter((p) => !alreadyInvitedIds.has(p.id));

  return (
    <div style={{ background: "white", border: "1.5px solid #EDE0C4", borderRadius: 16, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>{service.emoji}</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: DARK }}>{service.label}</span>
          {offres.length > 0 && (
            <span style={{ fontSize: 11, fontWeight: 600, background: "#F0FDF4", color: "#15803D", padding: "3px 10px", borderRadius: 20 }}>
              {offres.length} offre{offres.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <button
          onClick={() => setSelectorOpen((v) => !v)}
          className="btn-outline"
          style={{ padding: "6px 16px", fontSize: 12 }}
        >
          + Inviter
        </button>
      </div>

      <AnimatePresence>
        {selectorOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden", marginBottom: 12 }}
          >
            <div style={{ background: "#FDF8EE", borderRadius: 12, padding: 16, border: "1px solid rgba(201,168,76,.2)" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>
                Choisir un prestataire à inviter
              </div>
              {availablePrestataires.length === 0 ? (
                <div style={{ fontSize: 13, color: MUTED, padding: "8px 0" }}>
                  Aucun prestataire disponible pour cette prestation.{" "}
                  <Link href="/admin/prestataires" style={{ color: GOLD, fontWeight: 500 }}>
                    En ajouter →
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {availablePrestataires.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => invite(p.id)}
                      disabled={isPending}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "white", border: "1px solid #EDE0C4", borderRadius: 10, cursor: isPending ? "wait" : "pointer", textAlign: "left", fontFamily: "'Jost',sans-serif", transition: "border-color .2s" }}
                    >
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: DARK }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
                          {[p.email, p.phone, p.region].filter(Boolean).join(" · ")}
                        </div>
                      </div>
                      <span style={{ fontSize: 13, color: GOLD, fontWeight: 600 }}>Inviter →</span>
                    </button>
                  ))}
                </div>
              )}
              {error && <div style={{ marginTop: 10, fontSize: 12, color: "#dc2626" }}>{error}</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {invites.length > 0 && (
        <div style={{ marginBottom: offres.length > 0 ? 14 : 0 }}>
          <div className="lbl" style={{ marginBottom: 6 }}>Invitations envoyées</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {invites.map((inv) => {
              const presta = prestataires.find((p) => p.id === inv.prestataire_id);
              return (
                <InviteRowDisplay
                  key={inv.token}
                  invite={inv}
                  prestataireName={presta?.name || inv.email_sent_to || "Prestataire"}
                  prestatairePhone={presta?.phone || null}
                  onCancel={() => cancelInvite(inv.token)}
                  disabled={isPending}
                />
              );
            })}
          </div>
        </div>
      )}

      {offres.length > 0 && (
        <div>
          <div className="lbl" style={{ marginBottom: 6 }}>Offres reçues</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {offres.map((o) => {
              const presta = prestataires.find((p) => p.id === o.prestataire_id);
              return (
                <div key={o.id} style={{ background: "#FDF8EE", borderRadius: 12, padding: 14, border: "1px solid rgba(201,168,76,.2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{presta?.name || "Prestataire"}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: GOLD }}>{o.prix != null ? o.prix + " NIS" : "—"}</div>
                  </div>
                  {o.description && <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5, marginBottom: 6 }}>{o.description}</div>}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 11, color: MUTED }}>
                    {o.dispo && <span className="badge bg">{o.dispo}</span>}
                    {o.delai && <span>Délai : {o.delai}</span>}
                  </div>
                  {o.note && <div style={{ fontSize: 12, color: MUTED, fontStyle: "italic", marginTop: 6, paddingTop: 6, borderTop: "1px solid rgba(201,168,76,.15)" }}>{o.note}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {invites.length === 0 && offres.length === 0 && !selectorOpen && (
        <div style={{ fontSize: 13, color: MUTED, padding: "8px 0" }}>
          Aucune invitation pour cette prestation. Cliquez sur « Inviter » pour commencer.
        </div>
      )}
    </div>
  );
}

function InviteRowDisplay({
  invite,
  prestataireName,
  prestatairePhone,
  onCancel,
  disabled,
}: {
  invite: InviteRow;
  prestataireName: string;
  prestatairePhone: string | null;
  onCancel: () => void;
  disabled: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    setUrl(window.location.origin + "/p/" + invite.token);
  }, [invite.token]);

  function copy() {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function openWhatsApp() {
    if (!prestatairePhone || !url) return;
    const phone = prestatairePhone.replace(/[^0-9]/g, "").replace(/^0/, "972");
    const msg = encodeURIComponent("Bonjour " + prestataireName + ", Mazal Event vous propose une nouvelle demande. Voici le lien pour soumettre votre offre : " + url);
    window.open("https://wa.me/" + phone + "?text=" + msg, "_blank");
  }

  return (
    <div style={{ background: "#F0F4FF", border: "1px solid #C7D2FE", borderRadius: 10, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: DARK }}>{prestataireName}</div>
          <div style={{ fontSize: 11, color: MUTED }}>
            Envoyée le {new Date(invite.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
            {invite.used_at && " · Offre soumise"}
          </div>
        </div>
        <button
          onClick={onCancel}
          disabled={disabled}
          style={{ background: "none", border: "none", color: "#dc2626", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}
        >
          Annuler
        </button>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button
          onClick={copy}
          style={{ flex: 1, minWidth: 130, background: copied ? "#F0FDF4" : "white", border: "1px solid " + (copied ? "#15803D" : "#C7D2FE"), color: copied ? "#15803D" : "#3730A3", borderRadius: 8, padding: "8px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Jost',sans-serif" }}
        >
          {copied ? "✓ Copié" : "Copier le lien"}
        </button>
        {prestatairePhone && (
          <button
            onClick={openWhatsApp}
            style={{ flex: 1, minWidth: 100, background: "#25D366", border: "none", color: "white", borderRadius: 8, padding: "8px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Jost',sans-serif" }}
          >
            💬 WhatsApp
          </button>
        )}
      </div>
    </div>
  );
}
