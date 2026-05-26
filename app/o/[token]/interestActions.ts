"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type InterestResult = { ok: true } | { ok: false; error: string };

export async function toggleInterest(token: string, offreId: string, interested: boolean): Promise<InterestResult> {
  const supabase = createAdminClient();

  const { data: proposition, error: fetchErr } = await supabase
    .from("proposition_tokens")
    .select("interests, expires_at")
    .eq("token", token)
    .single();

  if (fetchErr || !proposition) return { ok: false, error: "Lien invalide." };
  if (new Date(proposition.expires_at).getTime() < Date.now()) {
    return { ok: false, error: "Ce lien a expiré." };
  }

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
  return { ok: true };
}

export async function markOpened(token: string): Promise<void> {
  const supabase = createAdminClient();
  // Only set opened_at if it's null (don't overwrite the first open)
  await supabase
    .from("proposition_tokens")
    .update({ opened_at: new Date().toISOString() })
    .eq("token", token)
    .is("opened_at", null);
}
