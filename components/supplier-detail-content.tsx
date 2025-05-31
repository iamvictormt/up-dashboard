"use client"

import { useState, useEffect } from "react"
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Share,
  Heart,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Building,
  Mail,
  Globe,
  Users,
  Award,
  MessageCircle,
  ExternalLink,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"

interface Supplier {
  id: string
  tradeName: string
  companyName: string
  document: string
  stateRegistration: string
  contact: string
  profileImage: string
  store: {
    id: string
    name: string
    description: string | null
    website: string | null
    rating: number
    openingHours: string | null
    address: {
      state: string
      city: string
      district: string
      street: string
      complement: string | null
      number: string
      zipCode: string
    }
  }
  category: string
  mainImage: string
  thumbnails: string[]
  available: string
  duration: string
  contactName: string
  reviews: number
  status?: "available" | "unavailable"
}

interface SupplierDetailContentProps {
  supplierId: string
}

// Dados mockados expandidos
const mockSuppliers: Supplier[] = [
  {
    id: "5527e77a-d669-4872-b4c9-a46768c32f0e",
    tradeName: "Super Soluções",
    companyName: "Super Soluções LTDA",
    document: "12.345.678/0001-90",
    stateRegistration: "123.456.789",
    contact: "+55 11 99999-8888",
    profileImage: "enderecofoto.com.br",
    store: {
      id: "d8821412-3cfc-4e1b-987b-b0760fe6240d",
      name: "Super Soluções",
      description:
        "Especialistas em soluções tecnológicas e consultoria empresarial para pequenas e médias empresas. Oferecemos serviços de TI, desenvolvimento de software, suporte técnico e consultoria em transformação digital com foco em resultados rápidos e eficientes.",
      website: "www.supersolucoes.com.br",
      rating: 4.2,
      openingHours: "Segunda a Sexta: 08:00 - 18:00 | Sábado: 08:00 - 12:00",
      address: {
        state: "SP",
        city: "São Paulo",
        district: "Centro",
        street: "Av. Principal",
        complement: "Sala 101",
        number: "100",
        zipCode: "01000-000",
      },
    },
    category: "Tecnologia",
    mainImage: "/placeholder.svg?height=400&width=600",
    thumbnails: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    available: "Disponível para novos projetos",
    duration: "Projetos de 1 semana a 6 meses",
    contactName: "João Silva",
    reviews: 234,
    status: "available",
  },
]

// Mock de produtos/serviços
const mockProducts = [
  {
    id: "1",
    name: "Consultoria em TI",
    description: "Análise e planejamento de infraestrutura tecnológica",
    price: "R$ 150/hora",
    category: "Consultoria",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    name: "Desenvolvimento de Software",
    description: "Criação de sistemas personalizados para sua empresa",
    price: "A partir de R$ 5.000",
    category: "Desenvolvimento",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    name: "Suporte Técnico",
    description: "Manutenção e suporte para sistemas existentes",
    price: "R$ 80/hora",
    category: "Suporte",
    image: "/placeholder.svg?height=200&width=300",
  },
]

// Mock de avaliações
const mockReviews = [
  {
    id: "1",
    author: "Maria Santos",
    rating: 5,
    date: "15 Jan 2025",
    comment: "Excelente trabalho! Entregaram o projeto no prazo e com qualidade excepcional.",
    project: "Sistema de Gestão",
  },
  {
    id: "2",
    author: "Carlos Oliveira",
    rating: 4,
    date: "10 Jan 2025",
    comment: "Muito profissionais e atenciosos. Recomendo!",
    project: "Consultoria em TI",
  },
  {
    id: "3",
    author: "Ana Costa",
    rating: 5,
    date: "05 Jan 2025",
    comment: "Superaram nossas expectativas. Equipe muito competente.",
    project: "Desenvolvimento Web",
  },
]

