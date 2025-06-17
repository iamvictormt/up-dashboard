"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Sparkles, Star, Phone } from "lucide-react"

interface PartnerSupplier {
  id: string
  name: string
  category: string
  location: string
  rating: number
  discountPercentage: number
  phone: string
  image: string
  badge: "PREMIUM" | "NOVO" | "OFERTA"
  gradient: string
  specialOffer: string
}

const partnerSuppliers: PartnerSupplier[] = [
  {
    id: "1",
    name: "Flores & Encantos",
    category: "Floricultura",
    location: "São Paulo, SP",
    rating: 4.9,
    discountPercentage: 25,
    phone: "(11) 99999-1234",
    image: "/placeholder.svg?height=80&width=80",
    badge: "PREMIUM",
    gradient: "from-pink-500 to-purple-500",
    specialOffer: "Frete grátis + 25% OFF",
  },
  {
    id: "2",
    name: "Doces da Vovó",
    category: "Confeitaria",
    location: "Rio de Janeiro, RJ",
    rating: 4.8,
    discountPercentage: 20,
    phone: "(21) 98888-5678",
    image: "/placeholder.svg?height=80&width=80",
    badge: "OFERTA",
    gradient: "from-amber-400 to-red-400",
    specialOffer: "Degustação gratuita + 20% OFF",
  },
  {
    id: "3",
    name: "Studio Visual Pro",
    category: "Fotografia",
    location: "Belo Horizonte, MG",
    rating: 5.0,
    discountPercentage: 30,
    phone: "(31) 97777-9012",
    image: "/placeholder.svg?height=80&width=80",
    badge: "NOVO",
    gradient: "from-blue-500 to-purple-600",
    specialOffer: "Pacote completo com 30% desconto",
  },
  {
    id: "4",
    name: "Som & Luz Premium",
    category: "Som e Iluminação",
    location: "Brasília, DF",
    rating: 4.7,
    discountPercentage: 15,
    phone: "(61) 96666-3456",
    image: "/placeholder.svg?height=80&width=80",
    badge: "PREMIUM",
    gradient: "from-green-500 to-blue-500",
    specialOffer: "DJ incluso sem custo adicional",
  },
]

export function WeeklySpotlight() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % partnerSuppliers.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isHovered])

  const currentSupplier = partnerSuppliers[currentIndex]

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "NOVO":
        return "bg-emerald-500 text-white"
      case "PREMIUM":
        return "bg-[#ffc560] text-[#6c2144] font-bold"
      case "OFERTA":
        return "bg-[#d01c2a] text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      {/* Compact Header */}
      <div className="p-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#6c2144]" />
          <h3 className="font-semibold text-sm text-gray-900">Destaque da Semana</h3>
        </div>
      </div>

      {/* Compact Carousel */}
      <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {/* Compact Content */}
        <div className="p-4">
          {/* Top Row - Badge and Rating */}
          <div className="flex justify-between items-center mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getBadgeColor(currentSupplier.badge)}`}>
              {currentSupplier.badge}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-gray-600">{currentSupplier.rating}</span>
            </div>
          </div>

          {/* Main Content Row */}
          <div className="flex gap-3 mb-3">
            {/* Avatar */}
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-br ${currentSupplier.gradient} flex-shrink-0 flex items-center justify-center`}
            >
              <span className="text-white font-bold text-lg">{currentSupplier.name.charAt(0)}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-gray-900 truncate">{currentSupplier.name}</h4>
              <p className="text-xs text-gray-500 mb-1">{currentSupplier.category}</p>
              <p className="text-xs text-gray-400">{currentSupplier.location}</p>
            </div>

            {/* Discount Badge */}
            <div className="flex-shrink-0">
              <div className="bg-red-100 text-red-700 px-2 py-1 rounded-md">
                <span className="text-xs font-bold">-{currentSupplier.discountPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Special Offer */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-2 mb-3">
            <p className="text-xs text-yellow-800 font-medium">🎉 {currentSupplier.specialOffer}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors">
              Ver Mais
            </button>
            <button className="bg-[#6c2144] hover:bg-[#6c2144]/90 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1">
              <Phone className="h-3 w-3" />
              Contato
            </button>
          </div>
        </div>

        {/* Compact Navigation */}
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + partnerSuppliers.length) % partnerSuppliers.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-sm rounded-full p-1 transition-all"
        >
          <ChevronLeft className="h-3 w-3 text-gray-600" />
        </button>

        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % partnerSuppliers.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-sm rounded-full p-1 transition-all"
        >
          <ChevronRight className="h-3 w-3 text-gray-600" />
        </button>
      </div>

      {/* Compact Dots */}
      <div className="px-4 pb-3 flex justify-center gap-1">
        {partnerSuppliers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-[#6c2144] w-6" : "bg-gray-300 hover:bg-gray-400 w-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
