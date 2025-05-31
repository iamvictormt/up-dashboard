"use client"

import { useState, useEffect } from "react"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Event {
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

const mockEvents: Event[] = [
  {
    id: "1ca62497-f22f-4aa0-8d56-3fa724bf3217",
    name: "Conferência de Tecnologia 2025",
    description: "O maior evento de tecnologia do ano com palestrantes renomados",
    date: "2025-09-15T09:00:00.000Z",
    type: "Conferência",
    points: 100,
    totalSpots: 500,
    filledSpots: 342,
    address: {
      id: "669b752d-5522-4f81-9314-a50135312ade",
      state: "SP",
      city: "São Paulo",
      district: "Vila Olímpia",
      street: "Av. das Nações Unidas",
      complement: "Centro de Convenções",
      number: "12901",
      zipCode: "04578-000",
    },
    store: {
      id: "d8821412-3cfc-4e1b-987b-b0760fe6240d",
      name: "Super Soluções",
      description: null,
      website: null,
      rating: 4.2,
      openingHours: null,
      addressId: "c9af52cc-4739-4f3e-a62a-399ca480ffc5",
      partnerId: "5527e77a-d669-4872-b4c9-a46768c32f0e",
    },
    participants: [],
  },
  {
    id: "2ba51396-e11e-3bb9-7c45-2ea613ae2f06",
    name: "Meetup de Desenvolvedores",
    description: "Encontro mensal da comunidade de desenvolvedores locais",
    date: "2025-07-20T19:00:00.000Z",
    type: "Meetup",
    points: 25,
    totalSpots: 80,
    filledSpots: 65,
    address: {
      id: "559a641c-4411-3e70-8203-a40024201bcd",
      state: "RJ",
      city: "Rio de Janeiro",
      district: "Botafogo",
      street: "Praia de Botafogo",
      complement: "Coworking Tech",
      number: "300",
      zipCode: "22250-040",
    },
    store: {
      id: "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
      name: "TechnoMax",
      description: null,
      website: null,
      rating: 4.8,
      openingHours: null,
      addressId: "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
      partnerId: "7f3a9b2c-8e4d-4a1b-9c5e-6f7a8b9c0d1e",
    },
    participants: [],
  },
  {
    id: "3ca40285-d00d-2aa8-6b34-1da502ad1e95",
    name: "Hackathon Sustentabilidade",
    description: "48 horas criando soluções para um mundo mais sustentável",
    date: "2025-08-05T08:00:00.000Z",
    type: "Hackathon",
    points: 150,
    totalSpots: 120,
    filledSpots: 89,
    address: {
      id: "448a530b-3300-2d5f-7102-a30013100abc",
      state: "MG",
      city: "Belo Horizonte",
      district: "Funcionários",
      street: "Av. do Contorno",
      complement: "Innovation Hub",
      number: "4747",
      zipCode: "30110-017",
    },
    store: {
      id: "q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6",
      name: "EcoVerde",
      description: null,
      website: null,
      rating: 4.5,
      openingHours: null,
      addressId: "q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6",
      partnerId: "9a8b7c6d-5e4f-3g2h-1i0j-k9l8m7n6o5p4",
    },
    participants: [],
  },
]

export function EventsContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [events, setEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(mockEvents)
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-2">Eventos</h1>
            <p className="text-[#511A2B]/70">Descubra e participe dos melhores eventos da comunidade</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#511A2B]/50 w-4 h-4" />
              <Input
                placeholder="Buscar eventos..."
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
                <div className="text-2xl font-bold text-[#511A2B]">{events.length}</div>
                <div className="text-sm text-[#511A2B]/70">Total Eventos</div>
              </div>
              <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {events.filter((e) => e.filledSpots < e.totalSpots).length}
                </div>
                <div className="text-sm text-[#511A2B]/70">Com Vagas</div>
              </div>
              <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                <div className="text-2xl font-bold text-[#FEC460]">
                  {Math.round(events.reduce((acc, e) => acc + e.points, 0) / events.length)}
                </div>
                <div className="text-sm text-[#511A2B]/70">Pontos Médios</div>
              </div>
              <div className="bg-white/80 rounded-2xl p-4 border border-[#511A2B]/10 shadow-sm">
                <div className="text-2xl font-bold text-[#D56235]">
                  {events.reduce((acc, e) => acc + e.filledSpots, 0)}
                </div>
                <div className="text-sm text-[#511A2B]/70">Participantes</div>
              </div>
            </>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-[#511A2B] animate-spin mb-4" />
            <p className="text-[#511A2B] text-lg font-medium">Carregando eventos...</p>
            <p className="text-[#511A2B]/70 text-sm">Buscando os melhores eventos para você</p>
          </div>
        ) : (
          /* Events Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {!isLoading && filteredEvents.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-[#511A2B] text-lg font-medium mb-2">Nenhum evento encontrado</p>
            <p className="text-[#511A2B]/70">Tente ajustar sua busca ou remover os filtros</p>
          </div>
        )}
      </div>
    </div>
  )
}
