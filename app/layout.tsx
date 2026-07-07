import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pasapalabra — El Rosco",
  description: "El clásico juego del rosco: 27 letras, una palabra por letra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
