import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mazal Event — Organisation d'événements en Israël",
  description: "Mariage, Bar Mitsva, Brit Mila... On sélectionne les bons prestataires pour vous.",
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
