import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/db";
import Project from "@/models/Project";

// POST /api/projects/[id]/duplicate - Duplicate a project
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectMongoDB();

    // Find original project
    const originalProject = await Project.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!originalProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Create duplicate
    const duplicatedProject = await Project.create({
      userId: session.user.id,
      projectName: `${originalProject.projectName} (Copy)`,
      description: originalProject.description,
      stack: originalProject.stack,
      template: originalProject.template,
    });

    return NextResponse.json({ project: duplicatedProject }, { status: 201 });
  } catch (error) {
    console.error("Error duplicating project:", error);
    return NextResponse.json(
      { error: "Failed to duplicate project" },
      { status: 500 }
    );
  }
}
