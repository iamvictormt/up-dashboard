'use client';

import { LogOut, User, Settings, Menu, X, ImageIcon, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
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
import { useState } from 'react';
import { AppSidebar } from './app-sidebar';
import { NotificationsDropdown } from './notifications-dropdown';
import { UserEditModal } from './user/user-edit-modal';
import { UserImageModal } from './user/user-image-modal';
import { MyPlanModal } from './plans/my-plan-modal';

interface DashboardHeaderProps {
  isSidebarExpanded?: boolean;
}

export function DashboardHeader({ isSidebarExpanded = true }: DashboardHeaderProps) {
  const { user, isLoading, logout } = useUser();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
    return user?.profileImage || '/placeholder.svg';
  };

  const getUserType = () => {
    if (user?.professional) {
      return `${user.professional.profession.name}`;
    } else if (user?.partnerSupplier) {
      return 'Fornecedor Parceiro';
    } else if (user?.loveDecoration) {
      return 'Eu amo decoração';
    }
    return 'Usuário';
  };

  // Classes dinâmicas para o header baseadas no estado da sidebar
  const headerClasses = `fixed top-0 z-40 h-[10vh] flex items-center justify-between bg-[#46142b] transition-all duration-300 w-full left-0 px-4 md:px-6 ${
    isSidebarExpanded ? 'md:left-72 md:w-[calc(100%-18rem)]' : 'md:left-24 md:w-[calc(100%-6rem)]'
  }`;

  if (isLoading) {
    return (
      <>
        <header className={headerClasses}>
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
        <header className={headerClasses}>
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="lg"
            className="md:hidden text-white hover:bg-white/10 rounded-xl mr-2"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          <div className="flex items-center space-x-4">
            <h1 className="text-lg md:text-xl font-semibold text-white">UP Connection</h1>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="text-white/70 text-sm">Acesso restrito</div>
          </div>
        </header>

        {/* Mobile Sidebar - apenas visível em mobile */}
        <div className="md:hidden">
          <AppSidebar isMobileOpen={isMobileMenuOpen} onToggleMobile={toggleMobileMenu} />
        </div>
      </>
    );
  }

  return (
    <>
      <header className={headerClasses}>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="lg"
          className="md:hidden rounded-xl text-gray-300 hover:text-white hover:bg-white/10 p-8 md:p-6"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        <div className="flex items-center space-x-4">
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
                <span className="hidden sm:inline text-md font-bold md:mr-2">Olá, {getUserName().split(' ')[0]}</span>
                <img
                  src={getProfileImage() || '/placeholder.svg'}
                  alt="profileImage"
                  className="w-10 h-10 object-cover rounded-full"
                />
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
              <DropdownMenuItem
                className="text-[#511A2B] hover:bg-[#511A2B]/10 cursor-pointer"
                onClick={() => setIsImageModalOpen(true)}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                <span>Alterar imagem de perfil</span>
              </DropdownMenuItem>
              {user.partnerSupplier && (
                <>
                  <DropdownMenuItem
                    className="text-[#511A2B] hover:bg-[#511A2B]/10 cursor-pointer"
                    onClick={() => setIsPlanModalOpen(true)}
                  >
                    <Coins className="mr-2 h-4 w-4" />
                    <span>Minha assinatura</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#511A2B]/10" />
                </>
              )}
              <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Modal de Meu Plano */}
      {isPlanModalOpen && <MyPlanModal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} />}

      {/* Modal de Edição de Perfil */}
      {isProfileModalOpen && <UserEditModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />}

      {/* Modal de Edição de Imagem */}
      {isImageModalOpen && <UserImageModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} />}

      {/* Mobile Sidebar - apenas visível em mobile */}
      <div className="md:hidden">
        <AppSidebar isMobileOpen={isMobileMenuOpen} onToggleMobile={toggleMobileMenu} />
      </div>
    </>
  );
}
