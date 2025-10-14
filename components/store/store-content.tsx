'use client';

import { useState, useEffect } from 'react';
import {
  Star,
  Store,
  Globe,
  Package,
  Calendar,
  Award,
  Edit3,
  Plus,
  ExternalLink,
  Heart,
  MapPin,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { EventForm } from '@/components/store/event-form';
import { EventEditModal } from './event-edit-modal';
import { fetchMyStore, fetchStoreById } from '@/lib/store-api';
import { ProductEditModal } from './product-edit-modal';
import { toast } from 'sonner';
import { StoreData } from '@/types';
import { StoreForm } from './store-form';
import { NoStoreView } from './no-store-view';
import { ProductFormModal } from './product-form';
import StoreInfoSection from './store-info-section';
import { formatCurrency } from '@/lib/utils';

const fetchStoreData = async (supplierId: string | undefined): Promise<StoreData | null> => {
  const response = supplierId ? await fetchStoreById(supplierId) : await fetchMyStore();
  if (response.status === 200) {
    return response.data;
  }

  return null;
};

interface StoreContentProps {
  supplierId?: string;
}

export function StoreContent({ supplierId }: StoreContentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [editingEvent, setEditingEvent] = useState<number | null>(null);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [showStoreForm, setShowStoreForm] = useState(false);

  useEffect(() => {
    loadStoreData();
  }, []);

  const loadStoreData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchStoreData(supplierId);
      setStoreData(data);
    } catch (error) {
      console.error('Erro ao carregar dados da loja:', error);
    } finally {
      setIsLoading(false);
    }
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

    setShowEventForm(false);
    loadStoreData();
  };

  const handleProductCreated = async (productData: any) => {
    if (!storeData) return;

    setShowProductForm(false);
    loadStoreData();
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
    return <></>;
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
          {!supplierId ? (
            <Button
              onClick={() => setShowStoreForm(true)}
              className="rounded-2xl bg-white text-[#511A2B] hover:bg-white/90 shadow-xl backdrop-blur-sm hover:scale-110 transition-all duration-300 p-6"
            >
              <Edit3 className="w-5 h-5" />
            </Button>
          ) : (
            ''
          )}
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[#46142b] rounded-xl" />
          <div className="relative px-6 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-12 w-full px-4">
                {/* Logo/Ícone da Loja */}
                <div className="relative">
                  {storeData.logoUrl ? (
                    <div className="w-44 h-44 rounded-2xl overflow-hidden border-3 border-primary/30 shadow-md">
                      <img
                        src={storeData.logoUrl || '/placeholder.svg'}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-40 h-40 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-2xl flex items-center justify-center">
                      <Store className="w-20 h-20 text-white" />
                    </div>
                  )}
                </div>

                {/* Informações Principais */}
                <div className="w-full lg:flex-1 text-center lg:text-left text-white break-words max-w-full">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">{storeData.name}</h1>

                  {/* Rating */}
                  {/* <div className="flex items-center justify-center lg:justify-start mb-6">
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
                    <span className="ml-3 text-2xl font-bold">{storeData?.rating?.toFixed(1) || 0}</span>
                    <span className="ml-2 text-white/80 hidden md:block">• Excelente</span>
                  </div> */}

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#511A2B] to-[#D56235] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#511A2B]">{storeData?.rating?.toFixed(1) || 0}</div>
                  <div className="text-sm text-[#511A2B]/70">Avaliação</div>
                </CardContent>
              </Card> */}

              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-[#46142b] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#511A2B]">{storeData.products.length}</div>
                  <div className="text-sm text-[#511A2B]/70">Produtos disponíveis</div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#511A2B]">{storeData.events.length}</div>
                  <div className="text-sm text-[#511A2B]/70">Eventos disponíveis</div>
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
                  <h2 className="text-3xl font-bold text-[#511A2B] mb-2">
                    {!supplierId ? 'Gerenciar produtos' : 'Produtos da loja'}
                  </h2>
                  <p className="text-[#511A2B]/70">
                    {!supplierId
                      ? 'Organize e atualize sua linha de produtos com facilidade'
                      : 'Conheça a linha completa de produtos desta loja'}
                  </p>
                </div>
                {!supplierId && (
                  <Button
                    onClick={() => setShowProductForm(true)}
                    className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl px-6 py-3 w-[100%] md:w-[33%] mt-2 md:mt-0 md:place-self-end"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Produto
                  </Button>
                )}
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
                          src={product.photoUrl || '/placeholder.svg?height=300&width=300'}
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
                        {!supplierId && (
                          <div className="absolute top-3 right-3">
                            <Button
                              size="lg"
                              className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-[#511A2B] hover:bg-[#511A2B]/90 text-white"
                              onClick={() => setEditingProduct(index)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="font-bold text-[#511A2B] mb-2 text-lg">{product.name}</h3>
                      <p className="text-sm text-[#511A2B]/70 mb-4 overflow-visible whitespace-normal break-words line-clamp-1 truncate">
                        {product.description}
                      </p>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="text-2xl font-bold text-[#511A2B]">{formatCurrency(product.price || 0)}</div>
                        <Button
                          variant="primary"
                          onClick={() => window.open(product.link, '_blank')}
                          disabled={!product.link}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Ver Produto
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Eventos Section */}
            {storeData.events && (
              <section>
                <div className="flex items-center justify-between mb-8 grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <h2 className="text-3xl font-bold text-[#511A2B] mb-2">Eventos disponíveis</h2>
                    <p className="text-[#511A2B]/70">Atividades e workshops promovidos pela loja</p>
                  </div>
                  {/* {!supplierId && (
                  <Button
                    onClick={() => setShowEventForm(true)}
                    className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl px-6 py-3 w-[100%] md:w-[33%] mt-2 md:mt-0 md:place-self-end"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Evento
                  </Button>
                )} */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {storeData.events.map((event, index) => (
                    <Card
                      key={index}
                      className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden group"
                    >
                      <div className="relative h-48 bg-[#46142b]">
                        <div className="relative p-6 h-full flex flex-col justify-between text-white">
                          <div>
                            <Badge className="bg-white/20 text-white border-white/30 mb-3">{event.type}</Badge>
                            <h3 className="text-xl font-bold mb-2 text-white">{event.name}</h3>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-[#FEC460]">+{event.points} pontos</div>
                            <div className="text-right">
                              <div className="text-sm opacity-90">Vagas</div>
                              <div className="font-bold">
                                {event.filledSpots}/{event.totalSpots}
                              </div>
                            </div>
                          </div>
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
                              {event.participantsCount ?? 0} participantes confirmados
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            <StoreInfoSection storeData={storeData} />
          </div>
        </div>

        {/* Modals */}
        {editingProduct !== null && (
          <ProductEditModal
            product={storeData.products[editingProduct]}
            onProductUpdated={(updatedProduct) => {
              loadStoreData();
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
              loadStoreData();
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
