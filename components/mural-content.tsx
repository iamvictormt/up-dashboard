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
  Hammer,
  Palette,
  TreePine,
  Wrench,
  Filter,
  TrendingUp,
  Clock,
  Menu,
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

interface Community {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  imageUrl?: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  communityId: string;
  hashtags: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    level?: string;
  };
  community: {
    id: string;
    name: string;
    color?: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  imageUrl?: string;
}

interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
}

// Mock data para comunidades com ícones
const mockCommunities: Community[] = [
  {
    id: 'c1',
    name: 'Arquitetura & Design',
    description: 'Comunidade para arquitetos e designers compartilharem projetos e ideias',
    memberCount: 1245,
    imageUrl: '/placeholder.svg?height=40&width=40',
    color: '#FF6B6B',
    icon: Home,
  },
  {
    id: 'c2',
    name: 'Construção Civil',
    description: 'Discussões sobre técnicas, materiais e projetos de construção civil',
    memberCount: 3782,
    imageUrl: '/placeholder.svg?height=40&width=40',
    color: '#4ECDC4',
    icon: Hammer,
  },
  {
    id: 'c3',
    name: 'Decoração de Interiores',
    description: 'Dicas e inspirações para decoração de ambientes internos',
    memberCount: 2156,
    imageUrl: '/placeholder.svg?height=40&width=40',
    color: '#FFD166',
    icon: Palette,
  },
  {
    id: 'c4',
    name: 'Paisagismo',
    description: 'Tudo sobre jardins, plantas e áreas externas',
    memberCount: 987,
    imageUrl: '/placeholder.svg?height=40&width=40',
    color: '#06D6A0',
    icon: TreePine,
  },
  {
    id: 'c5',
    name: 'Reformas & DIY',
    description: 'Compartilhe suas reformas e projetos faça-você-mesmo',
    memberCount: 4521,
    imageUrl: '/placeholder.svg?height=40&width=40',
    color: '#118AB2',
    icon: Wrench,
  },
];

