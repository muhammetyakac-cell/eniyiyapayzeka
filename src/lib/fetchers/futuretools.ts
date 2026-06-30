import type { RawToolData } from "@/types/tools";
import * as cheerio from "cheerio";

export async function scrapeFutureTools(): Promise<RawToolData[]> {
  const res = await fetch("https://www.futuretools.io", {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  if (!res.ok) throw new Error(`FutureTools fetch error ${res.status}`);

  const html = await res.text();
  const $ = cheerio.load(html);
  const tools: RawToolData[] = [];

  $('[class*="tool"], [class*="card"], [class*="item"]').each((_, el) => {
    const name = $(el).find("h3, h2, [class*=title]").first().text().trim();
    const desc = $(el).find("p, [class*=desc]").first().text().trim();
    const link = $(el).find("a").first().attr("href");

    if (name) {
      tools.push({
        name,
        description: desc || undefined,
        websiteUrl: link ? (link.startsWith("http") ? link : `https://www.futuretools.io${link}`) : undefined,
        source: "FUTURETOOLS",
        categorySlugs: [],
      });
    }
  });

  return tools.slice(0, 20);
}
