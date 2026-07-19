import { NextResponse } from "next/server";
import { auth } from "@/auth";

const PROTECTED_PREFIXES = [
  "/mission-control",
  "/crop-health",
  "/yield-forecast",
  "/resource-optimization",
  "/greenhouse",
  "/marketplace",
  "/schemes",
  "/outcomes",
  "/reports",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isOnboarding = pathname.startsWith("/onboarding");

  if (!req.auth && (isProtected || isOnboarding)) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Real server-side enforcement of onboarding, not just a client redirect:
  // signed-in users without an experience level get bounced to /onboarding
  // before they can reach any protected page.
  if (req.auth && isProtected && !req.auth.user?.experience) {
    return NextResponse.redirect(new URL("/onboarding", req.nextUrl.origin));
  }

  if (req.auth && isOnboarding && req.auth.user?.experience) {
    return NextResponse.redirect(new URL("/mission-control", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/mission-control/:path*",
    "/crop-health/:path*",
    "/yield-forecast/:path*",
    "/resource-optimization/:path*",
    "/greenhouse/:path*",
    "/marketplace/:path*",
    "/schemes/:path*",
    "/outcomes/:path*",
    "/reports/:path*",
    "/onboarding/:path*",
  ],
};
