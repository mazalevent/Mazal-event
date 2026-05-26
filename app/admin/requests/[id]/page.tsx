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

export type PrestataireLite = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  services: string[];
  region: string | null;
};

export type InviteRow = {
  token: string;
  service_id: string;
  prestataire_id: string | null;
  email_sent_to: string | null;
  created_at: string;
  used_at: string | null;
};

export type OffreRow = {
  id: string;
  service_id: string;
  prix: number | null;
  description: string | null;
  dispo: string | null;
  delai: string | null;
  note: string | null;
  received_at: string;
  prestataire_id: string | null;
  invite_token: string | null;
  selected_for_client: boolean;
};

export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [requestRes, prestatairesRes, invitesRes, offresRes] = await Promise.all([
    supabase.from("requests").select("*").eq("id", id).single(),
    supabase.from("prestataires").select("id, name, email, phone, services, region"),
    supabase.from("prestataire_invites").select("token, service_id, prestataire_id, email_sent_to, created_at, used_at").eq("request_id", id),
    supabase.from("offres").select("id, service_id, prix, description, dispo, delai, note, received_at, prestataire_id, invite_token, selected_for_client").eq("request_id", id),
  ]);

  if (requestRes.error || !requestRes.data) notFound();

  return (
    <RequestDetail
      request={requestRes.data as FullRequest}
      prestataires={(prestatairesRes.data as PrestataireLite[]) || []}
      invites={(invitesRes.data as InviteRow[]) || []}
      offres={(offresRes.data as OffreRow[]) || []}
    />
  );
}
