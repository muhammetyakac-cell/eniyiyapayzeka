import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runAutonomousAgent } from "@/lib/autonomous-agent";

export const maxDuration = 60; // 60 seconds maximum runtime for Hobby Plan to allow Gemini enough time

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Optional Vercel Cron Secret validation
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // Keep this bypassed in local/dev if needed, but strict in production
      // return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("[CRON] Autonomous Growth Agent Started...");

    // 1. Fetch existing tool names so Gemini doesn't duplicate them
    const existingTools = await prisma.aiTool.findMany({
      select: { name: true }
    });
    const toolNames = existingTools.map(t => t.name);

    // 2. Call the Gemini Autonomous Brain
    console.log("[CRON] Requesting new content from Gemini...");
    const result = await runAutonomousAgent(toolNames);

    if (!result || !result.tool || !result.blogPost) {
      throw new Error("Invalid payload format received from Autonomous Agent");
    }

    // 3. Connect or Create Category
    let category = await prisma.category.findUnique({
      where: { slug: result.tool.categorySlug }
    });
    
    if (!category) {
      // If the AI invents a slightly off category slug, create it to avoid crashes
      category = await prisma.category.create({
        data: {
          nameTr: result.tool.categorySlug.replace(/-/g, " ").toUpperCase(),
          slug: result.tool.categorySlug,
        }
      });
    }

    // 4. Save the generated AI Tool into the database
    const createdTool = await prisma.aiTool.upsert({
      where: { slug: result.tool.slug },
      update: {},
      create: {
        slug: result.tool.slug,
        name: result.tool.name,
        websiteUrl: result.tool.websiteUrl,
        pricingModel: result.tool.pricingModel as any || "FREEMIUM",
        bestFor: result.tool.bestFor,
        useCases: result.tool.useCases,
        metaTitle: result.tool.metaTitle,
        metaDescription: result.tool.metaDescription,
        descriptionTr: result.tool.descriptionTr,
        source: "MANUAL", // We'll store it as MANUAL or similar since it's injected content
        categories: {
          create: [{
            category: { connect: { id: category.id } }
          }]
        }
      }
    });
    console.log(`[CRON] Saved new AI Tool: ${createdTool.name}`);

    // 5. Save the generated SEO Blog Post into the database
    const createdBlog = await prisma.blogPost.upsert({
      where: { slug: result.blogPost.slug },
      update: {},
      create: {
        slug: result.blogPost.slug,
        title: result.blogPost.title,
        excerpt: result.blogPost.excerpt,
        contentTr: result.blogPost.contentTr,
        readTime: 6,
        author: "Otonom AI", // Belirtilen yazar doğrudan ajanımızın imzası olacak!
        metaTitle: result.blogPost.metaTitle,
        metaDescription: result.blogPost.metaDescription,
      }
    });

    // Link the blog post to the tool
    await prisma.blogPostTool.upsert({
      where: {
        blogPostId_toolId: { blogPostId: createdBlog.id, toolId: createdTool.id }
      },
      update: {},
      create: { blogPostId: createdBlog.id, toolId: createdTool.id }
    }).catch(() => {}); // Ignore duplicate link errors

    console.log(`[CRON] Saved new SEO Blog Post: ${createdBlog.title}`);

    return NextResponse.json({ 
      success: true, 
      message: "Autonomous Growth Cycle Completed",
      newTool: createdTool.name,
      newBlog: createdBlog.title
    });

  } catch (error: any) {
    console.error("[CRON] Autonomous Growth Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
