'use client';

import { useEffect, useState } from 'react';
import { useCommunity } from '@/contexts/community-context';
import { useMobile } from '@/hooks/use-mobile';
import { CommunityList } from './community-list';
import { CommunityHeader } from './community-header';
import { CreatePostForm } from './create-post-form';
import { PostList } from './post-lits';
import { TrendingTopics } from './trending-topics';
import { MuralUpdateProvider } from '@/contexts/mural-update-context';
import { MobileCommunitiesFAB } from './mobile-communities-fab';
import { Toaster } from '../ui/toaster';
import { MyPostsStats } from './my-post-stats';

export function MuralContent() {
  const isMobile = useMobile();
  const { selectedCommunity } = useCommunity();
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <MuralUpdateProvider>
      <div className="p-6 md:p-8 w-full">
        <MobileCommunitiesFAB />

        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full">
          {/* Header */}
          <div className=" mb-8 space-y-4 md:space-y-0">
            <div className="">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-2">Mural da comunidade</h1>
                <p className="text-[#511A2B]/70">Acompanhe as últimas publicações de todas as comunidades.</p>
              </div>
            </div>
            {/* Mobile Community Menu */}
            <div className="mx-auto py-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Desktop Community Sidebar */}
                {!isMobile && (
                  <div className="hidden md:block w-[350px] flex-shrink-0">
                    <div className="sticky top-[12vh]">
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
                <div className="hidden lg:block w-[350px] flex-shrink-0">
                  <div className="sticky top-[12vh] space-y-6">
                    {/* <WeeklySpotlight /> */}
                    <TrendingTopics />
                    <MyPostsStats />
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
