import { NextResponse, type NextRequest } from "next/server";

const TOKEN_COOKIE = "edumitra_token";

export async function updateSession(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const publicPaths = ["/login"];
  const isPublic = publicPaths.some((p) => request.nextUrl.pathname.startsWith(p));
  const isStatic =
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.includes(".");

  if (!token && !isPublic && !isStatic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (token && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}
