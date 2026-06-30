import type { RawToolData } from "@/types/tools";

export async function fetchGitHubTrending(): Promise<RawToolData[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const res = await fetch(
    `https://api.github.com/search/repositories?q=topic:llm+topic:ai+created:>=${weekAgo}&sort=stars&order=desc&per_page=20`,
    { headers }
  );

  if (!res.ok) throw new Error(`GitHub API error ${res.status}`);

  const data = await res.json();

  return (data.items || []).map((repo: Record<string, unknown>) => ({
    name: repo.full_name as string,
    description: (repo.description as string) || "",
    websiteUrl: (repo.homepage as string) || undefined,
    githubUrl: repo.html_url as string,
    starsCount: repo.stargazers_count as number,
    source: "GITHUB" as const,
    categorySlugs: ["kodlama"],
  }));
}
