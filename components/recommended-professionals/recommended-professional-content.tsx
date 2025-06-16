'use client';

import { useState, useEffect } from 'react';
import { ProfessionalCard } from '@/components/recommended-professionals/recommended-professional-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Users, UserCheck, MapPin, Briefcase } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchRecommendedProfessionals } from '@/lib/recommended-professional-api';
import { toast } from 'sonner';
import { RecommendedProfessionalData } from '@/types';
import { RecommendedProfessionalCardSkeleton } from './recommended-professional-card-skeleton';

export function RecommendedProfessionalsContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [professionals, setProfessionals] = useState<RecommendedProfessionalData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProfessionals, setFilteredProfessionals] = useState<RecommendedProfessionalData[]>([]);

  useEffect(() => {
    async function loadRecommendedProfessionals() {
      try {
        setIsLoading(true);
        const response = await fetchRecommendedProfessionals();
        if (response.status === 200) {
          setProfessionals(response.data);
        }
      } catch (err) {
        console.error(err);
        toast.error('Erro de indisponibilidade, contate o administrador.');
      } finally {
        setIsLoading(false);
      }
    }

    loadRecommendedProfessionals();
  }, []);

  // Filtrar profissionais baseado na busca
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProfessionals(professionals);
    } else {
      const filtered = professionals.filter(
        (professional) =>
          professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          professional.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
          professional.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          professional.address.district.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProfessionals(filtered);
    }
  }, [searchQuery, professionals]);

  const activeProfessionals = professionals.filter((p) => p.isActive);
  const totalProfessions = [...new Set(professionals.map((p) => p.profession))].length;
  const totalCities = [...new Set(professionals.map((p) => p.address.city))].length;

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-2">Profissionais recomendados</h1>
            <p className="text-[#511A2B]/70">Encontre e conecte-se com profissionais qualificados</p>
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
            <Button variant="primary" className="rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
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
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-5 h-5 text-[#511A2B]" />
                  <div className="text-2xl font-bold text-[#511A2B]">{professionals.length}</div>
                </div>
                <div className="text-sm text-[#511A2B]/70">Total de Profissionais</div>
              </div>
              <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <UserCheck className="w-5 h-5 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">{activeProfessionals.length}</div>
                </div>
                <div className="text-sm text-[#511A2B]/70">Ativos</div>
              </div>
              <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Briefcase className="w-5 h-5 text-[#FEC460]" />
                  <div className="text-2xl font-bold text-[#FEC460]">{totalProfessions}</div>
                </div>
                <div className="text-sm text-[#511A2B]/70">Profissões</div>
              </div>
              <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-5 h-5 text-[#D56235]" />
                  <div className="text-2xl font-bold text-[#D56235]">{totalCities}</div>
                </div>
                <div className="text-sm text-[#511A2B]/70">Cidades</div>
              </div>
            </>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <RecommendedProfessionalCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        ) : (
          <>
            {/* Results Info */}
            {searchQuery && (
              <div className="mb-6">
                <p className="text-[#511A2B]/70">
                  {filteredProfessionals.length > 0
                    ? `${filteredProfessionals.length} profissional(is) encontrado(s) para "${searchQuery}"`
                    : `Nenhum profissional encontrado para "${searchQuery}"`}
                </p>
              </div>
            )}

            {/* Professionals Grid */}
            {filteredProfessionals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProfessionals.map((professional) => (
                  <ProfessionalCard key={professional.id} professional={professional} />
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Users className="h-16 w-16 text-[#511A2B]/30 mb-4" />
                  <p className="text-[#511A2B] text-lg font-medium mb-2">Nenhum profissional encontrado</p>
                  <p className="text-[#511A2B]/70 text-sm text-center">
                    Tente ajustar sua busca ou remover os filtros aplicados
                  </p>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
