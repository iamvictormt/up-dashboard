'use client';

import type React from 'react';

import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/contexts/user-context';
import { useCommunity } from '@/contexts/community-context';
import { ImageIcon, X, Loader2, Hash } from 'lucide-react';
import { uploadImage } from '@/utils/image-upload';
import { createPost } from '@/lib/post-api';
import { useMuralUpdate } from '@/contexts/mural-update-context';
import { Badge } from '../ui/badge';

interface CreatePostFormProps {
  communityId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function CreatePostForm({ communityId, onCancel, onSuccess }: CreatePostFormProps) {
  const { user } = useUser();
  const { selectedCommunity } = useCommunity();
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

      // Upload image if present
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      // Create post
      await createPost({
        title: title.trim(),
        content: content.trim(),
        communityId,
        hashtags,
        authorId: user.id,
      });

      triggerUpdate();

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
          <Input
            placeholder="Título (opcional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-gray-200"
          />

          <Textarea
            placeholder="O que você quer compartilhar?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] border-gray-200"
            required
          />

          <div className="space-y-2">
            <div className="relative">
              <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                ref={hashtagInputRef}
                placeholder="Hashtags (espaço ou vírgula para adicionar)"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={handleHashtagInputKeyDown}
                onBlur={handleHashtagInputBlur}
                className="pl-10 border-gray-200"
              />
            </div>

            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {hashtags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full p-0 hover:bg-gray-300"
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

          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview || '/placeholder.svg'}
                alt="Preview"
                className="w-full h-auto rounded-lg object-cover max-h-[300px]"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
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
