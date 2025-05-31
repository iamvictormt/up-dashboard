"use client"

import {
  Star,
  Clock,
  DollarSign,
  Linkedin,
  Instagram,
  Phone,
  MapPin,
  Mail,
  Calendar,
  X,
  MessageCircle,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface Professional {
  id: string
  name: string
  profession?: string
  specialty?: string
  description?: string
  phone?: string
  email?: string
  state?: string
  city?: string
  district?: string
  street?: string
  number?: string
  complement?: string | null
  zipCode?: string
  availableDays?: { dayOfWeek: string }[]
  socialMedia?: {
    linkedin?: string
    instagram?: string
    whatsapp?: string | null
  }
  rating?: number
  reviews?: number
  experience?: string
  price?: string
  avatar?: string
  available?: boolean
}

interface ProfessionalProfileModalProps {
  professional: Professional
  isOpen: boolean
  onClose: () => void
}

// Função para formatar os dias disponíveis completos
const formatAvailableDaysFull = (days?: { dayOfWeek: string }[]) => {
  if (!days || days.length === 0) return "Não disponível"

  const dayMap: Record<string, string> = {
    MONDAY: "Segunda-feira",
    TUESDAY: "Terça-feira",
    WEDNESDAY: "Quarta-feira",
    THURSDAY: "Quinta-feira",
    FRIDAY: "Sexta-feira",
    SATURDAY: "Sábado",
    SUNDAY: "Domingo",
  }

  return days.map((day) => dayMap[day.dayOfWeek] || day.dayOfWeek)
}

// Função para formatar endereço completo
const formatFullAddress = (professional: Professional) => {
  const { street, number, complement, district, city, state, zipCode } = professional

  const addressParts = [
    street && number ? `${street}, ${number}` : null,
    complement,
    district,
    city,
    state,
    zipCode,
  ].filter(Boolean)

  return addressParts.length > 0 ? addressParts.join(", ") : "Endereço não informado"
}

export function ProfessionalProfileModal({ professional, isOpen, onClose }: ProfessionalProfileModalProps) {
  const {
    name,
    profession,
    specialty,
    description,
    rating = 5.0,
    reviews = 0,
    experience = "N/A",
    price = "N/A",
    avatar,
    available = true,
    phone,
    email,
    availableDays,
    socialMedia,
  } = professional

  const availableDaysList = formatAvailableDaysFull(availableDays)
  const fullAddress = formatFullAddress(professional)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] overflow-y-auto bg-white border-[#511A2B]/20 p-0">
        <div className="sticky top-0 bg-white border-b border-[#511A2B]/10 p-4 md:p-6 z-10">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl md:text-2xl font-bold text-[#511A2B]">Perfil do Profissional</DialogTitle>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-[#511A2B]/10">
                <X className="w-5 h-5 text-[#511A2B]" />
              </Button>
            </div>
          </DialogHeader>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Header do Perfil */}
          <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-20 h-20 md:w-24 md:h-24 rounded-2xl mx-auto md:mx-0">
              <AvatarImage src={avatar || "/placeholder.svg"} />
              <AvatarFallback className="rounded-2xl bg-[#511A2B] text-white text-xl md:text-2xl">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-[#511A2B] mb-2">{name}</h2>
              <p className="text-[#FEC460] text-lg font-semibold mb-3">{profession || specialty}</p>

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-4">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-lg font-semibold text-[#511A2B]">{rating}</span>
                  <span className="text-[#511A2B]/60">({reviews} avaliações)</span>
                </div>

                <Badge
                  className={`${available ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"} rounded-lg px-3 py-1 mx-auto md:mx-0`}
                >
                  {available ? "Disponível" : "Indisponível"}
                </Badge>
              </div>

              {description && <p className="text-[#511A2B]/80 leading-relaxed text-sm md:text-base">{description}</p>}
            </div>
          </div>

          <Separator className="bg-[#511A2B]/10" />

          {/* Informações de Contato */}
          <div>
            <h3 className="text-lg font-semibold text-[#511A2B] mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Informações de Contato
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {phone && (
                <div className="flex items-center space-x-3 p-3 bg-[#511A2B]/5 rounded-xl">
                  <Phone className="w-5 h-5 text-[#511A2B]/70" />
                  <div>
                    <p className="text-sm text-[#511A2B]/70">Telefone</p>
                    <p className="font-medium text-[#511A2B]">{phone}</p>
                  </div>
                </div>
              )}

              {email && (
                <div className="flex items-center space-x-3 p-3 bg-[#511A2B]/5 rounded-xl">
                  <Mail className="w-5 h-5 text-[#511A2B]/70" />
                  <div>
                    <p className="text-sm text-[#511A2B]/70">E-mail</p>
                    <p className="font-medium text-[#511A2B] break-all">{email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-[#511A2B]/10" />

          {/* Localização */}
          <div>
            <h3 className="text-lg font-semibold text-[#511A2B] mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Localização
            </h3>

            <div className="p-4 bg-[#511A2B]/5 rounded-xl">
              <p className="text-[#511A2B] leading-relaxed text-sm md:text-base">{fullAddress}</p>
            </div>
          </div>

          <Separator className="bg-[#511A2B]/10" />

          {/* Disponibilidade */}
          <div>
            <h3 className="text-lg font-semibold text-[#511A2B] mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Disponibilidade
            </h3>

            <div className="space-y-4">
              <div className="p-3 bg-[#511A2B]/5 rounded-xl">
                <p className="text-sm text-[#511A2B]/70 mb-2">Dias Disponíveis</p>
                <div className="flex flex-wrap gap-2">
                  {availableDaysList.map((day, index) => (
                    <Badge key={index} variant="outline" className="border-[#511A2B]/30 text-[#511A2B] text-xs">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {experience && (
                  <div className="flex items-center justify-between p-3 bg-[#511A2B]/5 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-[#511A2B]/70" />
                      <span className="text-sm text-[#511A2B]/70">Experiência</span>
                    </div>
                    <span className="font-medium text-[#511A2B]">{experience}</span>
                  </div>
                )}

                {price && (
                  <div className="flex items-center justify-between p-3 bg-[#511A2B]/5 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-[#511A2B]/70" />
                      <span className="text-sm text-[#511A2B]/70">Valor da Consulta</span>
                    </div>
                    <span className="font-semibold text-[#511A2B] text-lg">{price}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          {socialMedia && Object.values(socialMedia).some(Boolean) && (
            <>
              <Separator className="bg-[#511A2B]/10" />
              <div>
                <h3 className="text-lg font-semibold text-[#511A2B] mb-4">Redes Sociais</h3>

                <div className="flex flex-wrap gap-3">
                  {socialMedia.linkedin && (
                    <Button
                      variant="outline"
                      className="border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10 rounded-xl flex-1 md:flex-none"
                      onClick={() => window.open(socialMedia.linkedin, "_blank")}
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                  )}

                  {socialMedia.instagram && (
                    <Button
                      variant="outline"
                      className="border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10 rounded-xl flex-1 md:flex-none"
                      onClick={() =>
                        window.open(`https://instagram.com/${socialMedia.instagram.replace("@", "")}`, "_blank")
                      }
                    >
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram
                    </Button>
                  )}

                  {socialMedia.whatsapp && (
                    <Button
                      variant="outline"
                      className="border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10 rounded-xl flex-1 md:flex-none"
                      onClick={() => window.open(`https://wa.me/${socialMedia.whatsapp}`, "_blank")}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator className="bg-[#511A2B]/10" />

          {/* Ações */}
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 pt-4">
            <Button
              className="flex-1 bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl py-3"
              disabled={!available}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Agendar Consulta
            </Button>

            {phone && (
              <Button
                variant="outline"
                className="border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10 rounded-xl"
                onClick={() => window.open(`tel:${phone}`, "_blank")}
              >
                <Phone className="w-4 h-4 mr-2" />
                Ligar
              </Button>
            )}

            {email && (
              <Button
                variant="outline"
                className="border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10 rounded-xl"
                onClick={() => window.open(`mailto:${email}`, "_blank")}
              >
                <Mail className="w-4 h-4 mr-2" />
                E-mail
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
