import { PrismaClient } from "@prisma/client";
import { enrichTool } from "../src/lib/ai-enrich";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking tools to enrich via Gemini...");

  // We find tools that have very short descriptions (<300 characters)
  // These are the ones that haven't been manually enriched with detailed HTML
  const toolsToEnrich = await prisma.aiTool.findMany();
  
  const shortTools = toolsToEnrich.filter(t => !t.descriptionTr || t.descriptionTr.length < 300);

  console.log(`Found ${shortTools.length} tools that need detailed enrichment.`);

  for (const tool of shortTools) {
    console.log(`Enriching tool: ${tool.name} (${tool.slug})...`);
    try {
      const enriched = await enrichTool({
        name: tool.name,
        description: tool.descriptionTr || "",
        websiteUrl: tool.websiteUrl || "",
        githubUrl: tool.githubUrl || "",
        source: tool.source as any,
        starsCount: tool.starsCount || undefined,
      });

      // Update the database with the highly detailed, structured content!
      await prisma.aiTool.update({
        where: { id: tool.id },
        data: {
          descriptionTr: enriched.descriptionTr,
          metaTitle: enriched.metaTitle,
          metaDescription: enriched.metaDescription,
          useCases: enriched.useCases,
          pricingModel: enriched.pricingModel as any,
          hardwareReq: enriched.hardwareReq,
          bestFor: enriched.bestFor,
        },
      });
      console.log(`  ✓ Successfully enriched and updated: ${tool.name}`);
      
      // Wait a few seconds to avoid Gemini rate limits
      await new Promise(r => setTimeout(r, 4000));
    } catch (e) {
      console.error(`  ✗ Failed to enrich ${tool.name}:`, e);
    }
  }

  console.log("All automatic enrichments via Gemini completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