// Mock data para posts (mesmo do anterior)
const generateMockPosts = (): Post[] => {
  const basePosts = [
    {
      id: '1',
      title: 'Projeto de Reforma Concluído!',
      content:
        'Acabei de finalizar um projeto incrível! Reforma completa de uma casa de 200m². O cliente ficou muito satisfeito com o resultado. Gratidão por mais essa oportunidade! 🏠✨',
      authorId: 'user1',
      communityId: 'c2',
      hashtags: ['reforma', 'sucesso', 'gratidao'],
      createdAt: '2025-01-06T10:00:00Z',
      updatedAt: '2025-01-06T10:00:00Z',
      author: {
        id: 'user1',
        name: 'Carlos Pereira',
        role: 'Pedreiro',
        level: 'GOLD',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      community: {
        id: 'c2',
        name: 'Construção Civil',
        color: '#4ECDC4',
      },
      likes: 28,
      comments: 8,
      isLiked: false,
      imageUrl: '/placeholder.svg?height=400&width=600',
    },
    {
      id: '2',
      title: '',
      content:
        'Pessoal, alguém tem indicação de fornecedor de material elétrico na zona sul? Preciso para um projeto grande. Obrigada! ⚡',
      authorId: 'user2',
      communityId: 'c2',
      hashtags: ['duvida', 'fornecedor', 'eletrica'],
      createdAt: '2025-01-05T16:30:00Z',
      updatedAt: '2025-01-05T16:30:00Z',
      author: {
        id: 'user2',
        name: 'Ana Silva',
        role: 'Eletricista',
        level: 'SILVER',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      community: {
        id: 'c2',
        name: 'Construção Civil',
        color: '#4ECDC4',
      },
      likes: 12,
      comments: 23,
      isLiked: false,
    },
    {
      id: '3',
      title: 'Nova Parceria Firmada',
      content:
        'Muito feliz em anunciar nossa nova parceria com uma construtora renomada da cidade! Vamos fornecer todos os materiais para um condomínio de 50 casas. 🎉',
      authorId: 'user3',
      communityId: 'c5',
      hashtags: ['parceria', 'negocios', 'crescimento'],
      createdAt: '2025-01-05T14:30:00Z',
      updatedAt: '2025-01-05T14:30:00Z',
      author: {
        id: 'user3',
        name: 'Materiais São Paulo',
        role: 'Fornecedor Parceiro',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      community: {
        id: 'c5',
        name: 'Reformas & DIY',
        color: '#118AB2',
      },
      likes: 45,
      comments: 15,
      isLiked: true,
    },
    {
      id: '4',
      title: 'Dica de Decoração',
      content:
        'Plantas são vida! 🌱 Acabei de decorar um apartamento pequeno usando apenas plantas e alguns elementos naturais. O resultado ficou incrível e o cliente amou!',
      authorId: 'user4',
      communityId: 'c3',
      hashtags: ['decoracao', 'plantas', 'sustentavel'],
      createdAt: '2025-01-04T11:15:00Z',
      updatedAt: '2025-01-04T11:15:00Z',
      author: {
        id: 'user4',
        name: 'Marina Decorações',
        role: 'Love Decoration',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      community: {
        id: 'c3',
        name: 'Decoração de Interiores',
        color: '#FFD166',
      },
      likes: 67,
      comments: 12,
      isLiked: false,
      imageUrl: '/placeholder.svg?height=400&width=600',
    },
    {
      id: '5',
      title: 'Curso de Soldagem Concluído',
      content:
        'Finalizei mais um curso de aperfeiçoamento! Agora estou certificado em soldagem TIG. Sempre buscando evoluir na profissão! 💪',
      authorId: 'user5',
      communityId: 'c2',
      hashtags: ['curso', 'certificacao', 'soldagem'],
      createdAt: '2025-01-03T09:20:00Z',
      updatedAt: '2025-01-03T09:20:00Z',
      author: {
        id: 'user5',
        name: 'Roberto Santos',
        role: 'Soldador',
        level: 'PLATINUM',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      community: {
        id: 'c2',
        name: 'Construção Civil',
        color: '#4ECDC4',
      },
      likes: 34,
      comments: 6,
      isLiked: false,
    },
    {
      id: '6',
      title: '',
      content:
        'Alguém sabe onde encontrar azulejos vintage para um projeto especial? Cliente quer algo bem específico dos anos 70. Aceito sugestões! 🔍',
      authorId: 'user6',
      communityId: 'c1',
      hashtags: ['azulejos', 'vintage', 'ajuda'],
      createdAt: '2025-01-02T15:45:00Z',
      updatedAt: '2025-01-02T15:45:00Z',
      author: {
        id: 'user6',
        name: 'Lucia Arquitetura',
        role: 'Arquiteta',
        level: 'GOLD',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      community: {
        id: 'c1',
        name: 'Arquitetura & Design',
        color: '#FF6B6B',
      },
      likes: 19,
      comments: 31,
      isLiked: false,
    },
    {
      id: '7',
      title: 'Promoção Especial',
      content:
        '🔥 PROMOÇÃO: 20% de desconto em todos os pisos laminados até o final do mês! Aproveitem, pessoal. Estoque limitado!',
      authorId: 'user7',
      communityId: 'c5',
      hashtags: ['promocao', 'pisos', 'desconto'],
      createdAt: '2025-01-01T12:00:00Z',
      updatedAt: '2025-01-01T12:00:00Z',
      author: {
        id: 'user7',
        name: 'Pisos & Revestimentos',
        role: 'Fornecedor Parceiro',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      community: {
        id: 'c5',
        name: 'Reformas & DIY',
        color: '#118AB2',
      },
      likes: 89,
      comments: 24,
      isLiked: true,
    },
    {
      id: '8',
      title: 'Projeto Sustentável',
      content:
        'Acabei de finalizar um projeto 100% sustentável! Casa com energia solar, captação de água da chuva e materiais reciclados. O futuro é verde! 🌍♻️',
      authorId: 'user8',
      communityId: 'c1',
      hashtags: ['sustentavel', 'energia-solar', 'reciclagem'],
      createdAt: '2024-12-30T08:30:00Z',
      updatedAt: '2024-12-30T08:30:00Z',
      author: {
        id: 'user8',
        name: 'João Engenheiro',
        role: 'Engenheiro Civil',
        level: 'PLATINUM',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      community: {
        id: 'c1',
        name: 'Arquitetura & Design',
        color: '#FF6B6B',
    },
      likes: 156,
      comments: 42,
      isLiked: false,
      imageUrl: '/placeholder.svg?height=400&width=600',
    },
  ];

  return basePosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

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
  const [newPost, setNewPost] = useState({ title: '', content: '', hashtags: '', communityId: '', imageUrl: '' });
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

  // Simular carregamento inicial
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCommunities(mockCommunities);
      const allPosts = generateMockPosts();
      const filteredPosts = communityId ? allPosts.filter((post) => post.communityId === communityId) : allPosts;

      setPosts(filteredPosts);

      if (communityId) {
        const community = mockCommunities.find((c) => c.id === communityId);
        if (community) {
          setSelectedCommunity(community);
        }
      }

      setLoading(false);
    };

    loadData();
  }, [communityId]);

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
    if (posts.length >= 20) return;

    setIsLoadingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const morePosts = generateMockPosts()
      .map((post) => ({ ...post, id: `new-${post.id}-${Date.now()}` }))
      .slice(0, 5);

    const filteredMorePosts = communityId ? morePosts.filter((post) => post.communityId === communityId) : morePosts;

    setPosts((prev) => [...prev, ...filteredMorePosts]);
    setIsLoadingMore(false);
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

  const getUserRole = () => {
    if (!user) return 'Usuário';
    if (user.professional) return `${user.professional.profession} • ${user.professional.level}`;
    if (user.partnerSupplier) return 'Fornecedor Parceiro';
    if (user.loveDecoration) return 'Love Decoration';
    return 'Usuário';
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

      const selectedCommunityData = communities.find((c) => c.id === newPost.communityId);

      const postData = {
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        authorId: user.id,
        communityId: newPost.communityId,
        hashtags,
        imageUrl: newPost.imageUrl || undefined,
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newPostResponse = {
        id: `new-${Date.now()}`,
        ...postData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: user.id,
          name: getUserName(),
          role: getUserRole(),
          avatar: getUserAvatar(),
        },
        community: {
          id: selectedCommunityData?.id || '',
          name: selectedCommunityData?.name || '',
          color: selectedCommunityData?.color,
        },
        likes: 0,
        comments: 0,
        isLiked: false,
      };

      setPosts((prev) => [newPostResponse, ...prev]);
      setNewPost({ title: '', content: '', hashtags: '', communityId: '', imageUrl: '' });
      setIsPostDialogOpen(false);
    } catch (error) {
      console.error('Erro ao criar post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user || likingPosts.has(postId)) return;

    setLikingPosts((prev) => new Set(prev).add(postId));

    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      await new Promise((resolve) => setTimeout(resolve, 300));

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
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
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const openCommentModal = async (post: Post) => {
    setSelectedPost(post);
    setIsCommentModalOpen(true);
    setLoadingComments(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockComments: Comment[] = [
        {
          id: 'c1',
          userId: 'user5',
          postId: post.id,
          content: 'Ficou incrível! Parabéns pelo trabalho.',
          createdAt: new Date(new Date().getTime() - 3600000).toISOString(),
          updatedAt: new Date(new Date().getTime() - 3600000).toISOString(),
          author: {
            id: 'user5',
            name: 'Roberto Santos',
            role: 'Soldador',
            avatar: '/placeholder.svg?height=40&width=40',
          },
        },
        {
          id: 'c2',
          userId: 'user2',
          postId: post.id,
          content: 'Que legal! Você usou quais materiais?',
          createdAt: new Date(new Date().getTime() - 7200000).toISOString(),
          updatedAt: new Date(new Date().getTime() - 7200000).toISOString(),
          author: {
            id: 'user2',
            name: 'Ana Silva',
            role: 'Eletricista',
            avatar: '/placeholder.svg?height=40&width=40',
          },
        },
      ];

      setComments(mockComments);
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
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newCommentData = {
        id: `comment-${Date.now()}`,
        userId: user.id,
        postId: selectedPost.id,
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: user.id,
          name: getUserName(),
          role: getUserRole(),
          avatar: getUserAvatar(),
        },
      };

      setComments((prev) => [...prev, newCommentData]);
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
      router.push('/timeline');
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes + b.comments - (a.likes + a.comments);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Componente do filtro lateral
  const CommunityFilters = ({ className = '' }: { className?: string }) => (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-[#511A2B]" />
        <h3 className="font-semibold text-[#511A2B]">Filtrar por Comunidade</h3>
      </div>

      {/* Opção "Todas" */}
      <Button
        variant={selectedCommunity === null ? 'default' : 'ghost'}
        className={cn(
          'w-full justify-start h-auto p-3 transition-all duration-200',
          selectedCommunity === null
            ? 'bg-[#511A2B] text-white shadow-md'
            : 'hover:bg-[#511A2B]/5 text-[#511A2B]/80 hover:text-[#511A2B]'
        )}
        onClick={() => handleCommunityFilter(null)}
      >
        <div className="flex items-center gap-3 w-full">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
              selectedCommunity === null ? 'bg-white/20' : 'bg-gradient-to-br from-[#511A2B]/10 to-[#511A2B]/20'
            )}
          >
            <Users className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-medium">Todas as Comunidades</div>
            <div className="text-xs opacity-70">Timeline completa</div>
          </div>
        </div>
      </Button>

      {/* Filtros de ordenação */}
      <div className="border-t border-[#511A2B]/10 pt-4 space-y-2">
        <h4 className="text-sm font-medium text-[#511A2B]/70 mb-2">Ordenar por:</h4>
        <div className="flex flex-col gap-1">
          <Button
            variant={sortBy === 'recent' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              'justify-start h-8 text-sm',
              sortBy === 'recent'
                ? 'bg-[#511A2B] text-white'
                : 'hover:bg-[#511A2B]/5 text-[#511A2B]/70 hover:text-[#511A2B]'
            )}
            onClick={() => setSortBy('recent')}
          >
            <Clock className="w-4 h-4 mr-2" />
            Mais Recentes
          </Button>
          <Button
            variant={sortBy === 'popular' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              'justify-start h-8 text-sm',
              sortBy === 'popular'
                ? 'bg-[#511A2B] text-white'
                : 'hover:bg-[#511A2B]/5 text-[#511A2B]/70 hover:text-[#511A2B]'
            )}
            onClick={() => setSortBy('popular')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Mais Populares
          </Button>
        </div>
      </div>

      {/* Lista de comunidades */}
      <div className="space-y-2">
        {communities.map((community) => {
          const Icon = community.icon;
          const isSelected = selectedCommunity?.id === community.id;

          return (
            <Button
              key={community.id}
              variant={isSelected ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start h-auto p-3 transition-all duration-200',
                isSelected ? 'text-white shadow-md' : 'hover:bg-[#511A2B]/5 text-[#511A2B]/80 hover:text-[#511A2B]'
              )}
              style={
                isSelected
                  ? {
                      backgroundColor: community.color,
                    }
                  : {}
              }
              onClick={() => handleCommunityFilter(community)}
            >
              <div className="flex items-center gap-3 w-full">
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                    isSelected ? 'bg-white/20' : 'bg-white shadow-sm'
                  )}
                  style={
                    !isSelected
                      ? {
                          backgroundColor: `${community.color}15`,
                          color: community.color,
                        }
                      : {}
                  }
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{community.name}</div>
                  <div className="text-xs opacity-70 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {community.memberCount.toLocaleString()}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );

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
                <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B]">
                  {selectedCommunity ? selectedCommunity.name : 'Timeline da Comunidade'}
                </h1>
                <p className="text-[#511A2B]/70 text-sm md:text-base">
                  {selectedCommunity
                    ? selectedCommunity.description ||
                      `Comunidade com ${selectedCommunity.memberCount.toLocaleString()} membros`
                    : 'Acompanhe as últimas publicações de todas as comunidades'}
                </p>
              </div>

              {/* Botão para criar post */}
              {user && (
                <div className="flex items-center gap-2">
                  {/* Filtro mobile */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="lg:hidden border-[#511A2B]/20 text-[#511A2B]">
                        <Menu className="w-4 h-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <CommunityFilters className="mt-6" />
                    </SheetContent>
                  </Sheet>

                  <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl px-4 md:px-6 py-2 md:py-3 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span className="hidden md:inline">Criar Post</span>
                        <span className="md:hidden">Post</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-[#511A2B]">Criar Nova Publicação</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={getUserAvatar() || '/placeholder.svg'} />
                            <AvatarFallback className="bg-[#511A2B] text-white">
                              {getUserName()
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-[#511A2B]">{getUserName()}</p>
                            <p className="text-sm text-[#511A2B]/60">{getUserRole()}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[#511A2B]">Selecione uma comunidade</label>
                          <select
                            className="w-full rounded-md border border-[#511A2B]/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#511A2B]/30"
                            value={newPost.communityId}
                            onChange={(e) => setNewPost((prev) => ({ ...prev, communityId: e.target.value }))}
                            required
                          >
                            <option value="" disabled>
                              Selecione uma comunidade
                            </option>
                            {communities.map((community) => (
                              <option key={community.id} value={community.id}>
                                {community.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <Input
                          placeholder="Título (opcional)"
                          value={newPost.title}
                          onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
                          className="border-[#511A2B]/20 focus:border-[#511A2B]"
                        />

                        <Textarea
                          placeholder="Compartilhe uma experiência, tire uma dúvida ou conte sobre seu trabalho..."
                          value={newPost.content}
                          onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                          className="min-h-[120px] border-[#511A2B]/20 focus:border-[#511A2B]"
                          maxLength={500}
                        />

                        <div className="relative">
                          <Hash className="absolute left-3 top-3 w-4 h-4 text-[#511A2B]/50" />
                          <Input
                            placeholder="hashtags separadas por vírgula (ex: reforma, dica, ajuda)"
                            value={newPost.hashtags}
                            onChange={(e) => setNewPost((prev) => ({ ...prev, hashtags: e.target.value }))}
                            className="pl-10 border-[#511A2B]/20 focus:border-[#511A2B]"
                          />
                        </div>

                        <div className="relative">
                          <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-[#511A2B]/50" />
                          <Input
                            placeholder="URL da imagem (opcional)"
                            value={newPost.imageUrl}
                            onChange={(e) => setNewPost((prev) => ({ ...prev, imageUrl: e.target.value }))}
                            className="pl-10 border-[#511A2B]/20 focus:border-[#511A2B]"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#511A2B]/50">{newPost.content.length}/500</span>
                          <Button
                            onClick={handleCreatePost}
                            disabled={!newPost.content.trim() || !newPost.communityId || submitting}
                            className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white"
                          >
                            {submitting ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4 mr-2" />
                            )}
                            Publicar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filtros laterais - Desktop */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-6">
                  <CommunityFilters />
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
                                <AvatarImage src={post.author.avatar || '/placeholder.svg'} />
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
                                  {post.author.level && (
                                    <Badge className="bg-[#FEC460] text-[#511A2B] text-xs">{post.author.level}</Badge>
                                  )}
                                </div>
                                <div className="flex items-center text-xs text-[#511A2B]/60 space-x-2">
                                  <span>{post.author.role}</span>
                                  <span>•</span>
                                  <span>{formatDate(post.createdAt)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Link href={`/community/${post.communityId}`}>
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
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Bookmark className="mr-2 h-4 w-4" />
                                    <span>Salvar post</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    <span>Seguir {post.author.name}</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
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
                                onClick={() => handleLike(post.id)}
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
                                {post.comments > 0 ? `Ver ${post.comments} comentários` : 'Comentar'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}

                  {/* Indicador de carregamento de mais posts */}
                  {sortedPosts.length > 0 && (
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
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Modal de Comentários */}
      <Dialog open={isCommentModalOpen} onOpenChange={setIsCommentModalOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-[#511A2B]">Comentários</DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsCommentModalOpen(false)} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          {selectedPost && (
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Post original */}
              <div className="border-b border-[#511A2B]/10 pb-4 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedPost.author.avatar || '/placeholder.svg'} />
                    <AvatarFallback className="bg-[#511A2B] text-white">
                      {selectedPost.author.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-[#511A2B]">{selectedPost.author.name}</h4>
                      <Badge
                        style={{
                          backgroundColor: selectedPost.community.color || '#511A2B',
                          color: '#fff',
                        }}
                      >
                        {selectedPost.community.name}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#511A2B]/60">{selectedPost.author.role}</p>
                  </div>
                </div>
                {selectedPost.title && <h3 className="font-semibold text-[#511A2B] mb-2">{selectedPost.title}</h3>}
                <p className="text-[#511A2B]/80">{selectedPost.content}</p>

                {selectedPost.imageUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <img
                      src={selectedPost.imageUrl || '/placeholder.svg'}
                      alt="Imagem do post"
                      className="w-full h-auto object-cover max-h-[300px]"
                    />
                  </div>
                )}
              </div>

              {/* Lista de comentários */}
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4 mb-4">
                  {loadingComments ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex space-x-3">
                          <div className="w-8 h-8 bg-[#511A2B]/10 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="bg-[#511A2B]/5 rounded-lg p-3 space-y-2">
                              <div className="h-3 bg-[#511A2B]/10 rounded w-24"></div>
                              <div className="h-4 bg-[#511A2B]/10 rounded w-full"></div>
                              <div className="h-4 bg-[#511A2B]/10 rounded w-3/4"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-[#511A2B]/20 mx-auto mb-3" />
                      <p className="text-[#511A2B]/60">Seja o primeiro a comentar</p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.author.avatar || '/placeholder.svg'} />
                          <AvatarFallback className="bg-[#FEC460] text-[#511A2B] text-xs">
                            {comment.author.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-[#511A2B]/5 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-[#511A2B] text-sm">{comment.author.name}</span>
                              <span className="text-xs text-[#511A2B]/50">{formatDate(comment.createdAt)}</span>
                            </div>
                            <p className="text-[#511A2B]/80 text-sm">{comment.content}</p>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 ml-2">
                            <button className="text-xs text-[#511A2B]/50 hover:text-[#511A2B] transition-colors">
                              Curtir
                            </button>
                            <button className="text-xs text-[#511A2B]/50 hover:text-[#511A2B] transition-colors">
                              Responder
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* Formulário de novo comentário */}
              {user && (
                <div className="border-t border-[#511A2B]/10 pt-4 mt-auto">
                  <div className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={getUserAvatar() || '/placeholder.svg'} />
                      <AvatarFallback className="bg-[#511A2B] text-white text-xs">
                        {getUserName()
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="relative">
                        <Textarea
                          placeholder="Escreva um comentário..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="min-h-[80px] border-[#511A2B]/20 focus:border-[#511A2B] pr-10"
                          maxLength={300}
                        />
                        <div className="absolute right-3 bottom-3 flex space-x-2">
                          <button className="text-[#511A2B]/50 hover:text-[#511A2B] transition-colors">
                            <Smile className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#511A2B]/50">{newComment.length}/300</span>
                        <Button
                          onClick={handleAddComment}
                          disabled={!newComment.trim() || submitting}
                          size="sm"
                          className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white"
                        >
                          {submitting ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4 mr-2" />
                          )}
                          Comentar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
