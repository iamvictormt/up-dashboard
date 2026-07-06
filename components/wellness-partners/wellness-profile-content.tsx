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
import { buildWhatsAppUrl } from '@/constants/whatsapp';

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
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#4A1730]/20 border-t-[#4A1730] animate-spin" />
          <span className="text-sm text-[#1A3B51]/60 tracking-wide">Carregando perfil...</span>
        </div>
      </div>
    );
  }

  if (!wellness) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <Sparkles className="w-8 h-8 text-[#4A1730]/30 mb-3" />
        <p className="text-[#1A3B51]/70">Parceiro wellness não encontrado.</p>
      </div>
    );
  }

  const whatsapp = (wellness.contact || '').replace(/\D/g, '');
  const address = wellness.user?.address;
  const displayLogo = wellness.logoUrl || wellness.user?.profileImage;
  const openingHoursList = (wellness.openingHours ?? '')
    .split('|')
    .map((e) => e.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-10 max-w-5xl ">
        <Card className="overflow-hidden rounded-[28px] border border-[#4A1730]/10 shadow-[0_20px_60px_-15px_rgba(74,23,48,0.25)] bg-[#FDF8F0] border-0">
          {/* Hero band — soft wine gradient with a quiet ripple motif echoing the wellness theme */}
          <div className="relative h-40 md:h-48 bg-gradient-to-br from-[#5C1D3B] via-[#4A1730] to-[#2E0E1D] overflow-hidden">
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.15]"
              viewBox="0 0 800 200"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0,120 Q100,80 200,120 T400,120 T600,120 T800,120 V200 H0 Z"
                fill="none"
                stroke="#FFF7DD"
                strokeWidth="1.5"
              />
              <path
                d="M0,150 Q100,110 200,150 T400,150 T600,150 T800,150 V200 H0 Z"
                fill="none"
                stroke="#FFF7DD"
                strokeWidth="1"
              />
              <path
                d="M0,90 Q100,50 200,90 T400,90 T600,90 T800,90"
                fill="none"
                stroke="#FFF7DD"
                strokeWidth="1"
              />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>

          <CardContent className="p-6 md:p-8 -mt-16 bg-transparent border-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
              <div className="relative shrink-0">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border-[3px] border-white bg-white overflow-hidden flex items-center justify-center shadow-[0_8px_24px_rgba(74,23,48,0.2)]">
                  {displayLogo ? (
                    <img src={displayLogo} alt={wellness.name} className="w-full h-full object-cover" />
                  ) : (
                    <Sparkles className="w-10 h-10 text-[#4A1730]/40" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#FFF7DD] border-2 border-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#4A1730]" />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left pb-1">
                <h1 className="text-2xl md:text-[28px] font-bold text-[#1A3B51] tracking-tight">
                  {wellness.name}
                </h1>
                <div className="mt-1.5 flex items-center justify-center sm:justify-start gap-1.5 text-sm text-[#1A3B51]/60">
                  <MapPin className="w-3.5 h-3.5" />
                  {address?.city || 'Cidade não informada'}, {address?.state || '--'}
                </div>
              </div>

              <Button
                className="rounded-xl bg-[#4A1730] hover:bg-[#5C1D3B] text-white h-11 px-5 shadow-[0_6px_16px_rgba(74,23,48,0.3)] transition-all hover:shadow-[0_8px_20px_rgba(74,23,48,0.4)] hover:-translate-y-0.5"
                onClick={() => {
                  if (!whatsapp) {
                    toast.info('Contato via WhatsApp não disponível');
                    return;
                  }
                  window.open(buildWhatsAppUrl(whatsapp, wellness.whatsappMessage), '_blank');
                }}
              >
                Agendar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {wellness.description && (
              <div className="mt-7 pl-4 border-l-2 border-[#4A1730]/15">
                <p className="text-[#1A3B51]/75 leading-relaxed italic">{wellness.description}</p>
              </div>
            )}

            {openingHoursList.length > 0 && (
              <div className="mt-7 rounded-2xl bg-[#FFF7DD]/60 border border-[#4A1730]/10 p-4">
                <h2 className="mb-3 text-xs font-semibold text-[#4A1730] uppercase tracking-[0.12em] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Horário de atendimento
                </h2>
                <div className="flex flex-wrap gap-2">
                  {openingHoursList.map((hour, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium text-[#1A3B51] bg-white border border-[#4A1730]/10 rounded-full px-3 py-1.5 shadow-sm"
                    >
                      {hour}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-9 flex items-center gap-3">
              <h2 className="text-lg font-semibold text-[#1A3B51] whitespace-nowrap">Serviços</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-[#4A1730]/15 to-transparent" />
            </div>

            {wellness.services.length === 0 ? (
              <p className="mt-4 text-sm text-[#1A3B51]/60">Nenhum serviço cadastrado.</p>
            ) : (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wellness.services.map((service) => (
                  <div
                    key={service.id}
                    className="group relative rounded-2xl border border-[#4A1730]/10 bg-white p-4 shadow-sm space-y-1.5 overflow-hidden transition-all hover:shadow-[0_10px_28px_-8px_rgba(74,23,48,0.25)] hover:-translate-y-0.5"
                  >
                    <span className="absolute left-0 top-0 h-full w-1 bg-[#4A1730]/0 group-hover:bg-[#4A1730] transition-colors" />
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-[#1A3B51]">{service.name}</span>
                      <span className="shrink-0 rounded-lg bg-gradient-to-br from-[#FFF7DD] to-[#FFEDC1] px-2.5 py-1 text-xs font-bold text-[#4A1730] border border-[#4A1730]/5">
                        {service.price != null ? formatCurrency(service.price) : 'Sob consulta'}
                      </span>
                    </div>
                    {service.description && (
                      <p className="text-sm text-[#1A3B51]/65 leading-snug">{service.description}</p>
                    )}
                    {service.duration && (
                      <div className="flex items-center gap-1 text-xs text-[#1A3B51]/50 pt-1">
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
    </div>
  );
}