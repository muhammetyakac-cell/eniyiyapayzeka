import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { toolSlugify } from "@/lib/utils/slugify";
import type { PricingModel } from "@prisma/client";

// Guard helper to check admin authentication
async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    return false;
  }
  return true;
}

// POST: Create a new tool manually
export async function POST(req: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      websiteUrl,
      githubUrl,
      descriptionTr,
      pricingModel,
      hardwareReq,
      bestFor,
      useCases,
      metaTitle,
      metaDescription,
      featured,
      categoryIds, // Array of category IDs to associate
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const slug = toolSlugify(name);

    // Verify uniqueness of slug
    const existing = await prisma.aiTool.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu isimle bir araç zaten mevcut." },
        { status: 400 }
      );
    }

    const tool = await prisma.aiTool.create({
      data: {
        slug,
        name,
        descriptionTr: descriptionTr || null,
        websiteUrl: websiteUrl || null,
        githubUrl: githubUrl || null,
        pricingModel: (pricingModel as PricingModel) || "FREE",
        hardwareReq: hardwareReq || null,
        bestFor: bestFor || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        useCases: Array.isArray(useCases) ? useCases : [],
        featured: !!featured,
        source: "MANUAL",
        categories: categoryIds?.length
          ? {
              create: categoryIds.map((catId: string) => ({
                category: { connect: { id: catId } },
              })),
            }
          : undefined,
      },
    });

    return NextResponse.json({ success: true, tool });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

// PUT: Edit an existing tool
export async function PUT(req: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      id,
      name,
      websiteUrl,
      githubUrl,
      descriptionTr,
      pricingModel,
      hardwareReq,
      bestFor,
      useCases,
      metaTitle,
      metaDescription,
      featured,
      categoryIds,
    } = body;

    if (!id || !name) {
      return NextResponse.json({ error: "ID and Name are required" }, { status: 400 });
    }

    // Verify tool exists
    const existing = await prisma.aiTool.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Araç bulunamadı." }, { status: 404 });
    }

    // Update fields
    const slug = toolSlugify(name);

    // Delete existing category associations first
    await prisma.toolCategory.deleteMany({
      where: { toolId: id },
    });

    const tool = await prisma.aiTool.update({
      where: { id },
      data: {
        slug,
        name,
        descriptionTr: descriptionTr || null,
        websiteUrl: websiteUrl || null,
        githubUrl: githubUrl || null,
        pricingModel: (pricingModel as PricingModel) || "FREE",
        hardwareReq: hardwareReq || null,
        bestFor: bestFor || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        useCases: Array.isArray(useCases) ? useCases : [],
        featured: !!featured,
        categories: categoryIds?.length
          ? {
              create: categoryIds.map((catId: string) => ({
                category: { connect: { id: catId } },
              })),
            }
          : undefined,
      },
    });

    return NextResponse.json({ success: true, tool });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove an existing tool
export async function DELETE(req: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Delete associated categories cascade automatically if configured, or delete explicitly
    await prisma.toolCategory.deleteMany({
      where: { toolId: id },
    });

    await prisma.aiTool.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
