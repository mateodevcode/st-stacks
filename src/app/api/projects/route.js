// api/projects/route.js ok
import { NextResponse } from "next/server";
import Project from "@/models/Project";
import { connectMongoDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { validateApiKey } from "@/lib/validateApiKey";
import { checkRateLimit, defaultLimiter } from "@/lib/rateLimit";

// GET /api/projects - List all projects for authenticated user
export async function GET(req) {
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

    await connectMongoDB();

    const projects = await Project.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Projects fetched successfully",
        data: projects,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(req) {
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

    const body = await req.json();
    const { projectName, description, stack, template } = body;

    if (!projectName) {
      return NextResponse.json(
        { success: false, message: "Project name is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const project = await Project.create({
      userId: session.user.id,
      projectName,
      description: description || "",
      stack: stack || {},
      template: template || "custom",
    });

    return NextResponse.json(
      { success: true, message: "Project created successfully", data: project },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}
