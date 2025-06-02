"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Heart, MessageCircle, Share2, Eye, Calendar, Pin, Plus, Send, ImageIcon, Smile } from "lucide-react"
import { useUser } from "@/contexts/user-context"

interface Publication {
  id: string
  title: string
  content: string
  author: {
    name: string
    role: string
    avatar?: string
    isAdmin?: boolean
  }
  createdAt: string
  likes: number
  comments: number
  views: number
  isPinned: boolean
  tags: string[]
  image?: string
  type: "admin" | "user"
}

const mockPublications: Publication[] = [
  {
    id: "1",
    title: "Bem-vindos à nova versão da UP Connection!",
    content:
      "Estamos muito felizes em apresentar as novas funcionalidades da nossa plataforma. Agora você pode encontrar profissionais qualificados, fornecedores confiáveis e muito mais.",
    author: {
      name: "Equipe UP Connection",
      role: "Administrador",
      avatar: "/placeholder.svg?height=40&width=40",
      isAdmin: true,
    },
    createdAt: "2025-01-06T10:00:00Z",
    likes: 45,
    comments: 12,
    views: 234,
    isPinned: true,
    tags: ["Novidades", "Plataforma"],
    image: "/placeholder.svg?height=200&width=400",
    type: "admin",
  },
  {
    id: "2",
    title: "",
    content:
      "Acabei de finalizar um projeto incrível! Reforma completa de uma casa de 200m². O cliente ficou muito satisfeito com o resultado. Gratidão por mais essa oportunidade! 🏠✨",
    author: {
      name: "Carlos Pereira",
      role: "Pedreiro • GOLD",
      avatar: "https://randomuser.me/api/portraits/men/68.jpg",
      isAdmin: false,
    },
    createdAt: "2025-01-05T16:30:00Z",
    likes: 28,
    comments: 8,
    views: 156,
    isPinned: false,
    tags: ["Reforma", "Sucesso"],
    type: "user",
  },
  {
    id: "3",
    title: "Dicas para profissionais: Como se destacar na plataforma",
    content:
      "Quer aumentar sua visibilidade e conquistar mais clientes? Confira nossas dicas exclusivas para profissionais. Mantenha seu perfil atualizado e sempre entregue qualidade.",
    author: {
      name: "Maria Santos",
      role: "Gerente de Comunidade",
      avatar: "https://randomuser.me/api/portraits/women/23.jpg",
      isAdmin: true,
    },
    createdAt: "2025-01-05T14:30:00Z",
    likes: 67,
    comments: 15,
    views: 289,
    isPinned: false,
    tags: ["Dicas", "Profissionais"],
    type: "admin",
  },
  {
    id: "4",
    title: "",
    content:
      "Pessoal, alguém tem indicação de fornecedor de material elétrico na zona sul? Preciso para um projeto grande. Obrigada! ⚡",
    author: {
      name: "Ana Silva",
      role: "Eletricista • SILVER",
      avatar: "https://randomuser.me/api/portraits/women/42.jpg",
      isAdmin: false,
    },
    createdAt: "2025-01-04T11:15:00Z",
    likes: 12,
    comments: 23,
    views: 89,
    isPinned: false,
    tags: ["Dúvida", "Fornecedor"],
    type: "user",
  },
]

