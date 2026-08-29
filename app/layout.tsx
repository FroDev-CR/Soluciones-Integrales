import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./work-showcase.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://soluciones-six.vercel.app"),
  title: "Soluciones Integrales | Costa Rica",
  description:
    "Gas, agua, fontanería, jardinería, estructuras y construcción con un solo equipo.",
  openGraph: {
    title: "Soluciones Integrales",
    description: "Un solo equipo. Todo resuelto.",
    url: "https://soluciones-six.vercel.app",
    siteName: "Soluciones Integrales",
    locale: "es_CR",
    type: "website",
    images: [{ url: "/og.png", width: 1672, height: 941, alt: "Soluciones Integrales" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Soluciones Integrales",
    description: "Un solo equipo. Todo resuelto.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
