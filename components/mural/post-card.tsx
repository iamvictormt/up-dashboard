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
import { likePost, unlikePost } from '@/lib/post-api';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useUser();
  const { selectedCommunity } = useCommunity();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

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

      if (isLiked && post.likeId) {
        await unlikePost(post.likeId);
        setLikesCount((prev) => prev - 1);
      } else {
        await likePost({ userId: user.id, postId: post.id });
        setLikesCount((prev) => prev + 1);
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
              <DropdownMenuItem onClick={() => setShowReportModal(true)} className="text-red-600">
                <Flag className="h-4 w-4 mr-2" />
                <span>Reportar post</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Post Content */}
        <div className="mt-4">
          {post.title && <h3 className="text-lg font-semibold mb-2">{post.title}</h3>}
          <div className="prose prose-sm max-w-none">
            <p>{post.content}</p>
          </div>

          {post.image && (
            <div className="mt-4 rounded-lg overflow-hidden">
              <img
                src={post.image || '/placeholder.svg'}
                alt="Post attachment"
                className="w-full h-auto object-cover"
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
            className={`gap-2 ${isLiked ? 'text-red-500' : ''}`}
            onClick={handleLikeToggle}
            disabled={isLikeLoading}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </Button>

          <Button variant="ghost" size="sm" className="gap-2" onClick={handleCommentToggle}>
            <MessageSquare className="h-5 w-5" />
            <span>{post.comments || 0}</span>
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
          <CommentSection postId={post.id} />
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetId={post.id}
        targetType="POST"
      />
    </div>
  );
}
