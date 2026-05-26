"use client";

import { useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SERVICES, REGIONS, GOLD, DARK, MUTED } from "@/lib/constants";
import { createPrestataire, updatePrestataire, deletePrestataire, type PrestataireInput } from "./actions";

export type PrestataireRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  services: string[];
  region: string | null;
  notes: string | null;
  created_at: string;
};

const EMPTY: PrestataireInput = { name: "", email: "", phone: "", services: [], region: "", notes: "" };

export function PrestataireListClient({ prestataires, error }: { prestataires: PrestataireRow[]; error?: string }) {
  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string>("");
  const [editing, setEditing] = useState<PrestataireRow | "new" | null>(null);
  const [form, setForm] = useState<PrestataireInput>(EMPTY);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return prestataires.filter((p) => {
      if (serviceFilter && !p.services.includes(serviceFilter)) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const hay = (p.name + " " + (p.email || "") + " " + (p.phone || "") + " " + (p.region || "")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [prestataires, query, serviceFilter]);

  function startNew() {
    setForm(EMPTY);
    setEditing("new");
    setFormError(null);
  }

  function startEdit(p: PrestataireRow) {
    setForm({
      name: p.name,
      email: p.email || "",
      phone: p.phone || "",
      services: p.services || [],
      region: p.region || "",
      notes: p.notes || "",
    });
    setEditing(p);
    setFormError(null);
  }

  function cancel() {
    setEditing(null);
    setFormError(null);
  }

  function toggleSvc(id: string) {
    setForm((f) => ({
      ...f,
      services: f.services.includes(id) ? f.services.filter((x) => x !== id) : [...f.services, id],
    }));
  }

  function save() {
    setFormError(null);
    startTransition(async () => {
      const res = editing === "new"
        ? await createPrestataire(form)
        : editing
          ? await updatePrestataire(editing.id, form)
          : { ok: false as const, error: "État invalide" };
      if (!res.ok) setFormError(res.error);
      else setEditing(null);
    });
  }

  function remove(id: string, name: string) {
    if (!confirm("Supprimer le prestataire « " + name + " » ?")) return;
    startTransition(async () => {
      await deletePrestataire(id);
    });
  }

  return (
    <div className="page" style={{ padding: "24px 20px", maxWidth: 880, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 className="serif" style={{ fontSize: 30, fontWeight: 300 }}>
            Base <em style={{ color: GOLD }}>prestataires</em>
          </h2>
          <p style={{ color: MUTED, fontSize: 14 }}>
            {prestataires.length} prestataire{prestataires.length !== 1 ? "s" : ""} référencé{prestataires.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="btn-gold" onClick={startNew} style={{ width: "auto", padding: "12px 28px", fontSize: 14 }}>
          + Ajouter
        </button>
      </div>

      {error && (
        <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 12, padding: "12px 16px", marginBottom: 16, color: "#991B1B", fontSize: 13 }}>
          Erreur : {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          type="search"
          className="inp"
          placeholder="Rechercher (nom, email, téléphone, région)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: "1 1 240px" }}
        />
        <select
          className="inp"
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          style={{ flex: "0 0 200px", cursor: "pointer" }}
        >
          <option value="">Toutes prestations</option>
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>
          ))}
        </select>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden", marginBottom: 24 }}
          >
            <div style={{ background: "white", borderRadius: 20, padding: 24, border: "1.5px solid " + GOLD, boxShadow: "0 8px 30px rgba(201,168,76,.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 className="serif" style={{ fontSize: 22, fontWeight: 400 }}>
                  {editing === "new" ? "Nouveau prestataire" : "Modifier"}
                </h3>
                <button onClick={cancel} style={{ background: "none", border: "none", color: MUTED, fontSize: 20, cursor: "pointer" }}>×</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 16 }}>
                <div>
                  <span className="lbl">Nom complet *</span>
                  <input className="inp" placeholder="Ex: Studio Lumière" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <span className="lbl">Email</span>
                  <input className="inp" type="email" placeholder="contact@example.com" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <span className="lbl">Téléphone</span>
                  <input className="inp" type="tel" placeholder="050 123 4567" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <span className="lbl">Région</span>
                  <select className="inp" value={form.region || ""} onChange={(e) => setForm({ ...form, region: e.target.value })} style={{ cursor: "pointer" }}>
                    <option value="">— Aucune —</option>
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <span className="lbl">Prestations proposées</span>
                <div className="chips-wrap">
                  {SERVICES.map((s) => {
                    const sel = form.services.includes(s.id);
                    return (
                      <span key={s.id} className={sel ? "chip chip-sel" : "chip"} onClick={() => toggleSvc(s.id)}>
                        <span className="chip-dot" />
                        {s.emoji} {s.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <span className="lbl">Notes internes</span>
                <textarea className="inp" rows={3} placeholder="Tarifs habituels, contacts, retours d'expérience..." value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>

              {formError && (
                <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: "#991B1B", fontSize: 13 }}>
                  {formError}
                </div>
              )}

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={cancel} disabled={isPending} className="btn-outline" style={{ width: "auto" }}>Annuler</button>
                <button onClick={save} disabled={isPending} className="btn-gold" style={{ width: "auto", padding: "12px 28px" }}>
                  {isPending ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: MUTED }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <p>{prestataires.length === 0 ? "Aucun prestataire pour l'instant" : "Aucun prestataire ne correspond aux filtres"}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((p) => (
            <div key={p.id} style={{ background: "white", border: "1.5px solid #EDE0C4", borderRadius: 16, padding: 20, transition: "border-color .2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 600, fontSize: 16, color: DARK }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: MUTED, marginTop: 4, display: "flex", flexWrap: "wrap", gap: 12 }}>
                    {p.email && <span>📧 {p.email}</span>}
                    {p.phone && <span>📞 {p.phone}</span>}
                    {p.region && <span>📍 {p.region}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => startEdit(p)} className="btn-outline" style={{ padding: "6px 14px", fontSize: 12 }}>Modifier</button>
                  <button onClick={() => remove(p.id, p.name)} style={{ background: "none", border: "1.5px solid #fca5a5", color: "#dc2626", borderRadius: 50, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "'Jost',sans-serif" }}>
                    Supprimer
                  </button>
                </div>
              </div>
              {p.services.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.services.map((sid) => {
                    const sv = SERVICES.find((x) => x.id === sid);
                    return sv ? <span key={sid} className="badge bg">{sv.emoji} {sv.label}</span> : null;
                  })}
                </div>
              )}
              {p.notes && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #F0E8D8", fontSize: 13, color: MUTED, fontStyle: "italic" }}>
                  {p.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
