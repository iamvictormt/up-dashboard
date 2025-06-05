"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Loader2, Store, Star, Package, Calendar } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { SupplierCard } from "./supplier-card"

// Tipo para o formato de dados do fornecedor
interface Supplier {
  id: string
  name: string
  description: string
  website: string
  rating: number
  openingHours: string
  address: {
    state: string
    city: string
    district: string
    street: string
    complement: string | null
    number: string
    zipCode: string
  }
  products: Array<{
    name: string
    description: string
    price: number
    link: string
    featured: boolean
    promotion: boolean
  }>
  events: Array<{
    name: string
    description: string
    date: string
    type: string
    points: number
    totalSpots: number
    filledSpots: number
    participantsCount: number
    address: {
      state: string
      city: string
      district: string
      street: string
      complement: string | null
      number: string
      zipCode: string
    }
  }>
}

// Dados mockados para simulação
const mockSuppliers: Supplier[] = [
  {
    id: "s1f2e3d4-5678-9101-1121-314151617181",
    name: "Loja do Fornecedor ABC",
    description: "Uma loja especializada em produtos elétricos e hidráulicos.",
    website: "https://lojaabc.com.br",
    rating: 4.5,
    openingHours: "08:00 - 18:00",
    address: {
      state: "SP",
      city: "São Paulo",
      district: "Mooca",
      street: "Av. Paes de Barros",
      complement: "Loja 1",
      number: "456",
      zipCode: "03100-000",
    },
    products: [
      {
        name: "Chave de Fenda",
        description: "Ferramenta para apertar e soltar parafusos.",
        price: 19.99,
        link: "https://lojaabc.com.br/produtos/chave-de-fenda",
        featured: true,
        promotion: false,
      },
      {
        name: "Fita Isolante",
        description: "Ideal para instalações elétricas.",
        price: 5.5,
        link: "https://lojaabc.com.br/produtos/fita-isolante",
        featured: false,
        promotion: true,
      },
    ],
    events: [
      {
        name: "Workshop de Instalação Elétrica",
        description: "Evento voltado para profissionais da área elétrica.",
        date: "2025-07-10T09:00:00Z",
        type: "Workshop",
        points: 50,
        totalSpots: 30,
        filledSpots: 10,
        participantsCount: 10,
        address: {
          state: "SP",
          city: "São Paulo",
          district: "Vila Mariana",
          street: "Rua Domingos de Morais",
          complement: "Auditório",
          number: "350",
          zipCode: "04010-000",
        },
      },
    ],
  },
  {
    id: "s2a3b4c5-6789-0123-4567-890123456789",
    name: "Materiais Construção XYZ",
    description: "Fornecedor completo de materiais para construção civil e reformas.",
    website: "https://materiaisxyz.com.br",
    rating: 4.8,
    openingHours: "07:00 - 17:00",
    address: {
      state: "SP",
      city: "São Paulo",
      district: "Vila Prudente",
      street: "Rua do Oratório",
      complement: null,
      number: "1200",
      zipCode: "03220-000",
    },
    products: [
      {
        name: "Cimento Portland",
        description: "Cimento de alta qualidade para construção.",
        price: 28.9,
        link: "https://materiaisxyz.com.br/produtos/cimento",
        featured: true,
        promotion: false,
      },
      {
        name: "Tijolo Cerâmico",
        description: "Tijolo de qualidade superior.",
        price: 0.85,
        link: "https://materiaisxyz.com.br/produtos/tijolo",
        featured: false,
        promotion: true,
      },
      {
        name: "Tinta Acrílica",
        description: "Tinta lavável para paredes internas e externas.",
        price: 89.9,
        link: "https://materiaisxyz.com.br/produtos/tinta",
        featured: true,
        promotion: false,
      },
    ],
    events: [
      {
        name: "Feira de Materiais de Construção",
        description: "Exposição dos melhores materiais com preços especiais.",
        date: "2025-08-15T08:00:00Z",
        type: "Feira",
        points: 30,
        totalSpots: 100,
        filledSpots: 45,
        participantsCount: 45,
        address: {
          state: "SP",
          city: "São Paulo",
          district: "Expo Center Norte",
          street: "Rua José Bernardo Pinto",
          complement: "Pavilhão A",
          number: "333",
          zipCode: "02055-000",
        },
      },
    ],
  },
  {
    id: "s3d4e5f6-7890-1234-5678-901234567890",
    name: "Ferramentas Pro",
    description: "Especialista em ferramentas profissionais e equipamentos industriais.",
    website: "https://ferramentaspro.com.br",
    rating: 4.3,
    openingHours: "08:30 - 18:30",
    address: {
      state: "SP",
      city: "São Paulo",
      district: "Brás",
      street: "Rua Oriente",
      complement: "Galpão 5",
      number: "789",
      zipCode: "03016-000",
    },
    products: [
      {
        name: "Furadeira Profissional",
        description: "Furadeira de impacto com alta potência.",
        price: 299.9,
        link: "https://ferramentaspro.com.br/produtos/furadeira",
        featured: true,
        promotion: true,
      },
      {
        name: "Kit de Chaves",
        description: "Conjunto completo de chaves Phillips e fenda.",
        price: 45.0,
        link: "https://ferramentaspro.com.br/produtos/kit-chaves",
        featured: false,
        promotion: false,
      },
    ],
    events: [
      {
        name: "Treinamento de Ferramentas",
        description: "Aprenda a usar ferramentas profissionais com segurança.",
        date: "2025-09-20T14:00:00Z",
        type: "Treinamento",
        points: 40,
        totalSpots: 25,
        filledSpots: 8,
        participantsCount: 8,
        address: {
          state: "SP",
          city: "São Paulo",
          district: "Brás",
          street: "Rua Oriente",
          complement: "Sala de Treinamento",
          number: "789",
          zipCode: "03016-000",
        },
      },
    ],
  },
]

export function SuppliersContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Simular carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuppliers(mockSuppliers)
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.address.district.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calcular estatísticas
  const totalProducts = suppliers.reduce((acc, supplier) => acc + supplier.products.length, 0)
  const totalEvents = suppliers.reduce((acc, supplier) => acc + supplier.events.length, 0)
  const averageRating =
    suppliers.length > 0
      ? (suppliers.reduce((acc, supplier) => acc + supplier.rating, 0) / suppliers.length).toFixed(1)
      : "0.0"
  const highRatedSuppliers = suppliers.filter((supplier) => supplier.rating >= 4.5).length

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-2">Fornecedores Parceiros</h1>
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
  )
}
