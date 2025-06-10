'use client';

import type React from 'react';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/contexts/user-context';
import { toast } from 'sonner';

interface PaymentProtectionProps {
  children: React.ReactNode;
}

export function PaymentProtection({ children }: PaymentProtectionProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Não aplicar proteção se ainda estiver carregando
    if (isLoading) return;

    // Não aplicar proteção nas páginas de login e planos
    const allowedPaths = ['/login', '/plans'];
    if (allowedPaths.includes(pathname)) return;

    // Verificar se é um partner/supplier não pago
    if (user?.partnerSupplier && !user.partnerSupplier.isPaid) {
      toast.info('Para acessar outras abas do sistema, você precisa estar vinculado a um plano.');
      router.push('/plans');
      return;
    }
  }, [user, isLoading, router, pathname]);

  // Mostrar loading enquanto verifica
  if (isLoading) {
    return <></>;
  }

  // Se é partner não pago e não está na página de planos, não mostrar conteúdo
  if (user?.partnerSupplier && !user.partnerSupplier.isPaid && pathname !== '/plans') {
    return null;
  }

  return <>{children}</>;
}
