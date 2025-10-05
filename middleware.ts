import { NextResponse, type NextRequest } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("session_token")?.value

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!sessionToken) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }

    // Verify session is valid
    try {
      const sql = neon(process.env.DATABASE_URL!)
      const result = await sql`
        SELECT user_id
        FROM sessions
        WHERE token = ${sessionToken}
          AND expires_at > NOW()
      `

      if (result.length === 0) {
        const url = request.nextUrl.clone()
        url.pathname = "/login"
        const response = NextResponse.redirect(url)
        response.cookies.delete("session_token")
        return response
      }
    } catch (error) {
      console.error("[v0] Middleware error:", error)
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
  }

  // Additional middleware logic can be added here

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
