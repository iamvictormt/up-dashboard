'use client';

import type React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Crown, Zap, Rocket, Star, Users, TrendingUp, Shield, Headphones } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { EmbeddedCheckoutDialog, useEmbeddedCheckout } from '@/components/stripe/embedded-checkout-dialog';
import { formatCurrency } from '@/utils/currency';

interface PlanFeature {
  name: string;
  included: boolean;
  tooltip?: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  discount?: string;
  icon: React.ReactNode;
  gradient: string;
  idealFor: string;
  badge?: string;
  stripePriceId: string;
}

const allFeatures = [
  'Perfil profissional completo e verificado',
  'Cadastro de loja com vitrine de produtos/serviços',
  'Anúncios mensais em destaque',
  'Destaque nas buscas',
  'Listagem na home (ofertas, lançamentos)',
  'Participação em eventos presenciais promovidos pela marca',
  'Selo de verificação de confiança',
  'Selo de profissional em destaque',
  'Painel com estatísticas de performance',
  'Campanhas promocionais exclusivas',
  'Suporte por e-mail e WhatsApp',
  'Acesso antecipado a funcionalidades novas',
];

const plans: Plan[] = [
  {
    id: 'silver',
    name: 'SILVER',
    price: 1000,
    description: 'Para quem busca alta exposição com custo-benefício',
    idealFor: 'Profissionais iniciantes',
    icon: <Rocket className="w-6 h-6" />,
    gradient: 'from-[#511A2B] to-[#6d1f3f]',
    stripePriceId: 'price_starter_monthly',
    features: [
      { name: allFeatures[0], included: true },
      { name: allFeatures[1], included: true },
      { name: '2 anúncios mensais em destaque', included: true },
      { name: allFeatures[3], included: true },
      { name: allFeatures[4], included: false },
      { name: 'Eventos presenciais promovidos pela marca', included: false },
      { name: allFeatures[6], included: true },
      { name: allFeatures[7], included: false },
      { name: allFeatures[8], included: true },
      { name: allFeatures[9], included: false },
      { name: allFeatures[10], included: true },
      { name: allFeatures[11], included: false },
    ],
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: 3000,
    description: 'Para profissionais de elite',
    idealFor: 'Profissionais premium',
    popular: true,
    badge: 'MAIS COMPLETO',
    icon: <Crown className="w-6 h-6" />,
    gradient: 'from-[#D56235] to-[#dc2626]',
    stripePriceId: 'price_premium_monthly',
    features: [
      { name: allFeatures[0], included: true },
      { name: allFeatures[1], included: true },
      { name: '4 anúncios mensais em destaque', included: true },
      { name: allFeatures[3], included: true },
      { name: allFeatures[4], included: true },
      { name: '1 evento mensal promovido pela sua marca', included: true },
      { name: allFeatures[6], included: true },
      { name: allFeatures[7], included: true },
      { name: allFeatures[8], included: true },
      { name: allFeatures[9], included: true },
      { name: allFeatures[10], included: true },
      { name: allFeatures[11], included: true },
    ],
  },
  {
    id: 'gold',
    name: 'GOLD',
    price: 2000,
    description: 'Para profissionais que querem crescer',
    idealFor: 'Profissionais estabelecidos',
    badge: 'MAIS POPULAR',
    icon: <Zap className="w-6 h-6" />,
    gradient: 'from-[#FEC460] to-[#f59e0b]',
    stripePriceId: 'price_pro_monthly',
    features: [
      { name: allFeatures[0], included: true },
      { name: allFeatures[1], included: true },
      { name: '3 anúncios mensais em destaque', included: true },
      { name: allFeatures[3], included: true },
      { name: allFeatures[4], included: true },
      { name: '1 evento a cada 45 dias promovido pela sua marca', included: true },
      { name: allFeatures[6], included: true },
      { name: allFeatures[7], included: false },
      { name: allFeatures[8], included: true },
      { name: allFeatures[9], included: true },
      { name: allFeatures[10], included: true },
      { name: allFeatures[11], included: false },
    ],
  },
];