export function SupplierDetailContent({ supplierId }: SupplierDetailContentProps) {
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  const allImages = supplier ? [supplier.mainImage, ...supplier.thumbnails] : []

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundSupplier = mockSuppliers.find((s) => s.id === supplierId)
      setSupplier(foundSupplier || null)
      if (foundSupplier) {
        setSelectedImage(foundSupplier.mainImage)
      }
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [supplierId])

  const openGallery = (imageIndex: number) => {
    setCurrentImageIndex(imageIndex)
    setIsGalleryOpen(true)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 text-[#511A2B] animate-spin mb-4" />
        <p className="text-[#511A2B] text-lg font-medium">Carregando detalhes...</p>
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="text-center py-12">
        <p className="text-[#511A2B] text-lg font-medium mb-2">Fornecedor não encontrado</p>
        <Link href="/suppliers">
          <Button className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl">Voltar para Fornecedores</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed top-32 right-6 z-40 flex flex-col space-y-3">
        <Button
          onClick={() => setIsFavorited(!isFavorited)}
          size="icon"
          className={`rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ${
            isFavorited
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-white/90 hover:bg-white text-gray-700 border border-gray-200"
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
        </Button>

        <Button
          size="icon"
          className="rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-lg backdrop-blur-sm border border-gray-200"
        >
          <Share className="w-5 h-5" />
        </Button>
      </div>

      <div className="w-full">
        {/* Header da Empresa */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Logo/Imagem Principal */}
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-lg flex-shrink-0 mx-auto lg:mx-0">
              <Image src={selectedImage || "/placeholder.svg"} alt={supplier.tradeName} fill className="object-cover" />
              <div className="absolute top-2 right-2">
                <Badge
                  className={`${
                    supplier.status === "available"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  } shadow-lg text-xs`}
                >
                  {supplier.status === "available" ? "ATIVO" : "INATIVO"}
                </Badge>
              </div>
            </div>

            {/* Informações Principais */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-2">{supplier.tradeName}</h1>
                  <p className="text-lg text-[#511A2B]/80 mb-2">{supplier.companyName}</p>
                  <Badge className="bg-[#FEC460]/20 text-[#D56235] hover:bg-[#FEC460]/30 rounded-lg border-[#FEC460]/30">
                    {supplier.category}
                  </Badge>
                </div>
              </div>

              {/* Rating e Reviews */}
              <div className="flex flex-col md:flex-row md:items-center justify-center lg:justify-start space-y-2 md:space-y-0 md:space-x-6 mb-4">
                <div className="flex items-center justify-center lg:justify-start">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(supplier.store.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-[#511A2B] font-semibold">{supplier.store.rating.toFixed(1)}</span>
                  <span className="ml-1 text-gray-600">({supplier.reviews} avaliações)</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="text-sm">+500 clientes atendidos</span>
                </div>
              </div>

              {/* Descrição */}
              <p className="text-[#511A2B]/80 leading-relaxed mb-6 text-sm md:text-base">
                {supplier.store.description}
              </p>

              {/* Botões de Ação */}
              <div className="flex flex-col md:flex-row flex-wrap gap-3">
                <Button className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl px-6">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Entrar em Contato
                </Button>
                <Button
                  variant="outline"
                  className="border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10 rounded-xl"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Ligar Agora
                </Button>
                {supplier.store.website && (
                  <Button
                    variant="outline"
                    className="border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10 rounded-xl"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visitar Site
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="grid grid-cols-5 bg-white/80 rounded-2xl p-1 mb-8 min-w-max w-full">
              <TabsTrigger
                value="overview"
                className="rounded-xl data-[state=active]:bg-[#511A2B] data-[state=active]:text-white text-xs md:text-sm px-2 md:px-3"
              >
                Visão Geral
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="rounded-xl data-[state=active]:bg-[#511A2B] data-[state=active]:text-white text-xs md:text-sm px-2 md:px-3"
              >
                Produtos/Serviços
              </TabsTrigger>
              <TabsTrigger
                value="location"
                className="rounded-xl data-[state=active]:bg-[#511A2B] data-[state=active]:text-white text-xs md:text-sm px-2 md:px-3"
              >
                Localização
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-xl data-[state=active]:bg-[#511A2B] data-[state=active]:text-white text-xs md:text-sm px-2 md:px-3"
              >
                Avaliações
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="rounded-xl data-[state=active]:bg-[#511A2B] data-[state=active]:text-white text-xs md:text-sm px-2 md:px-3"
              >
                Contato
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informações da Empresa */}
              <Card className="lg:col-span-2 bg-white/80 border-[#511A2B]/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-[#511A2B] flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Informações da Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-[#511A2B]/70">CNPJ</label>
                      <p className="font-semibold text-[#511A2B] break-all">{supplier.document}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#511A2B]/70">Inscrição Estadual</label>
                      <p className="font-semibold text-[#511A2B]">{supplier.stateRegistration}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#511A2B]/70">Responsável</label>
                      <p className="font-semibold text-[#511A2B]">{supplier.contactName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#511A2B]/70">Categoria</label>
                      <p className="font-semibold text-[#511A2B]">{supplier.category}</p>
                    </div>
                  </div>
                  <Separator className="bg-[#511A2B]/10" />
                  <div>
                    <label className="text-sm font-medium text-[#511A2B]/70">Horário de Funcionamento</label>
                    <p className="font-semibold text-[#511A2B] text-sm md:text-base">{supplier.store.openingHours}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Estatísticas */}
              <div className="space-y-4">
                <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-[#511A2B] rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-[#511A2B]">{supplier.store.rating.toFixed(1)}</div>
                    <div className="text-sm text-[#511A2B]/70">Avaliação Média</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-[#FEC460] rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-[#511A2B]" />
                    </div>
                    <div className="text-2xl font-bold text-[#511A2B]">{supplier.reviews}</div>
                    <div className="text-sm text-[#511A2B]/70">Avaliações</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-[#D56235] rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-[#511A2B]">5+</div>
                    <div className="text-sm text-[#511A2B]/70">Anos de Experiência</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Galeria de Imagens */}
            <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#511A2B]">Galeria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => openGallery(index)}
                      className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 hover:border-[#511A2B]/50 transition-all duration-200 hover:scale-105"
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${supplier.tradeName} - Imagem ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Produtos/Serviços */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProducts.map((product) => (
                <Card
                  key={product.id}
                  className="bg-white/80 border-[#511A2B]/10 rounded-2xl hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Badge className="bg-[#FEC460]/20 text-[#D56235] hover:bg-[#FEC460]/30 rounded-lg mb-3">
                      {product.category}
                    </Badge>
                    <h3 className="font-bold text-[#511A2B] mb-2">{product.name}</h3>
                    <p className="text-sm text-[#511A2B]/80 mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#511A2B] text-sm md:text-base">{product.price}</span>
                      <Button
                        size="sm"
                        className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-lg text-xs md:text-sm"
                      >
                        Solicitar Orçamento
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Localização */}
          <TabsContent value="location" className="space-y-6">
            <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#511A2B] flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-[#511A2B]/70">Endereço Completo</label>
                      <p className="font-semibold text-[#511A2B]">
                        {supplier.store.address.street}, {supplier.store.address.number}
                        {supplier.store.address.complement && `, ${supplier.store.address.complement}`}
                      </p>
                      <p className="text-[#511A2B]">
                        {supplier.store.address.district}, {supplier.store.address.city} -{" "}
                        {supplier.store.address.state}
                      </p>
                      <p className="text-[#511A2B]">CEP: {supplier.store.address.zipCode}</p>
                    </div>
                    <Separator className="bg-[#511A2B]/10" />
                    <div>
                      <label className="text-sm font-medium text-[#511A2B]/70">Horário de Funcionamento</label>
                      <p className="font-semibold text-[#511A2B] text-sm md:text-base">{supplier.store.openingHours}</p>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                    <p className="text-gray-500">Mapa interativo aqui</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Avaliações */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-[#511A2B]">Resumo das Avaliações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-[#511A2B] mb-2">{supplier.store.rating.toFixed(1)}</div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(supplier.store.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-[#511A2B]/70">{supplier.reviews} avaliações</p>
                  </div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center space-x-2">
                        <span className="text-sm w-2">{stars}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#FEC460] h-2 rounded-full"
                            style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 5}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-8">
                          {stars === 5 ? "70%" : stars === 4 ? "20%" : "5%"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-2 space-y-4">
                {mockReviews.map((review) => (
                  <Card key={review.id} className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 space-y-2 md:space-y-0">
                        <div>
                          <h4 className="font-semibold text-[#511A2B]">{review.author}</h4>
                          <p className="text-sm text-[#511A2B]/70">{review.project}</p>
                        </div>
                        <div className="text-left md:text-right">
                          <div className="flex md:justify-end">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-[#511A2B]/70">{review.date}</p>
                        </div>
                      </div>
                      <p className="text-[#511A2B]/80 text-sm md:text-base">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Contato */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-[#511A2B] flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Informações de Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-[#511A2B]/5 rounded-xl">
                    <Phone className="w-5 h-5 text-[#511A2B]/70" />
                    <div>
                      <p className="text-sm text-[#511A2B]/70">Telefone</p>
                      <p className="font-medium text-[#511A2B]">{supplier.contact}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-[#511A2B]/5 rounded-xl">
                    <Mail className="w-5 h-5 text-[#511A2B]/70" />
                    <div>
                      <p className="text-sm text-[#511A2B]/70">E-mail</p>
                      <p className="font-medium text-[#511A2B] break-all">
                        contato@{supplier.store.website?.replace("www.", "")}
                      </p>
                    </div>
                  </div>

                  {supplier.store.website && (
                    <div className="flex items-center space-x-3 p-3 bg-[#511A2B]/5 rounded-xl">
                      <Globe className="w-5 h-5 text-[#511A2B]/70" />
                      <div>
                        <p className="text-sm text-[#511A2B]/70">Website</p>
                        <a
                          href={`https://${supplier.store.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline break-all"
                        >
                          {supplier.store.website}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3 p-3 bg-[#511A2B]/5 rounded-xl">
                    <Clock className="w-5 h-5 text-[#511A2B]/70" />
                    <div>
                      <p className="text-sm text-[#511A2B]/70">Horário de Atendimento</p>
                      <p className="font-medium text-[#511A2B] text-sm md:text-base">{supplier.store.openingHours}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-[#511A2B]">Enviar Mensagem</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-[#511A2B]">Nome</label>
                      <input
                        type="text"
                        className="w-full mt-1 p-3 border border-[#511A2B]/20 rounded-xl focus:border-[#511A2B]/40 focus:outline-none"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#511A2B]">E-mail</label>
                      <input
                        type="email"
                        className="w-full mt-1 p-3 border border-[#511A2B]/20 rounded-xl focus:border-[#511A2B]/40 focus:outline-none"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#511A2B]">Mensagem</label>
                      <textarea
                        rows={4}
                        className="w-full mt-1 p-3 border border-[#511A2B]/20 rounded-xl focus:border-[#511A2B]/40 focus:outline-none resize-none"
                        placeholder="Descreva seu projeto ou necessidade..."
                      />
                    </div>
                    <Button className="w-full bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl">
                      Enviar Mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="w-[95vw] max-w-6xl h-[90vh] p-0 bg-black border-0 flex items-center justify-center">
          {/* Close Button - sempre visível */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full bg-black/50"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevImage}
            className="absolute left-4 z-50 text-white hover:bg-white/20 rounded-full bg-black/50"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextImage}
            className="absolute right-4 z-50 text-white hover:bg-white/20 rounded-full bg-black/50"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Image Container */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="relative max-w-full max-h-full">
              <Image
                src={allImages[currentImageIndex] || "/placeholder.svg"}
                alt={`${supplier.tradeName} - Image ${currentImageIndex + 1}`}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
