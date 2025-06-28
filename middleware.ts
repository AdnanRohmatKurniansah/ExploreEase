import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const protectedPaths = ["/dashboard"]
 
  const matchesProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  const token = await getToken({ req })

  if (matchesProtectedPath) {
    if (!token) {
      const url = new URL(`/auth/login`, req.url)
      url.searchParams.set("callbackUrl", encodeURI(req.url))
      return NextResponse.redirect(url)
    }
  }

  if ((pathname === "/auth/login" || pathname === "/auth/register") && token) {
    const url = new URL(`/dashboard`, req.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}