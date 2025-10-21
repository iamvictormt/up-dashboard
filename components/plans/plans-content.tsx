'use client';

import type React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Crown, Users, TrendingUp, Star, Shield, ArrowRight, Gift, Flame, Gem, Trophy } from 'lucide-react';
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
  mostComplete?: boolean;
}

const plans: Plan[] = [
  {
    id: 'silver',
    name: 'SILVER',
    price: 1000,
    description: 'Especialmente para Lojistas fora da cidade de São Paulo',
    idealFor: 'Lojistas de fora da capital',
    icon: <Gem className="w-6 h-6" />,
    gradient: 'from-[#511A2B] to-[#6d1f3f]',
    stripePriceId: 'price_silver_monthly',
    features: [
      { name: 'Vitrine personalizada da loja dentro da plataforma.', included: true },
      { name: 'Anúncios em destaque.', included: true },
      {
        name: 'Links clicáveis e personalizáveis (WhatsApp, site ou produto específico) definidos pelo lojista.',
        included: true,
      },
      {
        name: 'Visibilidade para dois públicos: Profissionais de decoração e Consumidores da comunidade Eu Amo Decoração.',
        included: true,
      },
      { name: 'Mural da Comunidade: publique novidades, lançamentos e promoções da loja.', included: true },
      { name: 'Suporte dedicado por WhatsApp e e-mail com atendimento rápido e personalizado.', included: true },
    ],
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: 5000,
    description: 'Para profissionais de elite',
    idealFor: 'Lojistas premium',
    badge: 'MAIS COMPLETO',
    icon: <Crown className="w-6 h-6" />,
    gradient: 'from-[#D56235] to-[#dc2626]',
    stripePriceId: 'price_premium_monthly',
    mostComplete: true,
    features: [
      {
        name: '1 evento presencial por mês, organizado em parceria com a UP Connection (open house, talk, café, workshop ou ativação).',
        included: true,
      },
      { name: 'Curadoria e convites feitos pela UP Connection (15 a 20 profissionais).', included: true },
      {
        name: 'Custos de realização do evento (estrutura, alimentação, brindes) são por conta do lojista.',
        included: true,
      },
      { name: 'Destaque na HOME PAGE por ser categoria Premium.', included: true },
      { name: 'Acesso antecipado a novas funcionalidades da plataforma.', included: true },
      { name: 'Vitrine personalizada da loja dentro da plataforma.', included: true },
      { name: 'Anúncios em destaque.', included: true },
      {
        name: 'Links clicáveis e personalizáveis (WhatsApp, site ou produto específico) definidos pelo lojista.',
        included: true,
      },
      {
        name: 'Visibilidade para dois públicos: Profissionais de decoração e Consumidores da comunidade Eu Amo Decoração.',
        included: true,
      },
      { name: 'Mural da Comunidade: publique novidades, lançamentos e promoções da loja.', included: true },
      { name: 'Suporte dedicado por WhatsApp e e-mail com atendimento rápido e personalizado.', included: true },
    ],
  },
  {
    id: 'gold',
    name: 'GOLD',
    price: 2000,
    description: 'Para profissionais que querem crescer',
    idealFor: 'Lojistas em crescimento',
    badge: 'MAIS POPULAR',
    icon: <Trophy className="w-6 h-6" />,
    gradient: 'from-[#FEC460] to-[#f59e0b]',
    stripePriceId: 'price_gold_monthly',
    popular: true,
    features: [
      { name: 'Vitrine personalizada da loja dentro da plataforma.', included: true },
      { name: 'Anúncios em destaque.', included: true },
      {
        name: 'Links clicáveis e personalizáveis (WhatsApp, site ou produto específico) definidos pelo lojista.',
        included: true,
      },
      {
        name: 'Visibilidade para dois públicos: Profissionais de decoração e Consumidores da comunidade Eu Amo Decoração.',
        included: true,
      },
      { name: 'Mural da Comunidade: publique novidades, lançamentos e promoções da loja.', included: true },
      { name: 'Suporte dedicado por WhatsApp e e-mail com atendimento rápido e personalizado.', included: true },
    ],
  },
];

const stats = [
  { number: '100+', label: 'Profissionais Ativos', icon: Users, color: 'from-[#511A2B] to-[#6d1f3f]' },
  { number: '15K+', label: 'Trabalhos Realizados', icon: TrendingUp, color: 'from-[#FEC460] to-[#f59e0b]' },
  { number: '4.8', label: 'Avaliação Média', icon: Star, color: 'from-[#D56235] to-[#dc2626]' },
  { number: '98%', label: 'Satisfação', icon: Shield, color: 'from-[#511A2B] to-[#6d1f3f]' },
];

