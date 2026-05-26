"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateInviteToken } from "@/lib/tokens";

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
    .select("email")
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
  return { ok: true, token };
}

export async function deleteInvite(token: string, requestId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("prestataire_invites").delete().eq("token", token);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/requests/" + requestId);
  return { ok: true };
}
