'use client';

import { Calendar, MapPin, Users, Award, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
  };
  isRegistered?: boolean;
}

interface EventCardProps {
  event: Event;
  onEventClick: (event: Event) => void;
  onParticipateClick: (event: Event) => void;
  isRegistered?: boolean;
}

export function EventCard({ event, onEventClick, onParticipateClick, isRegistered }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const progressPercentage = (event.filledSpots / event.totalSpots) * 100;
  const spotsLeft = event.totalSpots - event.filledSpots;

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

  return (
    <div className="relative group">
      {/* Badge de Registrado - Posicionado no topo do card */}
      {isRegistered && (
        <div className="absolute -top-2 -right-2 z-20">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-70" />
            <Badge className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 rounded-full px-3 py-1.5 text-xs font-bold shadow-lg flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Registrado
            </Badge>
          </div>
        </div>
      )}

      <div
        onClick={() => onEventClick(event)}
        className={`relative bg-white/80 backdrop-blur-sm rounded-2xl border ${
          isRegistered ? 'border-green-200 shadow-lg shadow-green-100/50' : 'border-[#511A2B]/10'
        } p-6 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group-hover:scale-[1.02]`}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FEC460]/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Header */}
        <div className="relative space-y-3 mb-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-bold text-[#511A2B] line-clamp-2 flex-1">{event.name}</h3>
            
            {/* Points Badge */}
            <div className="flex flex-col items-center gap-1 bg-gradient-to-br from-[#FEC460] to-[#D56235] p-3 rounded-xl shadow-md shrink-0">
              <Award className="w-4 h-4 text-white" />
              <span className="text-lg font-bold text-white">{event.points}</span>
            </div>
          </div>

          {/* Type Badge */}
          <Badge
            className={`bg-gradient-to-r ${getTypeColor(
              event.type
            )} text-white border-0 rounded-full text-xs px-3 py-1 font-semibold inline-flex w-fit`}
          >
            {event.type}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-[#511A2B]/70 text-sm line-clamp-2 mb-4">{event.description}</p>

        {/* Event Details */}
        <div className="space-y-3 mb-4">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-sm text-[#511A2B]/80">
            <Calendar className="w-4 h-4 text-[#D56235]" />
            <span className="font-medium">{formatDate(event.date)}</span>
            <Clock className="w-4 h-4 text-[#D56235] ml-2" />
            <span className="font-medium">{formatTime(event.date)}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-[#511A2B]/80">
            <MapPin className="w-4 h-4 text-[#D56235]" />
            <span className="font-medium truncate">
              {event.address.city}, {event.address.state}
            </span>
          </div>

          {/* Store */}
          <div className="text-sm text-[#511A2B]/70 font-medium">
            Organizado por: <span className="text-[#511A2B]">{event.store.name}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-[#511A2B]/80">
              <Users className="w-4 h-4 text-[#D56235]" />
              <span className="font-semibold text-[#511A2B]">{event.filledSpots}</span>
              <span className="text-[#511A2B]/60">/ {event.totalSpots}</span>
            </div>
            <Badge
              className={`${
                spotsLeft > 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              } border-0 text-xs font-semibold px-2 py-0.5`}
            >
              {spotsLeft > 0 ? `${spotsLeft} vagas` : 'Lotado'}
            </Badge>
          </div>
          <Progress 
            value={progressPercentage} 
            className={`h-2 ${isRegistered ? 'bg-green-100' : 'bg-[#511A2B]/10'}`}
          />
        </div>

        {/* Action Button */}
        {isRegistered ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl py-2.5 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              if (spotsLeft > 0) {
                onParticipateClick(event);
              }
            }}
            disabled={spotsLeft === 0}
            className="w-full bg-gradient-to-r from-[#511A2B] to-[#511A2B]/90 hover:from-[#511A2B]/90 hover:to-[#511A2B]/80 text-white rounded-xl py-2.5 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {spotsLeft > 0 ? 'Participar' : 'Lotado'}
          </Button>
        )}
      </div>
    </div>
  );
}