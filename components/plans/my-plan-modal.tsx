'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  CreditCard,
  ExternalLink,
  Crown,
  CheckCircle2,
  Clock,
  XCircle,
  Shield,
  Zap,
  Star,
  Users,
  BarChart3,
  Headphones,
} from 'lucide-react';
import { useUser } from '@/contexts/user-context';

interface MyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyPlanModal({ isOpen, onClose }: MyPlanModalProps) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  // Dados da subscription real
  const subscription = user?.partnerSupplier?.subscription;

  // Se não é partnerUser, não mostra o modal
  if (!user?.partnerSupplier || !subscription) {
    return null;
  }

  const handleManageSubscription = async () => {
    window.open('https://billing.stripe.com/p/login/test_bJe9AV3WCe84ga7cBk00000', '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          text: 'Ativo',
          color: 'bg-emerald-500',
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-700',
          borderColor: 'border-emerald-200',
        };
      case 'CANCELED':
        return {
          icon: <XCircle className="w-4 h-4" />,
          text: 'Cancelado',
          color: 'bg-red-500',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
        };
      case 'PAST_DUE':
        return {
          icon: <Clock className="w-4 h-4" />,
          text: 'Vencido',
          color: 'bg-amber-500',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-700',
          borderColor: 'border-amber-200',
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          text: 'Pendente',
          color: 'bg-gray-500',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
        };
    }
  };

  const getPlanInfo = (planType: string) => {
    console.log(planType.toUpperCase())
    switch (planType.toUpperCase()) {
      case 'SILVER':
        return {
          name: 'SILVER',
          price: 'R$ 1.000,00',
          color: 'from-purple-600 to-pink-600',
          features: [
            { icon: <Users className="w-4 h-4" />, text: 'Até 500 contatos' },
            { icon: <BarChart3 className="w-4 h-4" />, text: 'Analytics avançado' },
            { icon: <Star className="w-4 h-4" />, text: 'Destaque nos resultados' },
            { icon: <Headphones className="w-4 h-4" />, text: 'Suporte prioritário' },
          ],
        };
      case 'GOLD':
        return {
          name: 'GOLD',
          price: 'R$ 2.000,00',
          color: 'from-blue-600 to-purple-600',
          features: [
            { icon: <Users className="w-4 h-4" />, text: 'Contatos ilimitados' },
            { icon: <BarChart3 className="w-4 h-4" />, text: 'Relatórios personalizados' },
            { icon: <Crown className="w-4 h-4" />, text: 'Badge exclusivo' },
            { icon: <Shield className="w-4 h-4" />, text: 'Suporte 24/7' },
          ],
        };
      default:
        return {
          name: 'PREMIUM',
          price: 'R$ 3.000,00',
          color: 'from-green-600 to-blue-600',
          features: [
            { icon: <Users className="w-4 h-4" />, text: 'Até 100 contatos' },
            { icon: <BarChart3 className="w-4 h-4" />, text: 'Relatórios básicos' },
            { icon: <Zap className="w-4 h-4" />, text: 'Publicações destacadas' },
            { icon: <Headphones className="w-4 h-4" />, text: 'Suporte por email' },
          ],
        };
    }
  };

  const statusInfo = getStatusInfo(subscription.subscriptionStatus);
  const planInfo = getPlanInfo(subscription.planType);

  // Calcular dias restantes
  const daysLeft = Math.ceil(
    (new Date(subscription.currentPeriodEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-2xl md:text-3xl font-bold text-[#511A2B]">
            Minha Assinatura
          </DialogTitle>
          <p className="text-[#511A2B]/70">Gerencie sua assinatura e aproveite todos os benefícios</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Card Principal do Plano */}
          <div
            className={`relative overflow-hidden rounded-2xl bg-[#46142b] p-8 text-white shadow-2xl`}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Crown className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Plano {planInfo.name}</h3>
                    <p className="text-white/80">Assinatura mensal ativa</p>
                  </div>
                </div>

                <Badge
                  className={`${statusInfo.bgColor} ${statusInfo.textColor} border-0 px-4 py-2 text-sm font-medium hover:bg-${statusInfo.bgColor}`}
                >
                  {statusInfo.icon}
                  <span className="ml-2">{statusInfo.text}</span>
                </Badge>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold">{planInfo.price}</span>
                <span className="text-white/80 text-lg">/mês</span>
              </div>

              {/* Próxima cobrança */}
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-white/80" />
                    <div>
                      <p className="text-sm text-white/80">Próxima cobrança</p>
                      <p className="font-semibold">{formatDate(subscription.currentPeriodEnd)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/80">Dias restantes</p>
                    <p className="text-2xl font-bold">{daysLeft}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Padrão decorativo */}
            <div className="absolute -top-10 -right-10 w-40 h-40 opacity-10">
              <div className="w-full h-full bg-white rounded-full"></div>
            </div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 opacity-5">
              <div className="w-full h-full bg-white rounded-full"></div>
            </div>
          </div>

          {/* Informações da Assinatura */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">ID da Assinatura</span>
              </div>
              <p className="text-sm font-mono text-gray-900 break-all">{subscription.subscriptionId}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Ativa desde</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{formatDate(subscription.createdAt)}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-600">Renovação</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {subscription.cancelAtPeriodEnd ? 'Cancelará' : 'Automática'}
              </p>
            </div>
          </div>

          {/* Botão de Gerenciar */}
          <div className="pt-4">
            <Button onClick={handleManageSubscription} disabled={isLoading} variant="primary" className="w-full p-6">
              <CreditCard className="w-5 h-5 mr-3" />
              {isLoading ? 'Redirecionando...' : 'Gerenciar Minha Assinatura'}
              <ExternalLink className="w-5 h-5 ml-3" />
            </Button>

            <p className="text-xs text-gray-500 text-center mt-3">
              Será aberta uma nova guia para o portal seguro do Stripe para gerenciar sua assinatura
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
