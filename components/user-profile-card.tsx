"use client"

import { User, Crown, Star, TrendingUp, Settings } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { Skeleton } from "@/components/ui/skeleton"
import { ProfileEditModal } from "@/components/profile-edit-modal"
import { useState } from "react"

export function UserProfileCard() {
  const { user, isLoading } = useUser()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  if (isLoading) {
    return (
      <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return null
  }

  // Função para obter o nome do usuário baseado no tipo
  const getUserName = () => {
    if (user.professional) return user.professional.name
    if (user.partnerSupplier) return user.partnerSupplier.tradeName
    if (user.loveDecoration) return user.loveDecoration.name
    return "Usuário"
  }

  // Função para obter as iniciais
  const getUserInitials = () => {
    const name = getUserName()
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  // Função para obter o tipo de usuário
  const getUserType = () => {
    if (user.professional) return `${user.professional.profession} • ${user.professional.level}`
    if (user.partnerSupplier) return "Fornecedor Parceiro"
    if (user.loveDecoration) return "Love Decoration"
    return "Usuário"
  }

  return (
    <>
      <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={user.professional?.profileImage || user.partnerSupplier?.profileImage || "/placeholder.svg"}
                />
                <AvatarFallback className="bg-[#511A2B] text-white text-lg">{getUserInitials()}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-[#511A2B] text-lg">{getUserName()}</h3>
                  {user.professional?.verified && <Crown className="w-4 h-4 text-yellow-500" />}
                </div>
                <p className="text-[#511A2B]/70 text-sm">{user.email}</p>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 rounded-lg mt-2">
                  {getUserType()}
                </Badge>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="text-[#511A2B] hover:bg-[#511A2B]/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center mb-1">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="font-semibold text-[#511A2B]">
                  {user.professional?.points?.toLocaleString() 
                  // || stats.points.toLocaleString()
                  }
                </span>
              </div>
              <p className="text-xs text-[#511A2B]/70">Pontos</p>
            </div>

            <div>
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="font-semibold text-[#511A2B]">
                  {/* {stats.successRate} */}
                  %</span>
              </div>
              <p className="text-xs text-[#511A2B]/70">Sucesso</p>
            </div>

            <div>
              <div className="flex items-center justify-center mb-1">
                <User className="w-4 h-4 text-blue-500 mr-1" />
                <span className="font-semibold text-[#511A2B]">
                  {/* {stats.certificates} */}
                  </span>
              </div>
              <p className="text-xs text-[#511A2B]/70">Certificados</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProfileEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </>
  )
}
