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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { EventForm } from '@/components/event-form';
import { ProductForm } from '@/components/product-form';
import { MyStoreContentSkeleton } from './my-store-skeleton';
import { EventEditModal } from './event-edit-modal';
import { fetchMyStore, updateStore } from '@/lib/store-api';
import { createProduct } from '@/lib/product';
import { ProductEditModal } from './product-edit-modal';
import { toast } from 'sonner';
import { StoreData } from '@/types';

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

  useEffect(() => {
    const loadStoreData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchStoreData();
        setStoreData(data);
        setEditData(data);
      } catch (error) {
        console.error('Erro ao carregar dados da loja:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoreData();
  }, []);

  const handleSave = async () => {
    if (editData) {
      try {
        setIsLoading(true);
        const response = await updateStore(editData);
        if (response.status === 200) {
          setStoreData(editData);
          toast.success('Loja editada com sucesso.');
        }
      } catch (error) {
        toast.error('Erro ao editar a loja, atualize a pagina e tente novamente.');
        console.error('Erro ao atualizar produto:', error);
      } finally {
        setIsEditing(false);
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditData(storeData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    if (!editData) return;

    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setEditData({
        ...editData,
        address: {
          ...editData.address,
          [addressField]: value,
        },
      });
    } else {
      setEditData({
        ...editData,
        [field]: value,
      });
    }
  };

  const handleEventCreated = (eventData: any) => {
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
    };

    setStoreData((prev) =>
      prev
        ? {
            ...prev,
            events: [...prev.events, newEvent],
          }
        : null
    );

    setShowEventForm(false);
    console.log('Evento criado:', newEvent);
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

    const response = await createProduct(newProduct);
    if (response.status === 201) {
      setShowProductForm(false);
      setStoreData((prev) =>
        prev
          ? {
              ...prev,
              products: [...prev.products, newProduct],
            }
          : null
      );
    }
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

  if (!storeData || !editData) {
    return (
      <div className="p-6 md:p-8 w-full">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#511A2B] mb-4">Erro ao carregar dados da loja</h2>
            <p className="text-[#511A2B]/70">Tente recarregar a página</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full">
        {/* Floating Action Buttons */}
        <div className="fixed top-32 right-8 md:right-16 z-50 flex flex-col space-y-3">
          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            size="icon"
            className={`rounded-full shadow-xl backdrop-blur-sm transition-all duration-300 ${
              isEditing
                ? 'bg-green-500 hover:bg-green-600 text-white scale-110'
                : 'bg-white/90 hover:bg-white text-gray-700 hover:scale-110'
            }`}
          >
            {isEditing ? <Save className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
          </Button>

          {isEditing && (
            <Button
              onClick={handleCancel}
              size="icon"
              className="rounded-full bg-red-500 hover:bg-red-600 text-white shadow-xl backdrop-blur-sm hover:scale-110 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[#46142b] rounded-xl" />
          <div className="relative px-6 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-12">
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
                <div className="flex-1 text-center lg:text-left text-white">
                  {isEditing ? (
                    <Input
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-4xl md:text-5xl font-bold mb-4 bg-white/20 border-white/30 text-white placeholder-white/70 rounded-xl pb-8 pt-8"
                      placeholder="Nome da loja"
                    />
                  ) : (
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{storeData.name}</h1>
                  )}

                  <p className="text-xl md:text-2xl text-white/90 mb-6">Minha Loja Especializada</p>

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
                    <span className="ml-3 text-2xl font-bold">{storeData.rating.toFixed(1)}</span>
                    <span className="ml-2 text-white/80">• Excelente</span>
                  </div>

                  {isEditing ? (
                    <Textarea
                      value={editData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="text-lg text-white leading-relaxed mb-8 max-w-2xl bg-white/20 border-white/30 text-white placeholder-white/70 rounded-xl"
                      placeholder="Descrição da loja"
                      rows={3}
                    />
                  ) : (
                    <p className="text-lg text-white/90 leading-relaxed mb-8 max-w-2xl">{storeData.description}</p>
                  )}

                  {/* Botões de Ação */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {isEditing ? (
                      <>
                        <Input
                          value={editData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          className="bg-white/20 border-white/30 text-white placeholder-white/70 rounded-xl"
                          placeholder="https://meusite.com.br"
                        />
                      </>
                    ) : (
                      <>
                        <Button
                          size="lg"
                          className="bg-white text-[#511A2B] hover:bg-white/90 rounded-xl px-8 py-4 font-semibold shadow-xl"
                          onClick={() => window.open(storeData.website, '_blank')}
                        >
                          <Globe className="w-5 h-5 mr-2" />
                          Visitar Site
                        </Button>
                      </>
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
                  <div className="text-2xl font-bold text-[#511A2B]">{storeData.rating.toFixed(1)}</div>
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
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-[#511A2B] mb-2">Meus Produtos</h2>
                  <p className="text-[#511A2B]/70">Gerencie sua linha completa de produtos</p>
                </div>
                <Button
                  onClick={() => setShowProductForm(true)}
                  className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl px-6 py-3"
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
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-[#511A2B] mb-2">Meus Eventos</h2>
                  <p className="text-[#511A2B]/70">Organize eventos e workshops para sua comunidade</p>
                </div>
                <Button
                  onClick={() => setShowEventForm(true)}
                  className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl px-6 py-3"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Evento
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            {/* Informações da Loja */}
            <section>
              <h2 className="text-3xl font-bold text-[#511A2B] mb-8">Informações da Loja</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white border-0 shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-[#511A2B] flex items-center text-xl">
                      <MapPin className="w-6 h-6 mr-3" />
                      Localização
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-[#511A2B] font-medium">CEP</Label>
                            <Input
                              value={editData.address.zipCode}
                              onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                              className="border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                            />
                          </div>
                          <div>
                            <Label className="text-[#511A2B] font-medium">Estado</Label>
                            <Input
                              value={editData.address.state}
                              onChange={(e) => handleInputChange('address.state', e.target.value)}
                              className="border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-[#511A2B] font-medium">Cidade</Label>
                            <Input
                              value={editData.address.city}
                              onChange={(e) => handleInputChange('address.city', e.target.value)}
                              className="border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                            />
                          </div>
                          <div>
                            <Label className="text-[#511A2B] font-medium">Bairro</Label>
                            <Input
                              value={editData.address.district}
                              onChange={(e) => handleInputChange('address.district', e.target.value)}
                              className="border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <Label className="text-[#511A2B] font-medium">Rua</Label>
                            <Input
                              value={editData.address.street}
                              onChange={(e) => handleInputChange('address.street', e.target.value)}
                              className="border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                            />
                          </div>
                          <div>
                            <Label className="text-[#511A2B] font-medium">Número</Label>
                            <Input
                              value={editData.address.number}
                              onChange={(e) => handleInputChange('address.number', e.target.value)}
                              className="border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-[#511A2B] font-medium">Complemento</Label>
                          <Input
                            value={editData.address.complement || ''}
                            onChange={(e) => handleInputChange('address.complement', e.target.value)}
                            className="border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold text-[#511A2B] text-lg">
                          {storeData.address.street}, {storeData.address.number}
                          {storeData.address.complement && `, ${storeData.address.complement}`}
                        </p>
                        <p className="text-[#511A2B]/80">
                          {storeData.address.district}, {storeData.address.city} - {storeData.address.state}
                        </p>
                        <p className="text-[#511A2B]/80">CEP: {storeData.address.zipCode}</p>
                      </div>
                    )}
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#511A2B]/70" />
                      <div className="flex-1">
                        <p className="text-sm text-[#511A2B]/70">Horário de Funcionamento</p>
                        {isEditing ? (
                          <Input
                            value={editData.openingHours}
                            onChange={(e) => handleInputChange('openingHours', e.target.value)}
                            className="border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                            placeholder="Ex: Segunda a Sexta: 08:00 - 18:00"
                          />
                        ) : (
                          <p className="font-semibold text-[#511A2B]">{storeData.openingHours}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-[#511A2B] flex items-center text-xl">
                      <Globe className="w-6 h-6 mr-3" />
                      Contato
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-[#511A2B]/5 rounded-xl">
                      <Globe className="w-5 h-5 text-[#511A2B]/70" />
                      <div className="flex-1">
                        <p className="text-sm text-[#511A2B]/70">Website</p>
                        {isEditing ? (
                          <Input
                            value={editData.website}
                            onChange={(e) => handleInputChange('website', e.target.value)}
                            className="border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                            placeholder="https://meusite.com.br"
                          />
                        ) : (
                          <a
                            href={storeData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 hover:underline"
                          >
                            {storeData.website}
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-[#511A2B]/5 rounded-xl">
                      <Mail className="w-5 h-5 text-[#511A2B]/70" />
                      <div>
                        <p className="text-sm text-[#511A2B]/70">E-mail</p>
                        <p className="font-semibold text-[#511A2B]">
                          contato@{storeData.website?.replace('https://', '')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
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
      {showEventForm && (
        <EventForm
          storeId={storeData.id}
          storeAddress={storeData.address}
          onEventCreated={handleEventCreated}
          onClose={() => setShowEventForm(false)}
        />
      )}

      {showProductForm && (
        <ProductForm
          storeId={storeData.id}
          onProductCreated={handleProductCreated}
          onClose={() => setShowProductForm(false)}
        />
      )}
    </div>
  );
}
