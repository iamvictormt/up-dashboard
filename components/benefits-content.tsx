'use client';

import { useState } from 'react';
import {
  Gift,
  Star,
  ShoppingBag,
  Smartphone,
  Headphones,
  Book,
  Trophy,
  Zap,
  Clock,
  Check,
  AlertCircle,
  Sparkles,
  Target,
  Award,
  Crown,
  Coins,
  Eye,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUser } from '@/contexts/user-context';

// Interface para recompensas
interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: 'digital' | 'physical' | 'experience' | 'discount';
  image: string;
  icon: any;
  available: boolean;
  stock?: number;
  expiresAt?: string;
  featured: boolean;
  estimatedDelivery?: string;
  terms?: string[];
}

// Recompensas mockadas
const mockRewards: Reward[] = [
  {
    id: '1',
    name: 'Curso Online: AutoCAD Avançado',
    description:
      'Curso completo de AutoCAD com certificado reconhecido pelo mercado. Aprenda técnicas avançadas de desenho técnico, modelagem 3D, renderização e muito mais. Inclui projetos práticos e suporte técnico especializado durante todo o período do curso.',
    pointsCost: 2500,
    category: 'digital',
    image: '/placeholder.svg?height=200&width=300',
    icon: Book,
    available: true,
    featured: true,
    estimatedDelivery: 'Acesso imediato',
    terms: [
      'Acesso por 12 meses',
      'Certificado incluso',
      'Suporte técnico',
      'Projetos práticos',
      'Atualizações gratuitas',
    ],
  },
  {
    id: '2',
    name: 'Fone de Ouvido Bluetooth Premium',
    description:
      'Fone de ouvido sem fio com cancelamento de ruído ativo, bateria de longa duração e qualidade de som excepcional. Perfeito para trabalho e entretenimento.',
    pointsCost: 1800,
    category: 'physical',
    image: '/placeholder.svg?height=200&width=300',
    icon: Headphones,
    available: true,
    stock: 15,
    featured: true,
    estimatedDelivery: '5-7 dias úteis',
    terms: ['Garantia de 1 ano', 'Frete grátis', 'Cores disponíveis: preto, branco', 'Cancelamento de ruído ativo'],
  },
  {
    id: '3',
    name: 'Vale-Presente Amazon R$ 100',
    description:
      'Crédito para compras na Amazon Brasil. Use para comprar livros, eletrônicos, casa e jardim, e muito mais.',
    pointsCost: 1200,
    category: 'digital',
    image: '/placeholder.svg?height=200&width=300',
    icon: ShoppingBag,
    available: true,
    featured: false,
    estimatedDelivery: 'Até 24 horas',
    terms: ['Válido por 1 ano', 'Não cumulativo', 'Uso único', 'Aplicável em todos os produtos'],
  },
  {
    id: '4',
    name: 'Mentoria 1:1 com Especialista',
    description:
      'Sessão de mentoria personalizada com profissional sênior da área. Receba orientações específicas para sua carreira, projetos e desenvolvimento profissional. Uma oportunidade única de aprendizado direto com quem já trilhou o caminho do sucesso.',
    pointsCost: 3000,
    category: 'experience',
    image: '/placeholder.svg?height=200&width=300',
    icon: Target,
    available: true,
    stock: 5,
    featured: true,
    estimatedDelivery: 'Agendamento em até 3 dias',
    terms: ['Duração: 1 hora', 'Online ou presencial', 'Gravação disponível', 'Material de apoio incluso'],
  },
  {
    id: '5',
    name: 'Desconto 50% em Workshop Premium',
    description: 'Desconto especial para próximo workshop de sua escolha. Válido para workshops premium da plataforma.',
    pointsCost: 800,
    category: 'discount',
    image: '/placeholder.svg?height=200&width=300',
    icon: Trophy,
    available: true,
    expiresAt: '2025-03-31',
    featured: false,
    estimatedDelivery: 'Cupom imediato',
    terms: ['Válido até 31/03/2025', 'Não cumulativo', 'Workshops selecionados', 'Transferível'],
  },
  {
    id: '6',
    name: 'Smartphone Samsung Galaxy A54',
    description:
      'Smartphone Android com 128GB de armazenamento, câmera tripla de alta qualidade, tela Super AMOLED e processador octa-core. Ideal para trabalho e entretenimento com excelente custo-benefício.',
    pointsCost: 5000,
    category: 'physical',
    image: '/placeholder.svg?height=200&width=300',
    icon: Smartphone,
    available: true,
    stock: 3,
    featured: true,
    estimatedDelivery: '7-10 dias úteis',
    terms: ['Garantia de 1 ano', 'Frete grátis', 'Nota fiscal inclusa', 'Película protetora inclusa'],
  },
  {
    id: '7',
    name: 'Kit de Livros Técnicos',
    description: 'Coleção com 5 livros essenciais para profissionais da construção civil, arquitetura e engenharia.',
    pointsCost: 1500,
    category: 'physical',
    image: '/placeholder.svg?height=200&width=300',
    icon: Book,
    available: true,
    stock: 20,
    featured: false,
    estimatedDelivery: '5-7 dias úteis',
    terms: ['Livros novos', 'Frete grátis', 'Embalagem especial', 'Autores renomados'],
  },
  {
    id: '8',
    name: 'Acesso VIP a Evento Exclusivo',
    description:
      'Entrada VIP para próximo evento de networking da plataforma com coffee break premium, networking exclusivo e certificado especial de participação.',
    pointsCost: 2200,
    category: 'experience',
    image: '/placeholder.svg?height=200&width=300',
    icon: Crown,
    available: false,
    featured: false,
    estimatedDelivery: 'Confirmação em 24h',
    terms: ['Inclui coffee break', 'Networking exclusivo', 'Certificado VIP', 'Acesso a palestrantes'],
  },
];

