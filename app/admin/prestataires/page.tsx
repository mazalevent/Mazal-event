import { createClient } from "@/lib/supabase/server";
import { PrestataireListClient, type PrestataireRow } from "./PrestataireListClient";

export const dynamic = "force-dynamic";

export default async function PrestatairesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prestataires")
    .select("id, name, email, phone, services, region, notes, created_at")
    .order("created_at", { ascending: false });

  return <PrestataireListClient prestataires={(data as PrestataireRow[]) || []} error={error?.message} />;
}
