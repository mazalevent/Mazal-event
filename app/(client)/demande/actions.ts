"use server";

import { createClient } from "@/lib/supabase/server";
import { isValidEmail, isValidIsraeliPhone } from "@/lib/validation";
import type { EventType } from "@/lib/constants";
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

  // Pas de .select() ici : l'anon n'a pas le droit de relire (RLS), on ne renvoie pas l'id
  const { error } = await supabase
    .from("requests")
    .insert({
      event_type: payload.eventType,
      services: payload.services,
      forms_data: payload.formsData,
      client_email: email,
    });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
