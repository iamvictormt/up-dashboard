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
    return true; // Se não conseguir decodificar, trata como expirado
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token || isTokenExpired(token)) {
    deleteCookie('token');
    deleteCookie('user');
    return NextResponse.redirect(new URL('http://localhost:3001/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next|favicon.ico|api).*)',
};
