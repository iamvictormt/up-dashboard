'use client';

import { useState, useEffect } from 'react';
import { WorkshopCard } from '@/components/workshops/workshop-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { fetchWorkshops } from '@/lib/workshops-api';

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

export function WorkshopsContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadWorkshops() {
      try {
        setIsLoading(true);
        // const response = await fetchWorkshops();
        // if (response.status === 200) {
        //   setWorkshops(response.data);
        // }
      } catch (err) {
        console.error(err);
        toast.error('Erro de indisponibilidade, contate o administrador.');
      } finally {
        setIsLoading(false);
      }
    }

    loadWorkshops();
  }, []);

  const filteredWorkshops = workshops.filter(
    (workshop) =>
      workshop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full">
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
            <></>
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
                  {Math.round(workshops.reduce((acc, w) => acc + w.points, 0) / workshops.length) || 0}
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
          <></>
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
  );
}
