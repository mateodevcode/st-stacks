// src/app/api/technologies/route.js ok
import { NextResponse } from "next/server";
import { TECHNOLOGIES } from "@/lib/mockData";

// GET /api/technologies - Get all available technologies
export async function GET() {
  try {
    return NextResponse.json(
      {
        success: true,
        message: "Technologies fetched successfully",
        data: TECHNOLOGIES,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