// Categorias de recompensas
const rewardCategories = [
  { id: 'all', name: 'Todas', icon: Gift },
  { id: 'digital', name: 'Digital', icon: Zap },
  { id: 'physical', name: 'Físico', icon: ShoppingBag },
  { id: 'experience', name: 'Experiência', icon: Star },
  { id: 'discount', name: 'Desconto', icon: Trophy },
];

// Histórico de resgates mockado
const redeemHistory = [
  {
    id: '1',
    rewardName: 'Vale-Presente Amazon R$ 50',
    pointsUsed: 600,
    redeemedAt: '2025-01-28',
    status: 'delivered',
    code: 'AMZ-2025-001',
  },
  {
    id: '2',
    rewardName: 'Desconto 30% Workshop',
    pointsUsed: 500,
    redeemedAt: '2025-01-15',
    status: 'used',
    code: 'WKS-2025-002',
  },
  {
    id: '3',
    rewardName: 'Curso Online: SketchUp',
    pointsUsed: 1800,
    redeemedAt: '2025-01-10',
    status: 'active',
    code: 'SKP-2025-003',
  },
];

export function BenefitsContent() {
  const [selectedTab, setSelectedTab] = useState('rewards');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [viewDetailsReward, setViewDetailsReward] = useState<Reward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const { user } = useUser();

  // Pontos do usuário (mockado por enquanto)
  const userPoints = user?.professional?.points || 1250;

  // Filtrar recompensas por categoria
  const filteredRewards = mockRewards.filter((reward) => {
    if (selectedCategory === 'all') return true;
    return reward.category === selectedCategory;
  });

  // Função para truncar texto
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Função para resgatar recompensa
  const handleRedeem = async (reward: Reward) => {
    if (userPoints < reward.pointsCost) return;

    setIsRedeeming(true);
    try {
      // Simular chamada de API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Aqui seria a chamada real para a API:
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rewards/${reward.id}/redeem`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ userId: user?.id })
      // })

      alert(`Recompensa "${reward.name}" resgatada com sucesso!`);
      setSelectedReward(null);
    } catch (error) {
      alert('Erro ao resgatar recompensa. Tente novamente.');
    } finally {
      setIsRedeeming(false);
    }
  };

  // Calcular próximo nível de pontos
  const getNextMilestone = () => {
    const milestones = [500, 1000, 2000, 3000, 5000, 10000];
    return milestones.find((milestone) => milestone > userPoints) || 10000;
  };

  const nextMilestone = getNextMilestone();
  const progressToNext = (userPoints / nextMilestone) * 100;

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-2">Central de Recompensas</h1>
                <p className="text-[#511A2B]/70">Troque seus pontos por recompensas incríveis</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-3 text-white">
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5" />
                  <div>
                    <div className="text-lg font-bold">{userPoints.toLocaleString()}</div>
                    <div className="text-xs opacity-90">pontos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progresso para próximo nível */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 rounded-2xl mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">
                    Progresso para {nextMilestone.toLocaleString()} pontos
                  </span>
                </div>
                <span className="text-sm text-blue-700">{Math.round(progressToNext)}%</span>
              </div>
              <Progress value={progressToNext} className="h-3 mb-2" />
              <p className="text-sm text-blue-800">
                Faltam {(nextMilestone - userPoints).toLocaleString()} pontos para desbloquear recompensas exclusivas!
              </p>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <div className="overflow-x-auto">
              <TabsList className="grid grid-cols-3 bg-white/80 rounded-2xl p-1 mb-8 min-w-max w-full">
                <TabsTrigger
                  value="rewards"
                  className="rounded-xl data-[state=active]:bg-[#511A2B] data-[state=active]:text-white text-xs md:text-sm px-2 md:px-3"
                >
                  Recompensas
                </TabsTrigger>
                <TabsTrigger
                  value="featured"
                  className="rounded-xl data-[state=active]:bg-[#511A2B] data-[state=active]:text-white text-xs md:text-sm px-2 md:px-3"
                >
                  Em Destaque
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="rounded-xl data-[state=active]:bg-[#511A2B] data-[state=active]:text-white text-xs md:text-sm px-2 md:px-3"
                >
                  Meus Resgates
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Recompensas */}
            <TabsContent value="rewards" className="space-y-6">
              {/* Filtros por categoria */}
              <div className="flex flex-wrap gap-2 mb-6">
                {rewardCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`rounded-xl ${
                      selectedCategory === category.id
                        ? 'bg-[#511A2B] hover:bg-[#511A2B]/90 text-white'
                        : 'border-[#511A2B]/20 text-[#511A2B] hover:bg-[#511A2B]/10'
                    }`}
                  >
                    <category.icon className="w-4 h-4 mr-2" />
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Grid de recompensas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRewards.map((reward) => {
                  const canRedeem = userPoints >= reward.pointsCost && reward.available;
                  const isOutOfStock = reward.stock !== undefined && reward.stock <= 0;

                  return (
                    <Card
                      key={reward.id}
                      className={`bg-white/80 border-[#511A2B]/10 rounded-2xl transition-all duration-300 hover:shadow-lg h-[65vh] flex flex-col ${
                        reward.featured ? 'ring-2 ring-purple-200' : ''
                      }`}
                    >
                      <CardContent className="p-0 flex flex-col h-full">
                        {/* Imagem - altura fixa */}
                        <div className="relative h-[30vh] flex-shrink-0">
                          <img
                            src={reward.image || '/placeholder.svg'}
                            alt={reward.name}
                            className="w-full h-full object-cover rounded-t-2xl"
                          />
                          {reward.featured && (
                            <Badge className="absolute top-3 left-3 bg-purple-500 text-white rounded-lg">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Destaque
                            </Badge>
                          )}
                          {isOutOfStock && (
                            <div className="absolute inset-0 bg-black/50 rounded-t-2xl flex items-center justify-center">
                              <Badge className="bg-red-500 text-white rounded-lg">Esgotado</Badge>
                            </div>
                          )}
                        </div>

                        {/* Conteúdo - flex-grow para ocupar espaço restante */}
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <reward.icon className="w-5 h-5 text-[#511A2B]" />
                              <Badge
                                className={`text-xs rounded-lg ${
                                  reward.category === 'digital'
                                    ? 'bg-blue-100 text-blue-700'
                                    : reward.category === 'physical'
                                    ? 'bg-green-100 text-green-700'
                                    : reward.category === 'experience'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-orange-100 text-orange-700'
                                }`}
                              >
                                {reward.category === 'digital'
                                  ? 'Digital'
                                  : reward.category === 'physical'
                                  ? 'Físico'
                                  : reward.category === 'experience'
                                  ? 'Experiência'
                                  : 'Desconto'}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1">
                                <Coins className="w-4 h-4 text-yellow-500" />
                                <span className="font-bold text-[#511A2B]">{reward.pointsCost.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Título - altura fixa */}
                          <h3 className="font-semibold text-[#511A2B] mb-2 h-12 line-clamp-2">{reward.name}</h3>

                          {/* Descrição - altura fixa com truncate */}
                          <p className="text-sm text-[#511A2B]/70 mb-4 h-10 line-clamp-2">
                            {truncateText(reward.description, 80)}
                          </p>

                          {/* Informações extras - flex-grow */}
                          <div className="space-y-2 mb-4 flex-grow">
                            {reward.stock !== undefined && (
                              <div className="flex items-center space-x-2 text-xs text-[#511A2B]/60">
                                <Clock className="w-3 h-3" />
                                <span>Estoque: {reward.stock} unidades</span>
                              </div>
                            )}
                            {reward.estimatedDelivery && (
                              <div className="flex items-center space-x-2 text-xs text-[#511A2B]/60">
                                <Clock className="w-3 h-3" />
                                <span>{reward.estimatedDelivery}</span>
                              </div>
                            )}
                            {reward.expiresAt && (
                              <div className="flex items-center space-x-2 text-xs text-orange-600">
                                <AlertCircle className="w-3 h-3" />
                                <span>Válido até {new Date(reward.expiresAt).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>

                          {/* Botões - sempre no final */}
                          <div className="space-y-2 mt-auto">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full rounded-xl border-[#511A2B]/20 text-[#511A2B] hover:bg-[#511A2B]/10"
                              onClick={() => setViewDetailsReward(reward)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalhes
                            </Button>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  className={`w-full rounded-xl ${
                                    canRedeem && !isOutOfStock
                                      ? 'bg-[#511A2B] hover:bg-[#511A2B]/90 text-white'
                                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  }`}
                                  disabled={!canRedeem || isOutOfStock}
                                  onClick={() => setSelectedReward(reward)}
                                >
                                  {isOutOfStock
                                    ? 'Esgotado'
                                    : !canRedeem
                                    ? `Faltam ${(reward.pointsCost - userPoints).toLocaleString()} pontos`
                                    : 'Resgatar'}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Confirmar Resgate</DialogTitle>
                                </DialogHeader>
                                {selectedReward && (
                                  <div className="space-y-4">
                                    <div className="text-center">
                                      <img
                                        src={selectedReward.image || '/placeholder.svg'}
                                        alt={selectedReward.name}
                                        className="w-full h-32 object-cover rounded-xl mb-4"
                                      />
                                      <h3 className="font-semibold text-[#511A2B] mb-2">{selectedReward.name}</h3>
                                      <p className="text-sm text-[#511A2B]/70 mb-4">{selectedReward.description}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-[#511A2B]/70">Custo:</span>
                                        <div className="flex items-center space-x-1">
                                          <Coins className="w-4 h-4 text-yellow-500" />
                                          <span className="font-bold text-[#511A2B]">
                                            {selectedReward.pointsCost.toLocaleString()}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-[#511A2B]/70">Seus pontos:</span>
                                        <span className="font-bold text-[#511A2B]">{userPoints.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-[#511A2B]/70">Pontos restantes:</span>
                                        <span className="font-bold text-green-600">
                                          {(userPoints - selectedReward.pointsCost).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>

                                    {selectedReward.terms && (
                                      <div className="bg-blue-50 rounded-xl p-4">
                                        <h4 className="font-semibold text-blue-900 mb-2">Termos e Condições:</h4>
                                        <ul className="space-y-1">
                                          {selectedReward.terms.map((term, index) => (
                                            <li
                                              key={index}
                                              className="text-sm text-blue-800 flex items-start space-x-2"
                                            >
                                              <Check className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                                              <span>{term}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    <div className="flex space-x-3">
                                      <Button
                                        variant="outline"
                                        className="flex-1 rounded-xl"
                                        onClick={() => setSelectedReward(null)}
                                      >
                                        Cancelar
                                      </Button>
                                      <Button
                                        className="flex-1 bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl"
                                        onClick={() => handleRedeem(selectedReward)}
                                        disabled={isRedeeming}
                                      >
                                        {isRedeeming ? 'Resgatando...' : 'Confirmar Resgate'}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Em Destaque */}
            <TabsContent value="featured" className="space-y-6">
              <div className="space-y-6">
                {mockRewards
                  .filter((reward) => reward.featured)
                  .map((reward) => {
                    const canRedeem = userPoints >= reward.pointsCost && reward.available;

                    return (
                      <Card key={reward.id} className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <img
                              src={reward.image || '/placeholder.svg'}
                              alt={reward.name}
                              className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-xl flex-shrink-0"
                            />
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 space-y-2 sm:space-y-0">
                                <Badge className="bg-purple-100 text-purple-700 rounded-lg self-start">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Destaque
                                </Badge>
                                <div className="flex items-center space-x-1">
                                  <Coins className="w-4 h-4 text-yellow-500" />
                                  <span className="font-bold text-[#511A2B]">{reward.pointsCost.toLocaleString()}</span>
                                </div>
                              </div>
                              <h3 className="font-semibold text-[#511A2B] mb-2">{reward.name}</h3>
                              <p className="text-sm text-[#511A2B]/70 mb-3">{truncateText(reward.description, 120)}</p>
                              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-xl border-[#511A2B]/20 text-[#511A2B] hover:bg-[#511A2B]/10"
                                  onClick={() => setViewDetailsReward(reward)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Ver Mais
                                </Button>
                                <Button
                                  size="sm"
                                  className={`rounded-xl ${
                                    canRedeem
                                      ? 'bg-[#511A2B] hover:bg-[#511A2B]/90 text-white'
                                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  }`}
                                  disabled={!canRedeem}
                                >
                                  {canRedeem ? 'Resgatar' : 'Pontos insuficientes'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>

            {/* Histórico */}
            <TabsContent value="history" className="space-y-6">
              <div className="space-y-4">
                {redeemHistory.map((item) => (
                  <Card key={item.id} className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Gift className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#511A2B]">{item.rewardName}</h3>
                            <p className="text-sm text-[#511A2B]/70">
                              Resgatado em {new Date(item.redeemedAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-[#511A2B]/60">Código: {item.code}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-2">
                            <Coins className="w-4 h-4 text-yellow-500" />
                            <span className="font-bold text-[#511A2B]">{item.pointsUsed.toLocaleString()}</span>
                          </div>
                          <Badge
                            className={`rounded-lg ${
                              item.status === 'delivered'
                                ? 'bg-green-100 text-green-700'
                                : item.status === 'used'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}
                          >
                            {item.status === 'delivered' ? 'Entregue' : item.status === 'used' ? 'Utilizado' : 'Ativo'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {redeemHistory.length === 0 && (
                <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                  <CardContent className="p-12 text-center">
                    <Gift className="w-16 h-16 text-[#511A2B]/30 mx-auto mb-4" />
                    <h3 className="font-semibold text-[#511A2B] mb-2">Nenhum resgate ainda</h3>
                    <p className="text-[#511A2B]/70">Comece a resgatar recompensas incríveis com seus pontos!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Modal de Detalhes */}
          <Dialog open={!!viewDetailsReward} onOpenChange={() => setViewDetailsReward(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>Detalhes da Recompensa</DialogTitle>
                  <Button variant="ghost" size="sm" onClick={() => setViewDetailsReward(null)} className="rounded-xl">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </DialogHeader>
              {viewDetailsReward && (
                <div className="space-y-6">
                  <div className="text-center">
                    <img
                      src={viewDetailsReward.image || '/placeholder.svg'}
                      alt={viewDetailsReward.name}
                      className="w-full h-[45vh] object-cover rounded-xl mb-4"
                    />
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <viewDetailsReward.icon className="w-5 h-5 text-[#511A2B]" />
                      <Badge
                        className={`rounded-lg ${
                          viewDetailsReward.category === 'digital'
                            ? 'bg-blue-100 text-blue-700'
                            : viewDetailsReward.category === 'physical'
                            ? 'bg-green-100 text-green-700'
                            : viewDetailsReward.category === 'experience'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {viewDetailsReward.category === 'digital'
                          ? 'Digital'
                          : viewDetailsReward.category === 'physical'
                          ? 'Físico'
                          : viewDetailsReward.category === 'experience'
                          ? 'Experiência'
                          : 'Desconto'}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-[#511A2B] mb-2">{viewDetailsReward.name}</h3>
                    <div className="flex items-center justify-center space-x-1 mb-4">
                      <Coins className="w-5 h-5 text-yellow-500" />
                      <span className="text-lg font-bold text-[#511A2B]">
                        {viewDetailsReward.pointsCost.toLocaleString()} pontos
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-[#511A2B] mb-2">Descrição Completa</h4>
                    <p className="text-[#511A2B]/80">{viewDetailsReward.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewDetailsReward.estimatedDelivery && (
                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <h4 className="font-semibold text-blue-900">Entrega</h4>
                        </div>
                        <p className="text-blue-800">{viewDetailsReward.estimatedDelivery}</p>
                      </div>
                    )}

                    {viewDetailsReward.stock !== undefined && (
                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <ShoppingBag className="w-4 h-4 text-green-600" />
                          <h4 className="font-semibold text-green-900">Disponibilidade</h4>
                        </div>
                        <p className="text-green-800">{viewDetailsReward.stock} unidades em estoque</p>
                      </div>
                    )}
                  </div>

                  {viewDetailsReward.terms && (
                    <div className="bg-purple-50 rounded-xl p-4">
                      <h4 className="font-semibold text-purple-900 mb-3">Termos e Condições</h4>
                      <ul className="space-y-2">
                        {viewDetailsReward.terms.map((term, index) => (
                          <li key={index} className="text-purple-800 flex items-start space-x-2">
                            <Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>{term}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {viewDetailsReward.expiresAt && (
                    <div className="bg-orange-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        <h4 className="font-semibold text-orange-900">Validade</h4>
                      </div>
                      <p className="text-orange-800">
                        Válido até {new Date(viewDetailsReward.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
