'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types/post';
import { fetchMyPosts, fetchPostsByCommunity } from '@/lib/post-api';
import { PostCard } from './post-card';
import { useMuralUpdate } from '@/contexts/mural-update-context';
import { ListingLoading } from '@/components/ui/listing-loading';
import { ListingEmpty } from '@/components/ui/listing-empty';
import { Quote } from 'lucide-react';

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
    return <ListingLoading message="Carregando publicações..." />;
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
      <ListingEmpty
        icon={<Quote className="h-12 w-12 text-[#511A2B]/30" />}
        title="Nenhuma publicação encontrada"
        description={
          communityId === ''
            ? 'Tem algo legal para mostrar? Compartilhe com a comunidade!'
            : 'Seja o primeiro a compartilhar algo nesta comunidade!'
        }
      />
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
