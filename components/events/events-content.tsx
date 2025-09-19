'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { EventCard } from './event-card';
import { EventDetailModal } from './event-detail-modal';

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
}

const mockEvents: Event[] = [
  {
    id: '1ca62497-f22f-4aa0-8d56-3fa724bf3217',
    name: 'Workshop de TypeScript',
    description: 'Evento para aprender TypeScript avançado com foco em desenvolvimento web moderno',
    date: '2025-06-10T14:00:00.000Z',
    type: 'Workshop',
    points: 50,
    totalSpots: 30,
    filledSpots: 12,
    storeId: 'd8821412-3cfc-4e1b-987b-b0760fe6240d',
    address: {
      state: 'SP',
      city: 'São Paulo',
      district: 'Centro',
      street: 'Rua da Tecnologia',
      complement: 'Sala 5',
      number: '123',
      zipCode: '01000-000',
    },
    store: {
      id: 'd8821412-3cfc-4e1b-987b-b0760fe6240d',
      name: 'Super Soluções',
      rating: 4.2,
    },
  },
  {
    id: '2ba51396-e11e-3bb9-7c45-2ea613ae2f06',
    name: 'Conferência de Tecnologia 2025',
    description: 'O maior evento de tecnologia do ano com palestrantes renomados',
    date: '2025-09-15T09:00:00.000Z',
    type: 'Conferência',
    points: 100,
    totalSpots: 500,
    filledSpots: 342,
    storeId: 'a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
    address: {
      state: 'SP',
      city: 'São Paulo',
      district: 'Vila Olímpia',
      street: 'Av. das Nações Unidas',
      complement: 'Centro de Convenções',
      number: '12901',
      zipCode: '04578-000',
    },
    store: {
      id: 'a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
      name: 'TechnoMax',
      rating: 4.8,
    },
  },
  {
    id: '3ca40285-d00d-2aa8-6b34-1da502ad1e95',
    name: 'Meetup de Desenvolvedores',
    description: 'Encontro mensal da comunidade de desenvolvedores locais',
    date: '2025-07-20T19:00:00.000Z',
    type: 'Meetup',
    points: 25,
    totalSpots: 80,
    filledSpots: 65,
    storeId: 'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
    address: {
      state: 'RJ',
      city: 'Rio de Janeiro',
      district: 'Botafogo',
      street: 'Praia de Botafogo',
      complement: 'Coworking Tech',
      number: '300',
      zipCode: '22250-040',
    },
    store: {
      id: 'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
      name: 'EcoVerde',
      rating: 4.5,
    },
  },
];

export function EventsContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(mockEvents);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
            {/* <Button variant="outline" className="border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10 rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button> */}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            <></>
          ) : (
            <>
              <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                <div className="text-2xl font-bold text-[#511A2B]">{events.length}</div>
                <div className="text-sm text-[#511A2B]/70">Total Eventos</div>
              </div>
              <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {events.filter((e) => e.filledSpots < e.totalSpots).length}
                </div>
                <div className="text-sm text-[#511A2B]/70">Com Vagas</div>
              </div>
              <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                <div className="text-2xl font-bold text-[#FEC460]">
                  {Math.round(events.reduce((acc, e) => acc + e.points, 0) / events.length)}
                </div>
                <div className="text-sm text-[#511A2B]/70">Pontos Médios</div>
              </div>
              <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                <div className="text-2xl font-bold text-[#D56235]">
                  {events.reduce((acc, e) => acc + e.filledSpots, 0)}
                </div>
                <div className="text-sm text-[#511A2B]/70">Participantes</div>
              </div>
            </>
          )}
        </div>

        {/* Loading State */}
        {!isLoading && (
          /* Events Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} onEventClick={handleEventClick} />
            ))}
          </div>
        )}

        {!isLoading && filteredEvents.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-[#511A2B] text-lg font-medium mb-2">Nenhum evento encontrado</p>
            <p className="text-[#511A2B]/70">Tente ajustar sua busca ou remover os filtros</p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes do Evento */}
      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}
