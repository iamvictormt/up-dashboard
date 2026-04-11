'use client';

import { useState } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Users,
  Award,
  Clock,
  Building,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EventConfirmationModal } from './event-confirmation';
import Image from 'next/image';

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  type: string;
  points: number;
  totalSpots: number;
  filledSpots: number;
  storeId: string;
  address: {
    state: string;
    city: string;
    district: string;
    street: string;
    complement: string | null;
    number: string;
    zipCode: string;
  };
  store: {
    id: string;
    name: string;
    rating: number;
    logoUrl?: string;
  };
  isRegistered?: boolean;
}

interface EventDetailModalProps {
  event: Event;
  professionalId?: string;
  onClose: () => void;
  onEventUpdate?: () => void;
  isRegistered?: boolean;
}

export function EventDetailModal({
  event,
  professionalId = '',
  onClose,
  onEventUpdate,
  isRegistered = false,
}: EventDetailModalProps) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      fullDate: date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const { fullDate, time } = formatDate(event.date);
  const progressPercentage = (event.filledSpots / event.totalSpots) * 100;
  const spotsLeft = event.totalSpots - event.filledSpots;

  const formatFullAddress = () => {
    const { street, number, complement, district, city, state, zipCode } = event.address;
    const addressParts = [
      street && number ? `${street}, ${number}` : null,
      complement,
      district,
      city,
      state,
      zipCode,
    ].filter(Boolean);
    return addressParts.join(', ');
  };

  const getTypeColor = (type: string) => {
    const map: any = {
      conferência: 'from-purple-500 to-purple-600',
      meetup: 'from-blue-500 to-blue-600',
      hackathon: 'from-orange-500 to-orange-600',
      workshop: 'from-green-500 to-green-600',
      curso: 'from-indigo-500 to-indigo-600',
      palestra: 'from-pink-500 to-pink-600',
      networking: 'from-cyan-500 to-cyan-600',
    };
    return map[type.toLowerCase()] || 'from-[#D56235] to-[#FEC460]';
  };

  const handleParticipateClick = () => {
    if (!professionalId || isRegistered || spotsLeft <= 0) return;
    setShowConfirmationModal(true);
  };

  const handleConfirmationSuccess = () => {
    event.filledSpots += 1;
    if (onEventUpdate) onEventUpdate();
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent
          className="
            w-[95vw] 
            max-w-xl sm:max-w-2xl md:max-w-3xl 
            h-[92dvh] 
            max-h-[92dvh]
            overflow-y-auto 
            bg-gradient-to-br from-white via-[#511A2B]/[0.01] to-[#FEC460]/[0.02] 
            p-0 
            rounded-2xl sm:rounded-3xl
          "
        >
          {/* HEADER */}
          <DialogHeader className="sticky top-0 bg-gradient-to-r from-[#511A2B] to-[#511A2B]/95 border-b border-[#511A2B]/20 px-4 py-4 sm:p-6 z-10">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                Detalhes do Evento
              </DialogTitle>

              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5 text-white" />
              </Button>
            </div>
          </DialogHeader>

          <div className="px-4 sm:px-6 py-6 space-y-6">

            {/* BANNER - REGISTRADO */}
            {isRegistered && (
              <div className="relative p-4 sm:p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl border border-green-200">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full blur-2xl" />
                <div className="relative flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-500 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-green-900 text-base sm:text-lg">Inscrição Confirmada!</h4>
                    <p className="text-green-700 text-xs sm:text-sm">Você já está registrado neste evento.</p>
                  </div>
                </div>
              </div>
            )}

            {/* HERO */}
            <div className="relative p-4 sm:p-6 bg-gradient-to-br from-[#511A2B]/5 via-transparent to-[#FEC460]/5 rounded-xl sm:rounded-2xl border border-[#511A2B]/10">
              <div className="relative space-y-3 sm:space-y-4">

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-[#511A2B] break-words">
                      {event.name}
                    </h1>

                    <Badge
                      className={`
                        bg-gradient-to-r ${getTypeColor(event.type)}
                        text-white border-0 rounded-full 
                        text-xs sm:text-sm font-bold 
                        px-3 sm:px-4 py-1 sm:py-1.5 shadow-lg inline-flex items-center gap-1
                      `}
                    >
                      {event.type}
                    </Badge>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FEC460] to-[#D56235] rounded-2xl blur-md opacity-40" />
                    <div className="relative flex flex-col items-center bg-gradient-to-br from-[#FEC460] to-[#D56235] p-4 sm:p-6 rounded-2xl shadow-xl gap-1 sm:gap-2">
                      <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      <div className="text-center">
                        <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{event.points}</div>
                        <div className="text-[10px] sm:text-xs text-white/90 font-semibold">pontos</div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[#511A2B]/70 text-sm sm:text-base md:text-lg leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>

            {/* ORGANIZADOR */}
            <div className="p-4 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-[#511A2B]/10 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-[#511A2B] mb-3 sm:mb-4 flex items-center gap-2">
                <Building className="w-4 h-4 sm:w-5 sm:h-5 text-[#D56235]" />
                Organizador
              </h3>

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 border border-[#511A2B]/10">
                  <Image
                    src={event.store.logoUrl || '/placeholder.svg?height=300&width=300'}
                    alt={event.store.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <h4 className="font-bold text-[#511A2B] text-base sm:text-lg">{event.store.name}</h4>
                  <p className="text-xs sm:text-sm text-[#511A2B]/60">Organizador do evento</p>
                </div>
              </div>
            </div>

            {/* DATA E HORA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

              <div className="p-4 sm:p-5 bg-blue-50 rounded-xl sm:rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <span className="text-base sm:text-lg font-semibold text-[#511A2B]/70">Data</span>
                </div>
                <p className="font-bold text-[#511A2B] text-base sm:text-lg capitalize">{fullDate}</p>
              </div>

              <div className="p-4 sm:p-5 bg-purple-50 rounded-xl sm:rounded-2xl border border-purple-100">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  </div>
                  <span className="text-base sm:text-lg font-semibold text-[#511A2B]/70">Horário</span>
                </div>
                <p className="font-bold text-[#511A2B] text-base sm:text-lg">{time}</p>
              </div>
            </div>

            {/* LOCAL */}
            <div className="p-4 sm:p-5 bg-red-50 rounded-xl sm:rounded-2xl border border-red-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#511A2B]">Local do Evento</h3>
              </div>
              <p className="text-[#511A2B] text-sm sm:text-base leading-relaxed font-medium break-words">
                {formatFullAddress()}
              </p>
            </div>

            {/* PARTICIPANTES */}
            <div className="p-4 sm:p-5 bg-[#511A2B]/5 rounded-xl sm:rounded-2xl border border-[#511A2B]/10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#511A2B] flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#511A2B]">Participantes</h3>
              </div>

              <div className="space-y-3 sm:space-y-4">

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xl sm:text-2xl font-bold text-[#511A2B]">
                      {event.filledSpots}
                    </span>
                    <span className="text-[#511A2B]/60 ml-1">de {event.totalSpots} vagas</span>
                  </div>

                  <Badge
                    className={`
                      text-white border-0 rounded-full px-3 py-1.5 text-[11px] sm:text-sm font-bold
                      ${spotsLeft > 0 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-red-500 to-rose-500'
                      }
                    `}
                  >
                    {spotsLeft > 0 ? `${spotsLeft} vagas restantes` : 'Lotado'}
                  </Badge>
                </div>

                <Progress value={progressPercentage} className="h-2 sm:h-3 bg-[#511A2B]/10" />
              </div>
            </div>

            {/* RECOMPENSAS */}
            <div className="p-4 sm:p-6 bg-gradient-to-br from-[#FEC460]/10 rounded-xl sm:rounded-2xl border border-[#FEC460]/30">
              <div className="flex items-center gap-2 sm:gap-3 mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#FEC460] to-[#D56235] flex items-center justify-center">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#511A2B]">Recompensas</h3>
              </div>

              <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/50 rounded-xl">
                <div className="flex-1">
                  <p className="font-bold text-[#511A2B] text-lg sm:text-xl">{event.points} pontos</p>
                  <p className="text-xs sm:text-sm text-[#511A2B]/70">
                    {isRegistered ? 'Você ganhará estes pontos ao participar' : 'Ganhe pontos ao participar'}
                  </p>
                </div>
              </div>
            </div>

            {/* BOTÃO */}
            <div className="pt-2">
              {isRegistered ? (
                <Button
                  disabled
                  className="
                    w-full 
                    bg-gradient-to-r from-green-500 to-emerald-600 
                    text-white rounded-xl 
                    py-4 sm:py-6 
                    text-base sm:text-lg 
                    font-bold shadow-lg
                  "
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Você já está registrado
                </Button>
              ) : (
                <Button
                  disabled={spotsLeft === 0 || !professionalId}
                  onClick={handleParticipateClick}
                  className="
                    w-full 
                    bg-gradient-to-r from-[#511A2B] to-[#511A2B]/90 
                    text-white 
                    rounded-xl 
                    py-4 sm:py-6 
                    text-base sm:text-lg 
                    font-bold shadow-lg 
                    disabled:opacity-50
                  "
                >
                  {spotsLeft > 0 ? (
                    <>
                      Participar do Evento
                      <Check className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    <>
                      <Clock className="w-5 h-5 mr-2" />
                      Falar com suporte
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showConfirmationModal && !isRegistered && (
        <EventConfirmationModal
          event={event}
          professionalId={professionalId}
          onClose={() => setShowConfirmationModal(false)}
          onSuccess={handleConfirmationSuccess}
        />
      )}
    </>
  );
}
