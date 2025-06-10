import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { X, MessageCircle, Smile, Send, Loader2 } from "lucide-react";
import React from "react";

interface CommentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPost: any; // Tipar conforme seu modelo
  comments: any[];
  loadingComments: boolean;
  newComment: string;
  setNewComment: (value: string) => void;
  submitting: boolean;
  handleAddComment: () => void;
  user: any; // Tipar conforme seu modelo
  getUserAvatar: () => string;
  getUserName: () => string;
  formatDate: (date: string) => string;
}

export const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onOpenChange,
  selectedPost,
  comments,
  loadingComments,
  newComment,
  setNewComment,
  submitting,
  handleAddComment,
  user,
  getUserAvatar,
  getUserName,
  formatDate,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-[#511A2B]">Comentários</DialogTitle>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {selectedPost && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <PostDisplay post={selectedPost} />
            <ScrollArea className="flex-1 pr-4">
              <CommentList
                comments={comments}
                loading={loadingComments}
                formatDate={formatDate}
              />
            </ScrollArea>
            {user && (
              <NewCommentForm
                user={user}
                getUserAvatar={getUserAvatar}
                getUserName={getUserName}
                newComment={newComment}
                setNewComment={setNewComment}
                handleAddComment={handleAddComment}
                submitting={submitting}
              />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const PostDisplay = ({ post }: { post: any }) => (
  <div className="border-b border-[#511A2B]/10 pb-4 mb-4">
    <div className="flex items-center space-x-3 mb-3">
      <Avatar className="w-10 h-10">
        <AvatarImage src={post.author.profileImage || "/placeholder.svg"} />
        <AvatarFallback className="bg-[#511A2B] text-white">
          {post.author.name.split(" ").map((n: string) => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center space-x-2">
          <h4 className="font-medium text-[#511A2B]">{post.author.name}</h4>
          <Badge style={{ backgroundColor: post.community.color || "#511A2B", color: "#fff" }}>
            {post.community.name}
          </Badge>
        </div>
        <p className="text-sm text-[#511A2B]/60">{post.author.role}</p>
      </div>
    </div>
    {post.title && <h3 className="font-semibold text-[#511A2B] mb-2">{post.title}</h3>}
    <p className="text-[#511A2B]/80">{post.content}</p>
    {post.imageUrl && (
      <div className="mt-3 rounded-lg overflow-hidden">
        <img
          src={post.imageUrl || "/placeholder.svg"}
          alt="Imagem do post"
          className="w-full h-auto object-cover max-h-[300px]"
        />
      </div>
    )}
  </div>
);

const CommentList = ({
  comments,
  loading,
  formatDate,
}: {
  comments: any[];
  loading: boolean;
  formatDate: (date: string) => string;
}) => {
  if (loading) {
    return (
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
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-[#511A2B]/20 mx-auto mb-3" />
        <p className="text-[#511A2B]/60">Seja o primeiro a comentar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={comment.author.profileImage || "/placeholder.svg"} />
            <AvatarFallback className="bg-[#FEC460] text-[#511A2B] text-xs">
              {comment.author.name.split(" ").map((n: string) => n[0]).join("")}
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
              {/* <button className="text-xs text-[#511A2B]/50 hover:text-[#511A2B] transition-colors">
                Curtir
              </button> */}
              <button className="text-xs text-[#511A2B]/50 hover:text-[#511A2B] transition-colors">
                Excluir
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const NewCommentForm = ({
  user,
  getUserAvatar,
  getUserName,
  newComment,
  setNewComment,
  handleAddComment,
  submitting,
}: {
  user: any;
  getUserAvatar: () => string;
  getUserName: () => string;
  newComment: string;
  setNewComment: (value: string) => void;
  handleAddComment: () => void;
  submitting: boolean;
}) => (
  <div className="border-t border-[#511A2B]/10 pt-4 mt-auto">
    <div className="flex space-x-3">
      <Avatar className="w-8 h-8">
        <AvatarImage src={getUserAvatar() || "/placeholder.svg"} />
        <AvatarFallback className="bg-[#511A2B] text-white text-xs">
          {getUserName().split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="relative group">
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
);
