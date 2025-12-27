import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/db";
import Project from "@/models/Project";
import { validateApiKey } from "@/lib/validateApiKey";
import { checkRateLimit, defaultLimiter } from "@/lib/rateLimit";

// POST /api/projects/[id]/duplicate - Duplicate a project
export async function POST(req, { params }) {
  try {
    const isValid = validateApiKey(req);
    if (isValid !== true) return isValid;

    const rateLimitResponse = checkRateLimit(req, defaultLimiter);
    if (rateLimitResponse !== true) return rateLimitResponse;

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectMongoDB();

    // Find original project
    const originalProject = await Project.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!originalProject) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    // Create duplicate
    const duplicatedProject = await Project.create({
      userId: session.user.id,
      projectName: `${originalProject.projectName} (Copy)`,
      description: originalProject.description,
      stack: originalProject.stack,
      template: originalProject.template,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project duplicated successfully",
        data: duplicatedProject,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
