"use client"

import { Calendar, MapPin, Users, Award, Clock, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Event {
  id: string
  name: string
  description: string
  date: string
  type: string
  points: number
  totalSpots: number
  filledSpots: number
  storeId: string
  address: {
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
    rating: number
  }
}

interface EventCardProps {
  event: Event
  onEventClick: (event: Event) => void
  onParticipateClick: (event: Event) => void
}

export function EventCard({ event, onEventClick, onParticipateClick }: EventCardProps) {
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

  const { date, time } = formatDate(event.date)
  const progressPercentage = (event.filledSpots / event.totalSpots) * 100
  const spotsLeft = event.totalSpots - event.filledSpots

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "conferência":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "meetup":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "hackathon":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "workshop":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-[#FEC460]/20 text-[#D56235] border-[#FEC460]/30"
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl hover:border-[#511A2B]/30 transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#511A2B] mb-2 line-clamp-1">{event.name}</h3>
            <p className="text-sm text-[#511A2B]/80 line-clamp-2 mb-3">{event.description}</p>
          </div>
          <Badge className={`${getTypeColor(event.type)} rounded-lg ml-2`}>{event.type}</Badge>
        </div>

        {/* Store Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#511A2B] rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-xs font-bold">{event.store.name.charAt(0)}</span>
            </div>
            <span className="text-sm font-medium text-[#511A2B]">{event.store.name}</span>
          </div>
          {event.store.rating > 0 && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="text-sm font-medium text-[#511A2B]">{event.store.rating.toFixed(1)}</span>
            </div>
          )}
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
            {event.address.city}, {event.address.state}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Users className="w-4 h-4 text-[#511A2B]/70 mr-2" />
              <span className="text-sm text-[#511A2B] font-medium">
                {event.filledSpots}/{event.totalSpots} participantes
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
            <span className="text-sm font-semibold text-[#511A2B]">{event.points} pontos</span>
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
            className="flex-1 bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={spotsLeft === 0}
            onClick={() => spotsLeft > 0 && onParticipateClick(event)}
          >
            {spotsLeft > 0 ? "Participar" : "Falar com suporte"}
          </Button>
          <Button
            variant="outline"
            className="border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10 rounded-xl"
            onClick={() => onEventClick(event)}
          >
            Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}