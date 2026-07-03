'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Clock, MapPin, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import type { Wellness } from '@/types/wellness';
import { fetchWellnessById } from '@/lib/wellness-api';

export function WellnessProfileContent() {
  const params = useParams();
  const id = params?.id as string;
  const [wellness, setWellness] = useState<Wellness | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchWellnessById(id)
      .then((response) => setWellness(response.data))
      .catch((error) => {
        console.error('Erro ao carregar parceiro wellness:', error);
        toast.error('Erro ao carregar o perfil.');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <div className="p-8 text-center text-[#1A3B51]/70">Carregando perfil...</div>;
  }

  if (!wellness) {
    return <div className="p-8 text-center text-[#1A3B51]/70">Parceiro wellness não encontrado.</div>;
  }

  const whatsapp = (wellness.contact || '').replace(/\D/g, '');
  const address = wellness.user?.address;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="overflow-hidden rounded-2xl border border-[#4A1730]/15">
        <div className="h-28 bg-[#F7E5B0]" />
        <CardContent className="p-6 -mt-14">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <div className="w-28 h-28 rounded-2xl border-4 border-white bg-white overflow-hidden flex items-center justify-center shadow">
              {wellness.user?.profileImage ? (
                <img
                  src={wellness.user.profileImage}
                  alt={wellness.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Sparkles className="w-10 h-10 text-[#4A1730]/40" />
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-[#1A3B51]">{wellness.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-1 text-sm text-[#1A3B51]/70">
                <MapPin className="w-4 h-4" />
                {address?.city || 'Cidade não informada'}, {address?.state || '--'}
              </div>
            </div>
            <Button
              className="rounded-xl bg-[#4A1730] hover:bg-[#5C1D3B] text-white"
              onClick={() => {
                if (!whatsapp) {
                  toast.info('Contato via WhatsApp não disponível');
                  return;
                }
                const text = wellness.whatsappMessage
                  ? `?text=${encodeURIComponent(wellness.whatsappMessage)}`
                  : '';
                window.open(`https://wa.me/${whatsapp}${text}`, '_blank');
              }}
            >
              Agendar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {wellness.description && (
            <p className="mt-6 text-[#1A3B51]/80 leading-relaxed">{wellness.description}</p>
          )}

          <h2 className="mt-8 mb-3 text-lg font-semibold text-[#1A3B51]">Serviços</h2>
          {wellness.services.length === 0 ? (
            <p className="text-sm text-[#1A3B51]/60">Nenhum serviço cadastrado.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wellness.services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-xl border border-[#4A1730]/15 bg-white p-4 shadow-sm space-y-1"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-[#1A3B51]">{service.name}</span>
                    <span className="shrink-0 rounded-md bg-[#FFF7DD] px-2 py-0.5 text-xs font-bold text-[#4A1730]">
                      {service.price != null ? formatCurrency(service.price) : 'Sob consulta'}
                    </span>
                  </div>
                  {service.description && (
                    <p className="text-sm text-[#1A3B51]/70">{service.description}</p>
                  )}
                  {service.duration && (
                    <div className="flex items-center gap-1 text-xs text-[#1A3B51]/55">
                      <Clock className="w-3 h-3" />
                      {service.duration}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
