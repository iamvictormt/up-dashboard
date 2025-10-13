'use client';

import type { Community } from '@/types/community';
import { Button } from '@/components/ui/button';
import { PenLine, Info } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '../ui/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface CommunityHeaderProps {
  community: Community;
  onCreatePost: () => void;
}

export function CommunityHeader({ community, onCreatePost }: CommunityHeaderProps) {
  const isMobile = useIsMobile();

  const getIconByName = (iconName: string): LucideIcon => {
    const icon = (LucideIcons as Record<string, LucideIcon>)[iconName];
    return icon || LucideIcons.Hash;
  };

  const Icon = getIconByName(community.icon);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 mb-6">
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-6">
        {/* Ícone e informações da comunidade */}
        <div className="flex flex-1 min-w-0 items-center gap-3 sm:gap-4">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${community.color}20`, color: community.color }}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-[#511A2B] truncate">{community.name}</h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                <LucideIcons.Rss className="h-3.5 w-3.5" />
                <span className="truncate">
                  {`${community.postsCount ?? 0} publicaç${(community.postsCount ?? 0) === 1 ? 'ão' : 'ões'}`}
                </span>
              </div>

              {isMobile ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 rounded-full">
                      <Info className="h-3.5 w-3.5" />
                      <span className="sr-only">Informações da comunidade</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 max-w-xs">
                    <p className="text-sm">{community.description || 'Sem descrição'}</p>
                  </PopoverContent>
                </Popover>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 rounded-full">
                        <Info className="h-3.5 w-3.5" />
                        <span className="sr-only">Informações da comunidade</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">{community.description || 'Sem descrição'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>

        {/* Botão criar post */}
        {community.id !== '' && (
          <Button
            onClick={onCreatePost}
            className="gap-2 w-full sm:w-auto justify-center sm:justify-start"
            style={{
              backgroundColor: community.color,
              color: '#fff',
              borderColor: 'transparent',
            }}
          >
            <PenLine className="h-4 w-4" />
            Publicar
          </Button>
        )}
      </div>
    </div>
  );
}
