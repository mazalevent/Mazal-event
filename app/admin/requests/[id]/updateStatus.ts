"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Status = "Nouveau" | "En selection" | "Propositions envoyees";

export async function updateStatus(id: string, status: Status) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("requests")
    .update({ status })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/requests/" + id);
  revalidatePath("/admin");
  return { ok: true };
}
