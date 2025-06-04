import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Hash, Send, Loader2 } from 'lucide-react';

interface CreatePostDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  newPost: any;
  setNewPost: any;
  communities: Community[];
  getUserAvatar: () => string | null | undefined;
  getUserName: () => string;
  handleCreatePost: () => void;
  submitting: boolean;
}

export function CreatePostDialog({
  isOpen,
  setIsOpen,
  newPost,
  setNewPost,
  communities,
  getUserAvatar,
  getUserName,
  handleCreatePost,
  submitting,
}: CreatePostDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className='mt-4'>
        <Button className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl px-4 md:px-6 py-2 md:py-3 flex items-center ml-2">
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
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#511A2B]">Selecione uma comunidade</label>
            <select
              className="w-full rounded-md border border-[#511A2B]/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#511A2B]/30"
              value={newPost.communityId}
              onChange={(e) => setNewPost((prev: Post) => ({ ...prev, communityId: e.target.value }))}
              required
            >
              <option value="" disabled>
                Selecione uma comunidade
              </option>
              {communities.map((community: Community) => (
                <option key={community.id} value={community.id}>
                  {community.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            placeholder="Título"
            value={newPost.title}
            onChange={(e) => setNewPost((prev: Post) => ({ ...prev, title: e.target.value }))}
            className="border-[#511A2B]/20 focus:border-[#511A2B]"
          />

          <Textarea
            placeholder="Compartilhe uma experiência, tire uma dúvida ou conte sobre seu trabalho..."
            value={newPost.content}
            onChange={(e) => setNewPost((prev: Post) => ({ ...prev, content: e.target.value }))}
            className="min-h-[120px] border-[#511A2B]/20 focus:border-[#511A2B]"
            maxLength={500}
          />

          <div className="relative">
            <Hash className="absolute left-3 top-3 w-4 h-4 text-[#511A2B]/50" />
            <Input
              placeholder="hashtags separadas por vírgula (ex: reforma, dica, ajuda)"
              value={newPost.hashtags}
              onChange={(e) => setNewPost((prev: any) => ({ ...prev, hashtags: e.target.value }))}
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
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Publicar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
