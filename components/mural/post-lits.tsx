'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Post } from '@/types/post';
import { fetchPostsByCommunity } from '@/lib/post-api';
import { PostCard } from './post-card';
import { useMuralUpdate } from '@/contexts/mural-update-context';

interface PostListProps {
  communityId: string;
}

export function PostList({ communityId }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { updateCount } = useMuralUpdate();

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        const data = await fetchPostsByCommunity(communityId);
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [communityId, updateCount]);

  const handleLikeIdChange = (postId: string, newLikeId: string) => {
    setPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, likeId: newLikeId } : post)));
  };

  if (loading) {
    return (
      <div className="space-y-6">
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
        <p>Erro ao carregar posts. Por favor, tente novamente.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Nenhum post encontrado</h3>
        <p className="text-gray-500">Seja o primeiro a compartilhar algo nesta comunidade!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} likeIdChange={handleLikeIdChange} />
      ))}
    </div>
  );
}
