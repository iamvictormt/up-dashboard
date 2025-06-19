'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types/post';
import { fetchMyPosts, fetchPostsByCommunity } from '@/lib/post-api';
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
        let data: Post[];
        setLoading(true);
        if (communityId === '') {
          data = await fetchMyPosts();
        } else {
          data = await fetchPostsByCommunity(communityId);
        }
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
    return <></>;
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
        {communityId === '' ? (
          <p className="text-gray-500">Tem algo legal para mostrar? Compartilhe com a comunidade!</p>
        ) : (
          <p className="text-gray-500">Seja o primeiro a compartilhar algo nesta comunidade!</p>
        )}
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
