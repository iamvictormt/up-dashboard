"use client"

import { Calendar, MapPin, Users, Award, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Workshop {
  id: string
  name: string
  description: string
  date: string
  type: string
  points: number
  totalSpots: number
  filledSpots: number
  address: {
    id: string
    state: string
    city: string
    district: string
    street: string
    complement: string | null
    number: string
    zipCode: string
  }
  store: {
    id: string
    name: string
    description: string | null
    website: string | null
    rating: number
    openingHours: string | null
    addressId: string
    partnerId: string
  }
  participants: any[]
}

interface WorkshopCardProps {
  workshop: Workshop
}

export function WorkshopCard({ workshop }: WorkshopCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const { date, time } = formatDate(workshop.date)
  const progressPercentage = (workshop.filledSpots / workshop.totalSpots) * 100
  const spotsLeft = workshop.totalSpots - workshop.filledSpots

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl hover:border-[#511A2B]/30 transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#511A2B] mb-2 line-clamp-1">{workshop.name}</h3>
            <p className="text-sm text-[#511A2B]/80 line-clamp-2 mb-3">{workshop.description}</p>
          </div>
          <Badge className="bg-[#FEC460]/20 text-[#D56235] hover:bg-[#FEC460]/30 rounded-lg border-[#FEC460]/30 ml-2">
            {workshop.type}
          </Badge>
        </div>

        {/* Store Info */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-[#511A2B] rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-xs font-bold">{workshop.store.name.charAt(0)}</span>
          </div>
          <span className="text-sm font-medium text-[#511A2B]">{workshop.store.name}</span>
        </div>

        {/* Date and Time */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-[#511A2B]/70 mr-2" />
            <span className="text-sm text-[#511A2B] font-medium">{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-[#511A2B]/70 mr-2" />
            <span className="text-sm text-[#511A2B] font-medium">{time}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center mb-4">
          <MapPin className="w-4 h-4 text-red-500 mr-2" />
          <span className="text-sm text-[#511A2B]">
            {workshop.address.city}, {workshop.address.state}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Users className="w-4 h-4 text-[#511A2B]/70 mr-2" />
              <span className="text-sm text-[#511A2B] font-medium">
                {workshop.filledSpots}/{workshop.totalSpots} participantes
              </span>
            </div>
            <span className="text-xs text-gray-500">{spotsLeft > 0 ? `${spotsLeft} vagas restantes` : "Lotado"}</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-gray-200" />
        </div>

        {/* Points */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Award className="w-4 h-4 text-[#FEC460] mr-2" />
            <span className="text-sm font-semibold text-[#511A2B]">{workshop.points} pontos</span>
          </div>
          <Badge
            className={`${
              spotsLeft > 0 ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"
            } rounded-lg`}
          >
            {spotsLeft > 0 ? "Disponível" : "Lotado"}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            className="flex-1 bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl"
            disabled={spotsLeft === 0}
          >
            {spotsLeft > 0 ? "Inscrever-se" : "Lista de Espera"}
          </Button>
          <Button variant="outline" className="border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10 rounded-xl">
            Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
