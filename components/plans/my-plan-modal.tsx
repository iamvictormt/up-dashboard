'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  CreditCard,
  Crown,
  CheckCircle2,
  Shield,
  Zap,
  Star,
  Users,
  Headphones,
  Gem,
  Trophy,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Clock,
  Check,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { capitalizeFirst } from '@/utils/capitalize';

interface Plan {
  id: string;
  planType: string;
  price: number;
  description: string;
  stripeCustomerId?: string;
}

interface EmbeddedCheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
}

const getPlanInfo = (planId: string) => {
  switch (planId.toLowerCase()) {
    case 'silver':
      return {
        icon: <Gem className="w-8 h-8" />,
        price: 1000,
        gradient: 'from-[#511A2B] to-[#6d1f3f]',
        features: [
          { icon: <Star className="w-4 h-4" />, text: 'Vitrine personalizada da loja' },
          { icon: <Zap className="w-4 h-4" />, text: 'Anúncios em destaque' },
          { icon: <Users className="w-4 h-4" />, text: 'Visibilidade para dois públicos' },
          { icon: <Headphones className="w-4 h-4" />, text: 'Suporte dedicado' },
        ],
      };
    case 'gold':
      return {
        icon: <Trophy className="w-8 h-8" />,
        gradient: 'from-[#FEC460] to-[#f59e0b]',
        price: 2000,
        features: [
          { icon: <Star className="w-4 h-4" />, text: 'Vitrine personalizada da loja' },
          { icon: <Zap className="w-4 h-4" />, text: 'Anúncios em destaque' },
          { icon: <Users className="w-4 h-4" />, text: 'Visibilidade para dois públicos' },
          { icon: <Headphones className="w-4 h-4" />, text: 'Suporte dedicado' },
        ],
      };
    case 'premium':
      return {
        icon: <Crown className="w-8 h-8" />,
        gradient: 'from-[#D56235] to-[#dc2626]',
        price: 5000,
        features: [
          { icon: <Calendar className="w-4 h-4" />, text: '1 evento presencial por mês' },
          { icon: <Users className="w-4 h-4" />, text: 'Curadoria de 15-20 profissionais' },
          { icon: <Sparkles className="w-4 h-4" />, text: 'Destaque na HOME PAGE' },
          { icon: <Zap className="w-4 h-4" />, text: 'Acesso antecipado a novidades' },
        ],
      };
    default:
      return {
        icon: <Star className="w-8 h-8" />,
        gradient: 'from-[#511A2B] to-[#6d1f3f]',
        features: [],
      };
  }
};

export function MyPlanModal({ isOpen, onClose, plan }: EmbeddedCheckoutDialogProps) {
  if (!plan) return null;

  const planInfo = getPlanInfo(plan.planType);

  const currentDate = new Date();
  const nextBillingDate = new Date(currentDate);
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const daysUntilBilling = Math.ceil((nextBillingDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

  const handleManageSubscription = async () => {
    window.open('https://billing.stripe.com/p/login/7sY9AT778a40cWeeud33W00', '_blank');
  };

  console.log(plan);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-2xl md:text-3xl font-bold text-[#511A2B]">Detalhes da Assinatura</DialogTitle>
          <p className="text-[#511A2B]/70">Revise as informações do seu plano</p>
        </DialogHeader>

        <div className="space-y-6">
          <div
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${planInfo.gradient} p-8 text-white shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-[1.02]`}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm transition-transform duration-300 hover:scale-110">
                    {planInfo.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Plano {capitalizeFirst(plan.planType)}</h3>
                  </div>
                </div>

                <Badge className="bg-white/20 text-white border-0 px-4 py-2 text-sm font-medium backdrop-blur-sm hover:bg-white/30 transition-colors">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mensal
                </Badge>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold">{formatCurrency(planInfo.price || 0)}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-white/80" />
                    <p className="text-sm text-white/80 font-medium">Próxima cobrança</p>
                  </div>
                  <p className="font-semibold text-lg">{formatDate(nextBillingDate)}</p>
                </div>

                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-white/80" />
                    <p className="text-sm text-white/80 font-medium">Dias restantes</p>
                  </div>
                  <p className="font-semibold text-3xl">{daysUntilBilling}</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-10 -right-10 w-40 h-40 opacity-10">
              <div className="w-full h-full bg-white rounded-full"></div>
            </div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 opacity-5 ">
              <div className="w-full h-full bg-white rounded-full"></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-lg font-bold text-[#511A2B] mb-4 flex items-center gap-2">Recursos Incluídos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {planInfo.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-[#FEC460]/30 hover:-translate-y-1"
                >
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-[#511A2B]">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {plan.stripeCustomerId !== `-` && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:border-[#511A2B]/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-gray-600">Pagamento Seguro</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">Stripe</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:border-[#511A2B]/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs font-medium text-gray-600">Renovação</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">Automática</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:border-[#511A2B]/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-gray-600">Cancelamento</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">A qualquer momento</p>
              </div>
            </div>
          )}

          <div className="pt-4 space-y-3">
            <Button
              onClick={handleManageSubscription}
              disabled={plan.stripeCustomerId === `-`}
              className="w-full h-14 rounded-xl font-bold text-base bg-gradient-to-r from-[#511A2B] to-[#6d1f3f] hover:from-[#6d1f3f] hover:to-[#511A2B] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Gerenciar Assinatura
            </Button>

            {plan.stripeCustomerId !== `-` && (
              <p className="text-xs text-gray-500 text-center pt-2">
                Pagamento seguro processado pelo Stripe. Você pode cancelar a qualquer momento sem taxas adicionais.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
