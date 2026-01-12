import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const guestRoutes = ["/sign-up", "/sign-in"];
const adminRoutes = ["/admin"];
const customerRoutes = ["/customer", "/orders", "/profile", "/checkout", "/cart"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token");
  const userRole = request.cookies.get("user_role")?.value;
  const isAuthenticated = !!accessToken;

  if (guestRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      const redirectTo = userRole === "admin" ? "/admin" : "/customer";
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/") {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    const redirectTo = userRole === "admin" ? "/admin" : "/customer";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/sign-in", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/customer", request.url));
    }
  }

  if (customerRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/sign-in", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userRole !== "customer") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/customer/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/checkout",
    "/cart",
    "/sign-in",
    "/sign-up",
  ],
};
