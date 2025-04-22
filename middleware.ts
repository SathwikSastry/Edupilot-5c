import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Continue with the request as normal
  return NextResponse.next()
}
