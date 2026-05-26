"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type PrestataireInput = {
  name: string;
  email: string | null;
  phone: string | null;
  services: string[];
  region: string | null;
  notes: string | null;
};

export type Result = { ok: true; id?: string } | { ok: false; error: string };

export async function createPrestataire(input: PrestataireInput): Promise<Result> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié." };
  if (!input.name.trim()) return { ok: false, error: "Le nom est requis." };

  const { data, error } = await supabase
    .from("prestataires")
    .insert({
      name: input.name.trim(),
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      services: input.services,
      region: input.region?.trim() || null,
      notes: input.notes?.trim() || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/prestataires");
  return { ok: true, id: data.id };
}

export async function updatePrestataire(id: string, input: PrestataireInput): Promise<Result> {
  const supabase = await createClient();
  if (!input.name.trim()) return { ok: false, error: "Le nom est requis." };

  const { error } = await supabase
    .from("prestataires")
    .update({
      name: input.name.trim(),
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      services: input.services,
      region: input.region?.trim() || null,
      notes: input.notes?.trim() || null,
    })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/prestataires");
  return { ok: true };
}

export async function deletePrestataire(id: string): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.from("prestataires").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/prestataires");
  return { ok: true };
}
