export function slugify(text: string): string {
  const trMap: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };

  return text
    .toLowerCase()
    .trim()
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (ch) => trMap[ch] || ch)
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function toolSlugify(name: string): string {
  return `${slugify(name)}-nedir`;
}

export function categorySlugify(name: string): string {
  return `${slugify(name)}-yapay-zeka-araclari`;
}
