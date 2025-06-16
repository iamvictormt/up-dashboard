'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useCallback, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/user-context';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
}

interface EmbeddedCheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
}

export function EmbeddedCheckoutDialog({ isOpen, onClose, plan }: EmbeddedCheckoutDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useUser();
  const router = useRouter();

  const fetchClientSecret = useCallback(() => {
    if (!plan) return Promise.reject('Nenhum plano selecionado');

    setIsLoading(true);

    return fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId: plan.id,
        email: user?.email || '',
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao criar sessão de checkout');
        }
        return res.json();
      })
      .then((data) => {
        setIsLoading(false);
        return data.client_secret;
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Erro no checkout:', error);
        throw error;
      });
  }, [plan]);

  const options = {
    fetchClientSecret,
    onComplete: () => {
      onClose();
      router.push('/payment-confirmation');
    },
  };

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>

        <div className="h-[80vh] max-h-[80vh] overflow-auto pb-8">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook para usar o checkout
export function useEmbeddedCheckout() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const openCheckout = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsOpen(true);
  };

  const closeCheckout = () => {
    setIsOpen(false);
    setSelectedPlan(null);
  };

  return {
    isOpen,
    selectedPlan,
    openCheckout,
    closeCheckout,
  };
}
