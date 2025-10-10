'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Store, Star, Package, Calendar } from 'lucide-react';
import { SupplierCard } from './supplier-card';
import { fetchStores } from '@/lib/store-api';
import { StoreData } from '@/types';

export function SuppliersContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<StoreData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadSuppliersStore() {
      try {
        setIsLoading(true);
        const response = await fetchStores();
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error loading partner suppliers:', error);
        setSuppliers([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadSuppliersStore();
  }, []);

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.address.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calcular estatísticas
  const totalProducts = suppliers.reduce((acc, supplier) => acc + supplier.products?.length, 0);
  const totalEvents = suppliers.reduce((acc, supplier) => acc + supplier.events?.length, 0);
  const averageRating =
    suppliers.length > 0
      ? (suppliers.reduce((acc, supplier) => acc + supplier.rating, 0) / suppliers.length).toFixed(1)
      : '0.0';
  const highRatedSuppliers = suppliers.filter((supplier) => supplier.rating >= 4.5).length;

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-2">Fornecedores parceiros</h1>
            <p className="text-[#511A2B]/70">Descubra lojas parceiras com produtos e eventos exclusivos</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#511A2B]/50 w-4 h-4" />
              <Input
                placeholder="Buscar fornecedores..."
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
          {!isLoading && (
            <>
              <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                <div className="flex items-center mb-2">
                  <Store className="w-5 h-5 text-[#511A2B] mr-2" />
                  <div className="text-2xl font-bold text-[#511A2B]">{suppliers.length}</div>
                </div>
                <div className="text-sm text-[#511A2B]/70">Total Fornecedores</div>
              </div>
              <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                <div className="flex items-center mb-2">
                  <Star className="w-5 h-5 text-[#FEC460] mr-2" />
                  <div className="text-2xl font-bold text-[#FEC460]">{averageRating}</div>
                </div>
                <div className="text-sm text-[#511A2B]/70">Avaliação Média</div>
              </div>
              <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                <div className="flex items-center mb-2">
                  <Package className="w-5 h-5 text-[#D56235] mr-2" />
                  <div className="text-2xl font-bold text-[#D56235]">{totalProducts}</div>
                </div>
                <div className="text-sm text-[#511A2B]/70">Produtos Disponíveis</div>
              </div>
              <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                <div className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 text-green-600 mr-2" />
                  <div className="text-2xl font-bold text-green-600">{totalEvents}</div>
                </div>
                <div className="text-sm text-[#511A2B]/70">Eventos Ativos</div>
              </div>
            </>
          )}
        </div>

        {/* Loading State */}
        {!isLoading && (
          /* Suppliers Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} />
            ))}
          </div>
        )}

        {!isLoading && filteredSuppliers.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-[#511A2B] text-lg font-medium mb-2">Nenhum fornecedor encontrado</p>
            <p className="text-[#511A2B]/70">Tente ajustar sua busca ou remover os filtros</p>
          </div>
        )}
      </div>
    </div>
  );
}
