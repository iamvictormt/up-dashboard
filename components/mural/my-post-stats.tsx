'use client';

import { useState, useEffect } from 'react';
import { FileText, Hash, Heart, MessageCircle, Rss, Star } from 'lucide-react';
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

  if (!loading) {
    return <></>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-4">
      <div className="p-3">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-[#6c2144]" />
          <h3 className="font-semibold text-sm text-gray-900">Engajamento dos meus posts</h3>
        </div>
      </div>

      {/* Estatísticas gerais */}
      {stats && (
        <div className="p-3">
          <div className="grid grid-cols-3 gap-2 p-3 mb-4 bg-gray-50 rounded-xl">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
                <Rss className="h-4 w-4" />
                <span className="text-xs font-medium">{stats.postsCount}</span>
              </div>
              <p className="text-xs text-gray-500">Publicações</p>
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
