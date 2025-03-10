import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get("isLoggedIn"); // Check if user is logged in

  const protectedRoutes = ["/blog", "/dashboard", "/profile"]; // List of protected routes

  if (protectedRoutes.includes(req.nextUrl.pathname) && !isLoggedIn) {
    // ✅ Redirect to home page if not logged in
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next(); // Continue if logged in
}
