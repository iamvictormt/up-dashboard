"use client"

import { useState } from "react"
import { X, Users, Calendar, MapPin, Award, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { registerInEvent } from "@/lib/event-api"

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

interface EventConfirmationModalProps {
  event: Event
  professionalId: string
  onClose: () => void
  onSuccess: () => void
}

export function EventConfirmationModal({ 
  event, 
  professionalId, 
  onClose, 
  onSuccess 
}: EventConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatAddress = () => {
    const { street, number, district, city, state } = event.address
    return `${street}, ${number} - ${district}, ${city}/${state}`
  }

  const handleConfirmParticipation = async () => {
    try {
      setIsLoading(true)
      await registerInEvent(event.id, {professionalId})
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Erro ao confirmar participação:", error)
      // Aqui você pode adicionar uma notificação de erro
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md bg-white border-[#511A2B]/20 p-0">
        <DialogHeader className="bg-white border-b border-[#511A2B]/10 p-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold text-[#511A2B]">
              Confirmar Participação
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
              <X className="w-4 h-4 text-[#511A2B]" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Resumo do Evento */}
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-[#511A2B] text-lg">{event.name}</h3>
            <p className="text-sm text-[#511A2B]/70">
              Você está prestes a se inscrever neste evento
            </p>
          </div>

          {/* Detalhes Resumidos */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-[#511A2B]/5 rounded-xl">
              <Calendar className="w-5 h-5 text-[#511A2B]/70" />
              <div>
                <p className="font-medium text-[#511A2B] text-sm">
                  {formatDate(event.date)}
                </p>
                <p className="text-xs text-[#511A2B]/70">
                  às {formatTime(event.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-[#511A2B]/5 rounded-xl">
              <MapPin className="w-5 h-5 text-[#511A2B]/70" />
              <div>
                <p className="font-medium text-[#511A2B] text-sm">
                  {event.store.name}
                </p>
                <p className="text-xs text-[#511A2B]/70">
                  {formatAddress()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-[#FEC460]/20 to-[#D56235]/20 rounded-xl border border-[#FEC460]/30">
              <Award className="w-5 h-5 text-[#D56235]" />
              <div>
                <p className="font-medium text-[#511A2B] text-sm">
                  {event.points} pontos de recompensa
                </p>
                <p className="text-xs text-[#511A2B]/70">
                  Ganhe pontos ao participar
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-[#511A2B]/5 rounded-xl">
              <Users className="w-5 h-5 text-[#511A2B]/70" />
              <div>
                <p className="font-medium text-[#511A2B] text-sm">
                  {event.totalSpots - event.filledSpots} vagas restantes
                </p>
                <p className="text-xs text-[#511A2B]/70">
                  de {event.totalSpots} vagas totais
                </p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex space-x-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10 rounded-xl"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl"
              onClick={handleConfirmParticipation}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Confirmando...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Confirmar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}