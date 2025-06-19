'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Crown, Star, Zap, Users, TrendingUp, Shield, Headphones } from 'lucide-react';
import { appUrl } from '@/constants/appRoutes';

export function PaymentConfirmedContent() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const benefits = [
    {
      icon: Crown,
      title: 'Status Premium Ativo',
      description: 'Seu perfil agora tem destaque especial',
      color: 'from-[#FEC460] to-[#f59e0b]',
    },
    {
      icon: Star,
      title: 'Visibilidade Máxima',
      description: 'Apareça sempre no topo dos resultados',
      color: 'from-[#D56235] to-[#dc2626]',
    },
    {
      icon: Users,
      title: 'Mais Clientes',
      description: 'Receba até 3x mais contatos',
      color: 'from-[#511A2B] to-[#6d1f3f]',
    },
    {
      icon: TrendingUp,
      title: 'Relatórios Avançados',
      description: 'Acompanhe seu crescimento em tempo real',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Shield,
      title: 'Selo de Verificação',
      description: 'Aumente a confiança dos clientes',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Headphones,
      title: 'Suporte Prioritário',
      description: 'Atendimento exclusivo 24/7',
      color: 'from-purple-500 to-purple-600',
    },
  ];

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
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div
              className={`text-center mb-16 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/80 backdrop-blur-sm rounded-full mb-8 shadow-xl">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-[#511A2B] mb-4">Pagamento Confirmado!</h1>

              <p className="text-xl text-[#511A2B]/70 mb-8 max-w-2xl mx-auto">
                Parabéns! Sua assinatura premium foi ativada com sucesso. Agora você tem acesso a todos os recursos
                exclusivos.
              </p>

              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FEC460] to-[#f59e0b] text-white px-8 py-4 rounded-full font-semibold shadow-lg">
                <Crown className="w-5 h-5" />
                Status Premium Ativo
              </div>
            </div>

            {/* Quick Stats */}
            <div
              className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg">
                <div className="text-3xl font-bold text-[#FEC460] mb-2">3x</div>
                <div className="text-[#511A2B]/70">Mais Visibilidade</div>
              </div>
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg">
                <div className="text-3xl font-bold text-[#D56235] mb-2">∞</div>
                <div className="text-[#511A2B]/70">Contatos Ilimitados</div>
              </div>
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg">
                <div className="text-3xl font-bold text-[#511A2B] mb-2">24/7</div>
                <div className="text-[#511A2B]/70">Suporte Premium</div>
              </div>
            </div>

            {/* Benefits Grid */}
            <div
              className={`mb-16 transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h2 className="text-3xl font-bold text-[#511A2B] text-center mb-12">Seus Novos Benefícios Premium</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#511A2B] mb-2">{benefit.title}</h3>
                      <p className="text-[#511A2B]/70 text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div
              className={`bg-white/60 backdrop-blur-sm border border-white/40 rounded-3xl p-8 text-center shadow-xl transition-all duration-1000 delay-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h2 className="text-2xl font-bold text-[#511A2B] mb-4">Próximos Passos</h2>
              <p className="text-[#511A2B]/70 mb-8 text-lg">
                Acesse seu dashboard para começar a aproveitar todos os benefícios premium
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push(appUrl.dashboard)}
                  size="lg"
                >
                  Acessar Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push(appUrl.help)}
                  size="lg"
                >
                  <Headphones className="mr-2 w-5 h-5" />
                  Central de Ajuda
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div
              className={`mt-12 text-center space-y-4 transition-all duration-1000 delay-900 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-[#511A2B]/70">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Você receberá um email de confirmação em instantes</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-[#511A2B]/70">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Transação processada com total segurança</span>
              </div>

              <p className="text-[#511A2B]/60 mt-6">
                Dúvidas? Entre em contato: <span className="text-[#511A2B] font-semibold">suporte@upconnection.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
