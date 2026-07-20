'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Tag } from 'lucide-react';
import { SupplierCard } from './supplier-card';
import { fetchStores, fetchStoreCategories } from '@/lib/store-api';
import { StoreData } from '@/types';
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

const ALL_CATEGORIES_VALUE = '__all_categories__';

export function SuppliersContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<StoreData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [hasMore, setHasMore] = useState(true);

  const availableCities =
    BRAZIL_LOCATION_OPTIONS.find((option) => option.state === selectedState)
      ?.cities ?? [];
  const hasLocationFilter = Boolean(selectedState || selectedCity || selectedCategory);

  const loadSuppliersStore = async (
    query = '',
    pageNumber = 1,
    state = selectedState,
    city = selectedCity,
    category = selectedCategory,
  ) => {
    try {
      setIsLoading(true);
      const response = await fetchStores(
        query,
        pageNumber,
        limit,
        'SUPPLIER',
        state,
        city,
        category,
      );
      setSuppliers(response.data);
      setHasMore(response.data.length === limit);
    } catch (error) {
      console.error('Error loading partner suppliers:', error);
      setSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliersStore();
    fetchStoreCategories()
      .then((res) => setCategories(res.data))
      .catch((error) => console.error('Error loading store categories:', error));
  }, []);

  const handleCategoryChange = (value: string) => {
    const nextCategory = value === ALL_CATEGORIES_VALUE ? '' : value;
    setSelectedCategory(nextCategory);
    setPage(1);
    loadSuppliersStore(searchQuery, 1, selectedState, selectedCity, nextCategory);
  };

  const handleSearchClick = () => {
    setPage(1);
    loadSuppliersStore(searchQuery, 1);
  };

  const handleStateChange = (value: string) => {
    const nextState = value === ALL_STATES_VALUE ? '' : value;
    setSelectedState(nextState);
    setSelectedCity('');
    setPage(1);
    loadSuppliersStore(searchQuery, 1, nextState, '');
  };

  const handleCityChange = (value: string) => {
    const nextCity = value === ALL_CITIES_VALUE ? '' : value;
    setSelectedCity(nextCity);
    setPage(1);
    loadSuppliersStore(searchQuery, 1, selectedState, nextCity);
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadSuppliersStore(searchQuery, nextPage);
  };

  const handlePrevPage = () => {
    if (page === 1) return;
    const prevPage = page - 1;
    setPage(prevPage);
    loadSuppliersStore(searchQuery, prevPage);
  };

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-[#FFEDC1] backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full">
        {/* Header com busca */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-2">Lojistas parceiros</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-96">
              <Input
                placeholder="Buscar por produtos ou lojistas..."
                className="pl-4 pr-12 w-full h-12 sm:h-14 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
              />
              <button
                onClick={handleSearchClick}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 rounded-lg text-[#511A2B]/70 hover:text-[#511A2B] hover:bg-[#511A2B]/10 transition"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-[420px]">
              <Select
                value={selectedCategory || ALL_CATEGORIES_VALUE}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="h-12 sm:h-14 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] focus:border-[#511A2B]/40 sm:col-span-2">
                  <Tag className="w-4 h-4 mr-2 text-[#511A2B]/60" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_CATEGORIES_VALUE}>Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedState || ALL_STATES_VALUE}
                onValueChange={handleStateChange}
              >
                <SelectTrigger className="h-12 sm:h-14 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] focus:border-[#511A2B]/40">
                  <MapPin className="w-4 h-4 mr-2 text-[#511A2B]/60" />
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
                <SelectTrigger className="h-12 sm:h-14 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] focus:border-[#511A2B]/40 disabled:opacity-60">
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

        {/* Loading / Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-[#511A2B]/70">Carregando lojistas...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {suppliers.map((supplier) => (
                <SupplierCard key={supplier.id} supplier={supplier} />
              ))}
            </div>

            {/* Empty State */}
            {suppliers.length === 0 && (searchQuery || hasLocationFilter) && (
              <div className="text-center py-12">
                <p className="text-[#511A2B] text-lg font-medium mb-2">Nenhum fornecedor encontrado</p>
                <p className="text-[#511A2B]/70">Tente ajustar sua busca ou remover os filtros</p>
              </div>
            )}

            {/* Paginação */}
            <div className="flex justify-center items-center mt-8 gap-4">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#511A2B] to-[#511A2B]/90 hover:from-[#511A2B]/90 hover:to-[#511A2B]/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="text-[#511A2B] font-medium">Página {page}</span>
              <button
                onClick={handleNextPage}
                disabled={!hasMore}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#511A2B] to-[#511A2B]/90 hover:from-[#511A2B]/90 hover:to-[#511A2B]/80 disabled:opacity-50 disabled:cursor-not-allowed"
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
