import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "katex/dist/katex.min.css";
import { AppShell } from "@/components/AppShell";
import { StudentProvider } from "@/components/StudentProvider";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "Physics Tutor",
  description: "A class-wise physics teacher for Classes 1 to 12, with checked calculations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${fraunces.variable}`} data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        <StudentProvider>
          <AppShell>{children}</AppShell>
        </StudentProvider>
      </body>
    </html>
  );
}
