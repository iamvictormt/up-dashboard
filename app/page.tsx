'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const roleCookie = Cookies.get('role');
    let role = '';

    if (roleCookie) {
      try {
        role = JSON.parse(roleCookie);
      } catch (error) {
        role = roleCookie;
      }
    }

    const routeByRole: Record<string, string> = {
      admin: '/admin/conexao-premiada',
      partnerSupplier: '/mural',
      professional: '/mural',
      loveDecoration: '/mural',
    };

    router.push(routeByRole[role] || '/mural');
  }, [router]);

  return <></>;
}
