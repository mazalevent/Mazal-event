import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GOLD, MUTED } from "@/lib/constants";
import { signOut } from "./login/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Pas de header sur la page login (user n'est pas connecte la-bas, le proxy ne le bloque pas non plus)
  if (!user) return <>{children}</>;

  return (
    <>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid rgba(201,168,76,.15)", background: "rgba(253,250,244,.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="serif" style={{ fontSize: 22, fontWeight: 300 }}>
            Mazal <em style={{ color: GOLD }}>Admin</em>
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: MUTED }}>{user.email}</span>
          <form action={signOut}>
            <button
              type="submit"
              style={{ background: "none", border: "1.5px solid rgba(201,168,76,.4)", color: MUTED, borderRadius: 50, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "'Jost',sans-serif" }}
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </header>
      {children}
    </>
  );
}
