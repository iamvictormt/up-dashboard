'use client';

import type React from 'react';

import { useRef, useState } from 'react';
import type { Post } from '@/types/post';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { uploadImage } from '@/utils/image-upload';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { updatePost } from '@/lib/post-api';
import { useMuralUpdate } from '@/contexts/mural-update-context';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  onPostUpdated?: (post: Post) => void;
}

export function EditPostModal({ isOpen, onClose, post, onPostUpdated }: EditPostModalProps) {
  const { triggerUpdate } = useMuralUpdate();
  const [title, setTitle] = useState(post.title || '');
  const [content, setContent] = useState(post.content || '');
  const [hashtags, setHashtags] = useState<string[]>(post.hashtags || []);
  const [hashtagInput, setHashtagInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(post.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hashtagInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);

      if (hashtagInput.trim()) {
        addHashtag();
      }

      let imageUrl = post.image;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const updatedPost = await updatePost(post.id, {
        title: title.trim(),
        content: content.trim(),
        hashtags,
        image: imageUrl,
      });

      if (onPostUpdated) {
        onPostUpdated(updatedPost);
      }

      triggerUpdate();

      onClose();
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const addHashtag = () => {
    const tags = hashtagInput
      .split(/[\s,]+/)
      .map((tag) => tag.trim().replace(/^#/, ''))
      .filter((tag) => tag.length > 0);

    if (tags.length > 0) {
      const newTags = tags.filter((tag) => !hashtags.includes(tag));
      if (newTags.length > 0) {
        setHashtags([...hashtags, ...newTags]);
      }
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const handleHashtagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHashtag();
    } else if (e.key === ' ' || e.key === ',') {
      e.preventDefault();
      addHashtag();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleHashtagInputBlur = () => {
    if (hashtagInput.trim()) {
      addHashtag();
    }
  };

  const focusHashtagInput = () => {
    if (hashtagInputRef.current) {
      hashtagInputRef.current.focus();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título (opcional)</Label>
            <Input id="title" placeholder="Título do post" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              placeholder="O que você está pensando?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hashtags">Hashtags</Label>
            <div className="flex">
              <Input
                ref={hashtagInputRef}
                id="hashtags"
                placeholder="Hashtags (espaço ou vírgula para adicionar)"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={handleHashtagInputKeyDown}
                onBlur={handleHashtagInputBlur}
                className="flex-1"
              />
            </div>

            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {hashtags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                    #{tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                      onClick={() => removeHashtag(tag)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remover hashtag</span>
                    </Button>
                  </Badge>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-gray-500 hover:text-gray-700"
                  onClick={focusHashtagInput}
                >
                  + Adicionar mais
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Imagem</Label>
            {imagePreview ? (
              <div className="relative group">
                <img src={imagePreview || '/placeholder.svg'} alt="Preview" className="w-full h-auto rounded-md" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remover imagem</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6">
                <label htmlFor="image-upload" className="flex flex-col items-center justify-center cursor-pointer">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Clique para adicionar uma imagem</span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
