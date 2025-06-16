'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, ChevronUp, HelpCircle, Star, Zap, Crown, Rocket } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// Remover esta linha:
// import { StripeCheckout, useStripeCheckout } from "@/components/stripe/stripe-checkout"

// Adicionar esta linha:
import { EmbeddedCheckoutDialog, useEmbeddedCheckout } from '@/components/stripe/embedded-checkout-dialog';

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
}

const plans: Plan[] = [
  {
    id: 'silver',
    name: 'SILVER',
    price: 1000,
    description: 'Perfeito para começar sua jornada digital com recursos essenciais',
    idealFor: 'Pequenos fornecedores iniciantes',
    icon: <Rocket className="w-8 h-8" />,
    gradient: 'from-slate-600 via-slate-700 to-slate-800',
    features: [
      { name: '50 produtos cadastrados', included: true, tooltip: 'Limite de 50 produtos em seu catálogo' },
      { name: '100 pedidos por mês', included: true, tooltip: 'Processe até 100 pedidos mensais' },
      { name: 'Suporte por email', included: true, tooltip: 'Resposta em até 48 horas úteis' },
      { name: 'Relatórios básicos', included: true, tooltip: 'Visualize métricas essenciais do seu negócio' },
      { name: 'Perfil público', included: true, tooltip: 'Página pública para sua marca' },
      { name: 'Integração com redes sociais', included: false },
      { name: 'Destaque nos resultados', included: false },
      { name: 'API para integrações', included: false },
    ],
  },
  {
    id: 'gold',
    name: 'GOLD',
    price: 2000,
    originalPrice: 79.9,
    description: 'Acelere seu crescimento com recursos avançados e maior visibilidade',
    idealFor: 'Negócios em expansão',
    popular: true,
    badge: 'MAIS POPULAR',
    discount: '25% OFF',
    icon: <Zap className="w-8 h-8" />,
    gradient: 'from-[#46142b] via-[#5a1a35] to-[#6d1f3f]',
    features: [
      { name: '200 produtos cadastrados', included: true, tooltip: 'Limite de 200 produtos em seu catálogo' },
      { name: '500 pedidos por mês', included: true, tooltip: 'Processe até 500 pedidos mensais' },
      { name: 'Suporte prioritário', included: true, tooltip: 'Resposta em até 24 horas' },
      { name: 'Analytics avançado', included: true, tooltip: 'Relatórios detalhados e insights de negócio' },
      { name: 'Personalização completa', included: true, tooltip: 'Personalize seu perfil e produtos' },
      { name: 'Integração com redes sociais', included: true, tooltip: 'Conecte com Facebook, Instagram e mais' },
      { name: 'Destaque nos resultados', included: true, tooltip: 'Apareça no topo das buscas' },
      { name: 'API para integrações', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: 3000,
    originalPrice: 129.9,
    description: 'Solução enterprise com recursos ilimitados e suporte dedicado',
    idealFor: 'Grandes empresas estabelecidas',
    discount: '23% OFF',
    badge: 'PREMIUM',
    icon: <Crown className="w-8 h-8" />,
    gradient: 'from-amber-600 via-amber-700 to-amber-800',
    features: [
      { name: 'Produtos ilimitados', included: true, tooltip: 'Sem limites para seu catálogo' },
      { name: 'Pedidos ilimitados', included: true, tooltip: 'Processe quantos pedidos precisar' },
      { name: 'Suporte 24/7', included: true, tooltip: 'Atendimento exclusivo a qualquer hora' },
      { name: 'API completa', included: true, tooltip: 'Integre com seus sistemas existentes' },
      { name: 'Gerente dedicado', included: true, tooltip: 'Suporte personalizado para seu negócio' },
      { name: 'Treinamentos exclusivos', included: true, tooltip: 'Capacitação para sua equipe' },
      { name: 'Relatórios personalizados', included: true, tooltip: 'Dados e métricas sob demanda' },
      { name: 'Integração customizada', included: true, tooltip: 'Soluções personalizadas para seu negócio' },
    ],
  },
];

const faqs = [
  {
    question: 'Posso mudar de plano depois?',
    answer:
      'Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor imediatamente e o valor é ajustado proporcionalmente ao período restante.',
  },
  {
    question: 'Existe alguma taxa de configuração?',
    answer: 'Não, não cobramos nenhuma taxa de configuração. Você paga apenas o valor do plano escolhido.',
  },
  {
    question: 'Como funciona o período de teste?',
    answer:
      'Oferecemos 14 dias de teste gratuito para todos os planos. Você pode experimentar todos os recursos sem compromisso e cancelar a qualquer momento.',
  },
  {
    question: 'Quais formas de pagamento são aceitas?',
    answer:
      'Aceitamos cartões de crédito (Visa, Mastercard, American Express), PIX e boleto bancário para pagamentos mensais.',
  },
  {
    question: 'O que acontece se eu exceder os limites do meu plano?',
    answer:
      'Você receberá uma notificação quando estiver próximo de atingir os limites do seu plano. Caso exceda, você pode fazer upgrade para um plano superior ou pagar apenas pelo uso adicional.',
  },
];

const stats = [
  { number: '10K+', label: 'Fornecedores Ativos' },
  { number: '50K+', label: 'Produtos Cadastrados' },
  { number: '1M+', label: 'Pedidos Processados' },
  { number: '99.9%', label: 'Uptime Garantido' },
];

export function PlansContent() {
  const [showComparison, setShowComparison] = useState(false);
  const { user, updateUser } = useUser();
  const router = useRouter();
  // Na função PlansContent, substituir:
  // const { isOpen, selectedPlan, openCheckout, closeCheckout } = useStripeCheckout()
  const { isOpen, selectedPlan, openCheckout, closeCheckout } = useEmbeddedCheckout();

  const handleSelectPlan = (plan: Plan) => {
    // Converter para o formato esperado pelo EmbeddedCheckoutDialog
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
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#46142b]/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#46142b]/10 to-amber-500/10 rounded-full blur-3xl" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            >
              <Star className="w-2 h-2 text-[#46142b]/30" />
            </div>
          ))}
        </div>

        <div className="relative z-10">
          {/* Hero Section */}
          <div className="pb-16 text-center px-4">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#46142b]/10 to-amber-500/10 backdrop-blur-sm border border-[#46142b]/20 rounded-full px-6 py-2 mb-8">
                <Star className="w-4 h-4 text-[#46142b]" />
                <span className="text-sm font-medium text-[#46142b]">Planos Premium para Fornecedores</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[#46142b] via-[#5a1a35] to-amber-600 bg-clip-text text-transparent">
                  Escolha Seu Plano
                </span>
                <br />
                <span className="text-slate-800">Ideal</span>
              </h1>

              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Transforme seu negócio com nossa plataforma completa. Recursos profissionais, suporte dedicado e
                crescimento garantido.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/80 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-[#46142b] to-amber-600 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Plans Section */}
          <div className="max-w-7xl mx-auto px-4 pb-16">
            <div className="grid lg:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={cn('relative group', plan.popular && 'lg:-mt-8 lg:mb-8')}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-[#46142b] to-[#5a1a35] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {plan.discount && (
                    <div className="absolute -top-2 -right-2 z-20">
                      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                        {plan.discount}
                      </div>
                    </div>
                  )}

                  <div
                    className={cn(
                      'relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:shadow-3xl hover:-translate-y-2',
                      plan.popular && 'ring-2 ring-[#46142b]/20 shadow-[#46142b]/10'
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

                      <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                      <p className="text-slate-600 text-sm mb-4">{plan.description}</p>

                      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl py-3 px-4 mb-6">
                        <p className="text-xs text-slate-500 mb-1">Ideal para</p>
                        <p className="text-sm font-semibold text-slate-700">{plan.idealFor}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {plan.originalPrice && (
                          <span className="text-lg text-slate-400 line-through">R${plan.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold bg-gradient-to-r from-[#46142b] to-amber-600 bg-clip-text text-transparent">
                          R${Math.round(plan.price)}
                        </span>
                        <span className="text-slate-500 text-sm">/mês</span>
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
                                ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg'
                                : 'bg-slate-200'
                            )}
                          >
                            {feature.included && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex items-center gap-1 flex-1">
                            <span
                              className={cn(
                                'text-sm font-medium',
                                feature.included ? 'text-slate-700' : 'text-slate-400'
                              )}
                            >
                              {feature.name}
                            </span>
                            {feature.tooltip && feature.included && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-3 w-3 text-slate-400 hover:text-slate-600 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs max-w-xs">{feature.tooltip}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Button
                      className={cn(
                        'w-full h-14 rounded-2xl font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl',
                        plan.popular
                          ? 'bg-gradient-to-r from-[#46142b] to-[#5a1a35] hover:from-[#5a1a35] hover:to-[#46142b] text-white'
                          : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white'
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

          {/* Comparison Toggle */}
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <Button
              variant="outline"
              className="bg-white/60 backdrop-blur-sm border-white/20 text-slate-700 hover:bg-white/80 rounded-2xl px-8 py-3"
              onClick={() => setShowComparison(!showComparison)}
            >
              {showComparison ? (
                <span className="flex items-center gap-2">
                  Ocultar Comparação <ChevronUp className="h-4 w-4" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Ver Comparação Detalhada <ChevronDown className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>

          {/* Comparison Table */}
          {showComparison && (
            <div className="max-w-6xl mx-auto px-4 py-8">
              <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#46142b] to-amber-600 bg-clip-text text-transparent">
                  Comparação Completa
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-6 px-4 font-semibold text-slate-600">Recursos</th>
                        {plans.map((plan) => (
                          <th key={plan.id} className="text-center py-6 px-4">
                            <div className="flex flex-col items-center gap-2">
                              <div
                                className={cn(
                                  'w-8 h-8 rounded-lg bg-gradient-to-br text-white flex items-center justify-center',
                                  plan.gradient
                                )}
                              >
                                {plan.icon}
                              </div>
                              <span className={cn('font-bold', plan.popular ? 'text-[#46142b]' : 'text-slate-700')}>
                                {plan.name}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-medium text-slate-700">Produtos</td>
                        <td className="text-center py-4 px-4 text-slate-600">50</td>
                        <td className="text-center py-4 px-4 text-slate-600">200</td>
                        <td className="text-center py-4 px-4 text-slate-600">Ilimitado</td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-medium text-slate-700">Pedidos mensais</td>
                        <td className="text-center py-4 px-4 text-slate-600">100</td>
                        <td className="text-center py-4 px-4 text-slate-600">500</td>
                        <td className="text-center py-4 px-4 text-slate-600">Ilimitado</td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-medium text-slate-700">Suporte</td>
                        <td className="text-center py-4 px-4 text-slate-600">Email (48h)</td>
                        <td className="text-center py-4 px-4 text-slate-600">Prioritário (24h)</td>
                        <td className="text-center py-4 px-4 text-slate-600">24/7 Dedicado</td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-medium text-slate-700">API</td>
                        <td className="text-center py-4 px-4">
                          <div className="w-6 h-6 rounded-full bg-slate-200 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="w-6 h-6 rounded-full bg-slate-200 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mx-auto">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto px-4 py-16">
            <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[#46142b] to-amber-600 bg-clip-text text-transparent">
              Perguntas Frequentes
            </h3>

            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-slate-200">
                    <AccordionTrigger className="text-left font-semibold text-slate-800 hover:text-[#46142b] transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 leading-relaxed">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Support Cards */}
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Suporte Técnico',
                  description: 'Equipe especializada disponível para resolver qualquer problema técnico rapidamente',
                  icon: <HelpCircle className="w-8 h-8" />,
                  gradient: 'from-blue-500 to-blue-600',
                },
                {
                  title: 'Atualizações Gratuitas',
                  description: 'Acesso a todas as novas funcionalidades e melhorias da plataforma automaticamente',
                  icon: <Zap className="w-8 h-8" />,
                  gradient: 'from-green-500 to-green-600',
                },
                {
                  title: 'Segurança Garantida',
                  description: 'Proteção de dados, backups automáticos e certificados SSL para total segurança',
                  icon: <Crown className="w-8 h-8" />,
                  gradient: 'from-amber-500 to-amber-600',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={cn(
                      'w-16 h-16 bg-gradient-to-r rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg',
                      item.gradient
                    )}
                  >
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-4">{item.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <EmbeddedCheckoutDialog isOpen={isOpen} onClose={closeCheckout} plan={selectedPlan} />

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-10px) rotate(180deg);
            }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
