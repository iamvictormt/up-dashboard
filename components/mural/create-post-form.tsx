'use client';

import type React from 'react';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/contexts/user-context';
import { useCommunity } from '@/contexts/community-context';
import { ImageIcon, X, Loader2, Hash } from 'lucide-react';
import { uploadImage } from '@/utils/image-upload';
import { createPost } from '@/lib/post-api';

interface CreatePostFormProps {
  communityId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function CreatePostForm({ communityId, onCancel, onSuccess }: CreatePostFormProps) {
  const { user } = useUser();
  const { selectedCommunity } = useCommunity();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // Process hashtags
      const hashtagArray = hashtags
        .split(/[,\s]+/)
        .map((tag) => tag.trim().replace(/^#/, ''))
        .filter((tag) => tag.length > 0);

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
        hashtags: hashtagArray,
        authorId: user.id,
      });

      onSuccess();
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Falha ao criar post. Tente novamente.');
    } finally {
      setSubmitting(false);
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

          <div className="relative">
            <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Hashtags separadas por espaço ou vírgula"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="pl-10 border-gray-200"
            />
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
