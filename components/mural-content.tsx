'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Heart,
  MessageCircle,
  Share2,
  Plus,
  Send,
  Hash,
  Loader2,
  X,
  ImageIcon,
  Smile,
  MoreHorizontal,
  Bookmark,
  Flag,
  UserPlus,
  Users,
  Home,
  Filter,
  TrendingUp,
  Clock,
  Menu,
  BookOpen,
} from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { iconMap } from '@/constants/appIcons';
import api from '@/services/api';
import { CommentModal } from './comments-modal';
import { CommunityFilters } from './community-filters';
import { CreatePostDialog } from './create-post-modal';
import { toast } from 'sonner';

// Mock data para comunidades com ícones
const mockCommunities: Community[] = [
  {
    id: 'c1',
    name: 'Arquitetura & Design',
    description: 'Comunidade para arquitetos e designers compartilharem projetos e ideias',
    postsCount: 1245,
    imageUrl: '/placeholder.svg?height=40&width=40',
    color: '#FF6B6B',
    icon: 'home',
  },
  {
    id: 'c2',
    name: 'Construção Civil',
    description: 'Discussões sobre técnicas, materiais e projetos de construção civil',
    postsCount: 3782,
    imageUrl: '/placeholder.svg?height=40&width=40',
    color: '#4ECDC4',
    icon: 'hammer',
  },
  {
    id: 'c3',
    name: 'Decoração de Interiores',
    description: 'Dicas e inspirações para decoração de ambientes internos',
    postsCount: 2156,
    imageUrl: '/placeholder.svg?height=40&width=40',
    color: '#FFD166',
    icon: 'palette',
  },
  {
    id: 'c4',
    name: 'Paisagismo',
    description: 'Tudo sobre jardins, plantas e áreas externas',
    postsCount: 987,
    imageUrl: '/placeholder.svg?height=40&width=40',
    color: '#06D6A0',
    icon: 'treepine',
  },
  {
    id: 'c5',
    name: 'Reformas & DIY',
    description: 'Compartilhe suas reformas e projetos faça-você-mesmo',
    postsCount: 4521,
    imageUrl: '/placeholder.svg?height=40&width=40',
    color: '#118AB2',
    icon: 'wrench',
  },
];

interface MuralContentProps {
  communityId?: string;
}

