import { NextRequest, NextResponse } from "next/server";

const TOKEN_COOKIE = "rentnest_token";
const ROLE_COOKIE = "rentnest_role";

// Maps each protected route prefix to the roles allowed to access it.
const ROUTE_RULES: { prefix: string; roles: string[] }[] = [
  { prefix: "/dashboard/tenant", roles: ["TENANT"] },
  { prefix: "/dashboard/landlord", roles: ["LANDLORD"] },
  { prefix: "/dashboard/admin", roles: ["ADMIN"] },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rule = ROUTE_RULES.find((r) => pathname.startsWith(r.prefix));
  if (!rule) return NextResponse.next();

  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const role = request.cookies.get(ROLE_COOKIE)?.value;

  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (role && !rule.roles.includes(role)) {
    // Logged in, but the wrong role — send them to their own dashboard
    // instead of a dead end.
    const home = role === "TENANT" ? "/dashboard/tenant" : role === "LANDLORD" ? "/dashboard/landlord" : "/dashboard/admin";
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
