'use client';

import { useState } from 'react';
import { useCommunity } from '@/contexts/community-context';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMobile } from '@/hooks/use-mobile';
import { CommunityList } from './community-list';
import { CommunityHeader } from './community-header';
import { CreatePostForm } from './create-post-form';
import { PostList } from './post-lits';
import { TrendingTopics } from './trending-topics';
import { MuralUpdateProvider } from '@/contexts/mural-update-context';
import { Skeleton } from '../ui/skeleton';
import { MobileCommunitiesFAB } from './mobile-communities-fab';
import { Toaster } from '../ui/toaster';

export function MuralContent() {
  const isMobile = useMobile();
  const { selectedCommunity } = useCommunity();
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <MuralUpdateProvider>
      <div className="p-6 md:p-8 w-full">
        <MobileCommunitiesFAB />

        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full max-w-7xl mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className=" mb-8 space-y-4 md:space-y-0">
              <div className="">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-2">Mural da Comunidade</h1>
                  <p className="text-[#511A2B]/70">Acompanhe as últimas publicações de todas as comunidades.</p>
                </div>
              </div>
              {/* Mobile Community Menu */}
              <div className="mx-auto py-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Desktop Community Sidebar */}
                  {!isMobile && (
                    <div className="hidden md:block w-[280px] flex-shrink-0">
                      <div className="sticky top-[12vh]">
                        <CommunityList />
                      </div>
                    </div>
                  )}

                  {/* Main Content */}
                  <div className="flex-1 max-w-3xl mx-auto w-full">
                    {selectedCommunity ? (
                      <>
                        <CommunityHeader community={selectedCommunity} onCreatePost={() => setShowCreatePost(true)} />

                        {showCreatePost && (
                          <div className="mb-6">
                            <CreatePostForm
                              communityId={selectedCommunity.id}
                              onCancel={() => setShowCreatePost(false)}
                              onSuccess={() => setShowCreatePost(false)}
                            />
                          </div>
                        )}

                        <PostList communityId={selectedCommunity.id} />
                      </>
                    ) : (
                      <div className="space-y-6">
                        <>
                          <div className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-center gap-4">
                              <Skeleton className="w-12 h-12 rounded-xl" />

                              <div className="flex flex-col gap-2">
                                <Skeleton className="h-6 w-32" />
                                <div className="flex items-center gap-3">
                                  <Skeleton className="h-4 w-24" />
                                  <Skeleton className="h-6 w-6 rounded-full" />
                                </div>
                              </div>
                            </div>
                          </div>
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm p-5">
                              <div className="flex items-start gap-3 mb-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1">
                                  <Skeleton className="h-5 w-32 mb-2" />
                                  <Skeleton className="h-4 w-24" />
                                </div>
                              </div>
                              <Skeleton className="h-4 w-full mb-2" />
                              <Skeleton className="h-4 w-full mb-2" />
                              <Skeleton className="h-4 w-3/4 mb-4" />
                              <Skeleton className="h-32 w-full rounded-lg mb-4" />
                              <div className="flex justify-between">
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-8 w-20" />
                              </div>
                            </div>
                          ))}
                        </>
                      </div>
                    )}
                  </div>

                  {/* Right Sidebar */}
                  <div className="hidden lg:block w-[280px] flex-shrink-0">
                    <div className="sticky top-[12vh] space-y-6">
                      <TrendingTopics />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </MuralUpdateProvider>
  );
}
