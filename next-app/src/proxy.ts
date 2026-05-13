import { NextRequest, NextResponse, userAgent } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Already on a prefixed path — let it through
  if (pathname.startsWith('/m') || pathname.startsWith('/d')) {
    return NextResponse.next()
  }

  const { device } = userAgent(request)
  const isMobile = device.type === 'mobile' || device.type === 'tablet'
  const prefix = isMobile ? '/m' : '/d'

  const url = request.nextUrl.clone()
  url.pathname = prefix + (pathname === '/' ? '' : pathname)
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf)$).*)',
  ],
}
