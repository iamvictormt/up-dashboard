'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { EventCard } from './event-card';
import { EventDetailModal } from './event-detail-modal';
import { fetchEvents, fetchMyEvents } from '@/lib/event-api';
import { useUser } from '@/contexts/user-context';

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
  // Adicionar campo para indicar se o usuário está registrado
  isRegistered?: boolean;
}

export function EventsContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [myEventIds, setMyEventIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { user } = useUser();

  const professionalId = user?.professional?.id;

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      
      // Busca eventos em paralelo
      const [eventsResponse, myEventsResponse] = await Promise.all([
        fetchEvents(),
        fetchMyEvents().catch(() => ({ data: [] })) // Se falhar, retorna array vazio
      ]);

      // Cria um Set com os IDs dos eventos que o usuário está registrado
      const myIds = new Set(myEventsResponse.data.map((event: Event) => event.id));
      setMyEventIds(myIds);

      // Marca os eventos como registrados
      const eventsWithRegistration = eventsResponse.data.map((event: Event) => ({
        ...event,
        isRegistered: myIds.has(event.id)
      }));

      setEvents(eventsWithRegistration);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleParticipateClick = (event: Event) => {
    setSelectedEvent(event);
    setShowConfirmationModal(true);
  };

  const handleEventUpdate = () => {
    // Recarrega os eventos após uma participação
    loadEvents();
  };

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-2">Eventos</h1>
            <p className="text-[#511A2B]/70">Descubra e participe dos melhores eventos da comunidade</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#511A2B]/50 w-4 h-4" />
              <Input
                placeholder="Buscar eventos..."
                className="pl-10 w-full sm:w-64 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-[#511A2B]/70">Carregando eventos...</p>
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onEventClick={handleEventClick}  
                onParticipateClick={handleParticipateClick}
                isRegistered={event.isRegistered} // Passa a prop para o card
              />
            ))}
          </div>
        )}

        {!isLoading && filteredEvents.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-[#511A2B] text-lg font-medium mb-2">Nenhum evento encontrado</p>
            <p className="text-[#511A2B]/70">Tente ajustar sua busca ou remover os filtros</p>
          </div>
        )}

        {!isLoading && events.length === 0 && !searchQuery && (
          <div className="text-center py-12">
            <p className="text-[#511A2B] text-lg font-medium mb-2">Nenhum evento disponível</p>
            <p className="text-[#511A2B]/70">Novos eventos serão exibidos aqui</p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes do Evento */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          professionalId={professionalId}
          onClose={() => setSelectedEvent(null)}
          onEventUpdate={handleEventUpdate}
          isRegistered={selectedEvent.isRegistered} // Passa também para o modal
        />
      )}
    </div>
  );
}