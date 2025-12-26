import { NextResponse } from "next/server";
import { TECHNOLOGIES } from "@/lib/mockData";

// GET /api/technologies - Get all available technologies
export async function GET() {
  try {
    return NextResponse.json({ technologies: TECHNOLOGIES });
  } catch (error) {
    console.error("Error fetching technologies:", error);
    return NextResponse.json(
      { error: "Failed to fetch technologies" },
      { status: 500 }
    );
  }
}
