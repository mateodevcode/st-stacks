// src/app/api/stacks/predefined/route.js ok

import { NextResponse } from "next/server";
import { PREDEFINED_STACKS } from "@/lib/mockData";

// GET /api/stacks/predefined - Get all predefined stack templates
export async function GET() {
  try {
    return NextResponse.json(
      {
        success: true,
        message: "Stacks fetched successfully",
        data: PREDEFINED_STACKS,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
