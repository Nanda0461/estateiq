import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";
import { AIChatbot } from "@/components/ai-chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EstateIQ — AI Powered Real Estate Intelligence Platform",
  description:
    "EstateIQ is an AI-powered real estate intelligence platform. Browse, search, and manage properties with AI recommendations, price predictions, and neighborhood analysis.",
  keywords: ["real estate", "properties", "buy", "rent", "sell", "AI recommendations", "EstateIQ"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 antialiased`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors position="top-right" />
          <AIChatbot />
        </Providers>
      </body>
    </html>
  );
}
