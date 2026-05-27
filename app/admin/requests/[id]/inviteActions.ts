"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateInviteToken } from "@/lib/tokens";
import { sendPrestataireInvite, getAppUrl } from "@/lib/email";
import { SERVICES } from "@/lib/constants";

export type InviteResult =
  | { ok: true; token: string }
  | { ok: false; error: string };

export async function createInvite(
  requestId: string,
  serviceId: string,
  prestataireId: string
): Promise<InviteResult> {
  const supabase = await createClient();

  const { data: presta, error: pErr } = await supabase
    .from("prestataires")
    .select("name, email")
    .eq("id", prestataireId)
    .single();
  if (pErr) return { ok: false, error: pErr.message };

  const token = generateInviteToken();
  const { error } = await supabase
    .from("prestataire_invites")
    .insert({
      token,
      request_id: requestId,
      service_id: serviceId,
      prestataire_id: prestataireId,
      email_sent_to: presta?.email ?? null,
    });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/requests/" + requestId);

  // Envoi email prestataire en best-effort (ne bloque pas la creation)
  if (presta?.email) {
    try {
      const { data: req } = await supabase
        .from("requests")
        .select("event_type, region, forms_data")
        .eq("id", requestId)
        .single();
      const eventLabel = (req?.event_type as { label?: string } | null)?.label || "événement";
      const service = SERVICES.find((s) => s.id === serviceId);
      const eventDate = (req?.forms_data as { common?: { date?: string } } | null)?.common?.date || null;
      await sendPrestataireInvite({
        toEmail: presta.email,
        prestataireName: presta.name || "Prestataire",
        eventLabel,
        serviceLabel: service?.label || serviceId,
        region: req?.region ?? null,
        eventDate,
        url: getAppUrl() + "/p/" + token,
      });
    } catch (e) {
      console.error("[createInvite] Email prestataire echec :", e);
    }
  }

  return { ok: true, token };
}

export async function deleteInvite(token: string, requestId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("prestataire_invites").delete().eq("token", token);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/requests/" + requestId);
  return { ok: true };
}
