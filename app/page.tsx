'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    let role = Cookies.get('role') ?? '';
    try {
      role = JSON.parse(role);
    } catch {
      // role stored as plain string
    }
    // Lojistas parceiros só existe para estes papéis; os demais caem em prestadores.
    const canSeeStore = ['professional', 'loveDecoration', 'admin'].includes(role);
    router.push(canSeeStore ? '/suppliers-store' : '/service-providers');
  }, [router]);

  return <></>;
}
