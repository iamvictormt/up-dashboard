'use client';

import { useState, useEffect } from 'react';
import { ProfessionalCard } from '@/components/professional-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/services/api';

interface Professional {
  id: string;
  name: string;
  profession?: string;
  specialty?: string;
  description?: string;
  phone?: string;
  email?: string;
  state?: string;
  city?: string;
  district?: string;
  street?: string;
  number?: string;
  complement?: string | null;
  zipCode?: string;
  availableDays?: { dayOfWeek: string }[];
  socialMedia?: {
    linkedin?: string;
    instagram?: string;
    whatsapp?: string | null;
  };
  rating?: number;
  reviews?: number;
  experience?: string;
  price?: string;
  avatar?: string;
  available?: boolean;
}

export function ProfessionalsContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setIsLoading(true);

        const response = await api.get('/recommended-professionals');
        setProfessionals(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-2">Profissionais recomendados</h1>
              <p className="text-[#511A2B]/70">Encontre e conecte-se com profissionais de confiança, cuidadosamente recomendados por nós.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#511A2B]/50 w-4 h-4" />
                <Input
                  placeholder="Buscar profissionais..."
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
                  <div className="text-2xl font-bold text-[#511A2B]">{professionals.length}</div>
                  <div className="text-sm text-[#511A2B]/70">Total de profissionais</div>
                </div>
                <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                  <div className="text-2xl font-bold text-green-600">
                    {professionals.filter((p) => p.available).length}
                  </div>
                  <div className="text-sm text-[#511A2B]/70">Disponíveis agora</div>
                </div>
                <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                  <div className="text-2xl font-bold text-[#FEC460]">4.9</div>
                  <div className="text-sm text-[#511A2B]/70">Média de avaliação</div>
                </div>
                <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                  <div className="text-2xl font-bold text-[#D56235]">5</div>
                  <div className="text-sm text-[#511A2B]/70">Especialidades</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-[#511A2B] animate-spin mb-4" />
            <p className="text-[#511A2B] text-lg font-medium">Buscando profissionais...</p>
            <p className="text-[#511A2B]/70 text-sm">Isso pode levar alguns segundos</p>
          </div>
        ) : (
          /* Professionals Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {professionals.map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
