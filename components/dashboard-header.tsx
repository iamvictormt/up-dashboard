'use client';

import { LogOut, User, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/contexts/user-context';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileEditModal } from '@/components/profile-edit-modal';
import { useState } from 'react';
import { NotificationsDropdown } from './notifications-dropdown';

export function DashboardHeader() {
  const { user, isLoading, logout } = useUser();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getUserName = () => {
    if (!user) return 'Usuário';

    if (user.professional) {
      return user.professional.name;
    } else if (user.partnerSupplier) {
      return user.partnerSupplier.tradeName;
    } else if (user.loveDecoration) {
      return user.loveDecoration.name;
    }

    return user.email.split('@')[0];
  };

  const getProfileImage = () => {
    if (user?.profileImage) {
      return user.profileImage;
    }
    return '/placeholder.svg';
  };

  const getUserType = () => {
    if (user?.professional) {
      return `${user.professional.profession} • ${user.professional.level}`;
    } else if (user?.partnerSupplier) {
      return 'Fornecedor Parceiro';
    } else if (user?.loveDecoration) {
      return 'Eu amo decoração';
    }
    return 'Usuário';
  };

  if (isLoading) {
    return (
      <>
        {/* Elemento de curvatura - apenas desktop */}
        {/* <div className="fixed top-0 left-72 z-30 hidden md:block transition-all duration-300 peer-data-[state=collapsed]:left-24 hidden">
          <svg width="32" height="64" viewBox="0 0 32 64" fill="none" className="block">
            <path d="M0 0H32C32 35.346 3.346 64 0 64V0Z" fill="#FFEDC1" />
          </svg>
        </div> */}

        <header className="fixed top-0 z-40 h-[10vh] flex items-center justify-between bg-[#46142b] transition-all duration-300 w-full left-0 px-4 md:px-6 md:left-72 md:w-[calc(100%-18rem)] md:peer-data-[state=collapsed]:left-24 md:peer-data-[state=collapsed]:w-[calc(100%-6rem)]">
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
    );
  }

  if (!user) {
    return (
      <>
        {/* Elemento de curvatura - apenas desktop */}
        {/* <div className="fixed top-0 left-72 z-30 hidden md:block transition-all duration-300 peer-data-[state=collapsed]:left-24">
          <svg width="32" height="64" viewBox="0 0 32 64" fill="none" className="block">
            <path d="M0 0H32C32 35.346 3.346 64 0 64V0Z" fill="#FFEDC1" />
          </svg>
        </div> */}

        <header className="fixed top-0 z-40 h-[10vh] flex items-center justify-between bg-[#46142b] transition-all duration-300 w-full left-0 px-4 md:px-6 md:left-72 md:w-[calc(100%-18rem)] md:peer-data-[state=collapsed]:left-24 md:peer-data-[state=collapsed]:w-[calc(100%-6rem)]">
          <div className="flex items-center space-x-4 ml-12 md:ml-0">
            <h1 className="text-lg md:text-xl font-semibold text-white">UP Connection</h1>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="text-white/70 text-sm">Acesso restrito</div>
          </div>
        </header>
      </>
    );
  }

  return (
    <>
      {/* Elemento de curvatura - apenas desktop */}
      {/* <div className="fixed top-0 left-72 z-30 hidden md:block transition-all duration-300 peer-data-[state=collapsed]:left-24">
        <svg width="32" height="64" viewBox="0 0 32 64" fill="none" className="block">
          <path d="M0 0H32C32 35.346 3.346 64 0 64V0Z" fill="#FFEDC1" />
        </svg>
      </div> */}

      <header className="fixed top-0 z-40 h-[10vh] flex items-center justify-between bg-[#46142b] transition-all duration-300 w-full left-0 px-4 md:px-6 md:left-72 md:w-[calc(100%-18rem)] md:peer-data-[state=collapsed]:left-24 md:peer-data-[state=collapsed]:w-[calc(100%-6rem)]">
        <div className="flex items-center space-x-4 ml-12 md:ml-0">
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-semibold text-white">UP Connection</h1>
            <p className="text-xs text-white/70 hidden md:block">{getUserType()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <NotificationsDropdown />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center text-gray-300 hover:text-white hover:bg-white/10 rounded-xl p-8 md:p-6"
              >
                <span className="text-sm hidden sm:inline">{getUserName().split(' ')[0]}</span>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={getProfileImage() || '/placeholder.svg'} />
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border-[#511A2B]/20" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-xs font-medium text-[#511A2B]">{getUserName()}</p>
                  <p className="text-xs text-[#511A2B]/70">{user.email}</p>
                  <p className="text-xs text-[#511A2B]/50">{getUserType()}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#511A2B]/10" />
              <DropdownMenuItem
                className="text-[#511A2B] hover:bg-[#511A2B]/10 cursor-pointer"
                onClick={() => setIsProfileModalOpen(true)}
              >
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

      {/* Modal de Edição de Perfil */}

      {isProfileModalOpen && (
        <ProfileEditModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      )}
    </>
  );
}
