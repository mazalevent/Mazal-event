import { createAdminClient } from "@/lib/supabase/admin";
import { SERVICES, GOLD, DARK, MUTED } from "@/lib/constants";
import { PrestataireOfferForm } from "./PrestataireOfferForm";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ token: string }> };

type Invite = {
  token: string;
  request_id: string;
  service_id: string;
  prestataire_id: string | null;
  expires_at: string;
  used_at: string | null;
};

type RequestForOffer = {
  id: string;
  event_type: { id: string; label: string; emoji: string; desc: string } | null;
  region: string | null;
  forms_data: {
    common: Record<string, unknown>;
    services: Record<string, Record<string, unknown>>;
  } | null;
};

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#FDFAF4", padding: "32px 20px" }}>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div className="serif" style={{ fontSize: 22, fontWeight: 300, color: DARK }}>
            Mazal <em style={{ color: GOLD }}>Event</em>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function ErrorState({ title, desc }: { title: string; desc: string }) {
  return (
    <PageShell>
      <div style={{ background: "white", borderRadius: 20, padding: 40, textAlign: "center", border: "1.5px solid #EDE0C4" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 className="serif" style={{ fontSize: 24, fontWeight: 400, marginBottom: 8, color: DARK }}>{title}</h2>
        <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
      </div>
    </PageShell>
  );
}

export default async function PrestatairePage({ params }: PageProps) {
  const { token } = await params;

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur serveur";
    return <ErrorState title="Configuration incomplète" desc={msg} />;
  }

  const { data: invite } = await supabase
    .from("prestataire_invites")
    .select("token, request_id, service_id, prestataire_id, expires_at, used_at")
    .eq("token", token)
    .single<Invite>();

  if (!invite) {
    return <ErrorState title="Lien invalide" desc="Ce lien n'existe pas ou a été révoqué. Contactez Mazal Event si vous pensez qu'il s'agit d'une erreur." />;
  }

  if (new Date(invite.expires_at).getTime() < Date.now()) {
    return <ErrorState title="Lien expiré" desc="Ce lien d'invitation a expiré. Demandez à Mazal Event de vous en envoyer un nouveau." />;
  }

  if (invite.used_at) {
    return (
      <PageShell>
        <div style={{ background: "white", borderRadius: 20, padding: 40, textAlign: "center", border: "1.5px solid #EDE0C4" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <h2 className="serif" style={{ fontSize: 24, fontWeight: 400, marginBottom: 8, color: DARK }}>Offre déjà envoyée</h2>
          <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.6 }}>
            Vous avez déjà soumis votre offre pour cette demande le{" "}
            {new Date(invite.used_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}.
          </p>
        </div>
      </PageShell>
    );
  }

  const { data: request } = await supabase
    .from("requests")
    .select("id, event_type, region, forms_data")
    .eq("id", invite.request_id)
    .single<RequestForOffer>();

  if (!request) {
    return <ErrorState title="Demande introuvable" desc="La demande client associée à ce lien est introuvable." />;
  }

  const service = SERVICES.find((s) => s.id === invite.service_id);
  if (!service) {
    return <ErrorState title="Prestation inconnue" desc="La prestation ciblée par ce lien n'existe plus." />;
  }

  return (
    <PrestataireOfferForm
      token={invite.token}
      service={service}
      eventType={request.event_type}
      region={request.region}
      commonData={request.forms_data?.common || {}}
      serviceData={request.forms_data?.services?.[invite.service_id] || {}}
    />
  );
}
