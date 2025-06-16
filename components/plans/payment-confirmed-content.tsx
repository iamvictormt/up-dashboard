'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle,
  ArrowRight,
  Store,
  Shield,
  Headphones,
  TrendingUp,
  BarChart3,
  Crown,
  Mail,
  HelpCircle,
  Quote,
  ShoppingCart,
} from 'lucide-react';
import { appUrl } from '@/constants/appRoutes';
import { useUser } from '@/contexts/user-context';

export function PaymentConfirmedContent() {
  const { user } = useUser();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Store,
      title: 'Loja Virtual Premium',
      description: 'Sua vitrine digital profissional com ferramentas avançadas',
    },
    {
      icon: Crown,
      title: 'Status VIP',
      description: 'Acesso prioritário e recursos exclusivos',
    },
    {
      icon: TrendingUp,
      title: 'Marketing Avançado',
      description: 'Ferramentas de promoção e campanhas automatizadas',
    },
    {
      icon: BarChart3,
      title: 'Analytics Pro',
      description: 'Relatórios detalhados e insights em tempo real',
    },
    {
      icon: Shield,
      title: 'Selo de Confiança',
      description: 'Certificação que aumenta sua credibilidade',
    },
    {
      icon: Headphones,
      title: 'Suporte Premium',
      description: 'Atendimento prioritário 24/7',
    },
  ];

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-5xl font-bold text-gray-900 mb-4">Pagamento Confirmado!</h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Sua assinatura {user?.subscription?.planName} foi ativada com sucesso.
              <br />
              Agora você tem acesso a todos os recursos premium.
            </p>

            <div className="inline-flex items-center gap-2 bg-[#46142b] text-white px-6 py-3 rounded-full font-semibold">
              <Crown className="w-5 h-5" />
              Status {user?.subscription?.planName} Ativo
            </div>
          </div>

          {/* Quick Stats */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="text-3xl font-bold text-[#46142b] mb-2">6+</div>
              <div className="text-gray-600">Recursos Premium</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="text-3xl font-bold text-green-600 mb-2">∞</div>
              <div className="text-gray-600">Potencial de Vendas</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Suporte Dedicado</div>
            </div>
          </div>

          {/* Features Grid */}
          <div
            className={`mb-16 transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              O que você ganhou com a inscrição {user?.subscription?.planName}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 border border-gray-200 rounded-2xl bg-white hover:border-[#46142b]/30 hover:bg-[#46142b]/5 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-[#46142b]/10 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-[#46142b]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <Card
            className={`border-0 shadow-lg bg-gradient-to-r from-[#46142b] to-[#5a1a35] text-white transition-all duration-1000 delay-700 rounded-3xl ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Próximos Passos</h2>
              <p className="text-white/90 mb-8 text-lg">
                Acesse o painel lateral esquerdo para começar a configurar sua loja
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push(appUrl.myStore)}
                  size="lg"
                  className="bg-white text-[#46142b] hover:bg-gray-100 font-semibold px-8 py-3"
                >
                  <ShoppingCart className="mr-2 w-5 h-5" />
                  Ir para Minha loja
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push(appUrl.base + '/help')}
                  size="lg"
                  className="bg-white text-[#46142b] hover:bg-gray-100 font-semibold px-8 py-3"
                >
                  <HelpCircle className="mr-2 w-5 h-5" />
                  Preciso de Ajuda
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div
            className={`mt-12 text-center space-y-4 transition-all duration-1000 delay-900 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Mail className="w-5 h-5" />
              <span>Você receberá um email de confirmação em instantes</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Shield className="w-5 h-5" />
              <span>Transação processada com segurança</span>
            </div>

            <p className="text-gray-500 mt-6">
              Dúvidas? Entre em contato: <span className="text-[#46142b] font-semibold">upconnection01@gmail.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
