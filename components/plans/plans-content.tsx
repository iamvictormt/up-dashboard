'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PlanFeature {
  name: string;
  included: boolean;
  tooltip?: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  discount?: string;
  circleColor: string;
  illustration: string;
  idealFor: string;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'STARTER',
    price: 29.9,
    description: 'Ideal para fornecedores iniciantes que estão começando sua jornada digital',
    idealFor: 'Pequenos fornecedores e negócios iniciantes',
    circleColor: 'bg-gradient-to-br from-gray-600 to-gray-800',
    illustration: '🚀',
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
    id: 'pro',
    name: 'PRO',
    price: 59.9,
    description: 'Para fornecedores em crescimento que buscam mais visibilidade e recursos avançados',
    idealFor: 'Negócios estabelecidos buscando crescimento',
    popular: true,
    circleColor: 'bg-gradient-to-br from-[#FEC460] to-[#F59E0B]',
    illustration: '💻',
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
    id: 'business',
    name: 'BUSINESS',
    price: 99.9,
    description: 'Solução completa para grandes operações com necessidades avançadas',
    idealFor: 'Grandes fornecedores e empresas estabelecidas',
    discount: '20% Off',
    circleColor: 'bg-gradient-to-br from-gray-600 to-gray-800',
    illustration: '💼',
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

export function PlansContent() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const { user, updateUser } = useUser();
  const router = useRouter();

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (user?.partnerSupplier) {
        updateUser({
          partnerSupplier: {
            ...user.partnerSupplier,
            isPaid: true,
          },
        });
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full">
        {/* Header */}
        <div className="pt-16 pb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-2">
            Escolha o plano ideal para o seu negócio
          </h1>
          <p className="text-[#511A2B]/70">
            Todos os planos incluem acesso à plataforma completa, atualizações gratuitas e suporte técnico
          </p>
        </div>

        {/* Plans Cards */}
        <div className="mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#FEC460] hover:bg-[#FEC460]/90 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      Popular
                    </Badge>
                  </div>
                )}

                {/* Discount Badge */}
                {plan.discount && (
                  <div className="absolute -top-2 -right-2 bg-[#FEC460] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {plan.discount}
                  </div>
                )}

                {/* Illustration Circle */}
                <div className="flex justify-center mb-6">
                  <div
                    className={cn('w-32 h-32 rounded-full flex items-center justify-center text-4xl', plan.circleColor)}
                  >
                    <span className="text-white text-5xl">{plan.illustration}</span>
                  </div>
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">{plan.name}</h3>

                {/* Plan Description */}
                <p className="text-gray-500 text-sm text-center mb-2">{plan.description}</p>

                {/* Ideal For */}
                <div className="bg-gray-50 rounded-lg py-2 px-3 text-center mb-6">
                  <p className="text-xs text-gray-500">Ideal para</p>
                  <p className="text-sm font-medium text-gray-700">{plan.idealFor}</p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full ${
                          feature.included ? 'bg-green-500' : 'bg-gray-200'
                        } flex items-center justify-center flex-shrink-0`}
                      >
                        {feature.included ? <Check className="w-3 h-3 text-white" /> : null}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-sm font-medium ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                          {feature.name}
                        </span>
                        {feature.tooltip && feature.included && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-3 w-3 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">{feature.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900">R${Math.round(plan.price)}</span>
                    <span className="text-gray-500 text-sm">/ Mês</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  className={cn(
                    'w-full h-12 rounded-xl font-medium text-base transition-all duration-300',
                    plan.popular
                      ? 'bg-[#F5B13D] hover:bg-[#F5B13D]/90 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  )}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isProcessing}
                >
                  {isProcessing && selectedPlan === plan.id ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processando...
                    </div>
                  ) : (
                    'Começar agora'
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Toggle */}
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <Button
            variant="outline"
            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            onClick={() => setShowComparison(!showComparison)}
          >
            {showComparison ? (
              <span className="flex items-center gap-2">
                Ocultar comparação detalhada <ChevronUp className="h-4 w-4" />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Ver comparação detalhada <ChevronDown className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>

        {/* Comparison Table */}
        {showComparison && (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Comparação de Planos</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-medium text-gray-500">Recursos</th>
                      {plans.map((plan) => (
                        <th key={plan.id} className="text-center py-4 px-4">
                          <span className={cn('font-bold', plan.popular ? 'text-[#FEC460]' : 'text-gray-900')}>
                            {plan.name}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-4 font-medium text-gray-700">Produtos</td>
                      <td className="text-center py-4 px-4">50</td>
                      <td className="text-center py-4 px-4">200</td>
                      <td className="text-center py-4 px-4">Ilimitado</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-4 font-medium text-gray-700">Pedidos mensais</td>
                      <td className="text-center py-4 px-4">100</td>
                      <td className="text-center py-4 px-4">500</td>
                      <td className="text-center py-4 px-4">Ilimitado</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-4 font-medium text-gray-700">Tempo de resposta suporte</td>
                      <td className="text-center py-4 px-4">48h</td>
                      <td className="text-center py-4 px-4">24h</td>
                      <td className="text-center py-4 px-4">Imediato</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-4 font-medium text-gray-700">Personalização</td>
                      <td className="text-center py-4 px-4">Básica</td>
                      <td className="text-center py-4 px-4">Completa</td>
                      <td className="text-center py-4 px-4">Premium</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-4 font-medium text-gray-700">Integração redes sociais</td>
                      <td className="text-center py-4 px-4">
                        <div className="inline-flex items-center justify-center w-6 h-6">
                          <div className="w-4 h-4 rounded-full bg-gray-200" />
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="inline-flex items-center justify-center w-6 h-6">
                          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="inline-flex items-center justify-center w-6 h-6">
                          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-4 font-medium text-gray-700">Destaque nos resultados</td>
                      <td className="text-center py-4 px-4">
                        <div className="inline-flex items-center justify-center w-6 h-6">
                          <div className="w-4 h-4 rounded-full bg-gray-200" />
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="inline-flex items-center justify-center w-6 h-6">
                          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="inline-flex items-center justify-center w-6 h-6">
                          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-4 font-medium text-gray-700">API para integrações</td>
                      <td className="text-center py-4 px-4">
                        <div className="inline-flex items-center justify-center w-6 h-6">
                          <div className="w-4 h-4 rounded-full bg-gray-200" />
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="inline-flex items-center justify-center w-6 h-6">
                          <div className="w-4 h-4 rounded-full bg-gray-200" />
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="inline-flex items-center justify-center w-6 h-6">
                          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-4 font-medium text-gray-700">Gerente dedicado</td>
                      <td className="text-center py-4 px-4">
                        <div className="inline-flex items-center justify-center w-6 h-6">
                          <div className="w-4 h-4 rounded-full bg-gray-200" />
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="inline-flex items-center justify-center w-6 h-6">
                          <div className="w-4 h-4 rounded-full bg-gray-200" />
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="inline-flex items-center justify-center w-6 h-6">
                          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
