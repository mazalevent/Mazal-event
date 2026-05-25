"use client";

import { useActionState } from "react";
import { GOLD, MUTED } from "@/lib/constants";
import { signIn, type LoginState } from "./actions";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(signIn, {});

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "radial-gradient(ellipse at 20% 50%,#f0e8d0 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,#ede0c4 0%,transparent 50%),#FDFAF4" }}>
      <div style={{ background: "white", borderRadius: 24, padding: 40, maxWidth: 400, width: "100%", boxShadow: "0 8px 40px rgba(0,0,0,.08)", border: "1.5px solid rgba(201,168,76,.15)" }}>
        <h1 className="serif" style={{ fontSize: 32, fontWeight: 300, marginBottom: 8, textAlign: "center" }}>
          Espace <em style={{ color: GOLD }}>Admin</em>
        </h1>
        <p style={{ color: MUTED, fontSize: 14, textAlign: "center", marginBottom: 32 }}>Mazal Event</p>

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {next && <input type="hidden" name="next" value={next} />}

          <div>
            <label className="lbl" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="inp"
              placeholder="admin@mazalevent.com"
            />
          </div>

          <div>
            <label className="lbl" htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="inp"
            />
          </div>

          {state.error && (
            <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 12, padding: "10px 14px", color: "#991B1B", fontSize: 13 }}>
              {state.error}
            </div>
          )}

          <button type="submit" className="btn-gold" disabled={pending} style={{ marginTop: 8 }}>
            {pending ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
