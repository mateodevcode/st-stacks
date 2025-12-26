import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function proxy(request) {
  const session = await getServerSession(authOptions);
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ["/auth/signin", "/auth/signup"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If not authenticated and trying to access protected route
  if (!session && !isPublicRoute && pathname !== "/") {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // If authenticated and trying to access auth pages, redirect to dashboard
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/builder/:path*", "/auth/:path*"],
};
