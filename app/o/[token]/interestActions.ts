"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { notifyAdminClientInterested, getAppUrl } from "@/lib/email";
import { SERVICES } from "@/lib/constants";

export type InterestResult = { ok: true } | { ok: false; error: string };

export async function toggleInterest(token: string, offreId: string, interested: boolean): Promise<InterestResult> {
  const supabase = createAdminClient();

  const { data: proposition, error: fetchErr } = await supabase
    .from("proposition_tokens")
    .select("interests, expires_at, request_id")
    .eq("token", token)
    .single();

  if (fetchErr || !proposition) return { ok: false, error: "Lien invalide." };
  if (new Date(proposition.expires_at).getTime() < Date.now()) {
    return { ok: false, error: "Ce lien a expiré." };
  }

  const wasInterested = !!(proposition.interests || {})[offreId];
  const newInterests: Record<string, boolean> = { ...(proposition.interests || {}) };
  if (interested) {
    newInterests[offreId] = true;
  } else {
    delete newInterests[offreId];
  }

  const { error } = await supabase
    .from("proposition_tokens")
    .update({ interests: newInterests })
    .eq("token", token);

  if (error) return { ok: false, error: error.message };

  // Notif admin uniquement quand le client devient nouvellement interesse (pas sur le untoggle)
  if (interested && !wasInterested) {
    try {
      const { data: offre } = await supabase
        .from("offres")
        .select("service_id, prestataire_id")
        .eq("id", offreId)
        .single();
      const [prestaRes, reqRes] = await Promise.all([
        offre?.prestataire_id
          ? supabase.from("prestataires").select("name").eq("id", offre.prestataire_id).single()
          : Promise.resolve({ data: null }),
        supabase.from("requests").select("client_name").eq("id", proposition.request_id).single(),
      ]);
      const service = offre?.service_id ? SERVICES.find((s) => s.id === offre.service_id) : null;
      await notifyAdminClientInterested({
        clientName: reqRes.data?.client_name || "Client",
        prestataireName: prestaRes.data?.name || "Prestataire",
        serviceLabel: service?.label || (offre?.service_id ?? ""),
        requestId: proposition.request_id,
        appUrl: getAppUrl(),
      });
    } catch (e) {
      console.error("[toggleInterest] Email notif admin echec :", e);
    }
  }

  return { ok: true };
}

export async function markOpened(token: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from("proposition_tokens")
    .update({ opened_at: new Date().toISOString() })
    .eq("token", token)
    .is("opened_at", null);
}
