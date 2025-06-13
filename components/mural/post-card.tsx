'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Heart, MessageSquare, Share2, MoreHorizontal, Flag } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { useCommunity } from '@/contexts/community-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Post } from '@/types/post';
import { CommentSection } from './comment-section';
import { ReportModal } from './report-modal';
import { deletePost, likePost, unlikePost } from '@/lib/post-api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { EditPostModal } from './edit-post-modal';
import { useToast } from '@/hooks/use-toast';
import { useMuralUpdate } from '@/contexts/mural-update-context';

interface PostCardProps {
  post: Post;
  onPostDeleted?: (postId: string) => void;
  onPostUpdated?: (post: Post) => void;
  likeIdChange?: (postId: string, newLikeId: string) => void;
}

export function PostCard({ post, onPostUpdated, onPostDeleted, likeIdChange }: PostCardProps) {
  const { user } = useUser();
  const { selectedCommunity, updateSelectedCommunity } = useCommunity();
  const { triggerUpdate } = useMuralUpdate();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments || 0);
  const [showComments, setShowComments] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { toast } = useToast();

  // Function to dynamically get icon from string name
  const getIconByName = (iconName: string): LucideIcon => {
    const icon = (LucideIcons as Record<string, LucideIcon>)[iconName];
    return icon || LucideIcons.Hash;
  };

  const CommunityIcon = selectedCommunity ? getIconByName(selectedCommunity.icon) : LucideIcons.Hash;

  const handleLikeToggle = async () => {
    if (!user) return;

    try {
      setIsLikeLoading(true);
      let likeId = '';

      if (isLiked) {
        await unlikePost(post.id);
        setLikesCount((prev) => prev - 1);
        toast({
          title: 'Curtida removida 💔',
          description: 'Você retirou sua reação deste post.',
          duration: 2000,
        });
      } else {
        likeId = await likePost({ userId: user.id, postId: post.id });
        setLikesCount((prev) => prev + 1);
        toast({
          title: 'Like adicionado! ❤️',
          description: 'Você acabou de curtir este conteúdo.',

          duration: 2000,
        });
      }
      if (likeIdChange) {
        likeIdChange(post.id, likeId);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleCommentToggle = () => {
    setShowComments(!showComments);
  };

  const handleDeletePost = async () => {
    try {
      setIsDeleteLoading(true);
      await deletePost(post.id);
      setShowDeleteDialog(false);
      if (onPostDeleted) {
        onPostDeleted(post.id);
      }
      updateSelectedCommunity({ postsCount: (selectedCommunity?.postsCount || 0) - 1 });
      toast({
        title: 'Post excluído! 🗑️',
        description: 'Esse post não está mais disponível.',
        duration: 2000,
      });
      triggerUpdate();
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch (error) {
      return 'data desconhecida';
    }
  };

  const handleNewComment = () => {
    setCommentsCount((count) => count + 1);
  };

  const handleRemoveComment = () => {
    setCommentsCount((count) => count - 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Post Header */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.profileImage || '/placeholder.svg?height=40&width=40'} />
              <AvatarFallback>{post.author.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{post.author.name}</span>
                {post.author.badge && (
                  <Badge variant="outline" className="text-xs py-0 h-5">
                    {post.author.badge}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                <span>{formatDate(post.createdAt)}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  {selectedCommunity && (
                    <>
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${selectedCommunity.color}20`, color: selectedCommunity.color }}
                      >
                        <CommunityIcon className="h-2.5 w-2.5" />
                      </div>
                      <span>{selectedCommunity.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-5 w-5" />
                <span className="sr-only">Mais opções</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {post.isMine ? (
                <>
                  <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                    <LucideIcons.Pencil className="h-4 w-4 mr-2" />
                    <span>Editar post</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
                    <LucideIcons.Trash2 className="h-4 w-4 mr-2" />
                    <span>Excluir post</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => setShowReportModal(true)} className="text-red-600">
                  <Flag className="h-4 w-4 mr-2" />
                  <span>Reportar post</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Post Content */}
        <div className="mt-4">
          {post.title && <h3 className="text-lg font-semibold mb-2">{post.title}</h3>}
          <div className="prose prose-sm max-w-none">
            <p>{post.content}</p>
          </div>

          {post.attachedImage && (
            <div className="mt-4 rounded-lg overflow-hidden place-items-center">
              <img
                src={post.attachedImage || '/placeholder.svg'}
                alt="Post attachment"
                className="object-cover"
                style={{ width: '50vh', height: '50vh' }}
              />
            </div>
          )}

          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {post.hashtags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${isLiked ? 'text-red-500 hover:text-red-500/80' : ''}`}
            onClick={handleLikeToggle}
            disabled={isLikeLoading}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </Button>

          <Button variant="ghost" size="sm" className="gap-2" onClick={handleCommentToggle}>
            <MessageSquare className="h-5 w-5" />
            <span>{commentsCount || 0}</span>
          </Button>

          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="h-5 w-5" />
            <span>Compartilhar</span>
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100">
          <CommentSection postId={post.id} onNewComment={handleNewComment} onCommentRemoved={handleRemoveComment} />
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetId={post.id}
        targetType="POST"
      />

      {/* Edit Post Modal */}
      {showEditModal && (
        <EditPostModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          post={post}
          onPostUpdated={onPostUpdated}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir post</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleteLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              disabled={isDeleteLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleteLoading ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