export function PlansContent() {
  const { isOpen, selectedPlan, openCheckout, closeCheckout } = useEmbeddedCheckout();

  const handleSelectPlan = (plan: Plan) => {
    openCheckout({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      description: plan.description,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFEDC1] via-[#FFF5E1] to-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#511A2B]/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/4 -right-40 w-80 h-80 bg-[#FEC460]/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-[#D56235]/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-7xl mx-auto mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D56235] to-[#FEC460] text-white rounded-full px-5 py-2.5 shadow-lg">
                <Flame className="w-4 h-4" />
                <span className="text-sm font-bold">Oferta de Lançamento</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-[#511A2B]">
                Transforme
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-[#FEC460] via-[#D56235] to-[#FEC460] bg-clip-text text-transparent">
                    Sua Loja
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-4 bg-[#FEC460]/30 -rotate-1" />
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-[#511A2B]/80 leading-relaxed font-medium">
                Conecte-se com milhares de profissionais e consumidores. Escolha o plano perfeito para o seu negócio.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-3 shadow-md">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                  <span className="font-semibold text-[#511A2B]">Sem taxa de adesão</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-3 shadow-md">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                  <span className="font-semibold text-[#511A2B]">Sem comissão</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:rotate-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300',
                      stat.color
                    )}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-4xl font-black text-[#511A2B] mb-1">{stat.number}</div>
                  <div className="text-sm font-semibold text-[#511A2B]/70">{stat.label}</div>
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FEC460]/0 to-[#FEC460]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#511A2B] via-[#6d1f3f] to-[#511A2B] p-8 shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FEC460] to-[#f59e0b] flex items-center justify-center shadow-xl">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-1">Condição Especial de Lançamento</h3>
                  <p className="text-white/90 font-medium">Válido apenas para os primeiros lojistas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-[#511A2B] mb-4">Escolha Seu Plano</h2>
            <p className="text-xl text-[#511A2B]/70 font-medium">Todos os planos incluem benefícios exclusivos</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={cn('relative group', plan.popular && 'lg:-mt-6 lg:mb-6')}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div
                      className={cn(
                        'px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-xl text-white border-2 border-white',
                        plan.popular
                          ? 'bg-gradient-to-r from-[#FEC460] to-[#f59e0b]'
                          : 'bg-gradient-to-r from-[#D56235] to-[#dc2626]'
                      )}
                    >
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    'relative bg-white rounded-3xl p-8 shadow-xl transition-all duration-500 hover:shadow-2xl border-2',
                    plan.popular
                      ? 'border-[#FEC460] hover:border-[#FEC460] hover:-translate-y-4 hover:rotate-1'
                      : plan.mostComplete
                      ? 'border-[#dc2626] hover:border-[#dc2626] hover:-translate-y-4 hover:rotate-1'
                      : 'border-[#511A2B]/10 hover:border-[#511A2B]/30 hover:-translate-y-3'
                  )}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={cn(
                        'w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500',
                        plan.gradient
                      )}
                    >
                      {plan.icon}
                    </div>
                    <div className="text-right mt-2">
                      <div className="text-4xl font-black text-[#511A2B]">{formatCurrency(plan.price)}</div>
                      <div className="text-sm font-semibold text-[#511A2B]/60">/mês</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-3xl font-black text-[#511A2B] mb-2">{plan.name}</h3>
                    <p className="text-[#511A2B]/70 font-medium leading-relaxed">{plan.description}</p>
                  </div>

                  <div
                    className={cn(
                      'rounded-2xl p-4 mb-6 border-2',
                      plan.popular
                        ? 'bg-gradient-to-br from-[#FEC460]/10 to-[#FEC460]/5 border-[#FEC460]/30'
                        : plan.mostComplete
                        ? 'bg-gradient-to-br from-[#D56235]/10 to-[#dc2626]/5 border-[#dc2626]/30'
                        : 'bg-gradient-to-br from-[#511A2B]/5 to-transparent border-[#511A2B]/10'
                    )}
                  >
                    <div className="text-xs font-black text-[#511A2B]/60 uppercase tracking-wider mb-1">Ideal para</div>
                    <div className="text-base font-bold text-[#511A2B]">{plan.idealFor}</div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          <Check className="w-3 h-3 text-white stroke-[3]" />
                        </div>
                        <span className="text-sm font-medium text-[#511A2B]/90 leading-snug">{feature.name}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={cn(
                      'w-full h-14 rounded-2xl font-black text-base transition-all duration-300 shadow-lg hover:shadow-xl group/button relative overflow-hidden',
                      plan.popular
                        ? 'bg-gradient-to-r from-[#FEC460] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#FEC460] text-white'
                        : plan.mostComplete
                        ? 'bg-gradient-to-r from-[#D56235] to-[#dc2626] hover:from-[#dc2626] hover:to-[#D56235]'
                        : 'bg-gradient-to-r from-[#511A2B] to-[#6d1f3f] hover:from-[#6d1f3f] hover:to-[#511A2B] text-white'
                    )}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Começar Agora
                      <ArrowRight className="w-5 h-5 group-hover/button:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-[#FFEDC1]/30 p-10 shadow-xl border-2 border-[#511A2B]/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FEC460]/10 rounded-full blur-3xl" />
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#511A2B] to-[#6d1f3f] flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-[#511A2B] mb-4">Garantia de Satisfação</h3>
              <p className="text-lg text-[#511A2B]/80 leading-relaxed font-medium max-w-2xl mx-auto">
                Junte-se a centenas de lojistas que já transformaram seus negócios.
                <br /> Estamos comprometidos com o seu sucesso.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <EmbeddedCheckoutDialog isOpen={isOpen} onClose={closeCheckout} plan={selectedPlan} />
    </div>
  );
}
