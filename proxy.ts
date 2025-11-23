import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  getSupportedLocalesSync,
  findBestMatch,
  parseAcceptLanguage
} from '@/lib/locales.server'

export function proxy(request: NextRequest) {
  const supportedLocales = getSupportedLocalesSync()
  const prefLocale = request.cookies.get('NEXT_PREF_LOCALE')?.value

  let selectedLocale: string

  if (prefLocale && supportedLocales.includes(prefLocale)) {
    selectedLocale = prefLocale
  } else {
    const acceptLanguage = request.headers.get('Accept-Language') || ''
    const preferredLocales = parseAcceptLanguage(acceptLanguage)
    selectedLocale = findBestMatch(preferredLocales, supportedLocales)
  }

  const response = NextResponse.next()
  response.cookies.set('NEXT_LOCALE', selectedLocale, { path: '/' })
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}
