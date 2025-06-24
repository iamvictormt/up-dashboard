'use client';

import type React from 'react';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/contexts/user-context';

interface PaymentProtectionProps {
  children: React.ReactNode;
}

export function PaymentProtection({ children }: PaymentProtectionProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const alwaysAllowedPaths = ['/auth/login', '/auth/register', '/payment-confirmation', '/payment-confirmed'];
    if (alwaysAllowedPaths.includes(pathname)) return;

    if (pathname === '/plans') {
      const shouldNotSeePlans =
        user?.professional ||
        user?.loveDecoration ||
        (user?.partnerSupplier && user.partnerSupplier.subscription?.subscriptionStatus === 'ACTIVE');

      if (shouldNotSeePlans) {
        router.push('/mural');
        return;
      }
    }

    if (user?.partnerSupplier) {
      const hasActiveSubscription = user.partnerSupplier.subscription?.subscriptionStatus === 'ACTIVE';

      if (!hasActiveSubscription) {
        router.push('/plans');
        return;
      }
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return <></>;
  }

  if (
    user?.partnerSupplier &&
    user.partnerSupplier.subscription?.subscriptionStatus === 'CANCELED' &&
    pathname !== '/plans'
  ) {
    return null;
  }

  return <>{children}</>;
}
