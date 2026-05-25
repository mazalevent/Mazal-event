"use server";

import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();
  const email = payload.formsData.common.email;
  const clientEmail = typeof email === "string" && email.trim() !== "" ? email.trim() : null;

  // Pas de .select() ici : l'anon n'a pas le droit de relire (RLS), on ne renvoie pas l'id
  const { error } = await supabase
    .from("requests")
    .insert({
      event_type: payload.eventType,
      services: payload.services,
      forms_data: payload.formsData,
      client_email: clientEmail,
    });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
