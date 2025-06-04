'use client';

import { useState } from 'react';
import { useUser } from '@/contexts/user-context';
import { useCommunity } from '@/contexts/community-context';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMobile } from '@/hooks/use-mobile';
import { CommunityList } from './community-list';
import { CommunityHeader } from './community-header';
import { CreatePostForm } from './create-post-form';
import { PostList } from './post-lits';
import { TrendingTopics } from './trending-topics';

export function MuralContent() {
  const { user } = useUser();
  const { selectedCommunity, loading } = useCommunity();
  const isMobile = useMobile();
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="p-6 md:p-8 w-full">
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
            <div className="mx-auto py-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Mobile Community Menu */}
                {isMobile && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="md:hidden fixed bottom-6 left-6 z-50 rounded-full shadow-lg bg-white"
                      >
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-[85%] max-w-[300px]">
                      <ScrollArea className="h-full">
                        <div className="p-4">
                          <CommunityList />
                        </div>
                      </ScrollArea>
                    </SheetContent>
                  </Sheet>
                )}

                {/* Desktop Community Sidebar */}
                {!isMobile && (
                  <div className="hidden md:block w-[280px] flex-shrink-0">
                    <div className="sticky top-[8vh]">
                      <CommunityList />
                    </div>
                  </div>
                )}

                {/* Main Content */}
                <div className="flex-1 max-w-3xl mx-auto w-full">
                  {selectedCommunity && (
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
                  )}
                </div>

                {/* Right Sidebar */}
                <div className="hidden lg:block w-[280px] flex-shrink-0">
                  <div className="sticky top-[8vh] space-y-6">
                    <TrendingTopics />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
