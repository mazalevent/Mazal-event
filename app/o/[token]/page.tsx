import { createAdminClient } from "@/lib/supabase/admin";
import { SERVICES, GOLD, DARK, MUTED } from "@/lib/constants";
import { ClientPropositionView } from "./ClientPropositionView";
import { markOpened } from "./interestActions";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ token: string }> };

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#FDFAF4", padding: "32px 20px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
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

export default async function PropositionPage({ params }: PageProps) {
  const { token } = await params;

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (e) {
    return <ErrorState title="Configuration incomplète" desc={e instanceof Error ? e.message : "Erreur serveur"} />;
  }

  const { data: proposition } = await supabase
    .from("proposition_tokens")
    .select("token, request_id, offre_ids, expires_at, interests")
    .eq("token", token)
    .single<{ token: string; request_id: string; offre_ids: string[]; expires_at: string; interests: Record<string, boolean> | null }>();

  if (!proposition) {
    return <ErrorState title="Lien invalide" desc="Ce lien n'existe pas ou a été révoqué." />;
  }

  if (new Date(proposition.expires_at).getTime() < Date.now()) {
    return <ErrorState title="Lien expiré" desc="Ce lien a expiré. Demandez à Mazal Event d'en générer un nouveau." />;
  }

  // Fetch en parallele : la demande + les offres choisies + les prestataires correspondants
  const { data: request } = await supabase
    .from("requests")
    .select("id, event_type, client_name, region, forms_data")
    .eq("id", proposition.request_id)
    .single<{ id: string; event_type: { id: string; label: string; emoji: string; desc: string } | null; client_name: string | null; region: string | null; forms_data: { common: Record<string, unknown> } | null }>();

  const { data: offres } = await supabase
    .from("offres")
    .select("id, service_id, prix, description, dispo, delai, note, prestataire_id")
    .in("id", proposition.offre_ids);

  if (!request || !offres || offres.length === 0) {
    return <ErrorState title="Proposition vide" desc="Cette proposition ne contient plus d'offres." />;
  }

  const prestataireIds = Array.from(new Set(offres.map((o) => o.prestataire_id).filter(Boolean) as string[]));
  const { data: prestataires } = prestataireIds.length > 0
    ? await supabase.from("prestataires").select("id, name").in("id", prestataireIds)
    : { data: [] as { id: string; name: string }[] };

  // Marque ouverture (non bloquant)
  markOpened(token).catch(() => {});

  // Groupe les offres par service
  const offresByService: Record<string, typeof offres> = {};
  for (const o of offres) {
    if (!offresByService[o.service_id]) offresByService[o.service_id] = [];
    offresByService[o.service_id].push(o);
  }

  const services = SERVICES.filter((s) => offresByService[s.id]?.length > 0);

  return (
    <ClientPropositionView
      token={token}
      clientName={request.client_name}
      eventType={request.event_type}
      region={request.region}
      services={services}
      offresByService={offresByService}
      prestataires={prestataires || []}
      initialInterests={proposition.interests || {}}
    />
  );
}
