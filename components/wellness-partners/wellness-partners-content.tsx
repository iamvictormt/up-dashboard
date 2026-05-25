'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { WellnessPartnerCard } from './wellness-partner-card';
import { fetchWellnessPartners } from '@/lib/store-api';
import { WellnessPartnerListItem } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ALL_CITIES_VALUE,
  ALL_STATES_VALUE,
  BRAZIL_LOCATION_OPTIONS,
} from '@/constants/locationOptions';

export function WellnessPartnersContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [partners, setPartners] = useState<WellnessPartnerListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [page, setPage] = useState(1);
  const limit = 6;
  const [hasMore, setHasMore] = useState(true);

  const availableCities =
    BRAZIL_LOCATION_OPTIONS.find((option) => option.state === selectedState)
      ?.cities ?? [];
  const hasLocationFilter = Boolean(selectedState || selectedCity);

  const loadPartners = async (
    query = '',
    pageNumber = 1,
    state = selectedState,
    city = selectedCity,
  ) => {
    try {
      setIsLoading(true);
      const response = await fetchWellnessPartners(
        query,
        pageNumber,
        limit,
        state,
        city,
      );
      const items = (response.data ?? []) as WellnessPartnerListItem[];
      setPartners(items);
      setHasMore(items.length === limit);
    } catch (error) {
      console.error('Error loading wellness partners:', error);
      setPartners([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const handleSearch = () => {
    setPage(1);
    loadPartners(searchQuery, 1);
  };

  const handleStateChange = (value: string) => {
    const nextState = value === ALL_STATES_VALUE ? '' : value;
    setSelectedState(nextState);
    setSelectedCity('');
    setPage(1);
    loadPartners(searchQuery, 1, nextState, '');
  };

  const handleCityChange = (value: string) => {
    const nextCity = value === ALL_CITIES_VALUE ? '' : value;
    setSelectedCity(nextCity);
    setPage(1);
    loadPartners(searchQuery, 1, selectedState, nextCity);
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPartners(searchQuery, nextPage);
  };

  const handlePrevPage = () => {
    if (page === 1) return;
    const prevPage = page - 1;
    setPage(prevPage);
    loadPartners(searchQuery, prevPage);
  };

  return (
    <div className="p-6 md:p-8 w-full ">
      <div className="bg-[#FFEDC1] backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#1A3B51]/10 shadow-lg w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1A3B51] mb-2">Parceiros de Bem-estar</h1>
            <p className="text-[#1A3B51]/70">Descubra serviços, terapias e experiências para o seu bem-estar</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-96">
              <Input
                placeholder="Buscar por serviço, especialidade ou parceiro..."
                className="pl-4 pr-12 w-full h-12 sm:h-14 bg-white/80 border-[#1A3B51]/20 rounded-xl text-[#1A3B51] placeholder:text-[#1A3B51]/50 focus:border-[#1A3B51]/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 rounded-lg text-[#1A3B51]/70 hover:text-[#1A3B51] hover:bg-[#1A3B51]/10 transition"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-[420px]">
              <Select
                value={selectedState || ALL_STATES_VALUE}
                onValueChange={handleStateChange}
              >
                <SelectTrigger className="h-12 sm:h-14 bg-white/80 border-[#1A3B51]/20 rounded-xl text-[#1A3B51] focus:border-[#1A3B51]/40">
                  <MapPin className="w-4 h-4 mr-2 text-[#1A3B51]/60" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_STATES_VALUE}>Todos os estados</SelectItem>
                  {BRAZIL_LOCATION_OPTIONS.map((option) => (
                    <SelectItem key={option.state} value={option.state}>
                      {option.state} - {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedCity || ALL_CITIES_VALUE}
                onValueChange={handleCityChange}
                disabled={!selectedState}
              >
                <SelectTrigger className="h-12 sm:h-14 bg-white/80 border-[#1A3B51]/20 rounded-xl text-[#1A3B51] focus:border-[#1A3B51]/40 disabled:opacity-60">
                  <SelectValue placeholder="Cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_CITIES_VALUE}>Todas as cidades</SelectItem>
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-[#1A3B51]/70">Carregando parceiros wellness...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <WellnessPartnerCard key={partner.id} partner={partner} />
              ))}
            </div>

            {partners.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#1A3B51] text-lg font-medium mb-2">
                  {searchQuery || hasLocationFilter
                    ? 'Nenhum parceiro encontrado'
                    : 'Nenhum parceiro wellness disponível no momento'}
                </p>
                <p className="text-[#1A3B51]/70">
                  {searchQuery || hasLocationFilter
                    ? 'Tente ajustar sua busca ou remover os filtros'
                    : 'Volte em breve para conferir novos serviços e especialidades'}
                </p>
              </div>
            )}

            <div className="flex justify-center items-center mt-8 gap-4">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#1A3B51] to-[#1A3B51]/90 hover:from-[#1A3B51]/90 hover:to-[#1A3B51]/80 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                Anterior
              </button>
              <span className="text-[#1A3B51] font-medium">Página {page}</span>
              <button
                onClick={handleNextPage}
                disabled={!hasMore}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#1A3B51] to-[#1A3B51]/90 hover:from-[#1A3B51]/90 hover:to-[#1A3B51]/80 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                Próxima
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