export function MuralContent() {
  const { user } = useUser()
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [newPost, setNewPost] = useState("")
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false)
  const [canPostThisWeek, setCanPostThisWeek] = useState(true) // Simular controle semanal

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const handleCreatePost = () => {
    if (newPost.trim()) {
      // Aqui você faria a chamada para a API
      console.log("Novo post:", newPost)
      setNewPost("")
      setIsPostDialogOpen(false)
      setCanPostThisWeek(false) // Simular que já postou esta semana
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Agora há pouco"
    if (diffInHours < 24) return `${diffInHours}h atrás`
    if (diffInHours < 48) return "Ontem"
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  const getUserName = () => {
    if (!user) return "Usuário"
    if (user.professional) return user.professional.name
    if (user.partnerSupplier) return user.partnerSupplier.tradeName
    if (user.loveDecoration) return user.loveDecoration.name
    return user.email.split("@")[0]
  }

  const getUserRole = () => {
    if (!user) return "Usuário"
    if (user.professional) return `${user.professional.profession} • ${user.professional.level}`
    if (user.partnerSupplier) return "Fornecedor Parceiro"
    if (user.loveDecoration) return "Love Decoration"
    return "Usuário"
  }

  const getUserAvatar = () => {
    if (user?.profileImage) return user.profileImage
    if (user?.profileImage) return user.profileImage
    return "/placeholder.svg?height=40&width=40"
  }

  // Separar posts por tipo
  const adminPosts = mockPublications.filter((post) => post.type === "admin")
  const userPosts = mockPublications.filter((post) => post.type === "user")

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
                  Compartilhe experiências, tire dúvidas e fique por dentro das novidades
                </p>
              </div>

              {/* Botão para criar post */}
              {user && (
                <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl px-6 py-3 flex items-center gap-2"
                      disabled={!canPostThisWeek}
                    >
                      <Plus className="w-4 h-4" />
                      {canPostThisWeek ? "Criar Post" : "Já postou esta semana"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-[#511A2B]">Criar Nova Publicação</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={getUserAvatar() || "/placeholder.svg"} />
                          <AvatarFallback className="bg-[#511A2B] text-white">
                            {getUserName()
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-[#511A2B]">{getUserName()}</p>
                          <p className="text-sm text-[#511A2B]/60">{getUserRole()}</p>
                        </div>
                      </div>
                      <Textarea
                        placeholder="Compartilhe uma experiência, tire uma dúvida ou conte sobre seu trabalho..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="min-h-[120px] border-[#511A2B]/20 focus:border-[#511A2B]"
                        maxLength={500}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-[#511A2B]/60">
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-[#511A2B]/60">
                            <Smile className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#511A2B]/50">{newPost.length}/500</span>
                          <Button
                            onClick={handleCreatePost}
                            disabled={!newPost.trim()}
                            className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Publicar
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-[#511A2B]/50">
                        💡 Você pode fazer 1 publicação por semana. Use com sabedoria!
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Layout em Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna Principal - Posts dos Admins */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-[#511A2B] rounded-full"></div>
                <h2 className="text-xl font-semibold text-[#511A2B]">Novidades da Plataforma</h2>
              </div>

              {adminPosts.map((publication) => (
                <Card
                  key={publication.id}
                  className="bg-white/90 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl shadow-sm hover:shadow-md transition-all"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12 rounded-xl">
                          <AvatarImage src={publication.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="rounded-xl bg-[#511A2B] text-white">
                            {publication.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-[#511A2B]">{publication.author.name}</h3>
                            {publication.isPinned && <Pin className="w-4 h-4 text-[#511A2B]" />}
                            {publication.author.isAdmin && (
                              <Badge className="bg-[#511A2B] text-white text-xs">Admin</Badge>
                            )}
                          </div>
                          <p className="text-sm text-[#511A2B]/60">{publication.author.role}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Calendar className="w-3 h-3 text-[#511A2B]/50" />
                            <span className="text-xs text-[#511A2B]/50">{formatDate(publication.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {publication.title && (
                      <h2 className="text-lg font-semibold text-[#511A2B] leading-tight">{publication.title}</h2>
                    )}
                    <p className="text-[#511A2B]/80 leading-relaxed">{publication.content}</p>

                    {publication.image && (
                      <div className="rounded-xl overflow-hidden">
                        <img
                          src={publication.image || "/placeholder.svg"}
                          alt="Imagem da publicação"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {publication.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-[#511A2B]/10 text-[#511A2B] hover:bg-[#511A2B]/20"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#511A2B]/10">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(publication.id)}
                          className={`flex items-center space-x-2 ${
                            likedPosts.has(publication.id)
                              ? "text-red-500 hover:text-red-600"
                              : "text-[#511A2B]/60 hover:text-[#511A2B]"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${likedPosts.has(publication.id) ? "fill-current" : ""}`} />
                          <span>{publication.likes + (likedPosts.has(publication.id) ? 1 : 0)}</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center space-x-2 text-[#511A2B]/60 hover:text-[#511A2B]"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{publication.comments}</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center space-x-2 text-[#511A2B]/60 hover:text-[#511A2B]"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-[#511A2B]/50">
                        <Eye className="w-3 h-3" />
                        <span>{publication.views}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar - Posts da Comunidade */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-[#FEC460] rounded-full"></div>
                <h2 className="text-lg font-semibold text-[#511A2B]">Comunidade</h2>
              </div>

              {userPosts.map((publication) => (
                <Card
                  key={publication.id}
                  className="bg-white/80 backdrop-blur-sm border-[#511A2B]/10 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10 rounded-lg">
                        <AvatarImage src={publication.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="rounded-lg bg-[#FEC460] text-[#511A2B]">
                          {publication.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-[#511A2B] text-sm truncate">{publication.author.name}</h4>
                        </div>
                        <p className="text-xs text-[#511A2B]/60">{publication.author.role}</p>
                        <p className="text-xs text-[#511A2B]/50 mt-1">{formatDate(publication.createdAt)}</p>
                      </div>
                    </div>

                    <p className="text-sm text-[#511A2B]/80 leading-relaxed">{publication.content}</p>

                    <div className="flex flex-wrap gap-1">
                      {publication.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-[#FEC460]/20 text-[#511A2B] text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#511A2B]/10">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(publication.id)}
                          className={`flex items-center space-x-1 text-xs ${
                            likedPosts.has(publication.id)
                              ? "text-red-500 hover:text-red-600"
                              : "text-[#511A2B]/60 hover:text-[#511A2B]"
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${likedPosts.has(publication.id) ? "fill-current" : ""}`} />
                          <span>{publication.likes + (likedPosts.has(publication.id) ? 1 : 0)}</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center space-x-1 text-xs text-[#511A2B]/60 hover:text-[#511A2B]"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>{publication.comments}</span>
                        </Button>
                      </div>

                      <div className="flex items-center space-x-1 text-xs text-[#511A2B]/50">
                        <Eye className="w-3 h-3" />
                        <span>{publication.views}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Card de incentivo para postar */}
              {user && canPostThisWeek && (
                <Card className="bg-gradient-to-br from-[#FEC460]/20 to-[#511A2B]/10 border-[#FEC460]/30 rounded-xl">
                  <CardContent className="p-4 text-center space-y-3">
                    <div className="w-12 h-12 bg-[#FEC460] rounded-full flex items-center justify-center mx-auto">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#511A2B] mb-1">Compartilhe com a comunidade!</h3>
                      <p className="text-sm text-[#511A2B]/70 mb-3">
                        Conte sobre seus projetos, tire dúvidas ou ajude outros profissionais.
                      </p>
                      <Button
                        onClick={() => setIsPostDialogOpen(true)}
                        className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white text-sm"
                      >
                        Criar Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
