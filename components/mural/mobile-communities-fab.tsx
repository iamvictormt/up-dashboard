'use client';

import { useEffect, useState } from 'react';
import { Hash, Search, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCommunity } from '@/contexts/community-context';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export function MobileCommunitiesFAB() {
  const { communities, selectedCommunity, selectCommunity } = useCommunity();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Function to dynamically get icon from string name
  const getIconByName = (iconName: string): LucideIcon => {
    const icon = (LucideIcons as Record<string, LucideIcon>)[iconName];
    return icon || LucideIcons.Hash;
  };

  // Filter communities based on search term
  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCommunitySelect = (community: (typeof communities)[0]) => {
    selectCommunity(community);
    setIsOpen(false);
    setSearchTerm('');
  };

  const SelectedIcon = selectedCommunity ? getIconByName(selectedCommunity.icon) : Hash;
  const selectedColor = selectedCommunity?.color || '#511A2B';

  return (
    <>
      {/* Floating Action Button - Only visible on mobile */}
      <div
        className="fixed bottom-6 right-6 z-50 md:hidden"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
        }}
      >
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button
              className="w-14 h-14 bg-[#511A2B] text-white rounded-xl shadow-xl flex items-center justify-center hover:bg-[#511A2B]/90 transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Abrir comunidades"
              style={{
                backgroundColor: `${selectedColor}50`, color: selectedColor,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                willChange: 'transform',
              }}
            >
              <SelectedIcon className="w-6 h-6" />
            </button>
          </SheetTrigger>

          <SheetContent side="bottom" className="h-[80vh] p-0">
            <div className="flex flex-col h-full">
              {/* Header */}
              <SheetHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-lg font-semibold">Comunidades</SheetTitle>
                </div>
              </SheetHeader>

              {/* Search */}
              <div className="p-4 pb-2">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar comunidades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
              </div>

              {/* Communities List */}
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-2 pb-4">
                  {filteredCommunities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Hash className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma comunidade encontrada</p>
                    </div>
                  ) : (
                    filteredCommunities.map((community) => {
                      const Icon = getIconByName(community.icon);
                      const isSelected = selectedCommunity?.id === community.id;

                      return (
                        <button
                          key={community.id}
                          onClick={() => handleCommunitySelect(community)}
                          className={cn(
                            'w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 active:scale-95',
                            isSelected
                              ? 'bg-[#511A2B] text-white shadow-lg'
                              : 'bg-white hover:bg-gray-50 border border-gray-100'
                          )}
                        >
                          <div
                            className={cn(
                              'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                              isSelected ? 'bg-white/20' : 'bg-opacity-20'
                            )}
                            style={{
                              backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : `${community.color}20`,
                              color: isSelected ? 'white' : community.color,
                            }}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3
                              className={cn(
                                'font-medium text-base truncate',
                                isSelected ? 'text-white' : 'text-gray-900'
                              )}
                            >
                              {community.name}
                            </h3>
                            <p
                              className={cn('text-sm truncate-10 mt-1', isSelected ? 'text-white/70' : 'text-gray-500')}
                            >
                              {community.description}
                            </p>
                          </div>
                          {isSelected && <div className="w-3 h-3 bg-white rounded-full flex-shrink-0" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
