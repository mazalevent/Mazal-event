import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mazal Event — Trouvez vos prestataires d'événement en Israël",
  description: "Mariage, Bar Mitsva, Brit Mila... On sélectionne les bons prestataires pour vous. Service 100% gratuit, 3 propositions sur mesure sous 24h.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
