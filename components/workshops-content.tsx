'use client';

import { useState, useEffect } from 'react';
import { WorkshopCard } from '@/components/workshop-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Workshop {
  id: string;
  name: string;
  description: string;
  date: string;
  type: string;
  points: number;
  totalSpots: number;
  filledSpots: number;
  address: {
    id: string;
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
    description: string | null;
    website: string | null;
    rating: number;
    openingHours: string | null;
    addressId: string;
    partnerId: string;
  };
  participants: any[];
}

const mockWorkshops: Workshop[] = [
  {
    id: '9ca62497-f22f-4aa0-8d56-3fa724bf3217',
    name: 'Workshop de TypeScript',
    description: 'Evento para aprender TypeScript avançado com foco em desenvolvimento web moderno',
    date: '2025-06-10T14:00:00.000Z',
    type: 'Workshop',
    points: 50,
    totalSpots: 30,
    filledSpots: 12,
    address: {
      id: '669b752d-5522-4f81-9314-a50135312ade',
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
      description: null,
      website: null,
      rating: 4.2,
      openingHours: null,
      addressId: 'c9af52cc-4739-4f3e-a62a-399ca480ffc5',
      partnerId: '5527e77a-d669-4872-b4c9-a46768c32f0e',
    },
    participants: [],
  },
  {
    id: '8ba51396-e11e-3bb9-7c45-2ea613ae2f06',
    name: 'Workshop de React Avançado',
    description: 'Aprenda técnicas avançadas de React, hooks customizados e performance',
    date: '2025-07-15T09:00:00.000Z',
    type: 'Workshop',
    points: 75,
    totalSpots: 25,
    filledSpots: 18,
    address: {
      id: '559a641c-4411-3e70-8203-a40024201bcd',
      state: 'RJ',
      city: 'Rio de Janeiro',
      district: 'Copacabana',
      street: 'Av. Atlântica',
      complement: 'Sala 12',
      number: '456',
      zipCode: '22070-000',
    },
    store: {
      id: 'a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
      name: 'TechnoMax',
      description: null,
      website: null,
      rating: 4.8,
      openingHours: null,
      addressId: 'a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
      partnerId: '7f3a9b2c-8e4d-4a1b-9c5e-6f7a8b9c0d1e',
    },
    participants: [],
  },
  {
    id: '7ca40285-d00d-2aa8-6b34-1da502ad1e95',
    name: 'Workshop de Node.js',
    description: 'Desenvolvimento backend com Node.js, Express e MongoDB',
    date: '2025-08-20T13:30:00.000Z',
    type: 'Workshop',
    points: 60,
    totalSpots: 20,
    filledSpots: 8,
    address: {
      id: '448a530b-3300-2d5f-7102-a30013100abc',
      state: 'MG',
      city: 'Belo Horizonte',
      district: 'Savassi',
      street: 'Rua da Bahia',
      complement: null,
      number: '789',
      zipCode: '30160-000',
    },
    store: {
      id: 'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
      name: 'EcoVerde',
      description: null,
      website: null,
      rating: 4.5,
      openingHours: null,
      addressId: 'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
      partnerId: '9a8b7c6d-5e4f-3g2h-1i0j-k9l8m7n6o5p4',
    },
    participants: [],
  },
];

export function WorkshopsContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setWorkshops(mockWorkshops);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const filteredWorkshops = workshops.filter(
    (workshop) =>
      workshop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-2">Workshops</h1>
              <p className="text-[#511A2B]/70">Participe de workshops e aprenda novas habilidades</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#511A2B]/50 w-4 h-4" />
                <Input
                  placeholder="Buscar workshops..."
                  className="pl-10 w-full sm:w-64 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                size="lg"
                className="bg-[#511A2B] hover:bg-[#511A2B]/90 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] text-white rounded-xl px-6"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {isLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                  <div className="text-2xl font-bold text-[#511A2B]">{workshops.length}</div>
                  <div className="text-sm text-[#511A2B]/70">Total Workshops</div>
                </div>
                <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                  <div className="text-2xl font-bold text-green-600">
                    {workshops.filter((w) => w.filledSpots < w.totalSpots).length}
                  </div>
                  <div className="text-sm text-[#511A2B]/70">Vagas Disponíveis</div>
                </div>
                <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                  <div className="text-2xl font-bold text-[#FEC460]">
                    {Math.round(workshops.reduce((acc, w) => acc + w.points, 0) / workshops.length)}
                  </div>
                  <div className="text-sm text-[#511A2B]/70">Pontos Médios</div>
                </div>
                <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                  <div className="text-2xl font-bold text-[#D56235]">
                    {workshops.reduce((acc, w) => acc + w.filledSpots, 0)}
                  </div>
                  <div className="text-sm text-[#511A2B]/70">Participantes</div>
                </div>
              </>
            )}
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-[#511A2B] animate-spin mb-4" />
              <p className="text-[#511A2B] text-lg font-medium">Carregando workshops...</p>
              <p className="text-[#511A2B]/70 text-sm">Buscando os melhores eventos para você</p>
            </div>
          ) : (
            /* Workshops Grid */
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredWorkshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))}
            </div>
          )}

          {!isLoading && filteredWorkshops.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-[#511A2B] text-lg font-medium mb-2">Nenhum workshop encontrado</p>
              <p className="text-[#511A2B]/70">Tente ajustar sua busca ou remover os filtros</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
