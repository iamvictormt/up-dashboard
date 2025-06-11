'use client';

import { useState, useEffect } from 'react';
import {
  Star,
  MapPin,
  Share,
  Store,
  Mail,
  Globe,
  Package,
  Calendar,
  Clock,
  Users,
  Award,
  Phone,
  Edit3,
  Save,
  X,
  Plus,
  ExternalLink,
  Map,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { EventForm } from '@/components/my-store/event-form';
import { MyStoreContentSkeleton } from './my-store-skeleton';
import { EventEditModal } from './event-edit-modal';
import { fetchMyStore, updateStore } from '@/lib/store-api';
import { ProductEditModal } from './product-edit-modal';
import { toast } from 'sonner';
import { StoreData } from '@/types';
import MapCard from '../map-card';
import { StoreForm } from './store-form';
import { NoStoreView } from './no-store-view';
import { ProductFormModal } from './product-form';

const fetchStoreData = async (): Promise<StoreData | null> => {
  const response = await fetchMyStore();
  if (response.status === 200) {
    return response.data;
  }

  return null;
};

export function MyStoreContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [editingEvent, setEditingEvent] = useState<number | null>(null);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [editData, setEditData] = useState<StoreData | null>(null);
  const [showStoreForm, setShowStoreForm] = useState(false);

  useEffect(() => {
    const loadStoreData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchStoreData();
        setStoreData(data);
        setEditData(data);
        console.log(data);
      } catch (error) {
        console.error('Erro ao carregar dados da loja:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoreData();
  }, []);

  const processStoreHours = (openingHours: string) => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Domingo, 1 = Segunda, etc.
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutos desde meia-noite

    const dayNames = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ];

    // Criar objeto com todos os dias da semana
    const weekSchedule = dayNames.map((day) => ({ day, hours: 'Fechado' }));

    // Processar horários cadastrados
    const schedules = openingHours.split(' | ');
    schedules.forEach((schedule) => {
      const [day, hours] = schedule.split(': ');
      const dayIndex = dayNames.indexOf(day);
      if (dayIndex !== -1) {
        weekSchedule[dayIndex].hours = hours;
      }
    });

    // Verificar se está aberto hoje
    const todaySchedule = weekSchedule[currentDay];
    let isOpen = false;
    let closingTime = null;
    let nextOpenTime = null;

    if (todaySchedule.hours !== 'Fechado') {
      const [openTime, closeTime] = todaySchedule.hours.split(' - ');
      const [openHour, openMin] = openTime.split(':').map(Number);
      const [closeHour, closeMin] = closeTime.split(':').map(Number);

      const openMinutes = openHour * 60 + openMin;
      const closeMinutes = closeHour * 60 + closeMin;

      isOpen = currentTime >= openMinutes && currentTime < closeMinutes;
      closingTime = isOpen ? closeTime : null;
      nextOpenTime = !isOpen && currentTime < openMinutes ? openTime : null;
    }

    return {
      weekSchedule,
      isOpen,
      closingTime,
      nextOpenTime,
      currentDay,
    };
  };

  const handleStoreCreated = (newStoreData: StoreData) => {
    setStoreData(newStoreData);
    setShowStoreForm(false);
    toast.success('Loja cadastrada com sucesso.');
  };

  const handleStoreUpdated = (updatedStoreData: StoreData) => {
    setStoreData(updatedStoreData);
    setShowStoreForm(false);
    toast.success('Loja atualizada com sucesso.');
  };

  const handleEventCreated = async (eventData: any) => {
    if (!storeData) return;

    const newEvent = {
      name: eventData.name,
      description: eventData.description,
      date: eventData.date,
      type: eventData.type,
      points: eventData.points,
      totalSpots: eventData.totalSpots,
      filledSpots: 0,
      participantsCount: 0,
      address: eventData.address,
      storeId: storeData.id,
    };

    setShowEventForm(false);
    setStoreData((prev) =>
      prev
        ? {
            ...prev,
            events: [...prev.events, newEvent],
          }
        : null
    );
  };

  const handleProductCreated = async (productData: any) => {
    if (!storeData) return;

    const newProduct = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      link: productData.link,
      featured: productData.featured,
      promotion: productData.promotion,
    };

    setShowProductForm(false);
    setStoreData((prev) =>
      prev
        ? {
            ...prev,
            products: [...prev.products, newProduct],
          }
        : null
    );
  };

  const removeProduct = (index: number) => {
    setStoreData((prev) =>
      prev
        ? {
            ...prev,
            products: prev.products.filter((_, i) => i !== index),
          }
        : null
    );
  };

  const removeEvent = (index: number) => {
    setStoreData((prev) =>
      prev
        ? {
            ...prev,
            events: prev.events.filter((_, i) => i !== index),
          }
        : null
    );
  };

  if (isLoading) {
    return <MyStoreContentSkeleton />;
  }

  if (!storeData) {
    return (
      <>
        <NoStoreView onCreateStore={() => setShowStoreForm(true)} />

        {showStoreForm && (
          <StoreForm onStoreCreated={handleStoreCreated} onClose={() => setShowStoreForm(false)} isEditing={false} />
        )}
      </>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full">
        {/* Floating Action Buttons */}
        <div className="fixed top-32 right-8 md:right-16 z-50 flex flex-col space-y-3">
          <Button
            onClick={() => setShowStoreForm(true)}
            size="icon"
            className="rounded-full bg-white text-[#511A2B] hover:bg-white/90 shadow-xl backdrop-blur-sm hover:scale-110 transition-all duration-300 p-6"
          >
            <Edit3 className="w-5 h-5" />
          </Button>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[#46142b] rounded-xl" />
          <div className="relative px-6 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-12 w-full px-4">
                {/* Logo/Ícone da Loja */}
                <div className="relative">
                  <div className="w-40 h-40 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-2xl flex items-center justify-center">
                    <Store className="w-20 h-20 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-green-500 text-white px-3 py-1 rounded-full shadow-lg">Minha Loja</Badge>
                  </div>
                </div>

                {/* Informações Principais */}
                <div className="w-full lg:flex-1 text-center lg:text-left text-white break-words max-w-full">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">{storeData.name}</h1>
                  <p className="text-lg md:text-2xl text-white/90 mb-6">Minha Loja Especializada</p>

                  {/* Rating */}
                  <div className="flex items-center justify-center lg:justify-start mb-6">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${
                            i < Math.floor(storeData.rating) ? 'text-yellow-300 fill-yellow-300' : 'text-white/30'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-3 text-2xl font-bold">{storeData.rating.toFixed(1) || 0}</span>
                    <span className="ml-2 text-white/80 hidden md:block">• Excelente</span>
                  </div>

                  <p className="text-lg text-white/90 leading-relaxed mb-8 w-full break-words">
                    {storeData.description}
                  </p>

                  {/* Botões de Ação */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {storeData.website && (
                      <Button
                        size="lg"
                        className="bg-white text-[#511A2B] hover:bg-white/90 rounded-xl px-8 py-4 font-semibold shadow-xl"
                        onClick={() => window.open(storeData.website, '_blank')}
                      >
                        <Globe className="w-5 h-5 mr-2" />
                        Visitar Site
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-6 -mt-12 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#511A2B] to-[#D56235] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#511A2B]">{storeData.rating.toFixed(1) || 0}</div>
                  <div className="text-sm text-[#511A2B]/70">Avaliação</div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FEC460] to-[#D56235] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#511A2B]">{storeData.products.length}</div>
                  <div className="text-sm text-[#511A2B]/70">Produtos</div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#D56235] to-[#511A2B] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#511A2B]">{storeData.events.length}</div>
                  <div className="text-sm text-[#511A2B]/70">Eventos</div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#511A2B]">15+</div>
                  <div className="text-sm text-[#511A2B]/70">Anos</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-16">
          <div className="max-w-7xl mx-auto space-y-16">
            {/* Produtos Section */}
            <section>
              <div className="flex items-center justify-between mb-8 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <h2 className="text-3xl font-bold text-[#511A2B] mb-2">Meus Produtos</h2>
                  <p className="text-[#511A2B]/70">Gerencie sua linha completa de produtos</p>
                </div>
                <Button
                  onClick={() => setShowProductForm(true)}
                  className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl px-6 py-3 w-[100%] md:w-[33%] mt-2 md:mt-0 md:place-self-end"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Produto
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storeData.products.map((product, index) => (
                  <Card
                    key={index}
                    className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-2"
                  >
                    <div className="relative">
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=300&width=300"
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          {product.featured && (
                            <Badge className="bg-[#FEC460] text-[#511A2B] hover:bg-[#FEC460]/90 shadow-lg">
                              Destaque
                            </Badge>
                          )}
                          {product.promotion && (
                            <Badge className="bg-red-500 text-white hover:bg-red-600 shadow-lg">Promoção</Badge>
                          )}
                        </div>
                        <div className="absolute top-3 right-3">
                          <Button
                            size="icon"
                            className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-[#511A2B] hover:bg-[#511A2B]/90 text-white"
                            onClick={() => setEditingProduct(index)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="font-bold text-[#511A2B] mb-2 text-lg">{product.name}</h3>
                      <p className="text-sm text-[#511A2B]/70 mb-4 line-clamp-2">{product.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-[#511A2B]">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </div>
                        <Button
                          size="sm"
                          className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl shadow-lg"
                          onClick={() => window.open(product.link, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Eventos Section */}
            <section>
              <div className="flex items-center justify-between mb-8 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <h2 className="text-3xl font-bold text-[#511A2B] mb-2">Meus Eventos</h2>
                  <p className="text-[#511A2B]/70">Organize eventos e workshops para sua comunidade</p>
                </div>
                <Button
                  onClick={() => setShowEventForm(true)}
                  className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl px-6 py-3 w-[100%] md:w-[33%] mt-2 md:mt-0 md:place-self-end"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Evento
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {storeData.events.map((event, index) => (
                  <Card
                    key={index}
                    className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden group"
                  >
                    <div className="relative h-48 bg-gradient-to-r from-[#511A2B] to-[#D56235]">
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="relative p-6 h-full flex flex-col justify-between text-white">
                        <div>
                          <Badge className="bg-white/20 text-white border-white/30 mb-3">{event.type}</Badge>
                          <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-3xl font-bold text-[#FEC460]">+{event.points}</div>
                          <div className="text-right">
                            <div className="text-sm opacity-90">Vagas</div>
                            <div className="font-bold">
                              {event.filledSpots}/{event.totalSpots}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Button
                          size="icon"
                          className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/30 text-white border border-white/30"
                          onClick={() => setEditingEvent(index)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <p className="text-[#511A2B]/80 mb-4">{event.description}</p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-[#511A2B]/70" />
                          <span className="text-sm font-medium text-[#511A2B]">
                            {new Date(event.date).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-[#511A2B]/70" />
                          <span className="text-sm font-medium text-[#511A2B]">
                            {event.address.district}, {event.address.city}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Users className="w-4 h-4 text-[#511A2B]/70" />
                          <span className="text-sm font-medium text-[#511A2B]">
                            {event.participantsCount} participantes confirmados
                          </span>
                        </div>
                      </div>

                      <Button className="w-full bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl py-3 font-semibold shadow-lg">
                        Gerenciar Evento
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-4">Informações da Loja</h2>
                <p className="text-[#511A2B]/70 max-w-2xl mx-auto">
                  Conheça mais detalhes sobre nossa loja, localização e horários de funcionamento
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Card de Localização */}
                <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                  <CardHeader className="bg-[#46142b] text-white p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Localização</h3>
                        <p className="text-white/90 text-sm">Onde nos encontrar</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 flex-1">
                    <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden mb-6">
                      <MapCard cep={storeData.address.zipCode} />
                    </div>

                    {/* Endereço Completo */}
                    <div className="space-y-5">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#511A2B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-[#511A2B]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#511A2B] text-lg">Endereço Completo</h4>
                          <p className="text-[#511A2B]/80 mt-1">
                            {storeData.address.street}, {storeData.address.number}
                            {storeData.address.complement && `, ${storeData.address.complement}`}
                          </p>
                          <p className="text-[#511A2B]/80 mt-1">
                            {storeData.address.district}, {storeData.address.city} - {storeData.address.state}
                          </p>
                          <p className="text-[#511A2B]/70 text-sm mt-1">CEP: {storeData.address.zipCode}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#D56235]/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Globe className="w-5 h-5 text-[#D56235]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#511A2B] text-lg">Região</h4>
                          <p className="text-[#511A2B]/80">
                            {storeData.address.city} - {storeData.address.state}
                          </p>
                          <p className="text-[#511A2B]/70 text-sm mt-1">Bairro: {storeData.address.district}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#FEC460]/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Store className="w-5 h-5 text-[#FEC460]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#511A2B] text-lg">Referência</h4>
                          <p className="text-[#511A2B]/80">
                            {storeData.name} - {storeData.address.street}
                          </p>
                          <p className="text-[#511A2B]/70 text-sm mt-1">
                            Próximo ao centro de {storeData.address.district}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Card de Horário de Funcionamento */}
                <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                  <CardHeader className="bg-[#46142b] text-white p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Horário de Funcionamento</h3>
                        <p className="text-white/90 text-sm">Quando estamos abertos</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="space-y-3 mb-6 flex-1">
                      {(() => {
                        const storeHours = processStoreHours(storeData.openingHours);
                        return storeHours.weekSchedule.map((schedule, index) => {
                          const isToday = storeHours.currentDay === index;
                          const isClosed = schedule.hours === 'Fechado';

                          return (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                                isToday ? 'bg-[#511A2B]/10 border border-[#511A2B]/20' : 'bg-gray-50'
                              }`}
                            >
                              <span
                                className={`font-medium ${isToday ? 'text-[#511A2B] font-bold' : 'text-[#511A2B]'}`}
                              >
                                {schedule.day}
                                {isToday && (
                                  <span className="ml-2 text-xs bg-[#511A2B] text-white px-2 py-1 rounded-full">
                                    Hoje
                                  </span>
                                )}
                              </span>
                              <Badge
                                variant="secondary"
                                className={`px-3 py-1 ${
                                  isClosed
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : isToday
                                    ? 'bg-[#511A2B] text-white hover:bg-[#511A2B]/90'
                                    : 'bg-[#511A2B]/10 text-[#511A2B] hover:bg-[#511A2B]/20'
                                }`}
                              >
                                {schedule.hours}
                              </Badge>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    {(() => {
                      const storeHours = processStoreHours(storeData.openingHours);
                      return (
                        <div
                          className={`p-4 rounded-xl border ${
                            storeHours.isOpen ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${storeHours.isOpen ? 'bg-green-500' : 'bg-red-500'}`}
                            ></div>
                            <span
                              className={`font-medium text-sm ${storeHours.isOpen ? 'text-green-700' : 'text-red-700'}`}
                            >
                              {storeHours.isOpen ? 'Aberto agora' : 'Fechado agora'}
                            </span>
                          </div>
                          <p className={`text-sm mt-1 ${storeHours.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                            {storeHours.isOpen && storeHours.closingTime && `Fecha às ${storeHours.closingTime}`}
                            {!storeHours.isOpen && storeHours.nextOpenTime && `Abre às ${storeHours.nextOpenTime}`}
                            {!storeHours.isOpen && !storeHours.nextOpenTime && 'Fechado hoje'}
                          </p>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </div>

        {/* Modals */}
        {editingProduct !== null && (
          <ProductEditModal
            product={storeData.products[editingProduct]}
            onProductUpdated={(updatedProduct) => {
              const newProducts = [...storeData.products];
              newProducts[editingProduct] = updatedProduct;
              setStoreData((prev) => ({ ...prev, products: newProducts }));
              setEditingProduct(null);
            }}
            onDelete={() => {
              removeProduct(editingProduct);
              setEditingProduct(null);
            }}
            onClose={() => setEditingProduct(null)}
          />
        )}

        {/* Modal de edição de evento */}
        {editingEvent !== null && (
          <EventEditModal
            event={storeData.events[editingEvent]}
            storeAddress={storeData.address}
            onEventUpdated={(updatedEvent) => {
              const newEvents = [...storeData.events];
              newEvents[editingEvent] = updatedEvent;
              setStoreData((prev) => ({ ...prev, events: newEvents }));
              setEditingEvent(null);
            }}
            onDelete={() => {
              removeEvent(editingEvent);
              setEditingEvent(null);
            }}
            onClose={() => setEditingEvent(null)}
          />
        )}

        {showStoreForm && (
          <StoreForm
            storeData={storeData}
            onStoreUpdated={handleStoreUpdated}
            onClose={() => setShowStoreForm(false)}
            isEditing={true}
          />
        )}

        {showEventForm && (
          <EventForm
            storeId={storeData.id}
            storeAddress={storeData.address}
            onEventCreated={handleEventCreated}
            onClose={() => setShowEventForm(false)}
          />
        )}

        {showProductForm && storeData && (
          <ProductFormModal
            storeId={storeData.id}
            onProductCreated={handleProductCreated}
            onClose={() => setShowProductForm(false)}
            isOpen={showProductForm}
          />
        )}
      </div>
    </div>
  );
}
