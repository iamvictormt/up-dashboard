'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Phone, Mail, MessageCircle, Clock, MapPin, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'Como criar uma conta na plataforma?',
    answer:
      "Para criar uma conta, clique no botão 'Cadastrar' na página de login, preencha seus dados pessoais e confirme seu email. Após a confirmação, você poderá acessar todas as funcionalidades da plataforma.",
    category: 'Conta',
  },
  {
    id: '2',
    question: 'Como cadastrar eventos na minha loja?',
    answer:
      "Acesse 'Minha Loja' no menu lateral, vá para a aba 'Eventos' e clique em 'Criar Evento'. Preencha todas as informações necessárias como nome, descrição, data, local e número de vagas. Após salvar, seu evento ficará disponível para inscrições.",
    category: 'Eventos',
  },
  {
    id: '3',
    question: 'Como funciona o sistema de pontos?',
    answer:
      'Você ganha pontos participando de workshops, eventos, conectando-se com profissionais e completando ações na plataforma. Os pontos podem ser usados para desbloquear benefícios exclusivos e melhorar seu ranking na comunidade.',
    category: 'Pontos',
  },
  {
    id: '4',
    question: 'Quais são os planos disponíveis?',
    answer:
      "Oferecemos três planos: Básico (gratuito), Premium (R$ 49,90/mês) e Enterprise (R$ 149,90/mês). Cada plano oferece diferentes limites de contatos, eventos e funcionalidades. Veja a comparação completa na seção 'Meus Benefícios'.",
    category: 'Planos',
  },
  {
    id: '5',
    question: 'Como entrar em contato com profissionais?',
    answer:
      "Na seção 'Profissionais', você pode visualizar perfis completos e usar os botões de contato direto (telefone, email, WhatsApp) ou agendar uma consulta. Lembre-se de que há limites baseados no seu plano atual.",
    category: 'Contatos',
  },
  {
    id: '6',
    question: 'Como cancelar minha assinatura?',
    answer:
      "Você pode cancelar sua assinatura a qualquer momento em 'Meus Benefícios' > 'Gerenciar Assinatura'. O cancelamento será efetivo no final do período de cobrança atual, e você manterá acesso aos benefícios até lá.",
    category: 'Planos',
  },
  {
    id: '7',
    question: 'Como editar informações da minha loja?',
    answer:
      "Acesse 'Minha Loja', clique em 'Editar' no canto superior direito, faça as alterações necessárias nas informações básicas, contato ou endereço, e clique em 'Salvar' para confirmar as mudanças.",
    category: 'Loja',
  },
  {
    id: '8',
    question: 'Posso participar de eventos de outras cidades?',
    answer:
      'Sim! Você pode se inscrever em eventos de qualquer cidade. Use os filtros de localização para encontrar eventos próximos ou explore oportunidades em outras regiões.',
    category: 'Eventos',
  },
];

const categories = ['Todos', 'Conta', 'Eventos', 'Pontos', 'Planos', 'Contatos', 'Loja'];

export function HelpContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFAQ = faqData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#511A2B] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-2">Central de Ajuda</h1>
            <p className="text-[#511A2B]/70">Encontre respostas para suas dúvidas ou entre em contato conosco</p>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#511A2B]/50 w-5 h-5" />
            <Input
              placeholder="Busque por uma pergunta ou palavra-chave..."
              className="pl-12 py-4 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`rounded-xl ${
                  selectedCategory === category
                    ? 'bg-[#511A2B] hover:bg-[#511A2B]/90 text-white'
                    : 'border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#511A2B] mb-6">Perguntas Frequentes</h2>

            {filteredFAQ.length === 0 ? (
              <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                <CardContent className="p-8 text-center">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Nenhuma pergunta encontrada</p>
                  <p className="text-sm text-gray-400">Tente ajustar sua busca ou categoria</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredFAQ.map((item) => (
                  <Card key={item.id} className="bg-white/80 border-[#511A2B]/10 rounded-2xl overflow-hidden">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleExpanded(item.id)}
                        className="w-full p-6 text-left hover:bg-[#511A2B]/5 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Badge className="bg-[#FEC460]/20 text-[#D56235] hover:bg-[#FEC460]/30 rounded-lg text-xs">
                                {item.category}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-[#511A2B] text-base md:text-lg">{item.question}</h3>
                          </div>
                          {expandedItems[item.id] ? (
                            <ChevronUp className="w-5 h-5 text-[#511A2B] ml-4" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-[#511A2B] ml-4" />
                          )}
                        </div>
                      </button>

                      {expandedItems[item.id] && (
                        <div className="px-6 pb-6">
                          <div className="border-t border-[#511A2B]/10 pt-4">
                            <p className="text-[#511A2B]/80 leading-relaxed">{item.answer}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-xl font-bold text-[#511A2B] mb-6">Ainda precisa de ajuda?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Chat Support */}
              <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-[#511A2B] mb-2">Whatsapp</h3>
                  <p className="text-sm text-[#511A2B]/70 mb-4">Converse com nossa equipe em tempo real</p>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Online agora</span>
                  </div>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl">Iniciar Chat</Button>
                </CardContent>
              </Card>

              {/* Email Support */}
              <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-[#511A2B] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-[#511A2B] mb-2">Email</h3>
                  <p className="text-sm text-[#511A2B]/70 mb-4">Envie sua dúvida por email</p>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Clock className="w-4 h-4 text-[#511A2B]/60" />
                    <span className="text-sm text-[#511A2B]/60">Resposta em 24h</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10 rounded-xl"
                    onClick={() => window.open('mailto:suporte@upconnection.com.br')}
                  >
                    Enviar Email
                  </Button>
                </CardContent>
              </Card>

              {/* Phone Support */}
              <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-[#511A2B] mb-2">Telefone</h3>
                  <p className="text-sm text-[#511A2B]/70 mb-4">Fale diretamente com nosso suporte</p>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Clock className="w-4 h-4 text-[#511A2B]/60" />
                    <span className="text-sm text-[#511A2B]/60">Seg-Sex 9h-18h</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-green-500/30 text-green-600 hover:bg-green-50 rounded-xl"
                    onClick={() => window.open('tel:+5511999999999')}
                  >
                    (11) 99999-9999
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Additional Contact Info */}
            <Card className="bg-gradient-to-r from-[#511A2B]/5 to-[#FEC460]/5 border-[#511A2B]/10 rounded-2xl mt-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <div>
                    <h3 className="font-semibold text-[#511A2B] mb-2">Informações de Contato</h3>
                    <div className="space-y-2 text-sm text-[#511A2B]/80">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>suporte@upconnection.com.br</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>+55 (11) 99999-9999</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>São Paulo, SP - Brasil</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-sm text-[#511A2B]/70 mb-2">Horário de Atendimento</p>
                    <p className="font-semibold text-[#511A2B]">Segunda a Sexta</p>
                    <p className="font-semibold text-[#511A2B]">09:00 - 18:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
