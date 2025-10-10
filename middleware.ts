import { deleteCookie, getCookie } from 'cookies-next';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return true;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const url = request.nextUrl.pathname;
  const isAuthPage = url.startsWith('/auth');
  const role = request.cookies.get('role')?.value;
  const permissions: any = {
    partnerSupplier: [
      '/mural',
      '/recommended-professionals',
      '/store-info',
      '/help',
      '/plans',
      '/payment-confirmed',
      '/payment-confirmation',
    ],
    professional: ['/mural', '/recommended-professionals', '/suppliers-store', '/workshops', '/events', '/help', '/benefits'],
    loveDecoration: ['/mural', '/recommended-professionals', '/suppliers-store', '/help'],
  };

  const isStatic =
    url.startsWith('/_next') ||
    url.startsWith('/favicon.ico') ||
    url.startsWith('/logo-up') ||
    url.startsWith('/images') ||
    url.startsWith('/sounds') ||
    url.match(/\.(.*)$/);
  if (isStatic) {
    return NextResponse.next();
  }

  if (!isAuthPage && (!token || isTokenExpired(token))) {
    deleteCookie('token');

    const url = new URL('/auth/login', request.url);

    if (token && isTokenExpired(token)) {
      url.searchParams.set('expired', 'true');
    }

    return NextResponse.redirect(url);
  }

  if (!isAuthPage) {
    if (!role) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    } else {
      if (url === '/') {
        return NextResponse.next();
      }

      const allowedRoutes = permissions[JSON.parse(role)];
      const isAllowed = allowedRoutes?.some((route: string) => url.startsWith(route));

      if (!isAllowed) {
        return NextResponse.redirect(new URL('/mural', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next|favicon.ico|api|login).*)',
};
