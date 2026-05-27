"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidEmail, isValidIsraeliPhone } from "@/lib/validation";
import { notifyAdminNewRequest, getAppUrl } from "@/lib/email";
import { SERVICES, type EventType } from "@/lib/constants";
import type { FormsData } from "@/components/client/FormsOrchestrator";

type SubmitPayload = {
  eventType: EventType;
  services: string[];
  formsData: FormsData;
};

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitRequest(payload: SubmitPayload): Promise<SubmitResult> {
  const common = payload.formsData.common;

  const name  = typeof common.name  === "string" ? common.name.trim()  : "";
  const phone = typeof common.phone === "string" ? common.phone.trim() : "";
  const email = typeof common.email === "string" ? common.email.trim() : "";

  if (!name)  return { ok: false, error: "Le nom est requis." };
  if (!phone) return { ok: false, error: "Le téléphone est requis." };
  if (!isValidIsraeliPhone(phone)) {
    return { ok: false, error: "Numéro de téléphone non valide. Format attendu : 050 123 4567." };
  }
  if (!email) return { ok: false, error: "L'email est requis." };
  if (!isValidEmail(email)) {
    return { ok: false, error: "Email non valide." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("requests")
    .insert({
      event_type: payload.eventType,
      services: payload.services,
      forms_data: payload.formsData,
      client_email: email,
    });

  if (error) return { ok: false, error: error.message };

  // Notif admin best-effort (ne bloque pas le retour client en cas d'echec)
  try {
    const adminClient = createAdminClient();
    const { data: latest } = await adminClient
      .from("requests")
      .select("id")
      .eq("client_email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    const region = typeof common.region === "string" ? common.region : null;
    const serviceLabels = payload.services.map((sid) => {
      const s = SERVICES.find((x) => x.id === sid);
      return s ? s.emoji + " " + s.label : sid;
    });
    await notifyAdminNewRequest({
      clientName: name,
      clientPhone: phone,
      clientEmail: email,
      eventLabel: payload.eventType.label,
      services: serviceLabels,
      region,
      requestId: latest?.id ?? "",
      appUrl: getAppUrl(),
    });
  } catch (e) {
    console.error("[submitRequest] Email notif admin echec :", e);
  }

  return { ok: true };
}
