"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generatePropositionToken } from "@/lib/tokens";

export type SendResult =
  | { ok: true; token: string }
  | { ok: false; error: string };

export async function createProposition(
  requestId: string,
  offreIds: string[]
): Promise<SendResult> {
  if (offreIds.length === 0) {
    return { ok: false, error: "Sélectionnez au moins une offre." };
  }

  const supabase = await createClient();
  const token = generatePropositionToken();

  const { error } = await supabase
    .from("proposition_tokens")
    .insert({
      token,
      request_id: requestId,
      offre_ids: offreIds,
    });

  if (error) return { ok: false, error: error.message };

  // Mettre la demande en statut "Propositions envoyees"
  await supabase
    .from("requests")
    .update({ status: "Propositions envoyees" })
    .eq("id", requestId);

  revalidatePath("/admin/requests/" + requestId);
  return { ok: true, token };
}

export async function deleteProposition(token: string, requestId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("proposition_tokens").delete().eq("token", token);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/requests/" + requestId);
  return { ok: true };
}
