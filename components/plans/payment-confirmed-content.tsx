'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  ArrowRight,
  Crown,
  Star,
  Zap,
  Users,
  TrendingUp,
  Shield,
  Headphones,
  Sparkles,
  Gift,
  Award,
} from 'lucide-react';
import { appUrl } from '@/constants/appRoutes';

export function PaymentConfirmedContent() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    const confettiTimer = setTimeout(() => setConfetti(true), 500);
    return () => {
      clearTimeout(timer);
      clearTimeout(confettiTimer);
    };
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#511A2B]/5 via-white to-[#FEC460]/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#511A2B]/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-40 right-20 w-48 h-48 bg-[#FEC460]/20 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-72 h-72 bg-[#D56235]/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />

        {/* Confetti effect */}
        {confetti && (
          <>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-20px',
                  backgroundColor: ['#511A2B', '#FEC460', '#D56235'][Math.floor(Math.random() * 3)],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              />
            ))}
          </>
        )}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}
          >
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FEC460] via-[#D56235] to-[#511A2B] rounded-full blur-2xl opacity-30 animate-pulse" />
              <div className="relative inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-white to-gray-50 rounded-full shadow-2xl border-4 border-white">
                <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={2.5} />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black pb-6 bg-gradient-to-r from-[#511A2B] via-[#D56235] to-[#511A2B] bg-clip-text text-transparent animate-gradient">
              Pagamento Confirmado!
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
              Parabéns! Sua assinatura foi ativada com sucesso.
              <br />
              Agora você tem acesso a todos os recursos exclusivos.
            </p>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FEC460] to-[#f59e0b] rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative text-center p-8 bg-white rounded-3xl border-2 border-[#FEC460]/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-5xl font-black bg-gradient-to-r from-[#FEC460] to-[#f59e0b] bg-clip-text text-transparent mb-3">
                  3x
                </div>
                <div className="text-gray-700 font-semibold text-lg">Mais Visibilidade</div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#D56235] to-[#dc2626] rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative text-center p-8 bg-white rounded-3xl border-2 border-[#D56235]/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-5xl font-black bg-gradient-to-r from-[#D56235] to-[#dc2626] bg-clip-text text-transparent mb-3">
                  ∞
                </div>
                <div className="text-gray-700 font-semibold text-lg">Contatos Ilimitados</div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#511A2B] to-[#6d1f3f] rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative text-center p-8 bg-white rounded-3xl border-2 border-[#511A2B]/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-5xl font-black bg-gradient-to-r from-[#511A2B] to-[#6d1f3f] bg-clip-text text-transparent mb-3">
                  24/7
                </div>
                <div className="text-gray-700 font-semibold text-lg">Suporte Premium</div>
              </div>
            </div>
          </div>

          <div
            className={`mb-16 transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#511A2B] to-[#6d1f3f] text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
                Seus Benefícios
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#511A2B]">Novos Recursos</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="group relative" style={{ animationDelay: `${index * 100}ms` }}>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${benefit.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                  />
                  <div className="relative flex flex-col items-center text-center gap-4 p-8 bg-white border-2 border-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
                    <div
                      className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      <benefit.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#511A2B] mb-2 text-lg">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`relative overflow-hidden bg-gradient-to-br from-[#511A2B] to-[#6d1f3f] rounded-3xl p-10 md:p-12 text-center shadow-2xl transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FEC460] rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D56235] rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Próximos Passos</h2>
              <p className="text-white/90 mb-10 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Acesse seu dashboard para começar a aproveitar todos os benefícios premium agora mesmo!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push(appUrl.dashboard)}
                  size="lg"
                  className="bg-white text-[#511A2B] hover:bg-gray-100 font-bold text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Acessar Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push(appUrl.help)}
                  size="lg"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#511A2B] font-bold text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <Headphones className="mr-2 w-5 h-5" />
                  Central de Ajuda
                </Button>
              </div>
            </div>
          </div>

          <div
            className={`mt-12 space-y-6 transition-all duration-1000 delay-900 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-gray-700">
              <div className="flex items-center gap-3 bg-green-50 px-6 py-3 rounded-full border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">Email de confirmação enviado</span>
              </div>

              <div className="flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-full border border-blue-200">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Transação 100% segura</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600">
                Dúvidas? Entre em contato:{' '}
                <a
                  href="mailto:suporte@upconnection.com"
                  className="text-[#511A2B] font-bold hover:text-[#D56235] transition-colors"
                >
                  suporte@upconnection.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
