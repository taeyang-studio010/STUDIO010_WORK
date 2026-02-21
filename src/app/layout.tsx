import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STUDIO 010 · 협업 워크스페이스",
  description: "Track A (STUDIO 010) & Track B (Let's Comfy) 통합 협업 허브",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="antialiased">
      <body className="min-h-screen bg-[#0a0a0a] text-white font-sans">
        {children}
      </body>
    </html>
  );
}
