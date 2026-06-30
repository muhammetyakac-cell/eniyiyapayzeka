"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  slug: string;
  nameTr: string;
}

interface Tool {
  id: string;
  slug: string;
  name: string;
  descriptionTr: string | null;
  websiteUrl: string | null;
  githubUrl: string | null;
  pricingModel: string;
  hardwareReq: string | null;
  bestFor: string | null;
  featured: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  useCases: string[];
  categories: { category: { id: string; nameTr: string } }[];
}

interface AdminDashboardProps {
  initialTools: Tool[];
  categories: Category[];
  stats: {
    totalTools: number;
    totalCategories: number;
    totalFeatured: number;
  };
}

export function AdminDashboard({ initialTools, categories, stats }: AdminDashboardProps) {
  const router = useRouter();
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [isPending, startTransition] = useTransition();

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [pricingModel, setPricingModel] = useState("FREE");
  const [descriptionTr, setDescriptionTr] = useState("");
  const [hardwareReq, setHardwareReq] = useState("");
  const [bestFor, setBestFor] = useState("");
  const [useCasesText, setUseCasesText] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Cron trigger states
  const [cronLoading, setCronLoading] = useState(false);
  const [cronResult, setCronResult] = useState<string | null>(null);

  // Open modal for adding a new tool
  const handleAddNew = () => {
    setEditingTool(null);
    setName("");
    setWebsiteUrl("");
    setGithubUrl("");
    setPricingModel("FREE");
    setDescriptionTr("");
    setHardwareReq("");
    setBestFor("");
    setUseCasesText("");
    setMetaTitle("");
    setMetaDescription("");
    setFeatured(false);
    setSelectedCategories([]);
    setError(null);
    setModalOpen(true);
  };

  // Open modal for editing a tool
  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setName(tool.name);
    setWebsiteUrl(tool.websiteUrl || "");
    setGithubUrl(tool.githubUrl || "");
    setPricingModel(tool.pricingModel);
    setDescriptionTr(tool.descriptionTr || "");
    setHardwareReq(tool.hardwareReq || "");
    setBestFor(tool.bestFor || "");
    setUseCasesText(tool.useCases.join(", "));
    setMetaTitle(tool.metaTitle || "");
    setMetaDescription(tool.metaDescription || "");
    setFeatured(tool.featured);
    setSelectedCategories(tool.categories.map((tc) => tc.category.id));
    setError(null);
    setModalOpen(true);
  };

  // Handle submit (save or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Araç ismi zorunludur.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      id: editingTool?.id,
      name,
      websiteUrl,
      githubUrl,
      descriptionTr,
      pricingModel,
      hardwareReq,
      bestFor,
      useCases: useCasesText.split(",").map((s) => s.trim()).filter(Boolean),
      metaTitle,
      metaDescription,
      featured,
      categoryIds: selectedCategories,
    };

    try {
      const res = await fetch("/api/admin/tools", {
        method: editingTool ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "İşlem başarısız oldu.");
      }

      setModalOpen(false);
      
      // Refresh local list and server data
      startTransition(() => {
        router.refresh();
      });
      
      // Temporary reload local state for quick feedback
      if (editingTool) {
        setTools((prev) =>
          prev.map((t) =>
            t.id === editingTool.id
              ? {
                  ...t,
                  name,
                  websiteUrl: websiteUrl || null,
                  githubUrl: githubUrl || null,
                  descriptionTr: descriptionTr || null,
                  pricingModel,
                  hardwareReq: hardwareReq || null,
                  bestFor: bestFor || null,
                  useCases: useCasesText.split(",").map((s) => s.trim()).filter(Boolean),
                  metaTitle: metaTitle || null,
                  metaDescription: metaDescription || null,
                  featured,
                  categories: selectedCategories.map((id) => ({
                    category: { id, nameTr: categories.find((c) => c.id === id)?.nameTr || "" },
                  })),
                }
              : t
          )
        );
      } else {
        // Force refresh page to pull new list item
        window.location.reload();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Bu aracı silmek istediğinizden emin misiniz?")) return;

    try {
      const res = await fetch(`/api/admin/tools?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Silme işlemi başarısız.");
      }

      setTools((prev) => prev.filter((t) => t.id !== id));
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Silme işlemi sırasında hata.");
    }
  };

  // Trigger Cron Job manually
  const handleCronTrigger = async () => {
    setCronLoading(true);
    setCronResult(null);
    try {
      const res = await fetch("/api/cron/fetch-and-enrich");
      const data = await res.json();
      setCronResult(JSON.stringify(data.results || data, null, 2));
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setCronResult("Hata: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setCronLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">
              Toplam Araç sayısı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-extrabold">{stats.totalTools}</span>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">
              Kategoriler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-extrabold">{stats.totalCategories}</span>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">
              Öne Çıkan Araçlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-extrabold">{stats.totalFeatured}</span>
          </CardContent>
        </Card>
      </div>

      {/* Main Admin Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Veritabanı Araçları</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleAddNew}
            className="flex-1 sm:flex-initial inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all cursor-pointer"
          >
            ➕ Yeni Araç Ekle
          </button>
          <button
            onClick={handleCronTrigger}
            disabled={cronLoading}
            className="flex-1 sm:flex-initial inline-flex h-10 items-center justify-center rounded-xl border bg-background/50 px-5 text-sm font-semibold hover:bg-accent/80 transition-all disabled:opacity-50 cursor-pointer"
          >
            🔄 {cronLoading ? "Çalışıyor..." : "Manuel Cron Tetikle"}
          </button>
        </div>
      </div>

      {cronResult && (
        <Card className="p-4 bg-muted/30 border font-mono text-xs overflow-x-auto max-h-60">
          <pre>{cronResult}</pre>
        </Card>
      )}

      {/* Tools Table */}
      <Card className="glass border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left p-4 font-semibold text-muted-foreground">İsim</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Fiyatlandırma</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Öne Çıkan</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Kategoriler</th>
                <th className="text-right p-4 font-semibold text-muted-foreground">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tools.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Veritabanında henüz araç bulunmuyor.
                  </td>
                </tr>
              ) : (
                tools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-accent/30 transition-colors">
                    <td className="p-4 font-bold">
                      <a
                        href={`/araclar/${tool.slug}`}
                        target="_blank"
                        className="hover:underline text-primary"
                      >
                        {tool.name}
                      </a>
                    </td>
                    <td className="p-4">
                      <Badge className="text-[10px] font-semibold">{tool.pricingModel}</Badge>
                    </td>
                    <td className="p-4">
                      {tool.featured ? (
                        <span className="text-green-600 font-bold">Evet</span>
                      ) : (
                        <span className="text-muted-foreground">Hayır</span>
                      )}
                    </td>
                    <td className="p-4 truncate max-w-[200px]">
                      {tool.categories.map((tc) => tc.category.nameTr).join(", ") || "—"}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(tool)}
                        className="inline-flex h-8 items-center justify-center rounded-lg border px-3 text-xs font-semibold hover:bg-accent cursor-pointer"
                      >
                        ✏️ Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(tool.id)}
                        className="inline-flex h-8 items-center justify-center rounded-lg border border-destructive/30 text-destructive px-3 text-xs font-semibold hover:bg-destructive/10 cursor-pointer"
                      >
                        🗑️ Sil
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-card border rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold">
                {editingTool ? `${editingTool.name} Düzenle` : "Yeni Yapay Zeka Aracı Ekle"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold"
              >
                ✕ Kapat
              </button>
            </div>

            {error && (
              <div className="p-3 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded-xl">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Araç İsmi *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                    required
                  />
                </div>

                {/* Pricing Model */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Fiyatlandırma Modeli</label>
                  <select
                    value={pricingModel}
                    onChange={(e) => setPricingModel(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border bg-background/50 focus:border-primary outline-none text-sm appearance-none"
                  >
                    <option value="FREE">Ücretsiz</option>
                    <option value="FREEMIUM">Freemium</option>
                    <option value="PAID">Ücretli</option>
                    <option value="OPEN_SOURCE">Açık Kaynak</option>
                  </select>
                </div>

                {/* Website URL */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Web Sitesi URL</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border bg-background/50 focus:border-primary outline-none text-sm"
                  />
                </div>

                {/* GitHub URL */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold">GitHub URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border bg-background/50 focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>

              {/* Categories Checkboxes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Kategoriler</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border p-3 rounded-lg bg-background/30 max-h-32 overflow-y-auto">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2 text-xs cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories((prev) => [...prev, cat.id]);
                          } else {
                            setSelectedCategories((prev) => prev.filter((id) => id !== cat.id));
                          }
                        }}
                        className="rounded border-muted accent-primary"
                      />
                      {cat.nameTr}
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold">Türkçe Açıklama (HTML formatı destekler)</label>
                <textarea
                  value={descriptionTr}
                  onChange={(e) => setDescriptionTr(e.target.value)}
                  className="w-full h-24 p-3 rounded-lg border bg-background/50 focus:border-primary outline-none text-sm font-sans"
                  placeholder="<h2>Araç Başlığı</h2><p>Araç açıklaması...</p>"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Best For */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold">En İyi Kimler İçin? (Best For)</label>
                  <input
                    type="text"
                    value={bestFor}
                    onChange={(e) => setBestFor(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border bg-background/50 focus:border-primary outline-none text-sm"
                    placeholder="örn: Yazılımcılar, Tasarımcılar"
                  />
                </div>

                {/* Hardware requirements */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Donanım Gereksinimi</label>
                  <input
                    type="text"
                    value={hardwareReq}
                    onChange={(e) => setHardwareReq(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border bg-background/50 focus:border-primary outline-none text-sm"
                    placeholder="örn: Cloud-only veya local GPU"
                  />
                </div>
              </div>

              {/* Use cases */}
              <div className="space-y-1">
                <label className="text-xs font-semibold">Kullanım Alanları (Virgülle ayırın)</label>
                <input
                  type="text"
                  value={useCasesText}
                  onChange={(e) => setUseCasesText(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border bg-background/50 focus:border-primary outline-none text-sm"
                  placeholder="örn: Kod yazımı, Hata ayıklama, Otomasyon"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Meta Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold">SEO Meta Başlığı</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border bg-background/50 focus:border-primary outline-none text-sm"
                  />
                </div>

                {/* Meta Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold">SEO Meta Açıklaması</label>
                  <input
                    type="text"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border bg-background/50 focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>

              {/* Featured */}
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer select-none pt-2">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-muted accent-primary scale-110"
                />
                Öne Çıkan Araç Olarak İşaretle
              </label>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="inline-flex h-10 items-center justify-center rounded-xl border bg-background px-5 text-sm font-semibold hover:bg-accent transition-all cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
