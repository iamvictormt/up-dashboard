'use client';

import { useState } from 'react';
import {
  Crown,
  Check,
  X,
  Star,
  Users,
  Calendar,
  Briefcase,
  GraduationCap,
  Zap,
  TrendingUp,
  Gift,
  Clock,
  BarChart3,
  Headphones,
  Award,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser, usePlan, useUserStats } from '@/contexts/user-context';
import { Skeleton } from '@/components/ui/skeleton';

// Benefícios inclusos no plano
const planBenefits = [
  {
    category: 'Networking',
    icon: Users,
    benefits: [
      { name: 'Contato direto com profissionais', included: true },
      { name: 'Acesso a perfis completos', included: true },
      { name: 'Chat prioritário', included: true },
      { name: 'Videochamadas ilimitadas', included: true },
    ],
  },
  {
    category: 'Eventos & Workshops',
    icon: Calendar,
    benefits: [
      { name: 'Participação em workshops', included: true },
      { name: 'Inscrição em eventos', included: true },
      { name: 'Acesso antecipado a eventos exclusivos', included: true },
      { name: 'Certificados de participação', included: true },
    ],
  },
  {
    category: 'Loja & Negócios',
    icon: Briefcase,
    benefits: [
      { name: 'Loja personalizada', included: true },
      { name: 'Analytics avançados', included: true },
      { name: 'Projetos simultâneos', included: true },
      { name: 'Suporte prioritário', included: true },
    ],
  },
  {
    category: 'Recursos Premium',
    icon: Sparkles,
    benefits: [
      { name: 'Badge Premium no perfil', included: true },
      { name: 'Destaque em buscas', included: true },
      { name: 'Relatórios mensais', included: true },
      { name: 'API de integração', included: false },
    ],
  },
];

// Comparação de planos
const planComparison = [
  {
    name: 'Básico',
    price: 'Gratuito',
    type: 'basic' as const,
    color: 'from-gray-400 to-gray-500',
    features: {
      contacts: 5,
      workshops: 2,
      events: 3,
      projects: 1,
      support: 'Email',
      analytics: false,
      priority: false,
      badge: false,
    },
  },
  {
    name: 'Premium',
    price: 'R$ 49,90',
    type: 'premium' as const,
    color: 'from-purple-500 to-purple-600',
    features: {
      contacts: 100,
      workshops: 15,
      events: 20,
      projects: 10,
      support: 'Chat + Email',
      analytics: true,
      priority: true,
      badge: true,
    },
  },
  {
    name: 'Enterprise',
    price: 'R$ 149,90',
    type: 'enterprise' as const,
    color: 'from-yellow-400 to-yellow-500',
    features: {
      contacts: 999,
      workshops: 999,
      events: 999,
      projects: 999,
      support: '24/7 + Telefone',
      analytics: true,
      priority: true,
      badge: true,
    },
  },
];

// Histórico de benefícios utilizados
const benefitsHistory = [
  {
    date: '28 Jan 2025',
    action: 'Participou do Workshop de React',
    points: '+50 pontos',
    type: 'workshop',
  },
  {
    date: '25 Jan 2025',
    action: 'Conectou com Maria Silva',
    points: '+10 pontos',
    type: 'contact',
  },
  {
    date: '22 Jan 2025',
    action: 'Inscreveu-se no Evento de Tecnologia',
    points: '+25 pontos',
    type: 'event',
  },
  {
    date: '20 Jan 2025',
    action: "Criou projeto 'App Mobile'",
    points: '+30 pontos',
    type: 'project',
  },
];

