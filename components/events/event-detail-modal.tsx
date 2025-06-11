"use client"

import { X, Calendar, MapPin, Users, Award, Clock, Star, Building, Phone, Mail } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

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

interface EventDetailModalProps {
  event: Event
  onClose: () => void
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      fullDate: date.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const { fullDate, time } = formatDate(event.date)
  const progressPercentage = (event.filledSpots / event.totalSpots) * 100
  const spotsLeft = event.totalSpots - event.filledSpots

  const formatFullAddress = () => {
    const { street, number, complement, district, city, state, zipCode } = event.address
    const addressParts = [
      street && number ? `${street}, ${number}` : null,
      complement,
      district,
      city,
      state,
      zipCode,
    ].filter(Boolean)
    return addressParts.join(", ")
  }

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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[90vh] overflow-y-auto bg-white border-[#511A2B]/20 p-0">
        <DialogHeader className="sticky top-0 bg-white border-b border-[#511A2B]/10 p-6 z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl md:text-2xl font-bold text-[#511A2B]">Detalhes do Evento</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-[#511A2B]/10">
              <X className="w-5 h-5 text-[#511A2B]" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Header do Evento */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-3">{event.name}</h1>
                <Badge className={`${getTypeColor(event.type)} rounded-lg text-sm px-3 py-1`}>{event.type}</Badge>
              </div>
              <div className="text-center md:text-right">
                <div className="text-3xl font-bold text-[#511A2B]">{event.points}</div>
                <div className="text-sm text-[#511A2B]/70">pontos de recompensa</div>
              </div>
            </div>

            <p className="text-[#511A2B]/80 leading-relaxed text-base">{event.description}</p>
          </div>

          <Separator className="bg-[#511A2B]/10" />

          {/* Informações da Loja */}
          <div>
            <h3 className="text-lg font-semibold text-[#511A2B] mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Organizador
            </h3>
            <div className="flex items-center space-x-4 p-4 bg-[#511A2B]/5 rounded-xl">
              <div className="w-12 h-12 bg-[#511A2B] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">{event.store.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#511A2B]">{event.store.name}</h4>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm text-[#511A2B]">{event.store.rating.toFixed(1)} avaliação</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-[#511A2B]/10" />

          {/* Data e Horário */}
          <div>
            <h3 className="text-lg font-semibold text-[#511A2B] mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Data e Horário
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#511A2B]/5 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-[#511A2B]/70" />
                  <span className="text-sm text-[#511A2B]/70">Data</span>
                </div>
                <p className="font-semibold text-[#511A2B] capitalize">{fullDate}</p>
              </div>
              <div className="p-4 bg-[#511A2B]/5 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-[#511A2B]/70" />
                  <span className="text-sm text-[#511A2B]/70">Horário</span>
                </div>
                <p className="font-semibold text-[#511A2B]">{time}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-[#511A2B]/10" />

          {/* Local */}
          <div>
            <h3 className="text-lg font-semibold text-[#511A2B] mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Local do Evento
            </h3>
            <div className="p-4 bg-[#511A2B]/5 rounded-xl">
              <p className="text-[#511A2B] leading-relaxed">{formatFullAddress()}</p>
            </div>
          </div>

          <Separator className="bg-[#511A2B]/10" />

          {/* Vagas */}
          <div>
            <h3 className="text-lg font-semibold text-[#511A2B] mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Participantes
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[#511A2B]">
                  {event.filledSpots} de {event.totalSpots} vagas preenchidas
                </span>
                <Badge
                  className={`${
                    spotsLeft > 0
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-red-100 text-red-700 border-red-200"
                  } rounded-lg`}
                >
                  {spotsLeft > 0 ? `${spotsLeft} vagas restantes` : "Lotado"}
                </Badge>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </div>

          <Separator className="bg-[#511A2B]/10" />

          {/* Recompensas */}
          <div>
            <h3 className="text-lg font-semibold text-[#511A2B] mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Recompensas
            </h3>
            <div className="p-4 bg-gradient-to-r from-[#FEC460]/20 to-[#D56235]/20 rounded-xl border border-[#FEC460]/30">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#FEC460] rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#511A2B]" />
                </div>
                <div>
                  <p className="font-semibold text-[#511A2B]">{event.points} pontos</p>
                  <p className="text-sm text-[#511A2B]/70">Ganhe pontos ao participar do evento</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 pt-4">
            <Button
              className="flex-1 bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl py-3"
              disabled={spotsLeft === 0}
            >
              {spotsLeft > 0 ? (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Participar do Evento
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Entrar na Lista de Espera
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
