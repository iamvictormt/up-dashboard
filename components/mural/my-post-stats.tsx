'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Hash, Heart, MessageCircle, Rss } from 'lucide-react';
import { fetchMyPostsStats } from '@/lib/post-api';
import { PostStats } from '@/types/post';
import { useMuralUpdate } from '@/contexts/mural-update-context';

export function MyPostsStats() {
  const [stats, setStats] = useState<PostStats>();
  const [loading, setLoading] = useState(true);
  const { updateCount } = useMuralUpdate();

  useEffect(() => {
    async function loadUserPosts() {
      try {
        setLoading(true);
        const data = await fetchMyPostsStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading user posts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserPosts();
  }, [updateCount]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Engajamento dos meus posts</h3>
        <div className="space-y-3">
          <div className="rounded-lg">
            <div className="flex gap-2">
              <Skeleton className="h-16 w-[100%]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Engajamento dos meus posts</h3>
      </div>

      {/* Estatísticas gerais */}
      {stats && (
        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
              <Rss className="h-4 w-4" />
              <span className="text-xs font-medium">{stats.postsCount}</span>
            </div>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-red-500 mb-1">
              <Heart className="h-4 w-4" />
              <span className="text-xs font-medium">{stats.likesCount}</span>
            </div>
            <p className="text-xs text-gray-500">Curtidas</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs font-medium">{stats.commentsCount}</span>
            </div>
            <p className="text-xs text-gray-500">Comentários</p>
          </div>
        </div>
      )}

      {!stats && (
        <div className="text-center py-8">
          <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-2">Você ainda não criou nenhum post</p>
          <p className="text-xs text-gray-400">Comece criando seu primeiro post!</p>
        </div>
      )}
    </div>
  );
}
