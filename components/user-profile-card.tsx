"use client"

import { User, Crown, Star, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser, usePlan, useUserStats } from "@/contexts/user-context"
import { Skeleton } from "@/components/ui/skeleton"

export function UserProfileCard() {
  const { user, isLoading } = useUser()
  const { plan } = usePlan()
  const { stats } = useUserStats()

  if (isLoading) {
    return (
      <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-16 h-16 rounded-2xl" />
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

  if (!user || !plan || !stats) {
    return null
  }

  return (
    <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="w-16 h-16 rounded-2xl">
            <AvatarImage src={user.avatar || "/placeholder.svg"} />
            <AvatarFallback className="rounded-2xl bg-[#511A2B] text-white text-lg">
              {user?.professional?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-[#511A2B] text-lg">{user.name}</h3>
              {plan.features.badge && <Crown className="w-4 h-4 text-yellow-500" />}
            </div>
            <p className="text-[#511A2B]/70 text-sm">{user.email}</p>
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 rounded-lg mt-2">{plan.name}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center mb-1">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="font-semibold text-[#511A2B]">{stats.points.toLocaleString()}</span>
            </div>
            <p className="text-xs text-[#511A2B]/70">Pontos</p>
          </div>

          <div>
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="font-semibold text-[#511A2B]">{stats.successRate}%</span>
            </div>
            <p className="text-xs text-[#511A2B]/70">Sucesso</p>
          </div>

          <div>
            <div className="flex items-center justify-center mb-1">
              <User className="w-4 h-4 text-blue-500 mr-1" />
              <span className="font-semibold text-[#511A2B]">{stats.certificates}</span>
            </div>
            <p className="text-xs text-[#511A2B]/70">Certificados</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
