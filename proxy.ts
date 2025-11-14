import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const prefLocale = request.cookies.get('NEXT_PREF_LOCALE')?.value
  if (!prefLocale) {
    const acceptLanguage = request.headers.get('Accept-Language') || ''
    const locales = acceptLanguage.split(',')
    const defaultLocale = locales[0]?.startsWith('zh') ? 'zh-CN' : 'en'
    
    const response = NextResponse.next()
    response.cookies.set('NEXT_LOCALE', defaultLocale)
    return response
  }

  const response = NextResponse.next()
  response.cookies.set('NEXT_LOCALE', prefLocale)
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}
