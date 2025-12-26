import { NextResponse } from "next/server";
import { PREDEFINED_STACKS } from "@/lib/mockData";

// GET /api/stacks/predefined - Get all predefined stack templates
export async function GET() {
  try {
    return NextResponse.json({ stacks: PREDEFINED_STACKS });
  } catch (error) {
    console.error("Error fetching predefined stacks:", error);
    return NextResponse.json(
      { error: "Failed to fetch predefined stacks" },
      { status: 500 }
    );
  }
}
