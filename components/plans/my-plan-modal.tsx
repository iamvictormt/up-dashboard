'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, CreditCard, RefreshCw, ExternalLink, Crown, CheckCircle2, XCircle } from 'lucide-react';
import { useUser } from '@/contexts/user-context';

interface MyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyPlanModal({ isOpen, onClose }: MyPlanModalProps) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  if (!user?.partnerSupplier || !user?.subscription) {
    return;
  }

  const planData = {
    ...user?.subscription,
    nextBilling: user?.subscription?.periodEndsAt,
    cycle: 'Mensal',
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const portalUrl = `https://billing.stripe.com/p/login/test_bJe9AV3WCe84ga7cBk00000`;
      window.open(portalUrl, '_blank');
    } catch (error) {
      console.error('Erro ao abrir portal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const amountFormatted = (planData.amount / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          text: 'Ativo',
          color: 'bg-emerald-500',
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-700',
        };
      default:
        return {
          icon: <XCircle className="w-4 h-4" />,
          text: 'Cancelado',
          color: 'bg-red-500',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
        };
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'silver':
        return 'from-[#d56235] to-[#d01c2a]';
      case 'gold':
        return 'from-[#ffc560] to-[#d56235]';
      default:
        return 'from-[#6c2144] to-[#d56235]';
    }
  };

  const statusInfo = getStatusInfo(planData.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900">Minha Assinatura</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Card Principal do Plano */}
          <div
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getPlanColor(
              planData.planName
            )} p-6 text-white`}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold capitalize">Plano {planData.planName}</h3>
                    <p className="text-white/80 text-sm">Assinatura mensal</p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusInfo.bgColor} ${statusInfo.textColor} bg-white/90`}
                >
                  {statusInfo.icon}
                  <span className="text-sm font-medium">{statusInfo.text}</span>
                </div>
              </div>

              <div className="text-3xl font-bold mb-1">
                {amountFormatted}
                <span className="text-lg font-normal text-white/80">/mês</span>
              </div>
            </div>

            {/* Padrão decorativo */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <div className="w-full h-full bg-white rounded-full transform translate-x-8 -translate-y-8"></div>
            </div>
          </div>

          {/* Informações da Cobrança */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Próxima cobrança</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {planData.status === 'canceled' ? 'Cobrança suspensa' : formatDate(planData.nextBilling)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Ciclo</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{planData.cycle}</p>
            </div>
          </div>

          {/* Botão de Gerenciar */}
          <div className="pt-4">
            <Button variant="primary" onClick={handleManageSubscription} disabled={isLoading} className="w-full p-6">
              <CreditCard className="w-4 h-4 mr-2" />
              {isLoading ? 'Abrindo...' : 'Gerenciar Assinatura'}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>

            <p className="text-xs text-gray-500 text-center mt-2">
              Você será redirecionado para o portal seguro do Stripe
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