const stats = [
  { number: '2.5K+', label: 'Profissionais Ativos', icon: Users },
  { number: '15K+', label: 'Trabalhos Realizados', icon: TrendingUp },
  { number: '4.8', label: 'Avaliação Média', icon: Star },
  { number: '98%', label: 'Satisfação', icon: Shield },
];

export function PlansContent() {
  const { isOpen, selectedPlan, openCheckout, closeCheckout } = useEmbeddedCheckout();

  const handleSelectPlan = (plan: Plan) => {
    const checkoutPlan = {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      originalPrice: plan.originalPrice,
      description: plan.description,
    };

    openCheckout(checkoutPlan);
  };

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#511A2B] rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-[#FEC460] rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-[#D56235] rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#511A2B]/20 rounded-full px-6 py-2 mb-8">
              <Crown className="w-4 h-4 text-[#511A2B]" />
              <span className="text-sm font-medium text-[#511A2B]">Planos para Profissionais</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-[#511A2B]">Escolha o Plano</span>
              <br />
              <span className="bg-gradient-to-r from-[#FEC460] to-[#D56235] bg-clip-text text-transparent">
                Perfeito para Você
              </span>
            </h1>

            <p className="text-xl text-[#511A2B]/70 mb-12 max-w-3xl mx-auto">
              Aumente sua visibilidade, receba mais clientes e faça seu negócio crescer com nossos planos profissionais
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-6 text-center hover:bg-white/80 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-[#511A2B] to-[#6d1f3f] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#511A2B] mb-1">{stat.number}</div>
                  <div className="text-sm text-[#511A2B]/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Plans */}
          <div className="grid lg:grid-cols-3 gap-8 md:mt-[15vh]">
            {plans.map((plan, index) => (
              <div key={plan.id} className={cn('relative group', plan.popular && 'lg:-mt-8 lg:mb-8 lg:scale-105')}>
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-[#FEC460] to-[#f59e0b] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    'relative bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full',
                    plan.popular && 'ring-2 ring-[#FEC460]/30 shadow-[#FEC460]/20'
                  )}
                >
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div
                      className={cn(
                        'inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br text-white mb-4 shadow-lg',
                        plan.gradient
                      )}
                    >
                      {plan.icon}
                    </div>

                    <h3 className="text-2xl font-bold text-[#511A2B] mb-2">{plan.name}</h3>
                    <p className="text-[#511A2B]/70 text-sm mb-4">{plan.description}</p>

                    <div className="bg-gradient-to-r from-[#FFEDC1] to-[#FEC460]/20 rounded-xl py-3 px-4 mb-6">
                      <p className="text-xs text-[#511A2B]/60 mb-1">Ideal para</p>
                      <p className="text-sm font-semibold text-[#511A2B]">{plan.idealFor}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-[#511A2B]">{formatCurrency(plan.price)}</span>
                      <span className="text-[#511A2B]/60 text-sm">/mês</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <div
                          className={cn(
                            'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                            feature.included
                              ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-sm'
                              : 'bg-[#511A2B]/20'
                          )}
                        >
                          {feature.included && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span
                          className={cn(
                            'text-sm font-medium',
                            feature.included ? 'text-[#511A2B]' : 'text-[#511A2B]/40'
                          )}
                        >
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={cn(
                      'w-full h-14 rounded-2xl font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl',
                      plan.popular
                        ? 'bg-gradient-to-r from-[#FEC460] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#FEC460] text-white'
                        : 'bg-gradient-to-r from-[#511A2B] to-[#6d1f3f] hover:from-[#6d1f3f] hover:to-[#511A2B] text-white'
                    )}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    <div className="flex items-center gap-2">
                      <span>Começar Agora</span>
                      <Zap className="w-4 h-4" />
                    </div>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <EmbeddedCheckoutDialog isOpen={isOpen} onClose={closeCheckout} plan={selectedPlan} />
    </div>
  );
}
