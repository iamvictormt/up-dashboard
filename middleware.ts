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
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');

  if (!isAuthPage && (!token || isTokenExpired(token))) {
    deleteCookie('token');
    deleteCookie('user');

    const url = new URL('/login', request.url);

    if (token && isTokenExpired(token)) {
      url.searchParams.set('expired', 'true');
    }

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next|favicon.ico|api|login).*)',
};
