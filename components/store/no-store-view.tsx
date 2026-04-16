'use client';

import { Calendar, Package, Store, Users, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

const supplierFeatures = [
  {
    icon: Package,
    title: 'Vitrine Completa',
    description: 'Cadastre produtos ilimitados com fotos, descrições e preços personalizados',
  },
  {
    icon: Calendar,
    title: 'Eventos Exclusivos',
    description: 'Organize workshops, open houses e eventos para conectar com clientes',
  },
  {
    icon: Users,
    title: 'Comunidade Ativa',
    description: 'Acesso a milhares de profissionais e consumidores interessados',
  },
];

const wellnessFeatures = [
  {
    icon: Package,
    title: 'Catálogo de Serviços',
    description: 'Apresente terapias, sessões e atendimentos com duração e valores personalizados',
  },
  {
    icon: Calendar,
    title: 'Experiências Programadas',
    description: 'Crie aulas, vivências e eventos para fortalecer sua comunidade wellness',
  },
  {
    icon: Users,
    title: 'Conexões Qualificadas',
    description: 'Aproxime-se de pessoas em busca de saúde integral e qualidade de vida',
  },
];

const supplierSteps = [
  { number: '01', title: 'Cadastre sua loja', description: 'Informações básicas em 2 minutos' },
  { number: '02', title: 'Adicione produtos', description: 'Fotos e descrições dos seus itens' },
  { number: '03', title: 'Comece a vender', description: 'Alcance milhares de clientes' },
];

const wellnessSteps = [
  { number: '01', title: 'Cadastre seu espaço', description: 'Configure sua presença wellness em poucos passos' },
  { number: '02', title: 'Adicione serviços', description: 'Descreva sessões, experiências e valores' },
  { number: '03', title: 'Abra sua agenda', description: 'Receba novos contatos e agendamentos' },
];

interface NoStoreViewProps {
  onCreateStore: () => void;
  isWellness?: boolean;
}

export function NoStoreView({ onCreateStore, isWellness = false }: NoStoreViewProps) {
  const title = isWellness ? 'Crie seu Espaço Wellness' : 'Crie Sua Loja';
  const highlightedTitle = isWellness ? 'Em Poucos Passos' : 'Em Minutos';
  const description = isWellness
    ? 'Você ainda não possui um espaço wellness cadastrado. Configure agora e apresente seus serviços para uma comunidade que busca bem-estar.'
    : 'Você ainda não possui uma loja cadastrada. Configure agora e conecte-se com milhares de profissionais e consumidores.';
  const ctaLabel = isWellness ? 'Cadastrar Meu Espaço' : 'Cadastrar Minha Loja';
  const sectionSubtitle = isWellness
    ? 'Ferramentas completas para organizar seus serviços e ampliar seus atendimentos'
    : 'Ferramentas completas para crescer seu negócio';
  const stats = isWellness
    ? [
        { value: '10+', label: 'Espaços Ativos', color: 'text-[#511A2B]' },
        { value: '1K+', label: 'Atendimentos Realizados', color: 'text-[#FEC460]' },
        { value: '100+', label: 'Serviços Publicados', color: 'text-[#D56235]' },
      ]
    : [
        { value: '10+', label: 'Lojistas Ativos', color: 'text-[#511A2B]' },
        { value: '1K+', label: 'Vendas Realizadas', color: 'text-[#FEC460]' },
        { value: '100+', label: 'Produtos à venda', color: 'text-[#D56235]' },
      ];
  const finalTitle = isWellness ? 'Pronto Para Atender Mais Pessoas?' : 'Pronto Para Começar?';
  const finalDescription = isWellness
    ? 'Junte-se aos parceiros wellness que já estão ampliando sua agenda e fortalecendo sua presença no app'
    : 'Junte-se a centenas de lojistas que já transformaram seus negócios';
  const finalCtaLabel = isWellness ? 'Criar Meu Espaço Wellness' : 'Criar Minha Loja Agora';
  const features = isWellness ? wellnessFeatures : supplierFeatures;
  const steps = isWellness ? wellnessSteps : supplierSteps;

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full text-center">
        <div className="max-w-6xl mx-auto mb-8">
          <h1 className="text-5xl md:text-7xl font-black text-[#511A2B] mb-6 leading-tight">
            {title}
            <br />
            <span className="bg-gradient-to-r from-[#FEC460] via-[#D56235] to-[#FEC460] bg-clip-text text-transparent">
              {highlightedTitle}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-[#511A2B]/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>

          <Button
            onClick={onCreateStore}
            size="lg"
            className="group h-16 px-10 bg-[#511A2B] hover:bg-[#6d1f3f] text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-[#511A2B]/50 transition-all duration-300 hover:scale-105"
          >
            <Store className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
            {ctaLabel}
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>

        <div className="max-w-7xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-black text-[#511A2B] text-center mb-12">Como Funciona</h2>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-1 bg-gradient-to-r from-[#511A2B] via-[#FEC460] to-[#D56235]" />

            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-[#511A2B]/10 hover:border-[#511A2B]/30 transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#511A2B] to-[#6d1f3f] flex items-center justify-center text-white font-black text-2xl mb-6 mx-auto shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-black text-[#511A2B] mb-3 text-center">{step.title}</h3>
                  <p className="text-[#511A2B]/70 text-center font-medium">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-black text-[#511A2B] text-center mb-4">Tudo Que Você Precisa</h2>
          <p className="text-lg text-[#511A2B]/70 text-center mb-12">{sectionSubtitle}</p>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#511A2B]/10 hover:border-[#FEC460] group text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FEC460] to-[#f59e0b] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-[#511A2B] mb-3">{feature.title}</h3>
                <p className="text-[#511A2B]/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-10 md:p-16 shadow-2xl border-2 border-[#511A2B]/10">
            <div className="grid grid-cols-3 gap-8 mb-12">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className={`text-4xl md:text-5xl font-black ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-sm text-[#511A2B]/70 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>

            <h3 className="text-3xl md:text-4xl font-black text-[#511A2B] mb-4">{finalTitle}</h3>
            <p className="text-lg text-[#511A2B]/70 mb-8 max-w-2xl mx-auto">{finalDescription}</p>

            <Button
              onClick={onCreateStore}
              size="lg"
              className="group h-16 px-12 bg-gradient-to-r from-[#511A2B] to-[#6d1f3f] hover:from-[#6d1f3f] hover:to-[#511A2B] text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {finalCtaLabel}
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
