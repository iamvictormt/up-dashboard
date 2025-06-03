'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, MessageCircle, Share2, Calendar, Plus, Send, Hash, Loader2, X } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import api from '@/services/api';
import { toast } from 'sonner';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  hashtags: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    role: string;
    profileImage?: string;
    level?: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
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
    profileImage?: string;
  };
}

export function MuralContent() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', hashtags: '' });
  const [newComment, setNewComment] = useState('');
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const response = await api.get('/posts');
      setPosts(response.data);
      setLoading(false);
    };
    loadPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Agora há pouco';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 48) return 'Ontem';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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

  const getUserProfileImage = () => {
    if (user?.profileImage) return user.profileImage;
    return '/placeholder.svg?height=40&width=40';
  };

  const handleCreatePost = async () => {
    if (!newPost.content.trim() || !user) return;

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
        hashtags,
      };

      // Simular chamada da API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const newPostResponse = await response.json();

        // Adicionar o novo post no início da lista
        const postWithAuthor = {
          ...newPostResponse,
          author: {
            id: user.id,
            name: getUserName(),
            role: getUserRole(),
            profileImage: getUserProfileImage(),
          },
          likes: 0,
          comments: 0,
          isLiked: false,
        };

        setPosts((prev) => [postWithAuthor, ...prev]);
        setNewPost({ title: '', content: '', hashtags: '' });
        setIsPostDialogOpen(false);
        toast.success('Post publicado com sucesso!');
      }
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

      if (post.isLiked) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/likes/${postId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        toast.info('Você retirou sua curtida esse post!');
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/likes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            userId: user.id,
            postId: postId,
          }),
        });
        toast.success('Você curtiu esse post!');
      }

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
      const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/comments/post/${post.id}`);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId: user.id,
          postId: selectedPost.id,
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        const newCommentResponse = await response.json();

        const commentWithAuthor = {
          ...newCommentResponse,
          author: {
            id: user.id,
            name: getUserName(),
            role: getUserRole(),
            profileImage: getUserProfileImage(),
          },
        };

        setComments((prev) => [...prev, commentWithAuthor]);
        setNewComment('');

        // Atualizar contador de comentários no post
        setPosts((prev) => prev.map((p) => (p.id === selectedPost.id ? { ...p, comments: p.comments + 1 } : p)));
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 w-full">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 md:p-6 lg:p-8 border border-[#511A2B]/10 shadow-lg w-full">
          <div className="max-w-7xl mx-auto">
            {/* Header skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-[#511A2B]/10 rounded-lg w-64 mb-2"></div>
              <div className="h-4 bg-[#511A2B]/10 rounded-lg w-96"></div>
            </div>

            {/* Posts skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="bg-white/90 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl h-[450px]">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#511A2B]/10 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-[#511A2B]/10 rounded w-24"></div>
                        <div className="h-3 bg-[#511A2B]/10 rounded w-20"></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-4 bg-[#511A2B]/10 rounded w-full"></div>
                    <div className="h-4 bg-[#511A2B]/10 rounded w-3/4"></div>
                    <div className="h-4 bg-[#511A2B]/10 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header do Mural */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#511A2B] mb-2">Mural da Comunidade</h1>
                <p className="text-[#511A2B]/70">
                  Compartilhe experiências, tire dúvidas e conecte-se com outros profissionais
                </p>
              </div>

              {/* Botão para criar post */}
              {user && (
                <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl px-6 py-3 flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Criar Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-[#511A2B]">Criar Nova Publicação</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={getUserProfileImage() || '/placeholder.svg'} />
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

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#511A2B]/50">{newPost.content.length}/500</span>
                        <Button
                          onClick={handleCreatePost}
                          disabled={!newPost.content.trim() || submitting}
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
              )}
            </div>
          </div>

          {/* Lista de Posts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="bg-white/90 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl shadow-sm hover:shadow-md transition-all h-[450px] flex flex-col"
              >
                {/* Header - Altura fixa */}
                <CardHeader className="pb-3 flex-shrink-0 h-[80px]">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.author.profileImage || "/placeholder.svg"} />
                      <AvatarFallback className="bg-[#511A2B] text-white">
                        {post.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-[#511A2B] text-sm truncate">{post.author.name}</h3>
                        {post.author.level && (
                          <Badge className="bg-[#FEC460] text-[#511A2B] text-xs">{post.author.level}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-[#511A2B]/60 truncate">{post.author.role}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Calendar className="w-3 h-3 text-[#511A2B]/50" />
                        <span className="text-xs text-[#511A2B]/50">{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-4 pt-0">
                  {/* Título - Altura fixa */}
                  <div className="h-[40px] mb-3">
                    {post.title ? (
                      <h2 className="text-sm font-semibold text-[#511A2B] leading-tight line-clamp-2">
                        {truncateText(post.title, 50)}
                      </h2>
                    ) : (
                      <div className="h-[40px]"></div>
                    )}
                  </div>

                  {/* Conteúdo - Altura fixa */}
                  <div className="h-[120px] mb-4">
                    <p className="text-sm text-[#511A2B]/80 leading-relaxed line-clamp-5">
                      {truncateText(post.content, 150)}
                    </p>
                  </div>

                  {/* Espaçador flexível */}
                  <div className="flex-1"></div>

                  {/* Tags - Altura fixa no rodapé */}
                  <div className="h-[24px] mb-4">
                    {post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.hashtags.slice(0, 2).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-[#511A2B]/10 text-[#511A2B] hover:bg-[#511A2B]/20 cursor-pointer text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                        {post.hashtags.length > 2 && (
                          <Badge variant="secondary" className="bg-[#511A2B]/10 text-[#511A2B] text-xs">
                            +{post.hashtags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Botões - Altura fixa */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#511A2B]/10 h-[50px]">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        disabled={likingPosts.has(post.id)}
                        className={`flex items-center space-x-1 text-xs transition-all duration-200 ${
                          post.isLiked ? "text-red-500 hover:text-red-600" : "text-[#511A2B]/60 hover:text-[#511A2B]"
                        } ${likingPosts.has(post.id) ? "scale-110" : ""}`}
                      >
                        <Heart
                          className={`w-4 h-4 transition-all duration-200 ${
                            post.isLiked ? "fill-current scale-110" : ""
                          } ${likingPosts.has(post.id) ? "animate-pulse" : ""}`}
                        />
                        <span>{post.likes}</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openCommentModal(post)}
                        className="flex items-center space-x-1 text-xs text-[#511A2B]/60 hover:text-[#511A2B]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1 text-xs text-[#511A2B]/60 hover:text-[#511A2B]"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Modal de Comentários */}
          <Dialog open={isCommentModalOpen} onOpenChange={setIsCommentModalOpen}>
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
                        <AvatarImage src={selectedPost.author.profileImage || "/placeholder.svg"} />
                        <AvatarFallback className="bg-[#511A2B] text-white">
                          {selectedPost.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-[#511A2B]">{selectedPost.author.name}</h4>
                        <p className="text-sm text-[#511A2B]/60">{selectedPost.author.role}</p>
                      </div>
                    </div>
                    {selectedPost.title && <h3 className="font-semibold text-[#511A2B] mb-2">{selectedPost.title}</h3>}
                    <p className="text-[#511A2B]/80">{selectedPost.content}</p>
                  </div>

                  {/* Lista de comentários */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {loadingComments ? (
                      // Skeleton dos comentários
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
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="flex space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.author.profileImage || "/placeholder.svg"} />
                            <AvatarFallback className="bg-[#FEC460] text-[#511A2B] text-xs">
                              {comment.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
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
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Formulário de novo comentário */}
                  {user && (
                    <div className="border-t border-[#511A2B]/10 pt-4">
                      <div className="flex space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={getUserProfileImage() || "/placeholder.svg"} />
                          <AvatarFallback className="bg-[#511A2B] text-white text-xs">
                            {getUserName()
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <Textarea
                            placeholder="Escreva um comentário..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="min-h-[80px] border-[#511A2B]/20 focus:border-[#511A2B]"
                            maxLength={300}
                          />
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
      </div>
    </div>
  );
}
