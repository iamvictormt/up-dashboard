'use client';

import { LogOut, User, Menu, X, ImageIcon, Coins, Settings } from 'lucide-react';
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
import { cn } from '@/lib/utils';

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
    if (user?.partnerSupplier) return 'Lojista Parceiro';
    if (user?.loveDecoration) return 'Eu amo decoração';
    return 'Usuário';
  };

  const headerClasses = cn(
    'fixed top-0 z-40 flex items-center justify-between',
    'bg-background backdrop-blur-sm bg-opacity-95',
    'transition-all duration-300 w-full left-0',
    'px-4 sm:px-6 lg:px-8',
    'h-16 lg:h-[72px]',
    'border-b border-white/10',
    isSidebarExpanded ? 'lg:left-72 lg:w-[calc(100%-18rem)]' : 'lg:left-24 lg:w-[calc(100%-6rem)]'
  );

  if (isLoading) return null;

  // Header sem usuário
  if (!user) {
    return (
      <>
        <header className={headerClasses}>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white/90 hover:text-white hover:bg-white/10"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-white font-bold text-sm">UP</span>
            </div>
            <h1 className="text-lg font-semibold text-white hidden sm:block">UP Connection</h1>
          </div>

          <span className="text-xs text-white/60 font-medium">Acesso restrito</span>
        </header>

        <div className="lg:hidden">
          <AppSidebar isMobileOpen={isMobileMenuOpen} onToggleMobile={toggleMobileMenu} />
        </div>
      </>
    );
  }

  // Header com usuário
  return (
    <>
      <header className={headerClasses}>
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden text-white/90 hover:text-white hover:bg-white/10 transition-colors"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        {/* Logo e Nome */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col">
            <h1 className="text-base lg:text-lg font-semibold text-white leading-tight">UP Connection</h1>
            <p className="text-[11px] lg:text-xs text-white/60 font-medium">{getUserType()}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Notificações */}
          <NotificationsDropdown />

          {/* Pontos do Profissional - Desktop */}
          {user.professional && (
            <div className="flex items-center gap-2 bg-white/10 hover:bg-white/15 transition-colors rounded-lg px-4 py-2 border border-white/10">
              <Coins className="w-4 h-4 text-yellow-400" />
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-semibold text-white">{user.professional.points || 0}</span>
                <span className="text-[11px] text-white/70 font-medium hidden md:inline">pontos</span>
                <span className="text-[11px] text-white/70 font-medium inline md:hidden">pts</span>
              </div>
            </div>
          )}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 lg:gap-3 hover:bg-white/10 transition-colors h-auto px-2 lg:px-3 py-2"
              >
                <span className="hidden lg:block text-sm font-medium text-white/90">{getUserName().split(' ')[0]}</span>
                <div className="relative">
                  <img
                    src={getProfileImage() || '/placeholder.svg'}
                    alt="profile"
                    className="w-8 h-8 lg:w-9 lg:h-9 object-cover rounded-full border-2 border-white/20"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#511A2B]" />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 bg-white shadow-xl border-gray-200" align="end">
              <DropdownMenuLabel className="font-normal px-3 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={getProfileImage() || '/placeholder.svg'}
                    alt="profile"
                    className="w-12 h-12 object-cover rounded-full border-2 border-[#511A2B]/20"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#511A2B] truncate">{getUserName()}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{getUserType()}</p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-gray-100" />

              <div className="px-1 py-1">
                <DropdownMenuItem
                  onClick={() => setIsProfileModalOpen(true)}
                  className="text-gray-700 hover:bg-gray-50 hover:text-[#511A2B] cursor-pointer rounded-md px-2 py-2"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">Alterar Perfil</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setIsImageModalOpen(true)}
                  className="text-gray-700 hover:bg-gray-50 hover:text-[#511A2B] cursor-pointer rounded-md px-2 py-2"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">Alterar Imagem</span>
                </DropdownMenuItem>

                {user.partnerSupplier && user.partnerSupplier.subscription && (
                  <DropdownMenuItem
                    onClick={() => setIsPlanModalOpen(true)}
                    className="text-gray-700 hover:bg-gray-50 hover:text-[#511A2B] cursor-pointer rounded-md px-2 py-2"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="text-sm font-medium">Minha Assinatura</span>
                  </DropdownMenuItem>
                )}
              </div>

              <DropdownMenuSeparator className="bg-gray-100" />

              <div className="px-1 py-1">
                <DropdownMenuItem
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer rounded-md px-2 py-2"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">Sair</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Modais */}
      {isPlanModalOpen && (
        <MyPlanModal
          plan={user.partnerSupplier?.subscription}
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
        />
      )}

      {isProfileModalOpen && <UserEditModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />}

      {isImageModalOpen && <UserImageModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} />}

      {/* Sidebar Mobile */}
      <div className="lg:hidden">
        <AppSidebar isMobileOpen={isMobileMenuOpen} onToggleMobile={toggleMobileMenu} />
      </div>
    </>
  );
}