export function MuralContent({ communityId }: MuralContentProps) {
  const { user } = useUser();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', hashtags: '', communityId: '' });
  const [newComment, setNewComment] = useState('');
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, [communityId]);

  const loadData = async () => {
    setLoading(true);

    const responseCommunities = await api.get(`/communities`);
    setCommunities(responseCommunities.data);

    let responsePosts;
    if (!communityId) {
      responsePosts = await api.get(`/posts`);
    } else {
      responsePosts = await api.get(`/posts/community/${communityId}`);
    }
    setPosts(responsePosts.data);

    if (communityId) {
      const community = responseCommunities.data.find((c: Community) => c.id === communityId);
      if (community) {
        setSelectedCommunity(community);
      }
    }

    setLoading(false);
  };

  // Configurar o observador de interseção para carregamento infinito
  useEffect(() => {
    if (loading) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoadingMore) {
        loadMorePosts();
      }
    };

    observerRef.current = new IntersectionObserver(handleObserver, options);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, isLoadingMore, posts.length]);

  const loadMorePosts = async () => {
    // if (posts.length >= 20) return;
    // setIsLoadingMore(true);
    // await new Promise((resolve) => setTimeout(resolve, 1500));
    // const morePosts = generateMockPosts()
    //   .map((post) => ({ ...post, id: `new-${post.id}-${Date.now()}` }))
    //   .slice(0, 5);
    // const filteredMorePosts = communityId ? morePosts.filter((post) => post.communityId === communityId) : morePosts;
    // setPosts((prev) => [...prev, ...filteredMorePosts]);
    // setIsLoadingMore(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Agora há pouco';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 48) return 'Ontem';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getUserName = () => {
    if (!user) return 'Usuário';
    if (user.professional) return user.professional.name;
    if (user.partnerSupplier) return user.partnerSupplier.tradeName;
    if (user.loveDecoration) return user.loveDecoration.name;
    return user.email.split('@')[0];
  };

  const getUserAvatar = () => {
    if (user?.profileImage) return user.profileImage;
    return '/placeholder.svg?height=40&width=40';
  };

  const handleCreatePost = async () => {
    if (!newPost.content.trim() || !user || !newPost.communityId) return;

    setSubmitting(true);
    try {
      const hashtags = newPost.hashtags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const postData = {
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        authorId: user.id,
        communityId: newPost.communityId,
        hashtags,
      };

      await api.post('/posts', postData);

      loadData();

      setNewPost({ title: '', content: '', hashtags: '', communityId: '' });
      setIsPostDialogOpen(false);
    } catch (error) {
      console.error('Erro ao criar post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (post: Post) => {
    if (!user || likingPosts.has(post.id)) return;

    setLikingPosts((prev) => new Set(prev).add(post.id));

    try {
      if (!post) return;

      if (post.isLiked) {
        await api.delete(`likes/${post.likeId}`);
        toast.info(`Você removeu sua curtida do post de ${post.author.name.split(' ')[0]}!`);
      } else {
        const likePostData = {
          userId: user.id,
          postId: post.id,
        };
        const response = await api.post('likes', likePostData);
        post.likeId = response.data.id;
        toast.success(`Você curtiu o post de ${post.author.name.split(' ')[0]}!`);
      }

      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                isLiked: !p.isLiked,
                likes: p.isLiked ? p.likes - 1 : p.likes + 1,
              }
            : p
        )
      );
    } catch (error) {
      console.error('Erro ao curtir post:', error);
    } finally {
      setLikingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(post.id);
        return newSet;
      });
    }
  };

  const openCommentModal = async (post: Post) => {
    setSelectedPost(post);
    setIsCommentModalOpen(true);
    setLoadingComments(true);

    try {
      const response = await api.get(`comments/post/${post.id}`)
      setComments(response.data);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost || !user) return;

    setSubmitting(true);
    try {
      const commentData = {
        userId: user.id,
        postId: selectedPost.id,
        content: newComment,
      };
      const response = await api.post('comments', commentData);
      setComments((prev) => [...prev, response.data]);
      setNewComment('');
      setPosts((prev) => prev.map((p) => (p.id === selectedPost.id ? { ...p, comments: p.comments + 1 } : p)));
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommunityFilter = (community: Community | null) => {
    setSelectedCommunity(community);

    if (community) {
      router.push(`/community/${community.id}`);
    } else {
      router.push('/mural');
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes + b.comments - (a.likes + a.comments);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (loading) {
    return (
      <div className="p-6 md:p-8 w-full">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full max-w-7xl mx-auto">
          <Card className="w-full max-w-7xl mx-auto">
            <CardHeader className="pb-4">
              <div className="h-8 bg-[#511A2B]/10 rounded-lg w-64 mb-2"></div>
              <div className="h-4 bg-[#511A2B]/10 rounded-lg w-96"></div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-[#511A2B]/10 rounded-lg"></div>
                  ))}
                </div>
                <div className="lg:col-span-3 space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/90 rounded-xl p-4 shadow-sm space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#511A2B]/10 rounded-full"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-[#511A2B]/10 rounded w-1/3"></div>
                          <div className="h-3 bg-[#511A2B]/10 rounded w-1/4"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-[#511A2B]/10 rounded w-full"></div>
                        <div className="h-4 bg-[#511A2B]/10 rounded w-full"></div>
                        <div className="h-4 bg-[#511A2B]/10 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B]">{'Mural da Comunidade'}</h1>
                <p className="text-[#511A2B]/70 text-sm md:text-base">
                  {selectedCommunity
                    ? selectedCommunity.description ||
                      `Comunidade com ${selectedCommunity.postsCount.toLocaleString()} posts compartilhados`
                    : 'Acompanhe as últimas publicações de todas as comunidades'}
                </p>
              </div>

              {/* Botão para criar post */}
              {user && (
                <div className="flex items-center gap-2">
                  {/* Filtro mobile */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="lg:hidden border-[#511A2B]/20 text-[#511A2B] mt-4"
                      >
                        <Menu className="w-4 h-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <CommunityFilters
                        selectedCommunity={selectedCommunity}
                        communities={communities}
                        sortBy={sortBy}
                        handleCommunityFilter={handleCommunityFilter}
                        setSortBy={setSortBy}
                        className="mt-6"
                      />
                    </SheetContent>
                  </Sheet>

                  <CreatePostDialog
                    isOpen={isPostDialogOpen}
                    setIsOpen={setIsPostDialogOpen}
                    newPost={newPost}
                    setNewPost={setNewPost}
                    communities={communities}
                    getUserAvatar={getUserAvatar}
                    getUserName={getUserName}
                    handleCreatePost={handleCreatePost}
                    submitting={submitting}
                  />
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filtros laterais - Desktop */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-6">
                  <CommunityFilters
                    selectedCommunity={selectedCommunity}
                    communities={communities}
                    sortBy={sortBy}
                    handleCommunityFilter={handleCommunityFilter}
                    setSortBy={setSortBy}
                    className="mt-6"
                  />
                </div>
              </div>

              {/* Feed de posts */}
              <div className="lg:col-span-3">
                <div className="space-y-6">
                  {sortedPosts.length === 0 ? (
                    <div className="bg-white/90 rounded-xl p-8 shadow-sm text-center">
                      <Users className="w-12 h-12 text-[#511A2B]/30 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-[#511A2B] mb-2">Nenhuma publicação encontrada</h3>
                      <p className="text-[#511A2B]/70 mb-6">
                        {selectedCommunity
                          ? 'Seja o primeiro a publicar nesta comunidade!'
                          : 'Comece seguindo algumas comunidades ou crie sua primeira publicação!'}
                      </p>
                      <Button
                        onClick={() => setIsPostDialogOpen(true)}
                        className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Publicação
                      </Button>
                    </div>
                  ) : (
                    sortedPosts.map((post) => (
                      <Card
                        key={post.id}
                        className="bg-white/90 backdrop-blur-sm border-[#511A2B]/10 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                      >
                        <CardContent className="p-4">
                          {/* Cabeçalho do post */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={post.author.profileImage || '/placeholder.svg'} />
                                <AvatarFallback className="bg-[#511A2B] text-white">
                                  {post.author.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-[#511A2B] text-sm">{post.author.name}</h3>
                                  {/* {post.author.level && (
                                    <Badge className="bg-[#FEC460] text-[#511A2B] text-xs">{post.author.level}</Badge>
                                  )} */}
                                </div>
                                <div className="flex items-center text-xs text-[#511A2B]/60 space-x-2">
                                  <span>{formatDate(post.createdAt)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Link href={`/community/${post.community.id}`}>
                                <Badge
                                  className="hover:bg-opacity-80 transition-all cursor-pointer"
                                  style={{
                                    backgroundColor: post.community.color || '#511A2B',
                                    color: '#fff',
                                  }}
                                >
                                  {post.community.name}
                                </Badge>
                              </Link>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4 text-[#511A2B]/70" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                  <DropdownMenuItem className="cursor-pointer text-red-600">
                                    <Flag className="mr-2 h-4 w-4" />
                                    <span>Denunciar</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {/* Conteúdo do post */}
                          <div className="space-y-3">
                            {post.title && <h2 className="text-lg font-semibold text-[#511A2B]">{post.title}</h2>}

                            <p className="text-[#511A2B]/80 whitespace-pre-line">{post.content}</p>

                            {/* Imagem do post */}
                            {post.imageUrl && (
                              <div className="mt-3 rounded-lg overflow-hidden">
                                <img
                                  src={post.imageUrl || '/placeholder.svg'}
                                  alt="Imagem do post"
                                  className="w-full h-auto object-cover max-h-[400px]"
                                />
                              </div>
                            )}

                            {/* Tags */}
                            {post.hashtags.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-2">
                                {post.hashtags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-[#511A2B]/10 text-[#511A2B] hover:bg-[#511A2B]/20 cursor-pointer text-xs"
                                  >
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Botões de interação */}
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#511A2B]/10">
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLike(post)}
                                disabled={likingPosts.has(post.id)}
                                className={`flex items-center space-x-1 text-sm transition-all duration-200 ${
                                  post.isLiked
                                    ? 'text-red-500 hover:text-red-600'
                                    : 'text-[#511A2B]/60 hover:text-[#511A2B]'
                                } ${likingPosts.has(post.id) ? 'scale-110' : ''}`}
                              >
                                <Heart
                                  className={`w-5 h-5 transition-all duration-200 ${
                                    post.isLiked ? 'fill-current scale-110' : ''
                                  } ${likingPosts.has(post.id) ? 'animate-pulse' : ''}`}
                                />
                                <span>{post.likes}</span>
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openCommentModal(post)}
                                className="flex items-center space-x-1 text-sm text-[#511A2B]/60 hover:text-[#511A2B]"
                              >
                                <MessageCircle className="w-5 h-5" />
                                <span>{post.comments}</span>
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center space-x-1 text-sm text-[#511A2B]/60 hover:text-[#511A2B]"
                              >
                                <Share2 className="w-5 h-5" />
                              </Button>
                            </div>

                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openCommentModal(post)}
                                className="text-sm text-[#511A2B]/60 hover:text-[#511A2B]"
                              >
                                {post.comments > 0 ? `Ver ${post.comments} comentário${post.comments > 1 ? 's' : ''}` : 'Comentar'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}

                  {/* Indicador de carregamento de mais posts */}
                  {/* {sortedPosts.length > 0 && (
                    <div ref={loadMoreRef} className="py-4 flex justify-center">
                      {isLoadingMore ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-5 h-5 text-[#511A2B] animate-spin" />
                          <span className="text-sm text-[#511A2B]/70">Carregando mais posts...</span>
                        </div>
                      ) : (
                        <div className="h-8" />
                      )}
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Modal de Comentários */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onOpenChange={setIsCommentModalOpen}
        selectedPost={selectedPost}
        comments={comments}
        loadingComments={loadingComments}
        newComment={newComment}
        setNewComment={setNewComment}
        submitting={submitting}
        handleAddComment={handleAddComment}
        user={user}
        getUserAvatar={getUserAvatar}
        getUserName={getUserName}
        formatDate={formatDate}
      />
    </div>
  );
}
