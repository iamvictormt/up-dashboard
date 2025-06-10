"use client"

import { useState, useEffect } from "react"
import {
  Star,
  MapPin,
  Share,
  Heart,
  Loader2,
  Store,
  Mail,
  Globe,
  Package,
  Calendar,
  Clock,
  Users,
  Award,
  ShoppingBag,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"

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

interface SupplierDetailContentProps {
  supplierId: string
}

// Dados mockados expandidos
const mockSuppliers: Supplier[] = [
  {
    id: "s1f2e3d4-5678-9101-1121-314151617181",
    name: "Loja do Fornecedor ABC",
    description:
      "Uma loja especializada em produtos elétricos e hidráulicos com mais de 15 anos de experiência no mercado. Oferecemos produtos de alta qualidade e atendimento especializado para profissionais e consumidores finais.",
    website: "https://lojaabc.com.br",
    rating: 4.5,
    openingHours: "Segunda a Sexta: 08:00 - 18:00 | Sábado: 08:00 - 14:00",
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
      {
        name: "Alicate Universal",
        description: "Alicate profissional para múltiplas funções.",
        price: 35.9,
        link: "https://lojaabc.com.br/produtos/alicate",
        featured: true,
        promotion: false,
      },
      {
        name: "Martelo de Unha",
        description: "Martelo resistente para trabalhos pesados.",
        price: 45.0,
        link: "https://lojaabc.com.br/produtos/martelo",
        featured: false,
        promotion: false,
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
      {
        name: "Feira de Ferramentas 2025",
        description: "Exposição dos melhores produtos e novidades do mercado.",
        date: "2025-08-15T10:00:00Z",
        type: "Feira",
        points: 30,
        totalSpots: 100,
        filledSpots: 45,
        participantsCount: 45,
        address: {
          state: "SP",
          city: "São Paulo",
          district: "Mooca",
          street: "Av. Paes de Barros",
          complement: "Pavilhão A",
          number: "456",
          zipCode: "03100-000",
        },
      },
    ],
  },
]

export function SupplierDetailContent({ supplierId }: SupplierDetailContentProps) {
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundSupplier = mockSuppliers.find((s) => s.id === supplierId)
      setSupplier(foundSupplier || null)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [supplierId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-16 w-16 text-[#511A2B] animate-spin mb-6" />
        <p className="text-[#511A2B] text-xl font-medium">Carregando loja...</p>
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <Store className="h-24 w-24 text-[#511A2B]/50 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#511A2B] mb-4">Loja não encontrada</h2>
          <p className="text-[#511A2B]/70 mb-8">A loja que você procura não existe ou foi removida.</p>
          <Link href="/suppliers">
            <Button className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl px-8 py-3">
              Voltar para Fornecedores
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Floating Action Buttons */}
      <div className="fixed top-32 right-8 md:right-16 z-50 flex flex-col space-y-3">
        <Button
          onClick={() => setIsFavorited(!isFavorited)}
          size="icon"
          className={`rounded-full shadow-xl backdrop-blur-sm transition-all duration-300 ${
            isFavorited
              ? "bg-red-500 hover:bg-red-600 text-white scale-110"
              : "bg-white/90 hover:bg-white text-gray-700 border border-gray-200 hover:scale-110"
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
        </Button>

        <Button
          size="icon"
          className="rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-xl backdrop-blur-sm border border-gray-200 hover:scale-110 transition-all duration-300"
        >
          <Share className="w-5 h-5" />
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#46142b] rounded-xl" />
        <div className="relative px-6 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Logo/Ícone da Loja */}
              <div className="relative group">
                <div className="w-40 h-40 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-2xl flex items-center justify-center">
                  <Store className="w-20 h-20 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-green-500 text-white px-3 py-1 rounded-full shadow-lg">Verificado</Badge>
                </div>
              </div>

              {/* Informações Principais */}
              <div className="flex-1 text-center lg:text-left text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{supplier.name}</h1>
                <p className="text-xl md:text-2xl text-white/90 mb-6">Loja Especializada</p>

                {/* Rating */}
                <div className="flex items-center justify-center lg:justify-start mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(supplier.rating) ? "text-yellow-300 fill-yellow-300" : "text-white/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-3 text-2xl font-bold">{supplier.rating.toFixed(1)}</span>
                  <span className="ml-2 text-white/80">• Excelente</span>
                </div>

                <p className="text-lg text-white/90 leading-relaxed mb-8 max-w-2xl">{supplier.description}</p>

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-white text-[#511A2B] hover:bg-white/90 rounded-xl px-8 py-4 font-semibold shadow-xl"
                    onClick={() => window.open(supplier.website, "_blank")}
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Visitar Site
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#F5B13D] text-white bg-[#F5B13D] hover:bg-[#F5B13D]/90 hover:text-white rounded-xl px-8 py-4 font-semibold"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Entrar em Contato
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 -mt-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#511A2B] to-[#D56235] rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-[#511A2B]">{supplier.rating.toFixed(1)}</div>
                <div className="text-sm text-[#511A2B]/70">Avaliação</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FEC460] to-[#D56235] rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-[#511A2B]">{supplier.products.length}</div>
                <div className="text-sm text-[#511A2B]/70">Produtos</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#D56235] to-[#511A2B] rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-[#511A2B]">{supplier.events.length}</div>
                <div className="text-sm text-[#511A2B]/70">Eventos</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-[#511A2B]">15+</div>
                <div className="text-sm text-[#511A2B]/70">Anos</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Produtos Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-[#511A2B] mb-2">Nossos Produtos</h2>
                <p className="text-[#511A2B]/70">Descubra nossa linha completa de produtos</p>
              </div>
              <Button variant="outline" className="border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10 rounded-xl">
                Ver Todos
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supplier.products.map((product, index) => (
                <Card
                  key={index}
                  className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-2"
                >
                  <div className="relative group">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {product.featured && (
                          <Badge className="bg-[#FEC460] text-[#511A2B] hover:bg-[#FEC460]/90 shadow-lg">
                            Destaque
                          </Badge>
                        )}
                        {product.promotion && (
                          <Badge className="bg-red-500 text-white hover:bg-red-600 shadow-lg">Promoção</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="font-bold text-[#511A2B] mb-2 text-lg">{product.name}</h3>
                    <p className="text-sm text-[#511A2B]/70 mb-4 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-[#511A2B]">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </div>
                      <Button
                        size="sm"
                        className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl shadow-lg"
                        onClick={() => window.open(product.link, "_blank")}
                      >
                        <ShoppingBag className="w-4 h-4 mr-1" />
                        Comprar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Eventos Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-[#511A2B] mb-2">Próximos Eventos</h2>
                <p className="text-[#511A2B]/70">Participe dos nossos eventos e ganhe pontos</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {supplier.events.map((event, index) => (
                <Card
                  key={index}
                  className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden"
                >
                  <div className="relative h-48 bg-gradient-to-r from-[#681C3F] to-[#FEC460]">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative p-6 h-full flex flex-col justify-between text-white">
                      <div>
                        <Badge className="bg-white/20 text-white border-white/30 mb-3">{event.type}</Badge>
                        <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-[#FEC460]">+{event.points}</div>
                        <div className="text-right">
                          <div className="text-sm opacity-90">Vagas</div>
                          <div className="font-bold">
                            {event.filledSpots}/{event.totalSpots}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <p className="text-[#511A2B]/80 mb-4">{event.description}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-[#511A2B]/70" />
                        <span className="text-sm font-medium text-[#511A2B]">
                          {new Date(event.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-[#511A2B]/70" />
                        <span className="text-sm font-medium text-[#511A2B]">
                          {event.address.district}, {event.address.city}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-[#511A2B]/70" />
                        <span className="text-sm font-medium text-[#511A2B]">
                          {event.participantsCount} participantes confirmados
                        </span>
                      </div>
                    </div>

                    <Button className="w-full bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl py-3 font-semibold shadow-lg">
                      Inscrever-se no Evento
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Informações da Loja */}
          <section>
            <h2 className="text-3xl font-bold text-[#511A2B] mb-8">Informações da Loja</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white border-0 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-[#511A2B] flex items-center text-xl">
                    <MapPin className="w-6 h-6 mr-3" />
                    Localização
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold text-[#511A2B] text-lg">
                      {supplier.address.street}, {supplier.address.number}
                      {supplier.address.complement && `, ${supplier.address.complement}`}
                    </p>
                    <p className="text-[#511A2B]/80">
                      {supplier.address.district}, {supplier.address.city} - {supplier.address.state}
                    </p>
                    <p className="text-[#511A2B]/80">CEP: {supplier.address.zipCode}</p>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#511A2B]/70" />
                    <div>
                      <p className="text-sm text-[#511A2B]/70">Horário de Funcionamento</p>
                      <p className="font-semibold text-[#511A2B]">{supplier.openingHours}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-[#511A2B] flex items-center text-xl">
                    <Globe className="w-6 h-6 mr-3" />
                    Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-[#511A2B]/5 rounded-xl">
                    <Globe className="w-5 h-5 text-[#511A2B]/70" />
                    <div>
                      <p className="text-sm text-[#511A2B]/70">Website</p>
                      <a
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {supplier.website}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-[#511A2B]/5 rounded-xl">
                    <Mail className="w-5 h-5 text-[#511A2B]/70" />
                    <div>
                      <p className="text-sm text-[#511A2B]/70">E-mail</p>
                      <p className="font-semibold text-[#511A2B]">contato@{supplier.website.replace("https://", "")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
