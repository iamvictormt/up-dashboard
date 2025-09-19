"use client"
import { Star, MapPin, Store, MoreHorizontal, Package, Calendar, ExternalLink, Clock, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

interface SupplierCardProps {
  supplier: Supplier
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const { id, name, description, website, rating, openingHours, address, products, events } = supplier

  const featuredProducts = products.filter((product) => product.featured)
  const promotionProducts = products.filter((product) => product.promotion)
  const nextEvent = events.length > 0 ? events[0] : null

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl hover:border-[#511A2B]/30 transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden h-[580px] flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Header Section - Altura fixa */}
        <div className="relative bg-[#511A2B] p-6 text-white h-[110px] flex-shrink-0">
          {/* Rating Overlay */}
          <div className="absolute top-4 right-4 bg-[#FEC460] text-[#511A2B] px-3 py-1 rounded-lg flex items-center space-x-1">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
          </div>

          {/* Store Info */}
          <div className="flex items-start space-x-3 h-full">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Store className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold mb-1 truncate pr-16 text-white">{name}</h3>
              <div className="flex items-center space-x-2 text-white/80 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">
                  {address.district}, {address.city}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Flex grow para ocupar espaço restante */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Description - Altura fixa */}
          <div className="h-[48px] mb-4">
            <p className="text-sm text-[#511A2B]/80 line-clamp-2">{description}</p>
          </div>

          {/* Opening Hours - Altura fixa */}


          {/* Products Section - Altura fixa */}
          <div className="mb-4 h-[120px] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-[#511A2B] flex items-center">
                <Package className="w-4 h-4 mr-1 flex-shrink-0" />
                Produtos ({products.length})
              </h4>
            </div>

            <div className="flex flex-wrap gap-2 mb-2 min-h-[24px]">
              {featuredProducts.length > 0 && (
                <Badge className="bg-[#FEC460]/20 text-[#D56235] hover:bg-[#FEC460]/30 rounded-lg border-[#FEC460]/30 text-xs">
                  {featuredProducts.length} em destaque
                </Badge>
              )}
              {promotionProducts.length > 0 && (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-200 rounded-lg border-red-200 text-xs">
                  {promotionProducts.length} em promoção
                </Badge>
              )}
            </div>

            {/* Sample Products - Altura fixa */}
            <div className="space-y-1 flex-1">
              {products.length > 0 ? (
                <>
                  {products.slice(0, 2).map((product, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-[#511A2B]/70 truncate flex-1 mr-2">{product.name}</span>
                      <span className="font-semibold text-[#511A2B] flex-shrink-0">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  ))}
                  {products.length > 2 && <p className="text-xs text-[#511A2B]/50">+{products.length - 2} produtos</p>}
                </>
              ) : (
                <p className="text-xs text-[#511A2B]/50 italic">Nenhum produto disponível</p>
              )}
            </div>
          </div>

          {/* Events Section - Altura fixa */}
          <div className="mb-4 h-[120px] flex flex-col">
            {nextEvent ? (
              <div className="p-3 bg-[#511A2B]/5 rounded-xl h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-[#511A2B] flex items-center">
                    <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                    Próximo Evento
                  </h4>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-xs flex-shrink-0">
                    {nextEvent.type}
                  </Badge>
                </div>
                <p className="text-xs text-[#511A2B]/80 line-clamp-1 mb-1 flex-1">{nextEvent.name}</p>
                <p className="text-xs text-[#511A2B]/60 mb-2">
                  {new Date(nextEvent.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#511A2B]/60">
                    {nextEvent.filledSpots}/{nextEvent.totalSpots} vagas
                  </span>
                  <span className="text-xs font-semibold text-[#FEC460]">+{nextEvent.points} pontos</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-xl h-full flex flex-col items-center justify-center">
                <Calendar className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-xs text-gray-500 text-center">Nenhum evento disponível no momento</p>
              </div>
            )}
          </div>

          {/* Action Buttons - Altura fixa no final */}
          <div className="flex space-x-2 mt-auto">
            <Link href={`/suppliers-store/${id}`} className="flex-1">
              <Button className="w-full bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl text-sm">
                Ver Loja
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10 rounded-xl"
              onClick={() => window.open(website, "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            {/* <Button
              variant="outline"
              className="border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10 rounded-xl"
            >
              <Heart className="w-4 h-4" />
            </Button> */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
