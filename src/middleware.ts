import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    // Redirect user to login page if no token
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If token exists, continue
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/auctions", "/auctions/:path*","/analytics"],
}