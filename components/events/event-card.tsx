'use client';

import { Calendar, MapPin, Users, Award, Clock, Star, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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

interface EventCardProps {
  event: Event;
  onEventClick: (event: Event) => void;
  onParticipateClick: (event: Event) => void;
}

export function EventCard({ event, onEventClick, onParticipateClick }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const { date, time } = formatDate(event.date);
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

  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  return (
    <Card className="group relative bg-white border border-[#511A2B]/10 rounded-3xl hover:border-[#511A2B]/20 transition-all duration-500 shadow-sm hover:shadow-xl overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#511A2B]/[0.02] via-transparent to-[#FEC460]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardContent className="relative p-6 space-y-5">
        {/* Type Badge - Floating */}
        <div className="absolute -top-2 -right-2 z-10">
          <div className={`bg-gradient-to-br ${getTypeColor(event.type)} px-4 py-2 rounded-2xl shadow-lg`}>
            <span className="text-white text-xs font-bold uppercase tracking-wide">{event.type}</span>
          </div>
        </div>

        {/* Header with Store Info */}
        <div className="flex items-start gap-4 pt-2">
          <div className="relative">
            <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-gray-100 border border-[#511A2B]/10">
              <Image
                src={event.store.logoUrl || '/placeholder.svg?height=300&width=300'}
                alt={event.store.name}
                fill
                sizes="80px"
                className="object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            {/* Decorative ring */}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-[#511A2B] mb-1 line-clamp-1 group-hover:text-[#D56235] transition-colors">
              {event.name}
            </h3>
            <p className="text-sm text-[#511A2B]/60 line-clamp-1 mb-2">{event.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#511A2B]/80">{event.store.name}</span>
              {event.store.rating > 0 && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 rounded-full">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-semibold text-yellow-700">{event.store.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Date, Time & Location Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-[#511A2B]/5 rounded-xl group-hover:bg-[#511A2B]/10 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <Calendar className="w-4 h-4 text-[#511A2B]" />
            </div>
            <span className="text-xs font-medium text-[#511A2B]">{date}</span>
          </div>

          <div className="flex items-center gap-2 p-3 bg-[#511A2B]/5 rounded-xl group-hover:bg-[#511A2B]/10 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <Clock className="w-4 h-4 text-[#511A2B]" />
            </div>
            <span className="text-xs font-medium text-[#511A2B]">{time}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
          <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-sm font-medium text-[#511A2B]">
            {event.address.district}, {event.address.city} - {event.address.state}
          </span>
        </div>

        {/* Progress Section */}
        <div className="space-y-3 p-4 bg-gradient-to-br from-[#511A2B]/5 to-transparent rounded-xl border border-[#511A2B]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#511A2B]" />
              <span className="text-sm font-semibold text-[#511A2B]">
                {event.filledSpots}/{event.totalSpots}
              </span>
              <span className="text-xs text-[#511A2B]/60">participantes</span>
            </div>
            <Badge
              className={`${
                spotsLeft > 0
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0'
                  : 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-0'
              } rounded-full px-3 py-1 text-xs font-bold shadow-sm`}
            >
              {spotsLeft > 0 ? `${spotsLeft} vagas` : 'Lotado'}
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-[#511A2B]/10" />
        </div>

        {/* Points Badge */}
        <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-[#FEC460]/20 via-[#FEC460]/10 to-transparent rounded-xl border border-[#FEC460]/30">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FEC460] to-[#D56235] flex items-center justify-center shadow-md">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#511A2B] to-[#D56235] bg-clip-text text-transparent">
              {event.points}
            </div>
            <div className="text-xs text-[#511A2B]/60 font-medium">pontos</div>
          </div>
          <Sparkles className="w-4 h-4 text-[#FEC460] ml-auto" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            className="flex-1 bg-gradient-to-r from-[#511A2B] to-[#511A2B]/90 hover:from-[#511A2B]/90 hover:to-[#511A2B]/80 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={spotsLeft === 0}
            onClick={() => spotsLeft > 0 && onParticipateClick(event)}
          >
            {spotsLeft > 0 ? 'Ver mais detalhes' : 'Falar com suporte'}
          </Button>
          {/* <Button
            variant="outline"
            className="border-2 border-[#511A2B]/20 text-[#511A2B] hover:bg-[#511A2B]/5 hover:border-[#511A2B]/30 rounded-xl font-semibold transition-all duration-300 bg-transparent"
            onClick={() => onEventClick(event)}
          >
            Detalhes
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}
