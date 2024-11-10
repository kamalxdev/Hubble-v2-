import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import authenticate from "./server-actions/auth/authenticate";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  let authCookie = request.cookies.get("auth");
  if (url.startsWith("/login") || url.startsWith("/register")) {
    if (authCookie) {
      const authenticateUserTOKEN = await authenticate();
      if (authenticateUserTOKEN?.success)
        return NextResponse.redirect(new URL("/", request.url));
    }
  } else if (url.startsWith("/")) {
    if (!authCookie)
      return NextResponse.redirect(new URL("/login", request.url));
    const authenticateUserTOKEN = await authenticate();
    if (!authenticateUserTOKEN?.success)
      return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/:path", "/login", "/register"],
};
