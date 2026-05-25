import { createClient } from "@/lib/supabase/server";
import { RequestList, type RequestRow } from "@/components/admin/RequestList";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requests")
    .select("id, event_type, services, status, client_name, client_phone, client_email, region, created_at")
    .order("created_at", { ascending: false });

  return <RequestList requests={(data as RequestRow[]) || []} error={error?.message} />;
}
