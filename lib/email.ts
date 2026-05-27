import { Resend } from "resend";

// Singleton Resend client. Lazy pour ne pas exiger la cle a l import.
let _resend: Resend | null = null;
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!_resend) _resend = new Resend(key);
  return _resend;
}

const FROM = process.env.RESEND_FROM_EMAIL || "Mazal Event <onboarding@resend.dev>";
const ADMIN = process.env.ADMIN_NOTIFICATION_EMAIL || "";

// Wrapper bas niveau. Best-effort : echec n empeche pas l action metier.
async function sendEmail(opts: { to: string | string[]; subject: string; html: string }): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY absent, email non envoye :", opts.subject);
    return;
  }
  try {
    const res = await resend.emails.send({ from: FROM, to: opts.to, subject: opts.subject, html: opts.html });
    if (res.error) console.error("[email] Resend error :", res.error);
  } catch (e) {
    console.error("[email] Exception :", e);
  }
}

// ============================================================
// Templates HTML
// ============================================================

const styles = {
  body: `font-family:'Jost',-apple-system,BlinkMacSystemFont,sans-serif;background:#FDFAF4;color:#1A1208;padding:40px 20px;margin:0`,
  container: `max-width:560px;margin:0 auto;background:white;border-radius:20px;padding:40px 32px;border:1.5px solid rgba(201,168,76,.15);box-shadow:0 4px 30px rgba(0,0,0,.04)`,
  brand: `text-align:center;margin-bottom:32px;font-size:22px;font-weight:300;letter-spacing:0`,
  brandEm: `color:#C9A84C;font-style:italic;font-family:'Cormorant Garamond',serif;font-weight:400`,
  h1: `font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:300;color:#1A1208;margin:0 0 16px 0;line-height:1.2`,
  h1Em: `color:#C9A84C;font-style:italic`,
  p: `color:#1A1208;font-size:15px;line-height:1.7;margin:0 0 16px 0`,
  muted: `color:#8B7355;font-size:14px;line-height:1.6`,
  button: `display:inline-block;background:linear-gradient(135deg,#C9A84C,#E8C97A);color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:500;font-size:15px`,
  card: `background:#FDF8EE;border-radius:14px;padding:16px 20px;margin:16px 0;border:1px solid rgba(201,168,76,.15)`,
  divider: `border:none;border-top:1px solid rgba(201,168,76,.15);margin:24px 0`,
  footer: `text-align:center;color:#8B7355;font-size:11px;margin-top:24px;padding-top:24px;border-top:1px solid rgba(201,168,76,.15)`,
};

function wrap(content: string): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${styles.body}">
  <div style="${styles.container}">
    <div style="${styles.brand}">Mazal <span style="${styles.brandEm}">Event</span></div>
    ${content}
    <div style="${styles.footer}">Mazal Event &mdash; Organisation d'événements en Israël</div>
  </div>
