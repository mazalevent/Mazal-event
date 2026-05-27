"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { notifyAdminNewOffer, getAppUrl } from "@/lib/email";
import { SERVICES } from "@/lib/constants";

export type SubmitOfferInput = {
  token: string;
  prix: number | null;
  description: string;
  dispo: "Disponible" | "A confirmer" | "Non disponible" | "";
  delai: string;
  note: string;
};

export type SubmitOfferResult = { ok: true } | { ok: false; error: string };

export async function submitOffer(input: SubmitOfferInput): Promise<SubmitOfferResult> {
  if (!input.token) return { ok: false, error: "Lien invalide." };
  if (!input.description.trim()) return { ok: false, error: "La description est requise." };
  if (input.prix == null || isNaN(input.prix) || input.prix <= 0) {
    return { ok: false, error: "Le prix doit être un nombre positif." };
  }
  if (input.dispo === "") return { ok: false, error: "La disponibilité est requise." };

  const supabase = createAdminClient();

  const { data: invite, error: invErr } = await supabase
    .from("prestataire_invites")
    .select("token, request_id, service_id, prestataire_id, expires_at, used_at")
    .eq("token", input.token)
    .single();

  if (invErr || !invite) return { ok: false, error: "Lien invalide ou expiré." };
  if (new Date(invite.expires_at).getTime() < Date.now()) {
    return { ok: false, error: "Ce lien a expiré." };
  }

  const { error: insErr } = await supabase.from("offres").insert({
    request_id: invite.request_id,
    service_id: invite.service_id,
    invite_token: invite.token,
    prestataire_id: invite.prestataire_id,
    prix: input.prix,
    description: input.description.trim(),
    dispo: input.dispo,
    delai: input.delai.trim() || null,
    note: input.note.trim() || null,
  });

  if (insErr) return { ok: false, error: insErr.message };

  // Marquer l'invitation comme utilisée
  await supabase
    .from("prestataire_invites")
    .update({ used_at: new Date().toISOString() })
    .eq("token", input.token);

  // Notif admin best-effort
  try {
    const [{ data: presta }, { data: req }] = await Promise.all([
      invite.prestataire_id
        ? supabase.from("prestataires").select("name").eq("id", invite.prestataire_id).single()
        : Promise.resolve({ data: null }),
      supabase.from("requests").select("client_name").eq("id", invite.request_id).single(),
    ]);
    const service = SERVICES.find((s) => s.id === invite.service_id);
    await notifyAdminNewOffer({
      prestataireName: presta?.name || "Prestataire",
      serviceLabel: service?.label || invite.service_id,
      clientName: req?.client_name || "Client",
      prix: input.prix,
      requestId: invite.request_id,
      appUrl: getAppUrl(),
    });
  } catch (e) {
    console.error("[submitOffer] Email notif admin echec :", e);
  }

  return { ok: true };
}
