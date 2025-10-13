'use client';

import { useState } from 'react';
import { X, Calendar, MapPin, Users, Award, Clock, Building, Sparkles, TrendingUp, Check } from 'lucide-react';
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
}

interface EventDetailModalProps {
  event: Event;
  professionalId?: string;
  onClose: () => void;
  onEventUpdate?: () => void;
}

export function EventDetailModal({ event, professionalId = '', onClose, onEventUpdate }: EventDetailModalProps) {
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
    switch (type.toLowerCase()) {
      case 'conferência':
        return 'from-purple-500 to-purple-600';
      case 'meetup':
        return 'from-blue-500 to-blue-600';
      case 'hackathon':
        return 'from-orange-500 to-orange-600';
      case 'workshop':
        return 'from-green-500 to-green-600';
      case 'curso':
        return 'from-indigo-500 to-indigo-600';
      case 'palestra':
        return 'from-pink-500 to-pink-600';
      case 'networking':
        return 'from-cyan-500 to-cyan-600';
      default:
        return 'from-[#D56235] to-[#FEC460]';
    }
  };

  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const handleParticipateClick = () => {
    if (!professionalId) {
      return;
    }

    if (spotsLeft <= 0) {
      return;
    }
    setShowConfirmationModal(true);
  };

  const handleConfirmationSuccess = () => {
    event.filledSpots += 1;

    if (onEventUpdate) {
      onEventUpdate();
    }
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-3xl h-[90vh] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-[#511A2B]/[0.01] to-[#FEC460]/[0.02] p-0 rounded-3xl">
          {/* Header with gradient background */}
          <DialogHeader className="sticky top-0 bg-gradient-to-r from-[#511A2B] to-[#511A2B]/95 border-b border-[#511A2B]/20 p-6 z-10">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                Detalhes do Evento
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-white/10 rounded-xl">
                <X className="w-5 h-5 text-white" />
              </Button>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* Hero Section */}
            <div className="relative p-6 bg-gradient-to-br from-[#511A2B]/5 via-transparent to-[#FEC460]/5 rounded-2xl border border-[#511A2B]/10 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FEC460]/20 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#511A2B]/10 to-transparent rounded-full blur-3xl" />

              <div className="relative space-y-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#511A2B] leading-tight">{event.name}</h1>
                    <Badge
                      className={`bg-gradient-to-r ${getTypeColor(
                        event.type
                      )} text-white border-0 rounded-full text-sm px-4 py-1.5 font-bold shadow-lg inline-flex items-center gap-1`}
                    >
                      <TrendingUp className="w-3 h-3" />
                      {event.type}
                    </Badge>
                  </div>

                  {/* Points Card */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FEC460] to-[#D56235] rounded-2xl blur-lg opacity-50" />
                    <div className="relative flex flex-col items-center gap-2 bg-gradient-to-br from-[#FEC460] to-[#D56235] p-6 rounded-2xl shadow-xl">
                      <Award className="w-8 h-8 text-white" />
                      <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-white">{event.points}</div>
                        <div className="text-sm text-white/90 font-semibold uppercase tracking-wide">pontos</div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[#511A2B]/70 leading-relaxed text-base md:text-lg">{event.description}</p>
              </div>
            </div>

            {/* Organizer Card */}
            <div className="p-5 bg-white rounded-2xl border border-[#511A2B]/10 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-[#511A2B] mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#D56235]" />
                Organizador
              </h3>

              <div className="flex items-center gap-4">
                <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-gray-100 border border-[#511A2B]/10">
                  <Image
                    src={event.store.logoUrl || '/placeholder.svg?height=300&width=300'}
                    alt={event.store.name}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>

                <div>
                  <h4 className="font-bold text-[#511A2B] text-lg">{event.store.name}</h4>
                  <p className="text-sm text-[#511A2B]/60">Organizador do evento</p>
                </div>
              </div>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-[#511A2B]/70 uppercase tracking-wide">Data</span>
                </div>
                <p className="font-bold text-[#511A2B] text-lg capitalize">{fullDate}</p>
              </div>

              <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-semibold text-[#511A2B]/70 uppercase tracking-wide">Horário</span>
                </div>
                <p className="font-bold text-[#511A2B] text-lg">{time}</p>
              </div>
            </div>

            {/* Location */}
            <div className="p-5 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-[#511A2B]">Local do Evento</h3>
              </div>
              <p className="text-[#511A2B] leading-relaxed font-medium">{formatFullAddress()}</p>
            </div>

            {/* Participants Progress */}
            <div className="p-5 bg-gradient-to-br from-[#511A2B]/5 to-transparent rounded-2xl border border-[#511A2B]/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#511A2B] shadow-sm flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#511A2B]">Participantes</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-[#511A2B]">{event.filledSpots}</span>
                    <span className="text-[#511A2B]/60 font-medium"> de {event.totalSpots} vagas</span>
                  </div>
                  <Badge
                    className={`${
                      spotsLeft > 0
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-red-500 to-rose-500'
                    } text-white border-0 rounded-full px-4 py-2 text-sm font-bold shadow-md`}
                  >
                    {spotsLeft > 0 ? `${spotsLeft} vagas restantes` : 'Lotado'}
                  </Badge>
                </div>
                <Progress value={progressPercentage} className="h-3 bg-[#511A2B]/10" />
              </div>
            </div>

            {/* Rewards Section */}
            <div className="relative p-6 bg-gradient-to-br from-[#FEC460]/10 via-[#FEC460]/5 to-transparent rounded-2xl border border-[#FEC460]/30 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FEC460]/30 to-transparent rounded-full blur-2xl" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FEC460] to-[#D56235] shadow-md flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#511A2B]">Recompensas</h3>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/50 rounded-xl">
                  <div className="flex-1">
                    <p className="font-bold text-[#511A2B] text-xl">{event.points} pontos</p>
                    <p className="text-sm text-[#511A2B]/70 font-medium">Ganhe pontos ao participar do evento</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Button
                className="w-full bg-gradient-to-r from-[#511A2B] to-[#511A2B]/90 hover:from-[#511A2B]/90 hover:to-[#511A2B]/80 text-white rounded-xl py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={spotsLeft === 0 || !professionalId}
                onClick={handleParticipateClick}
              >
                {spotsLeft > 0 ? (
                  <div className="flex items-center gap-2">
                    Participar do Evento
                    <Check className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Falar com suporte para tentar uma vaga
                  </div>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showConfirmationModal && (
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
