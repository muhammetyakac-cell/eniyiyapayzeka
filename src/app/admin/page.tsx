import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <p className="text-muted-foreground mb-6">
        Hoş geldin, {session.user.name || "Admin"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/api/cron/fetch-and-enrich"
          className="rounded-lg border p-6 hover:border-primary/50 transition-colors"
        >
          <h2 className="font-semibold">Manuel Veri Çekme</h2>
          <p className="text-sm text-muted-foreground mt-2">
            GitHub ve HuggingFace&apos;ten yeni araçları çek ve zenginleştir.
          </p>
        </a>
      </div>
    </div>
  );
}
