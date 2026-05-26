import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Route appelee par le cron Vercel (vercel.json) tous les jours.
// Supprime les invitations prestataires et les propositions client expirees.
//
// Le cron Vercel envoie un header `Authorization: Bearer ${CRON_SECRET}` automatiquement.
// On le verifie pour eviter qu'une URL publique puisse trigger la suppression.

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const expected = "Bearer " + (process.env.CRON_SECRET || "");
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }

  const now = new Date().toISOString();

  const invitesRes = await supabase
    .from("prestataire_invites")
    .delete()
    .lt("expires_at", now)
    .select("token");

  const propositionsRes = await supabase
    .from("proposition_tokens")
    .delete()
    .lt("expires_at", now)
    .select("token");

  return NextResponse.json({
    ok: true,
    at: now,
    deleted: {
      invites: invitesRes.data?.length ?? 0,
      propositions: propositionsRes.data?.length ?? 0,
    },
    errors: {
      invites: invitesRes.error?.message ?? null,
      propositions: propositionsRes.error?.message ?? null,
    },
  });
}
