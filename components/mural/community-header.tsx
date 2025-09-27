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
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${community.color}20`, color: community.color }}
          >
            <Icon className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#511A2B]">{community.name}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                <LucideIcons.Rss className="h-3.5 w-3.5" />
                <span className='text-muted'>
                  {`${community.postsCount ?? 0} publicaç${(community.postsCount ?? 0) === 1 ? 'ão' : 'ões'}`}
                </span>
              </div>

              {isMobile ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="lg" className="h-6 w-6 rounded-full">
                      <Info className="h-3.5 w-3.5" />
                      <span className="sr-only">Informações da comunidade</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <p>{community.description || 'Sem descrição'}</p>
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
                      <p>{community.description || 'Sem descrição'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>

        {community.id !== "" && (
          <Button
            onClick={onCreatePost}
            className="gap-2"
            style={{
              backgroundColor: community.color,
              color: '#fff',
              borderColor: 'transparent',
            }}
          >
            <PenLine className="h-4 w-4" />
            <span className="hidden sm:inline">Criar Post</span>
            <span className="sm:hidden">Post</span>
          </Button>
        )}
      </div>
    </div>
  );
}
