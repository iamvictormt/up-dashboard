'use client';

import { Package, ArrowRight, Clock, Sparkles, MapPin } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import type { Wellness } from '@/types/wellness';
import { toast } from 'sonner';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE_WELLNESS } from '@/constants/whatsapp';

interface WellnessPartnerCardProps {
  partner: Wellness;
}

export function WellnessPartnerCard({ partner }: WellnessPartnerCardProps) {
  const { id, name, contact, description, services, user, whatsappMessage, logoUrl, openingHours } = partner;

  if (!id) {
    return null;
  }

  const displayServices = (services ?? []).slice(0, 2);
  const remainingServices = Math.max(0, (services ?? []).length - displayServices.length);
  const whatsapp = (contact || '').replace(/\D/g, '');
  const address = user?.address;
  const displayLogo = logoUrl || user?.profileImage;
  const mainOpeningHour = (openingHours ?? '').split('|').map((e) => e.trim()).filter(Boolean)[0];

  return (
    <Card className="group relative flex flex-col h-full overflow-hidden border border-[#4A1730]/15 bg-white transition-all duration-300 hover:shadow-xl hover:border-[#4A1730]/25 rounded-2xl">
      <div className="absolute inset-x-0 top-0 h-24 bg-[#F7E5B0]" />

      <CardHeader className="relative z-10 pt-6 pb-2 px-4 sm:px-5 flex-none">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-background bg-white overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              {displayLogo ? (
                <img
                  src={displayLogo || '/placeholder.svg'}
                  alt={name || 'Parceiro wellness'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Sparkles className="w-8 h-8 text-[#4A1730]/40" />
              )}
            </div>
          </div>

          <div className="flex-1 w-full min-w-0 pt-1 sm:pt-2 text-center sm:text-left">
            <h3 className="font-bold text-base sm:text-lg leading-tight text-[#1A3B51] truncate group-hover:text-[#4A1730] transition-colors duration-300">
              {name || 'Parceiro Wellness'}
            </h3>
            <div className="flex items-center justify-center sm:justify-start gap-1 mt-1 text-[#1A3B51]/70 text-xs sm:text-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">
                {address?.city || 'Cidade não informada'}, {address?.state || '--'}
              </span>
            </div>
            {mainOpeningHour && (
              <div className="flex items-center justify-center sm:justify-start gap-1 mt-2 text-[10px] font-bold text-[#1A3B51] bg-[#F7E5B0]/70 border border-[#4A1730]/10 rounded-full px-2 py-0.5 w-fit mx-auto sm:mx-0">
                <Clock className="w-3 h-3" />
                <span className="truncate max-w-[200px]">{mainOpeningHour}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 sm:gap-5 px-4 sm:px-5 py-4">
        <p className="text-sm text-[#1A3B51]/75 line-clamp-2 leading-relaxed min-h-[40px]">
          {description || 'Conheça experiências e serviços voltados ao seu bem-estar.'}
        </p>

        <div className="space-y-2.5 p-3 rounded-xl border border-[#4A1730]/10 bg-[#FFF7DD]">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[#1A3B51]/70 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              Serviços Wellness
            </h4>
            {remainingServices > 0 && (
              <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                +{remainingServices}
              </span>
            )}
          </div>

          {displayServices.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {displayServices.map((service) => (
                <div
                  key={service.id || service.name}
                  className="group/product overflow-hidden rounded-xl border border-[#4A1730]/15 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4A1730]/30 hover:shadow-md"
                >
                  <div className="aspect-[5/3] overflow-hidden bg-[#FFF7DD]">
                    {service.photoUrl ? (
                      <img
                        src={service.photoUrl || '/placeholder.svg'}
                        alt={service.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover/product:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Sparkles className="h-6 w-6 text-[#4A1730]/35" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 border-t border-[#4A1730]/10 bg-white px-2.5 py-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="line-clamp-2 min-w-0 text-[11px] font-bold leading-tight text-[#1A3B51]">
                        {service.name}
                      </span>
                      <span className="shrink-0 rounded-md bg-[#FFF7DD] px-1.5 py-0.5 text-[10px] font-bold text-[#4A1730]">
                        {service.price != null ? formatCurrency(service.price) : 'Sob consulta'}
                      </span>
                    </div>
                    {service.duration && (
                      <div className="flex items-center gap-1 text-[9px] font-medium text-[#1A3B51]/55">
                        <Clock className="h-2.5 w-2.5" />
                        <span className="truncate">{service.duration}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="aspect-[4/3] rounded-lg border border-dashed border-[#4A1730]/20 bg-white flex flex-col items-center justify-center text-[#1A3B51]/55 shadow-sm">
                <Sparkles className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">Sem serviços cadastrados</span>
              </div>
              <div className="aspect-[4/3] rounded-lg border border-dashed border-[#4A1730]/20 bg-white flex flex-col items-center justify-center text-[#1A3B51]/55 shadow-sm">
                <Sparkles className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">Sem serviços cadastrados</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 sm:p-5 pt-0 gap-2">
        <Link href={`/wellness-partners/${id}`} className="flex-1">
          <Button variant="outline" className="w-full rounded-xl font-semibold transition-all">
            Ver Perfil
          </Button>
        </Link>
        <Button
          className="flex-1 rounded-xl font-semibold shadow-md hover:shadow-xl transition-all group/btn bg-[#4A1730] hover:bg-[#5C1D3B] text-white"
          onClick={() => {
            if (!whatsapp) {
              toast.info('Contato via WhatsApp não disponível');
              return;
            }
            window.open(buildWhatsAppUrl(whatsapp, whatsappMessage, DEFAULT_WHATSAPP_MESSAGE_WELLNESS), '_blank');
          }}
        >
          Agendar
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}
