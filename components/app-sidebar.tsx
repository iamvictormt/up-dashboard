'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  LayoutDashboard,
  Users,
  Store,
  Calendar,
  Briefcase,
  GraduationCap,
  HelpCircle,
  Settings,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Crown,
} from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { Skeleton } from './ui/skeleton';
import { appImages } from '@/constants/appImages';
import Image from 'next/image';

type SidebarItem = {
  title: string;
  icon: React.ElementType;
  url?: string;
  badge?: string;
  indicator?: string;
  isExpandable?: boolean;
  subItems?: {
    title: string;
    url: string;
    indicator?: 'purple' | 'red' | 'blue' | 'green';
  }[];
  roles?: string[];
};

export function AppSidebar() {
  const pathname = usePathname();
  const { user, isLoading, role } = useUser();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  console.log(role);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleExpandItem = (title: string) => {
    if (isExpanded) {
      setExpandedItems((prev) => ({
        ...prev,
        [title]: !prev[title],
      }));
    }
  };

  const handleMouseEnter = (itemTitle: string) => {
    if (!isExpanded) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setHoveredItem(itemTitle);
    }
  };

  const handleMouseLeave = () => {
    if (!isExpanded) {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredItem(null);
      }, 100);
    }
  };

  const mainMenuItems: SidebarItem[] = [
    {
      title: 'Mural',
      icon: MessageSquare,
      url: '/mural',
      roles: ['professional', 'partnerSupplier', 'loveDecoration'],
    },
    {
      title: 'Profissionais',
      icon: Users,
      url: '/professionals',
      roles: ['professional', 'partnerSupplier', 'loveDecoration'],
    },
    {
      title: 'Fornecedores',
      icon: Store,
      url: '/suppliers',
      roles: ['professional'],
    },
    {
      title: 'Workshops',
      icon: GraduationCap,
      url: '/workshops',
      roles: ['professional'],
    },
    {
      title: 'Eventos',
      icon: Calendar,
      url: '/events',
      roles: ['professional'],
    },
    {
      title: 'Minha Loja',
      icon: Briefcase,
      url: '/my-store',
      roles: ['partnerSupplier'],
    },
    {
      title: 'Meus Benefícios',
      icon: Crown,
      url: '/benefits',
      roles: ['partnerSupplier'],
    },
  ];

  const otherMenuItems: SidebarItem[] = [
    {
      title: 'Ajuda',
      icon: HelpCircle,
      url: '/help',
    },
    // {
    //   title: 'Configurações',
    //   icon: Settings,
    //   url: '/settings',
    // },
  ];

  const MenuItemSkeleton = () => (
    <div className={`w-full relative ${isExpanded ? 'px-3' : 'px-2'}`}>
      <div
        className={`
          w-full flex items-center h-12 rounded-lg
          ${isExpanded ? 'justify-between px-4' : 'justify-center'}
        `}
      >
        <div className={`flex items-center ${isExpanded ? 'space-x-3' : ''}`}>
          <Skeleton className="w-5 h-5 bg-white/20" />
          {isExpanded && <Skeleton className="h-4 w-20 bg-white/20" />}
        </div>
      </div>
    </div>
  );

  const renderMenuItem = (item: SidebarItem) => {
    const isActive = item.url === pathname;
    const isItemExpanded = expandedItems[item.title];

    // Classes comuns para ambos os tipos de item
    const baseClasses = `
      w-full flex items-center transition-all h-12 rounded-lg
      text-gray-300 hover:text-white hover:bg-white/10
      ${isExpanded ? 'justify-between px-4' : 'justify-center'}
    `;

    if (item.isExpandable) {
      return (
        <div key={item.title} className={`w-full relative ${isExpanded ? 'px-3' : 'px-2'}`}>
          <button
            data-item={item.title}
            onClick={() => toggleExpandItem(item.title)}
            onMouseEnter={() => handleMouseEnter(item.title)}
            onMouseLeave={handleMouseLeave}
            className={baseClasses}
          >
            <div className={`flex items-center ${isExpanded ? 'space-x-3' : ''}`}>
              <item.icon className="w-5 h-5" />
              {isExpanded && <span className="text-sm font-medium">{item.title}</span>}
            </div>
            {isExpanded && (
              <ChevronRight className={`w-4 h-4 transition-transform ${isItemExpanded ? 'rotate-90' : ''}`} />
            )}
          </button>

          {/* Submenu expandido quando sidebar está aberta */}
          {isExpanded && isItemExpanded && item.subItems && (
            <div className="ml-6 mt-1 space-y-1">
              {item.subItems.map((subItem) => {
                const isSubActive = subItem.url === pathname;
                return (
                  <Link
                    key={subItem.title}
                    href={subItem.url}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      flex items-center px-4 py-2 rounded-lg
                      ${
                        isSubActive
                          ? 'bg-white/15 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }
                      transition-all
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          subItem.indicator === 'purple'
                            ? 'bg-purple-500'
                            : subItem.indicator === 'red'
                            ? 'bg-red-500'
                            : subItem.indicator === 'blue'
                            ? 'bg-blue-500'
                            : 'bg-green-500'
                        }`}
                      />
                      <span className="text-sm font-medium">{subItem.title}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.title} className={`w-full relative ${isExpanded ? 'px-3' : 'px-2'}`}>
        <Link
          data-item={item.title}
          href={item.url || '#'}
          onClick={() => setIsMobileOpen(false)}
          onMouseEnter={() => handleMouseEnter(item.title)}
          onMouseLeave={handleMouseLeave}
          className={`
            ${baseClasses}
            ${isActive ? 'bg-white/15 text-white shadow-lg' : ''}
          `}
        >
          <div className={`flex items-center ${isExpanded ? 'space-x-3' : ''}`}>
            <item.icon className="w-5 h-5" />
            {isExpanded && <span className="text-sm font-medium">{item.title}</span>}
          </div>
        </Link>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button - Melhor posicionamento */}
      {!isMobileOpen ? (
        <button
          onClick={toggleMobileSidebar}
          className="fixed top-2 left-2 z-[60] md:hidden bg-[#511A2B] text-white p-3 rounded-xl shadow-lg border border-white/20"
        >
          <Menu className="w-5 h-5" />
        </button>
      ) : null}

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-[#511A2B] z-50
          transition-all duration-300 ease-in-out flex flex-col
          ${isExpanded ? 'w-72' : 'w-24'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          shadow-2xl md:shadow-none
        `}
      >
        {/* Sidebar Header */}
        <div className="border-b border-white/10 p-4 pt-6 flex items-center justify-between">
          {isExpanded ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="relative w-24 h-24">
                  <Image
                    src={appImages.logoUpSvg.src}
                    alt="UP Club Logo"
                    fill
                    className="object-contain ml-[8vh]"
                    priority
                  />
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={toggleSidebar}
                  className="hidden md:flex w-8 h-8 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {/* Botão de fechar no mobile */}
                <button
                  onClick={toggleMobileSidebar}
                  className="md:hidden w-8 h-8 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full">
              <button
                onClick={toggleSidebar}
                className="hidden md:flex w-8 h-8 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Menu */}
          <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
            {isExpanded && (
              <div className="text-gray-400 text-xs font-medium tracking-wider px-6 mb-3 mt-2">
                {isLoading ? <Skeleton className="h-3 w-16 bg-white/20" /> : 'PRINCIPAL'}
              </div>
            )}
            <div className="space-y-1">
              {isLoading
                ? // Mostra skeletons enquanto carrega
                  Array.from({ length: 4 }).map((_, index) => <MenuItemSkeleton key={`skeleton-${index}`} />)
                : // Mostra itens reais após carregar
                  mainMenuItems.filter((item) => !item.roles || item.roles.includes(role)).map(renderMenuItem)}
            </div>
          </div>

          {/* Other Menu */}
          <div className="py-4 border-t border-white/10">
            {isExpanded && (
              <div className="text-gray-400 text-xs font-medium tracking-wider px-6 mb-3">
                {isLoading ? <Skeleton className="h-3 w-12 bg-white/20" /> : 'OUTROS'}
              </div>
            )}
            <div className="space-y-1">
              {isLoading
                ? // Mostra skeletons para seção "Outros"
                  Array.from({ length: 2 }).map((_, index) => <MenuItemSkeleton key={`skeleton-other-${index}`} />)
                : // Mostra itens reais
                  otherMenuItems.filter((item) => !item.roles || item.roles.includes(role)).map(renderMenuItem)}
            </div>
          </div>
        </div>
      </aside>

      {/* Tooltips Portal */}
      {!isLoading && !isExpanded && hoveredItem && (
        <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
          {mainMenuItems.concat(otherMenuItems).map((item, index) => {
            if (item.title !== hoveredItem) return null;

            const itemElement = document.querySelector(`[data-item="${item.title}"]`);
            const rect = itemElement?.getBoundingClientRect();

            if (!rect) return null;

            if (item.isExpandable && item.subItems) {
              return (
                <div
                  key={item.title}
                  className="absolute pointer-events-auto"
                  style={{
                    left: rect.right + 8,
                    top: rect.top,
                  }}
                  onMouseEnter={() => {
                    if (hoverTimeoutRef.current) {
                      clearTimeout(hoverTimeoutRef.current);
                    }
                    setHoveredItem(item.title);
                  }}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-[#511A2B] border border-white/10 rounded-xl shadow-xl min-w-48 py-2">
                    {/* Header do submenu */}
                    <div className="px-4 py-2 border-b border-white/10">
                      <div className="flex items-center space-x-2">
                        <item.icon className="w-4 h-4 text-white" />
                        <span className="text-white font-medium text-sm">{item.title}</span>
                      </div>
                    </div>

                    {/* Itens do submenu */}
                    <div className="py-1">
                      {item.subItems.map((subItem) => {
                        const isSubActive = subItem.url === pathname;
                        return (
                          <Link
                            key={subItem.title}
                            href={subItem.url}
                            className={`
                              flex items-center px-4 py-2 mx-2 rounded-md
                              ${
                                isSubActive
                                  ? 'bg-white/15 text-white'
                                  : 'text-gray-300 hover:text-white hover:bg-white/10'
                              }
                              transition-all
                            `}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  subItem.indicator === 'purple'
                                    ? 'bg-purple-500'
                                    : subItem.indicator === 'red'
                                    ? 'bg-red-500'
                                    : subItem.indicator === 'blue'
                                    ? 'bg-blue-500'
                                    : 'bg-green-500'
                                }`}
                              />
                              <span className="text-sm font-medium">{subItem.title}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Seta do tooltip */}
                    <div className="absolute left-0 top-6 transform -translate-x-1 w-2 h-2 bg-[#511A2B] rotate-45 border-l border-b border-white/10" />
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={item.title}
                  className="absolute pointer-events-auto"
                  style={{
                    left: rect.right + 8,
                    top: rect.top + rect.height / 2,
                    transform: 'translateY(-50%)',
                  }}
                  onMouseEnter={() => {
                    if (hoverTimeoutRef.current) {
                      clearTimeout(hoverTimeoutRef.current);
                    }
                    setHoveredItem(item.title);
                  }}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-[#511A2B] text-white text-sm font-medium px-3 py-2 rounded-lg shadow-lg border border-white/10 whitespace-nowrap">
                    {item.title}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-[#511A2B] rotate-45 border-l border-b border-white/10" />
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
    </>
  );
}
