'use client';

import { LogOut, User, Menu, X, ImageIcon, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/contexts/user-context';
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

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  const getUserName = () => {
    if (!user) return 'Usuário';
    if (user.professional) return user.professional.name;
    if (user.partnerSupplier) return user.partnerSupplier.tradeName;
    if (user.loveDecoration) return user.loveDecoration.name;
    return user.email.split('@')[0];
  };

  const getProfileImage = () => user?.profileImage || '/placeholder.svg';

  const getUserType = () => {
    if (user?.professional) return `${user.professional.profession.name}`;
    if (user?.partnerSupplier) return 'Fornecedor Parceiro';
    if (user?.loveDecoration) return 'Eu amo decoração';
    return 'Usuário';
  };

  // padding menor no mobile, mais espaçado no desktop
  const headerClasses = `
    fixed top-0 z-40 flex items-center justify-between
    bg-background transition-all duration-300 w-full left-0
    px-5 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5
    h-[72px] sm:h-[80px] md:h-[10vh]
    ${isSidebarExpanded ? 'md:left-72 md:w-[calc(100%-18rem)]' : 'md:left-24 md:w-[calc(100%-6rem)]'}
    shadow-sm border-b border-white/5
  `;

  if (isLoading) return null;

  // --------------------
  // HEADER SEM USUÁRIO
  // --------------------
  if (!user) {
    return (
      <>
        <header className={headerClasses}>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10 rounded-xl"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          <h1 className="text-lg font-semibold text-white">UP Connection</h1>

          <span className="text-xs text-white/70">Acesso restrito</span>
        </header>

        <div className="md:hidden">
          <AppSidebar isMobileOpen={isMobileMenuOpen} onToggleMobile={toggleMobileMenu} />
        </div>
      </>
    );
  }

  // --------------------
  // HEADER COM USUÁRIO
  // --------------------
  return (
    <>
      <header className={headerClasses}>
        {/* BOTÃO MOBILE MENU */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-200 hover:text-white hover:bg-white/10 rounded-xl"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        {/* LOGO / NOME */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
          <h1 className="text-lg sm:text-xl font-semibold text-white leading-tight">UP Connection</h1>
          <p className="text-[12px] sm:text-sm text-white/70 hidden sm:block">{getUserType()}</p>
        </div>

        {/* ÍCONES E PERFIL */}
        <div className="flex items-center gap-2 sm:gap-4">
          <NotificationsDropdown />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-center gap-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl px-3 sm:px-5 py-2 sm:py-3"
              >
                <span className="hidden sm:inline text-sm font-semibold">Olá, {getUserName().split(' ')[0]}</span>
                <img
                  src={getProfileImage()}
                  alt="profile"
                  className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-full border border-white/20"
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 bg-white border-[#511A2B]/20" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-[#511A2B] truncate">{getUserName()}</p>
                  <p className="text-xs text-[#511A2B]/70 truncate">{user.email}</p>
                  <p className="text-xs text-[#511A2B]/50">{getUserType()}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#511A2B]/10" />

              <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)} className="text-[#511A2B]">
                <User className="mr-2 h-4 w-4" />
                Alterar Perfil
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setIsImageModalOpen(true)} className="text-[#511A2B]">
                <ImageIcon className="mr-2 h-4 w-4" />
                Alterar Imagem
              </DropdownMenuItem>

              {user.partnerSupplier && (
                <>
                  <DropdownMenuItem onClick={() => setIsPlanModalOpen(true)} className="text-[#511A2B]">
                    <Coins className="mr-2 h-4 w-4" />
                    Minha Assinatura
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#511A2B]/10" />
                </>
              )}

              <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Modais */}
      {isPlanModalOpen && <MyPlanModal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} />}
      {isProfileModalOpen && <UserEditModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />}
      {isImageModalOpen && <UserImageModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} />}

      {/* Sidebar Mobile */}
      <div className="md:hidden">
        <AppSidebar isMobileOpen={isMobileMenuOpen} onToggleMobile={toggleMobileMenu} />
      </div>
    </>
  );
}
