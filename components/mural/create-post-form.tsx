'use client';

import type React from 'react';

import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/contexts/user-context';
import { useCommunity } from '@/contexts/community-context';
import { ImageIcon, X, Loader2, Hash, Quote } from 'lucide-react';
import { createPost } from '@/lib/post-api';
import { useMuralUpdate } from '@/contexts/mural-update-context';
import { Badge } from '../ui/badge';
import { uploadImageCloudinary } from '@/lib/user-api';
import { useToast } from '@/hooks/use-toast';

interface CreatePostFormProps {
  communityId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function CreatePostForm({ communityId, onCancel, onSuccess }: CreatePostFormProps) {
  const { user } = useUser();
  const { selectedCommunity, updateSelectedCommunity } = useCommunity();
  const { triggerUpdate } = useMuralUpdate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hashtagInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  if (!user) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      if (hashtagInput.trim()) {
        addHashtag();
      }

      let cloudinaryImageURL = null;
      if (image) {
        cloudinaryImageURL = await uploadImageCloudinary(image);
      }

      // Create post
      await createPost({
        title: title.trim(),
        content: content.trim(),
        communityId,
        hashtags,
        authorId: user.id,
        attachedImage: cloudinaryImageURL || '',
      });

      triggerUpdate();
      toast({
        title: 'Post publicado com sucesso! 🚀',
        description: 'Seu post já está visível para todos.',
        duration: 2000,
      });
      updateSelectedCommunity({ postsCount: (selectedCommunity?.postsCount || 0) + 1 });
      onSuccess();
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Falha ao criar post. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
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

  if (communityId === '') {
    return;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profileImage || '/placeholder.svg?height=40&width=40'} />
            <AvatarFallback>{user.professional?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="text-sm font-medium">{user.professional?.name}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              {selectedCommunity && (
                <>
                  <span>Postando em</span>
                  <span className="font-medium">{selectedCommunity.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <Input
              placeholder="Título (opcional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
            />
            <Quote className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-primary transition-colors text-gray-400" />
          </div>

          <Textarea
            placeholder="O que você quer compartilhar?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
            required
          />

          <div className="space-y-2">
            <div className="relative group">
              <Input
                ref={hashtagInputRef}
                placeholder="Hashtags (espaço ou vírgula para adicionar)"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={handleHashtagInputKeyDown}
                onBlur={handleHashtagInputBlur}
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-primary transition-colors text-gray-400" />
            </div>

            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {hashtags.map((tag) => (
                  <Badge key={tag} variant="default" className="pl-2 pr-1 flex items-center gap-1">
                    {tag}
                    <Button variant="ghost" size="xs" onClick={() => removeHashtag(tag)}>
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remover hashtag</span>
                    </Button>
                  </Badge>
                ))}
                <Button variant="ghost" size="xs" className="p-4" onClick={focusHashtagInput}>
                  + Adicionar mais
                </Button>
              </div>
            )}
          </div>

          {imagePreview ? (
            <div className="relative group">
              <img
                src={imagePreview || '/placeholder.svg'}
                alt="Preview"
                className="w-full h-auto rounded-lg object-cover max-h-[300px]"
              />
              <Button
                type="button"
                variant="destructive"
                size="lg"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <span>Adicionar imagem</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          )}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!content.trim() || submitting}
              style={{
                backgroundColor: selectedCommunity?.color || '#000',
                borderColor: 'transparent',
                color: 'white',
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publicando...
                </>
              ) : (
                'Publicar'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
