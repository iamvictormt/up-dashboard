import { deleteCookie } from 'cookies-next';
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
  const roleCookie = request.cookies.get('role')?.value;
  let parsedRole: string | null = null;
  if (roleCookie) {
    try {
      parsedRole = JSON.parse(roleCookie);
    } catch (error) {
      parsedRole = roleCookie;
    }
  }

  const defaultRouteByRole: Record<string, string> = {
    admin: '/admin/conexao-premiada',
    partnerSupplier: '/mural',
    professional: '/mural',
    loveDecoration: '/mural',
  };
  const permissions: any = {
    partnerSupplier: [
      '/mural',
      '/service-providers',
      '/store-info',
      '/physical-sales',
      '/help',
      '/plans',
      '/payment-confirmed',
      '/payment-confirmation',
    ],
    professional: [
      '/mural',
      '/service-providers',
      '/suppliers-store',
      '/wellness-partners',
      '/workshops',
      '/events',
      '/help',
      '/benefits',
    ],
    loveDecoration: ['/mural', '/service-providers', '/suppliers-store', '/wellness-partners', '/help'],
    admin: ['/admin', '/help'],
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
    if (!parsedRole) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    } else {
      if (url === '/') {
        return NextResponse.next();
      }

      const allowedRoutes = permissions[parsedRole];
      const isAllowed = allowedRoutes?.some((route: string) => url.startsWith(route));

      if (!isAllowed) {
        const fallbackPath = defaultRouteByRole[parsedRole] || '/mural';
        return NextResponse.redirect(new URL(fallbackPath, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next|favicon.ico|api|login).*)',
};