</body></html>`;
}

// ============================================================
// Templates publics
// ============================================================

export async function sendPrestataireInvite(opts: {
  toEmail: string;
  prestataireName: string;
  eventLabel: string;
  serviceLabel: string;
  region: string | null;
  eventDate: string | null;
  url: string;
}): Promise<void> {
  const dateStr = opts.eventDate
    ? new Date(opts.eventDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
    : null;
  const html = wrap(`
    <h1 style="${styles.h1}">Bonjour ${escapeHtml(opts.prestataireName)},</h1>
    <p style="${styles.p}">Nous avons un nouveau client qui recherche un <strong>${escapeHtml(opts.serviceLabel.toLowerCase())}</strong> pour son <strong>${escapeHtml(opts.eventLabel.toLowerCase())}</strong>.</p>
    <div style="${styles.card}">
      ${opts.region ? `<div style="margin-bottom:6px"><strong>Région :</strong> ${escapeHtml(opts.region)}</div>` : ""}
      ${dateStr ? `<div><strong>Date :</strong> ${escapeHtml(dateStr)}</div>` : ""}
    </div>
    <p style="${styles.p}">Cliquez sur le bouton ci-dessous pour voir les détails de la demande et envoyer votre offre :</p>
    <p style="text-align:center;margin:32px 0"><a href="${opts.url}" style="${styles.button}">Voir la demande &amp; envoyer mon offre</a></p>
    <hr style="${styles.divider}">
    <p style="${styles.muted}">Si le bouton ne fonctionne pas, copiez ce lien : <br><span style="word-break:break-all;color:#C9A84C">${opts.url}</span></p>
  `);
  await sendEmail({ to: opts.toEmail, subject: "Mazal Event — Nouvelle demande pour vous", html });
}

export async function sendClientProposition(opts: {
  toEmail: string;
  clientName: string | null;
  eventLabel: string;
  url: string;
  offerCount: number;
}): Promise<void> {
  const greeting = opts.clientName ? `Bonjour ${escapeHtml(opts.clientName)},` : "Bonjour,";
  const html = wrap(`
    <h1 style="${styles.h1}">${greeting}</h1>
    <p style="${styles.p}">Vos propositions sont prêtes ! Nous avons sélectionné <strong>${opts.offerCount} offre${opts.offerCount > 1 ? "s" : ""}</strong> pour votre <strong>${escapeHtml(opts.eventLabel.toLowerCase())}</strong>.</p>
    <p style="text-align:center;margin:32px 0"><a href="${opts.url}" style="${styles.button}">Voir mes <em style="${styles.h1Em}">propositions</em></a></p>
    <p style="${styles.p}">Vous pouvez consulter chaque offre en détail et cliquer sur « Je suis intéressé(e) » pour celles qui vous parlent.</p>
    <hr style="${styles.divider}">
    <p style="${styles.muted}">Si le bouton ne fonctionne pas, copiez ce lien : <br><span style="word-break:break-all;color:#C9A84C">${opts.url}</span></p>
  `);
  await sendEmail({ to: opts.toEmail, subject: "Mazal Event — Vos propositions sont prêtes", html });
}

// ============================================================
// Notifications admin
// ============================================================

async function notifyAdmin(subject: string, html: string): Promise<void> {
  if (!ADMIN) {
    console.warn("[email] ADMIN_NOTIFICATION_EMAIL absent, notif admin non envoyee :", subject);
    return;
  }
  await sendEmail({ to: ADMIN, subject: "[Admin] " + subject, html: wrap(html) });
}

export async function notifyAdminNewRequest(opts: {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  eventLabel: string;
  services: string[];
  region: string | null;
  requestId: string;
  appUrl: string;
}): Promise<void> {
  const html = `
    <h1 style="${styles.h1}">Nouvelle demande</h1>
    <div style="${styles.card}">
      <div><strong>Client :</strong> ${escapeHtml(opts.clientName)}</div>
      <div><strong>Téléphone :</strong> ${escapeHtml(opts.clientPhone)}</div>
      <div><strong>Email :</strong> ${escapeHtml(opts.clientEmail)}</div>
      <div><strong>Événement :</strong> ${escapeHtml(opts.eventLabel)}</div>
      ${opts.region ? `<div><strong>Région :</strong> ${escapeHtml(opts.region)}</div>` : ""}
      <div><strong>Prestations :</strong> ${opts.services.map((s) => escapeHtml(s)).join(", ")}</div>
    </div>
    <p style="text-align:center;margin:24px 0"><a href="${opts.appUrl}/admin/requests/${opts.requestId}" style="${styles.button}">Voir la demande</a></p>
  `;
  await notifyAdmin("Nouvelle demande — " + opts.clientName, html);
}

export async function notifyAdminNewOffer(opts: {
  prestataireName: string;
  serviceLabel: string;
  clientName: string;
  prix: number | null;
  requestId: string;
  appUrl: string;
}): Promise<void> {
  const html = `
    <h1 style="${styles.h1}">Nouvelle offre reçue</h1>
    <div style="${styles.card}">
      <div><strong>Prestataire :</strong> ${escapeHtml(opts.prestataireName)}</div>
      <div><strong>Prestation :</strong> ${escapeHtml(opts.serviceLabel)}</div>
      <div><strong>Pour :</strong> ${escapeHtml(opts.clientName)}</div>
      ${opts.prix != null ? `<div><strong>Prix :</strong> ${opts.prix} NIS</div>` : ""}
    </div>
    <p style="text-align:center;margin:24px 0"><a href="${opts.appUrl}/admin/requests/${opts.requestId}" style="${styles.button}">Voir la demande</a></p>
  `;
  await notifyAdmin("Nouvelle offre — " + opts.prestataireName, html);
}

export async function notifyAdminClientInterested(opts: {
  clientName: string;
  prestataireName: string;
  serviceLabel: string;
  requestId: string;
  appUrl: string;
}): Promise<void> {
  const html = `
    <h1 style="${styles.h1}">Client intéressé&nbsp;!</h1>
    <p style="${styles.p}"><strong>${escapeHtml(opts.clientName)}</strong> est intéressé(e) par l'offre <strong>${escapeHtml(opts.prestataireName)}</strong> pour <strong>${escapeHtml(opts.serviceLabel)}</strong>.</p>
    <p style="text-align:center;margin:24px 0"><a href="${opts.appUrl}/admin/requests/${opts.requestId}" style="${styles.button}">Voir la demande</a></p>
  `;
  await notifyAdmin("Client intéressé — " + opts.clientName, html);
}

// ============================================================
// Utils
// ============================================================

function escapeHtml(s: string | null | undefined): string {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "https://mazal-event.vercel.app";
}
