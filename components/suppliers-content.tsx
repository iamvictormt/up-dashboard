'use client';

import { useState, useEffect } from 'react';
import { SupplierCard } from '@/components/supplier-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/services/api';

// Tipo para o formato de dados do fornecedor
interface Supplier {
  id: string;
  tradeName: string;
  companyName: string;
  document: string;
  stateRegistration: string;
  contact: string;
  profileImage: string;
  store: {
    id: string;
    name: string;
    description: string | null;
    website: string | null;
    rating: number;
    openingHours: string | null;
    address: {
      state: string;
      city: string;
      district: string;
      street: string;
      complement: string | null;
      number: string;
      zipCode: string;
    };
  };
  // Campos adicionais para exibição
  category: string;
  mainImage: string;
  thumbnails: string[];
  available: string;
  duration: string;
  contactName: string;
  reviews: number;
}

// Dados mockados para simulação
const mockSuppliers: Supplier[] = [
  {
    id: '5527e77a-d669-4872-b4c9-a46768c32f0e',
    tradeName: 'Super Soluções',
    companyName: 'Super Soluções LTDA',
    document: '12345678000190',
    stateRegistration: '12345678',
    contact: '(11) 99999-8888',
    profileImage: 'enderecofoto.com.br',
    store: {
      id: 'd8821412-3cfc-4e1b-987b-b0760fe6240d',
      name: 'Super Soluções',
      description: 'Especialistas em soluções tecnológicas e consultoria empresarial',
      website: 'www.supersolucoes.com.br',
      rating: 4.2,
      openingHours: '08:00 - 18:00',
      address: {
        state: 'SP',
        city: 'São Paulo',
        district: 'Centro',
        street: 'Av. Principal',
        complement: 'Sala 101',
        number: '100',
        zipCode: '01000-000',
      },
    },
    category: 'Tecnologia',
    mainImage: '/placeholder.svg?height=400&width=600',
    thumbnails: [
      '/placeholder.svg?height=200&width=300',
      '/placeholder.svg?height=200&width=300',
      '/placeholder.svg?height=200&width=300',
      '/placeholder.svg?height=200&width=300',
    ],
    available: '29 May 2025 - 30 May 2025',
    duration: '4 days 3 nights',
    contactName: 'João Silva',
    reviews: 234,
  },
  {
    id: '7f3a9b2c-8e4d-4a1b-9c5e-6f7a8b9c0d1e',
    tradeName: 'TechnoMax',
    companyName: 'TechnoMax Sistemas LTDA',
    document: '98765432000123',
    stateRegistration: '87654321',
    contact: '(21) 98888-7777',
    profileImage: 'enderecofoto2.com.br',
    store: {
      id: 'a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
      name: 'TechnoMax',
      description: 'Desenvolvimento de software e automação industrial',
      website: 'www.technomax.com.br',
      rating: 4.8,
      openingHours: '09:00 - 17:00',
      address: {
        state: 'RJ',
        city: 'Rio de Janeiro',
        district: 'Copacabana',
        street: 'Rua Atlântica',
        complement: 'Cobertura',
        number: '500',
        zipCode: '22070-000',
      },
    },
    category: 'Automação',
    mainImage: '/placeholder.svg?height=400&width=600',
    thumbnails: [
      '/placeholder.svg?height=200&width=300',
      '/placeholder.svg?height=200&width=300',
      '/placeholder.svg?height=200&width=300',
      '/placeholder.svg?height=200&width=300',
    ],
    available: '15 Jun 2025 - 20 Jun 2025',
    duration: '5 days 4 nights',
    contactName: 'Maria Santos',
    reviews: 156,
  },
  {
    id: '9a8b7c6d-5e4f-3g2h-1i0j-k9l8m7n6o5p4',
    tradeName: 'EcoVerde',
    companyName: 'EcoVerde Sustentabilidade LTDA',
    document: '11223344000155',
    stateRegistration: '11223344',
    contact: '(31) 97777-6666',
    profileImage: 'enderecofoto3.com.br',
    store: {
      id: 'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
      name: 'EcoVerde',
      description: 'Consultoria em sustentabilidade e energia renovável',
      website: 'www.ecoverde.com.br',
      rating: 4.5,
      openingHours: '08:30 - 17:30',
      address: {
        state: 'MG',
        city: 'Belo Horizonte',
        district: 'Savassi',
        street: 'Rua da Bahia',
        complement: null,
        number: '1200',
        zipCode: '30160-000',
      },
    },
    category: 'Sustentabilidade',
    mainImage: '/placeholder.svg?height=400&width=600',
    thumbnails: [
      '/placeholder.svg?height=200&width=300',
      '/placeholder.svg?height=200&width=300',
      '/placeholder.svg?height=200&width=300',
      '/placeholder.svg?height=200&width=300',
    ],
    available: '10 Jul 2025 - 14 Jul 2025',
    duration: '4 days 3 nights',
    contactName: 'Carlos Oliveira',
    reviews: 189,
  },
];

export function SuppliersContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPartnersSuppliers = async () => {
      try {
        setIsLoading(true);

        const response = await api.get('/partner-supplier');
        setSuppliers(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartnersSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.tradeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.store.address.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-2">Fornecedores Parceiros</h1>
            <p className="text-[#511A2B]/70">Descubra empresas parceiras de confiança</p>
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
            <Button variant="outline" className="border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10 rounded-xl">
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
                <div className="text-2xl font-bold text-[#511A2B]">{suppliers.length}</div>
                <div className="text-sm text-[#511A2B]/70">Total Fornecedores</div>
              </div>
              <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {suppliers.filter((s) => s.store.rating > 4.0).length}
                </div>
                <div className="text-sm text-[#511A2B]/70">Bem Avaliados</div>
              </div>
              <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                <div className="text-2xl font-bold text-[#FEC460]">
                  {(suppliers.reduce((acc, s) => acc + s.store.rating, 0) / suppliers.length).toFixed(1)}
                </div>
                <div className="text-sm text-[#511A2B]/70">Avaliação Média</div>
              </div>
              <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                <div className="text-2xl font-bold text-[#D56235]">
                  {new Set(suppliers.map((s) => s.category)).size}
                </div>
                <div className="text-sm text-[#511A2B]/70">Categorias</div>
              </div>
            </>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-[#511A2B] animate-spin mb-4" />
            <p className="text-[#511A2B] text-lg font-medium">Carregando fornecedores...</p>
            <p className="text-[#511A2B]/70 text-sm">Buscando as melhores opções para você</p>
          </div>
        ) : (
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
