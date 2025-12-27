// lib/validateRateLimit.js
import { NextResponse } from "next/server";

export function validateRateLimit(rateLimitCheck) {
  console.log(rateLimitCheck);

  if (rateLimitCheck.isLimited) {
    return NextResponse.json(
      {
        success: false,
        error: rateLimitCheck.message,
      },
      {
        status: 429,
        headers: {
          "Retry-After": rateLimitCheck.retryAfter,
        },
      }
    );
  }
  return true;
}
