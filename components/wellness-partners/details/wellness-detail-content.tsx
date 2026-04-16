'use client';

import { useState, useEffect } from 'react';
import {
  Globe,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Users,
  Briefcase,
  Store,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { fetchStoreById, fetchMyStore } from '@/lib/store-api';
import { toast } from 'sonner';
import { StoreData } from '@/types';
import StoreInfoSection from '@/components/store/store-info-section';
import { formatCurrency } from '@/lib/utils';

interface WellnessDetailContentProps {
  supplierId?: string;
}

export function WellnessDetailContent({ supplierId }: WellnessDetailContentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [storeData, setStoreData] = useState<StoreData | null>(null);

  useEffect(() => {
    loadStoreData();
  }, []);

  const loadStoreData = async () => {
    try {
      setIsLoading(true);
      const response = supplierId ? await fetchStoreById(supplierId) : await fetchMyStore();
      if (response.status === 200) {
        setStoreData(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do parceiro:', error);
      toast.error('Não foi possível carregar os dados do parceiro.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-[#1A3B51]">Carregando...</div>;
  if (!storeData) return <div className="p-8 text-center text-[#1A3B51]">Parceiro não encontrado.</div>;

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#1A3B51]/10 shadow-lg w-full">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A3B51] to-[#2A5B71] rounded-xl" />
          <div className="relative px-6 py-12 md:py-20">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-10 w-full">
                <div className="relative">
                  {storeData.logoUrl ? (
                    <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
                      <img
                        src={storeData.logoUrl}
                        alt={storeData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-40 h-40 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl flex items-center justify-center">
                      <Store className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center lg:text-left text-white">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">{storeData.name}</h1>
                  <p className="text-lg text-white/80 leading-relaxed mb-6 max-w-2xl">
                    {storeData.description}
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    {storeData.website && (
                      <Button
                        variant="secondary"
                        size="lg"
                        className="rounded-xl font-semibold"
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

        {/* Serviços Section */}
        <div className="px-6 py-12">
          <div className="max-w-7xl mx-auto space-y-12">
            <section>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#1A3B51] mb-2 flex items-center gap-2">
                  <Briefcase className="w-8 h-8" />
                  Nossos Serviços
                </h2>
                <p className="text-[#1A3B51]/70">Explore os serviços de bem-estar oferecidos</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storeData.products.map((service, index) => (
                  <Card
                    key={index}
                    className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={service.photoUrl || '/placeholder.svg'}
                        alt={service.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-[#1A3B51] mb-2 text-lg">{service.name}</h3>
                      <p className="text-sm text-[#1A3B51]/70 mb-4 line-clamp-3">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-2xl font-bold text-[#1A3B51]">
                          {formatCurrency(service.price)}
                        </div>
                        {service.duration && (
                          <div className="flex items-center gap-1 text-sm text-[#1A3B51]/60">
                            <Clock className="w-4 h-4" />
                            {service.duration}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Eventos Section */}
            {storeData.events && storeData.events.length > 0 && (
              <section>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-[#1A3B51] mb-2 flex items-center gap-2">
                    <Calendar className="w-8 h-8" />
                    Atividades e Eventos
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {storeData.events.map((event, index) => (
                    <Card key={index} className="bg-[#1A3B51] text-white rounded-2xl p-6 shadow-xl">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline" className="text-white border-white/20">
                          {event.type}
                        </Badge>
                        <span className="text-2xl font-bold text-blue-400">+{event.points} pts</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                      <p className="text-white/70 text-sm mb-6 line-clamp-2">{event.description}</p>
                      <div className="space-y-2 text-sm text-white/60">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {event.address.district}, {event.address.city}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            <StoreInfoSection storeData={storeData} />
          </div>
        </div>
      </div>
    </div>
  );
}
