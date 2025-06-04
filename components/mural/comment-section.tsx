'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Send, MoreHorizontal, Flag, Pencil, Trash2 } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Comment, createComment, deleteComment, fetchCommentsByPost, updateComment } from '@/lib/comment-api';
import { ReportModal } from './report-modal';
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

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reportingComment, setReportingComment] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deletingComment, setDeletingComment] = useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  useEffect(() => {
    async function loadComments() {
      try {
        setLoading(true);
        const data = await fetchCommentsByPost(postId);
        setComments(data);
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [postId]);

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      setSubmitting(true);
      const comment = await createComment({
        postId,
        content: newComment.trim(),
        userId: user.id,
      });

      setComments((prev) => [...prev, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async () => {
    if (!editingComment || !editContent.trim()) return;

    try {
      setSubmitting(true);
      const updatedComment = await updateComment(editingComment.id, editContent.trim());

      setComments((prev) => prev.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment)));
      setEditingComment(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!deletingComment) return;

    try {
      setIsDeleteLoading(true);
      await deleteComment(deletingComment);

      setComments((prev) => prev.filter((comment) => comment.id !== deletingComment));
      setDeletingComment(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditContent('');
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

  return (
    <div className="p-5">
      {/* Comment Input */}
      {user && (
        <div className="flex gap-3 mb-6">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profileImage || '/placeholder.svg?height=32&width=32'} />
            <AvatarFallback>{user.professional?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <Textarea
              placeholder="Escreva um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none mb-2"
            />

            <div className="flex justify-end">
              <Button
                className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
                size="sm"
              >
                <Send className="h-4 w-4" />
                Comentar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">
          {comments.length} {comments.length === 1 ? 'Comentário' : 'Comentários'}
        </h4>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-16 w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author?.profileImage || '/placeholder.svg?height=32&width=32'} />
                <AvatarFallback>{comment.author.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{comment.author.name}</span>
                    <span className="text-xs text-gray-500 ml-2">{formatDate(comment.createdAt)}</span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Mais opções</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {comment.isMine ? (
                        <>
                          <DropdownMenuItem onClick={() => startEditing(comment)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            <span>Editar comentário</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeletingComment(comment.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span>Excluir comentário</span>
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <DropdownMenuItem onClick={() => setReportingComment(comment.id)} className="text-red-600">
                          <Flag className="h-4 w-4 mr-2" />
                          <span>Reportar comentário</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {editingComment?.id === comment.id ? (
                  <div className="mt-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[80px] resize-none mb-2"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={cancelEditing} disabled={submitting}>
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={handleEditComment} disabled={!editContent.trim() || submitting}>
                        Salvar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 text-gray-700">
                    <p>{comment.content}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {!loading && comments.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <p>Seja o primeiro a comentar!</p>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {reportingComment && (
        <ReportModal
          isOpen={!!reportingComment}
          onClose={() => setReportingComment(null)}
          targetId={reportingComment}
          targetType="COMMENT"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingComment} onOpenChange={(open) => !open && setDeletingComment(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir comentário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleteLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteComment}
              disabled={isDeleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleteLoading ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
