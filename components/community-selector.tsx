"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search, X, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Community {
  id: string
  name: string
  description?: string
  memberCount: number
  imageUrl?: string
  color?: string
}

interface CommunitySelectorProps {
  communities: Community[]
  selectedCommunity: Community | null
  onChange: (community: Community | null) => void
}

export function CommunitySelector({ communities, selectedCommunity, onChange }: CommunitySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll)
      // Check initial scroll state
      handleScroll()
      return () => scrollContainer.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  return (
    <div className="relative">
      {/* Barra de pesquisa */}
      {showSearch ? (
        <div className="mb-4 flex items-center space-x-2">
          <Input
            placeholder="Buscar comunidades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-[#511A2B]/20 focus:border-[#511A2B]"
            autoFocus
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setShowSearch(false)
              setSearchQuery("")
            }}
            className="border-[#511A2B]/20 text-[#511A2B]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-[#511A2B]">Comunidades</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSearch(true)}
            className="border-[#511A2B]/20 text-[#511A2B]"
          >
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
      )}

      {/* Controles de navegação */}
      <div className="relative">
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 shadow-md hover:bg-white"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        {canScrollRight && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 shadow-md hover:bg-white"
            onClick={scrollRight}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}

        {/* Container de rolagem horizontal */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Opção para todos os posts */}
          <div className="snap-start shrink-0 mr-3">
            <Link href="/timeline">
              <Button
                variant={selectedCommunity === null ? "default" : "outline"}
                className={cn(
                  "h-auto py-3 px-4 flex flex-col items-center justify-center min-w-[120px] border-2",
                  selectedCommunity === null
                    ? "bg-[#511A2B] text-white border-[#511A2B]"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#511A2B]/50",
                )}
                onClick={() => onChange(null)}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#511A2B] to-[#8B4367] flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">Todas</span>
                <span className="text-xs opacity-70">Timeline</span>
              </Button>
            </Link>
          </div>

          {/* Cards de comunidades */}
          {filteredCommunities.map((community) => {
            const isSelected = selectedCommunity?.id === community.id
            const bgColor = community.color || "#511A2B"

            return (
              <div key={community.id} className="snap-start shrink-0 mr-3">
                <Link href={`/community/${community.id}`}>
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "h-auto py-3 px-4 flex flex-col items-center justify-center min-w-[120px] border-2",
                      isSelected
                        ? `bg-[${bgColor}] text-white border-[${bgColor}]`
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#511A2B]/50",
                    )}
                    onClick={() => onChange(community)}
                  >
                    {community.imageUrl ? (
                      <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 overflow-hidden mb-2">
                        <img
                          src={community.imageUrl || "/placeholder.svg"}
                          alt={community.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                        style={{ backgroundColor: bgColor }}
                      >
                        <span className="text-white font-bold text-lg">{community.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <span className="text-sm font-medium truncate max-w-[100px]">{community.name}</span>
                    <span className="text-xs opacity-70 flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {community.memberCount}
                    </span>
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
