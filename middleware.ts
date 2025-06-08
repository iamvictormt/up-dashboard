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
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const url = request.nextUrl.pathname;
  const role = request.cookies.get('role')?.value;
  const permissions: any = {
    partnerSupplier: ['/', '/my-store', '/dashboard', '/orders'],
    professional: ['/', '/projects', '/appointments'],
    loveDecoration: ['/', '/inspiration', '/profile', '/help'],
  };

  if (!isAuthPage && (!token || isTokenExpired(token))) {
    deleteCookie('token');

    const url = new URL('/login', request.url);

    if (token && isTokenExpired(token)) {
      url.searchParams.set('expired', 'true');
    }

    return NextResponse.redirect(url);
  }

  if (!isAuthPage) {
    if (!role) {
      return NextResponse.redirect(new URL('/login', request.url));
    } else {
      if (url === '/') {
        return NextResponse.next();
      }

      const allowedRoutes = permissions[JSON.parse(role)];
      const isAllowed = allowedRoutes?.some((route: string) => url.startsWith(route));
      if (!isAllowed) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next|favicon.ico|api|login).*)',
};