export function BenefitsContent() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const { user, isLoading } = useUser();
  const { plan, usage, getRemainingUsage } = usePlan();
  const { stats } = useUserStats();

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 w-full">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full max-w-7xl mx-auto">
          <div className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !plan || !usage || !stats) {
    return (
      <div className="p-6 md:p-8 w-full">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-[#511A2B] text-lg font-medium">Erro ao carregar dados do usuário</p>
          </div>
        </div>
      </div>
    );
  }

  // Dados de uso atual baseados no contexto
  const usageData = [
    {
      feature: 'Contatos com Profissionais',
      used: usage.contacts,
      limit: plan.features.contacts,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      feature: 'Workshops Participados',
      used: usage.workshops,
      limit: plan.features.workshops,
      icon: GraduationCap,
      color: 'bg-green-500',
    },
    {
      feature: 'Eventos Inscritos',
      used: usage.events,
      limit: plan.features.events,
      icon: Calendar,
      color: 'bg-orange-500',
    },
    {
      feature: 'Projetos Ativos',
      used: usage.projects,
      limit: plan.features.projects,
      icon: Briefcase,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-2">Meus Benefícios</h1>
              <p className="text-[#511A2B]/70">Gerencie sua assinatura e aproveite todos os benefícios</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge className="bg-green-100 text-green-700 border-green-200 rounded-lg px-3 py-1">
              {plan.status === 'active' ? 'Ativo' : 'Inativo'}
            </Badge>
            <Button className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl">
              <TrendingUp className="w-4 h-4 mr-2" />
              Fazer Upgrade
            </Button>
          </div>
        </div>

        {/* Plano Atual */}
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 rounded-2xl mb-8 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{plan.name}</h2>
                  <p className="text-white/80">
                    {plan.price}/{plan.period === 'monthly' ? 'mês' : 'ano'}
                  </p>
                  {plan.nextBilling && <p className="text-sm text-white/70">Próxima cobrança: {plan.nextBilling}</p>}
                </div>
              </div>

              <div className="text-center md:text-right">
                {plan.daysLeft && (
                  <>
                    <div className="text-3xl font-bold">{plan.daysLeft}</div>
                    <div className="text-sm text-white/80">dias restantes</div>
                  </>
                )}
                <Button variant="outline" className="mt-2 border-white/30 text-white hover:bg-white/10 rounded-xl">
                  Gerenciar Assinatura
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="grid grid-cols-4 bg-white/80 rounded-2xl p-1 mb-8 min-w-max w-full">
              <TabsTrigger
                value="overview"
                className="rounded-xl data-[state=active]:bg-[#511A2B] data-[state=active]:text-white text-xs md:text-sm px-2 md:px-3"
              >
                Visão Geral
              </TabsTrigger>
              <TabsTrigger
                value="usage"
                className="rounded-xl data-[state=active]:bg-[#511A2B] data-[state=active]:text-white text-xs md:text-sm px-2 md:px-3"
              >
                Uso Atual
              </TabsTrigger>
              <TabsTrigger
                value="plans"
                className="rounded-xl data-[state=active]:bg-[#511A2B] data-[state=active]:text-white text-xs md:text-sm px-2 md:px-3"
              >
                Comparar Planos
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-xl data-[state=active]:bg-[#511A2B] data-[state=active]:text-white text-xs md:text-sm px-2 md:px-3"
              >
                Histórico
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Benefícios por Categoria */}
              <div className="lg:col-span-2 space-y-6">
                {planBenefits.map((category, index) => (
                  <Card key={index} className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-[#511A2B] flex items-center">
                        <category.icon className="w-5 h-5 mr-2" />
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center space-x-3">
                            {benefit.included ? (
                              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                                <X className="w-3 h-3 text-gray-400" />
                              </div>
                            )}
                            <span
                              className={`text-sm ${
                                benefit.included ? 'text-[#511A2B]' : 'text-gray-400 line-through'
                              }`}
                            >
                              {benefit.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Stats Rápidas */}
              <div className="space-y-4">
                <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-[#511A2B]">{stats.points.toLocaleString()}</div>
                    <div className="text-sm text-[#511A2B]/70">Pontos Acumulados</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-[#511A2B]">{stats.certificates}</div>
                    <div className="text-sm text-[#511A2B]/70">Certificados Obtidos</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-[#511A2B]">{stats.successRate}%</div>
                    <div className="text-sm text-[#511A2B]/70">Taxa de Sucesso</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Uso Atual */}
          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {usageData.map((item, index) => (
                <Card key={index} className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#511A2B]">{item.feature}</h3>
                          <p className="text-sm text-[#511A2B]/70">
                            {item.used} de {item.limit === 999 ? '∞' : item.limit} utilizados
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#511A2B]">
                          {item.limit === 999 ? '∞' : Math.round((item.used / item.limit) * 100)}%
                        </div>
                      </div>
                    </div>
                    {item.limit !== 999 && (
                      <>
                        <Progress value={(item.used / item.limit) * 100} className="h-3" />
                        <div className="flex justify-between text-xs text-[#511A2B]/60 mt-2">
                          <span>{item.used} usado</span>
                          <span>{item.limit - item.used} restante</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Dicas de Otimização */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Dicas para Otimizar seu Plano</h3>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Você ainda tem {getRemainingUsage('contacts')} contatos disponíveis este mês</li>
                      <li>
                        • Participe de mais {getRemainingUsage('workshops')} workshops para maximizar seu aprendizado
                      </li>
                      <li>
                        • Considere criar mais {getRemainingUsage('projects')} projetos para expandir seu portfólio
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparar Planos */}
          <TabsContent value="plans" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {planComparison.map((planOption, index) => (
                <Card
                  key={index}
                  className={`${
                    planOption.type === plan.type
                      ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg scale-105'
                      : 'bg-white/80 border-[#511A2B]/10'
                  } rounded-2xl transition-all duration-300`}
                >
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      {planOption.type === plan.type && (
                        <Badge className="bg-white/20 text-white hover:bg-white/20 rounded-lg mb-3">Plano Atual</Badge>
                      )}
                      <h3
                        className={`text-xl font-bold ${
                          planOption.type === plan.type ? 'text-white' : 'text-[#511A2B]'
                        } mb-2`}
                      >
                        {planOption.name}
                      </h3>
                      <div
                        className={`text-3xl font-bold ${
                          planOption.type === plan.type ? 'text-white' : 'text-[#511A2B]'
                        }`}
                      >
                        {planOption.price}
                      </div>
                      {planOption.price !== 'Gratuito' && (
                        <div
                          className={`text-sm ${planOption.type === plan.type ? 'text-white/80' : 'text-[#511A2B]/70'}`}
                        >
                          /mês
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span
                          className={`text-sm ${planOption.type === plan.type ? 'text-white/90' : 'text-[#511A2B]/80'}`}
                        >
                          Contatos
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            planOption.type === plan.type ? 'text-white' : 'text-[#511A2B]'
                          }`}
                        >
                          {planOption.features.contacts === 999 ? 'Ilimitado' : `${planOption.features.contacts}/mês`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          className={`text-sm ${planOption.type === plan.type ? 'text-white/90' : 'text-[#511A2B]/80'}`}
                        >
                          Workshops
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            planOption.type === plan.type ? 'text-white' : 'text-[#511A2B]'
                          }`}
                        >
                          {planOption.features.workshops === 999 ? 'Ilimitado' : `${planOption.features.workshops}/mês`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          className={`text-sm ${planOption.type === plan.type ? 'text-white/90' : 'text-[#511A2B]/80'}`}
                        >
                          Eventos
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            planOption.type === plan.type ? 'text-white' : 'text-[#511A2B]'
                          }`}
                        >
                          {planOption.features.events === 999 ? 'Ilimitado' : `${planOption.features.events}/mês`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          className={`text-sm ${planOption.type === plan.type ? 'text-white/90' : 'text-[#511A2B]/80'}`}
                        >
                          Projetos
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            planOption.type === plan.type ? 'text-white' : 'text-[#511A2B]'
                          }`}
                        >
                          {planOption.features.projects === 999 ? 'Ilimitado' : planOption.features.projects}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          className={`text-sm ${planOption.type === plan.type ? 'text-white/90' : 'text-[#511A2B]/80'}`}
                        >
                          Suporte
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            planOption.type === plan.type ? 'text-white' : 'text-[#511A2B]'
                          }`}
                        >
                          {planOption.features.support}
                        </span>
                      </div>
                    </div>

                    <Button
                      className={`w-full rounded-xl ${
                        planOption.type === plan.type
                          ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                          : planOption.name === 'Básico'
                          ? 'bg-gray-500 hover:bg-gray-600 text-white'
                          : 'bg-[#511A2B] hover:bg-[#511A2B]/90 text-white'
                      }`}
                      disabled={planOption.type === plan.type}
                    >
                      {planOption.type === plan.type
                        ? 'Plano Atual'
                        : planOption.name === 'Básico'
                        ? 'Downgrade'
                        : 'Fazer Upgrade'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Histórico */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#511A2B] flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Atividades Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {benefitsHistory.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          item.type === 'workshop'
                            ? 'bg-green-100'
                            : item.type === 'contact'
                            ? 'bg-blue-100'
                            : item.type === 'event'
                            ? 'bg-orange-100'
                            : 'bg-purple-100'
                        }`}
                      >
                        {item.type === 'workshop' && <GraduationCap className="w-5 h-5 text-green-600" />}
                        {item.type === 'contact' && <Users className="w-5 h-5 text-blue-600" />}
                        {item.type === 'event' && <Calendar className="w-5 h-5 text-orange-600" />}
                        {item.type === 'project' && <Briefcase className="w-5 h-5 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#511A2B]">{item.action}</p>
                        <p className="text-sm text-[#511A2B]/70">{item.date}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200 rounded-lg">{item.points}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resumo Mensal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#511A2B]">{stats.totalActions}</div>
                  <div className="text-sm text-[#511A2B]/70">Ações Este Mês</div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#511A2B]">R$ {stats.valueSaved.toLocaleString()}</div>
                  <div className="text-sm text-[#511A2B]/70">Valor Economizado</div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Headphones className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#511A2B]">{stats.supportUsed}</div>
                  <div className="text-sm text-[#511A2B]/70">Suporte Utilizado</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
