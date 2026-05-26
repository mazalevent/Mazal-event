import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RequestDetail } from "@/components/admin/RequestDetail";
import type { EventType } from "@/lib/constants";
import type { Status } from "@/app/admin/requests/[id]/updateStatus";

export const dynamic = "force-dynamic";

export type FullRequest = {
  id: string;
  event_type: EventType | null;
  services: string[];
  status: Status;
  client_name: string | null;
  client_phone: string | null;
  client_email: string | null;
  region: string | null;
  created_at: string;
  forms_data: {
    common: Record<string, unknown>;
    services: Record<string, Record<string, unknown>>;
  } | null;
};

export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return <RequestDetail request={data as FullRequest} />;
}
