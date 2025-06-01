"use client"

import { Bell, LogOut, User, Settings, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/contexts/user-context"
import { Skeleton } from "@/components/ui/skeleton"
import { appUrl } from "@/constants/appRoutes"

export function DashboardHeader() {
  const { user, isLoading, logout, refreshUser } = useUser()

  const handleLogout = () => {
    logout()
    // Redirecionar para página de login se necessário
    window.location.href = appUrl.login
  }

  const handleRefresh = async () => {
    await refreshUser()
  }

  if (isLoading) {
    return (
      <>
        {/* Elemento de curvatura - apenas desktop */}
      <div className="fixed top-0 left-72 z-30 hidden md:block transition-all duration-300 peer-data-[state=collapsed]:left-24 mt-[64px]">
        <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 V0 H100 A100,100 0 0 0 0,100" fill="#46142B" />
        </svg>
      </div>

        <header className="fixed top-0 z-40 h-16 flex items-center justify-between bg-background transition-all duration-300 w-full left-0 px-4 md:px-6 md:left-72 md:w-[calc(100%-18rem)] md:peer-data-[state=collapsed]:left-24 md:peer-data-[state=collapsed]:w-[calc(100%-6rem)]">
          <div className="flex items-center space-x-4 ml-12 md:ml-0">
            <Skeleton className="h-6 w-32 bg-white/20" />
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Skeleton className="h-8 w-8 rounded-xl bg-white/20" />
            <Skeleton className="h-8 w-24 rounded-xl bg-white/20" />
            <Skeleton className="h-8 w-8 rounded-full bg-white/20" />
          </div>
        </header>
      </>
    )
  }

  if (!user) {
    return (
      <>
        {/* Elemento de curvatura - apenas desktop */}
      <div className="fixed top-0 left-72 z-30 hidden md:block transition-all duration-300 peer-data-[state=collapsed]:left-24 mt-[64px]">
        <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 V0 H100 A100,100 0 0 0 0,100" fill="#46142B" />
        </svg>
      </div>

        <header className="fixed top-0 z-40 h-16 flex items-center justify-between bg-background transition-all duration-300 w-full left-0 px-4 md:px-6 md:left-72 md:w-[calc(100%-18rem)] md:peer-data-[state=collapsed]:left-24 md:peer-data-[state=collapsed]:w-[calc(100%-6rem)]">
        </header>
      </>
    )
  }

  return (
    <>
      {/* Elemento de curvatura - apenas desktop */}
      <div className="fixed top-0 left-72 z-30 hidden md:block transition-all duration-300 peer-data-[state=collapsed]:left-24 mt-[64px]">
        <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 V0 H100 A100,100 0 0 0 0,100" fill="#46142B" />
        </svg>
      </div>

      <header className="fixed top-0 z-40 h-16 flex items-center justify-between bg-background transition-all duration-300 w-full left-0 px-4 md:px-6 md:left-72 md:w-[calc(100%-18rem)] md:peer-data-[state=collapsed]:left-24 md:peer-data-[state=collapsed]:w-[calc(100%-6rem)]">
        <div className="flex items-center space-x-4 ml-12 md:ml-0">
          <h1 className="text-lg md:text-xl font-semibold text-white">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-white hover:bg-white/10"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 md:w-5 md:h-5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-xl text-white hover:bg-white/10">
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-white hover:bg-white/10 rounded-xl p-2"
              >
                <span className="text-sm hidden sm:inline">Olá, {user?.professional?.name?.split(" ")[0]} 👋</span>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.professional?.profileImage || "/placeholder.svg"} />
                  <AvatarFallback className="bg-[#FEC460] text-[#511A2B] font-semibold">
                    {user?.professional?.name?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border-[#511A2B]/20" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-[#511A2B]">{user?.professional?.name}</p>
                  <p className="text-xs text-[#511A2B]/70">{user?.email}</p>
                  <p className="text-xs text-[#511A2B]/50">Plano: {user?.plan?.name}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#511A2B]/10" />
              <DropdownMenuItem className="text-[#511A2B] hover:bg-[#511A2B]/10 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Alterar Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#511A2B] hover:bg-[#511A2B]/10 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#511A2B]/10" />
              <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  )
}
