import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Auth is handled in individual pages with useAuth hook
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
