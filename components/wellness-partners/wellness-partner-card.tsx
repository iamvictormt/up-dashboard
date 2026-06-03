'use client';

import { Star, Package, ArrowRight, ChevronDown, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn, formatCurrency } from '@/lib/utils';
import { WellnessPartnerListItem } from '@/types';
import { toast } from 'sonner';

interface WellnessPartnerCardProps {
  partner: WellnessPartnerListItem;
}

export function WellnessPartnerCard({ partner }: WellnessPartnerCardProps) {
  const { id, tradeName, contact, isVerified, store } = partner;
  const storeData = store;

  if (!id) {
    return null;
  }

  const serviceOfferings = storeData?.products ?? [];
  const displayServices = serviceOfferings.slice(0, 2);
  const remainingServices = Math.max(0, serviceOfferings.length - displayServices.length);
  const openingHours = storeData?.openingHours ?? '';
  const openingHoursList = openingHours ? openingHours.split('|').map((entry) => entry.trim()).filter(Boolean) : [];
  const mainOpeningHour = openingHoursList[0] || 'Horário não informado';
  const hasMoreHours = openingHoursList.length > 1;

  const hoursList = (openingHours ?? '')
    .split('|')
    .map((entry) => entry.trim())
    .filter(Boolean);
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });
  const todayHours = hoursList.find((entry) => entry.toLowerCase().includes(today.toLowerCase())) || hoursList[0];

  const now = new Date();
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

  const isOpen = (() => {
    if (!todayHours || !todayHours.includes(':')) return false;

    const timePart = todayHours.split(':').slice(1).join(':').trim();
    const [startTime, endTime] = timePart.split('-').map((time) => time?.trim());
    if (!startTime || !endTime) return false;

    const [startHour, startMinute = '0'] = startTime.split(':');
    const [endHour, endMinute = '0'] = endTime.split(':');
    const startTotalMinutes = Number(startHour) * 60 + Number(startMinute);
    const endTotalMinutes = Number(endHour) * 60 + Number(endMinute);

    return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes < endTotalMinutes;
  })();

  const whatsapp = (contact || '').replace(/\D/g, '');

  return (
    <Card className="group relative flex flex-col h-full overflow-hidden border border-[#4A1730]/15 bg-white transition-all duration-300 hover:shadow-xl hover:border-[#4A1730]/25 rounded-2xl">
      <div className="absolute inset-x-0 top-0 h-24 bg-[#F7E5B0]" />

      <CardHeader className="relative z-10 pt-6 pb-2 px-4 sm:px-5 flex-none">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-background bg-white overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              {storeData?.logoUrl ? (
                <img
                  src={storeData.logoUrl || '/placeholder.svg'}
                  alt={storeData.name || tradeName || 'Parceiro wellness'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Sparkles className="w-8 h-8 text-[#4A1730]/40" />
              )}
            </div>
            {Boolean(storeData?.rating && storeData.rating > 0) && (
              <div className="absolute -bottom-2 -right-2 bg-background border border-border/50 shadow-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-foreground">{storeData?.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="flex-1 w-full min-w-0 pt-1 sm:pt-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1 flex-wrap">
              <h3 className="font-bold text-base sm:text-lg leading-tight text-[#1A3B51] truncate group-hover:text-[#4A1730] transition-colors duration-300">
                {storeData?.name || tradeName || 'Parceiro Wellness'}
              </h3>
              {isVerified && (
                <Badge variant="secondary" className="bg-[#F7E5B0] text-[#4A1730] hover:bg-[#F7E5B0] border-[#4A1730]/15 flex items-center gap-0.5 px-1.5 py-0">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="text-[10px]">Verificado</span>
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1 mt-1 text-[#1A3B51]/70 text-xs sm:text-sm">
              <span className="truncate">
                  {storeData?.address?.city || 'Cidade não informada'}, {storeData?.address?.state || '--'}
              </span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-1 mt-2">
              <div
                className={cn(
                  'flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize tracking-wider border backdrop-blur-sm',
                  isOpen
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                    : 'bg-red-500/10 border-red-500/20 text-red-600'
                )}
              >
                {isOpen ? 'Aberto' : 'Fechado'}
                <div
                  className={cn('w-1.5 h-1.5 rounded-full animate-pulse', isOpen ? 'bg-emerald-400' : 'bg-red-400')}
                />
              </div>
            </div>

            <div className="relative group/hours inline-block gap-1 mt-2">
              <Badge
                variant="secondary"
                className={cn(
                  'flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize tracking-wider border backdrop-blur-sm bg-[#F7E5B0]/70 text-[#1A3B51] border-[#4A1730]/10 transition-colors',
                  hasMoreHours && 'hover:bg-[#F7E5B0] pr-1.5'
                )}
              >
                <span className="truncate max-w-[200px] sm:max-w-none">{mainOpeningHour}</span>
                {hasMoreHours && <ChevronDown className="w-3 h-3 ml-1 opacity-50" />}
              </Badge>

              {hasMoreHours && (
                <div className="absolute top-full left-0 mt-2 md:w-60 w-full p-2 bg-popover text-popover-foreground text-xs rounded-lg border shadow-lg opacity-0 invisible group-hover/hours:opacity-100 group-hover/hours:visible transition-all duration-200 z-50 translate-y-1 group-hover/hours:translate-y-0 w-full">
                  <div className="font-semibold mb-1.5 px-1 text-muted-foreground text-[10px] uppercase tracking-wider">
                    Horários de Funcionamento
                  </div>
                  <div className="space-y-1">
                    {openingHoursList.map((hour, i) => (
                      <div key={i} className="px-2 py-1.5 rounded-md hover:bg-muted/50 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#4A1730]/50" />
                        {hour}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 sm:gap-5 px-4 sm:px-5 py-4">
        <p className="text-sm text-[#1A3B51]/75 line-clamp-2 leading-relaxed min-h-[40px]">
          {storeData?.description || 'Conheça experiências e serviços voltados ao seu bem-estar.'}
        </p>

        <div className="space-y-2.5 p-3 rounded-xl border border-[#4A1730]/10 bg-[#FFF7DD]">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[#1A3B51]/70 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              Serviços Wellness
            </h4>{' '}
            {remainingServices > 0 && (
              <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                +{remainingServices}
              </span>
            )}
          </div>

          {serviceOfferings.length > 0 ? (
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
                        {formatCurrency(service.price)}
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
        <Link href={`/wellness-partners/${storeData?.id}`} className="flex-1">
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

            window.open(`https://wa.me/${whatsapp}`, '_blank');
          }}
        >
          Agendar
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}
