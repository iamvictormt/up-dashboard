'use client';

import { useRef, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { X, Camera, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface PhotoUploadProps {
  photo: string | null;
  onPhotoChange: (photo: string | null) => void;
}

export function PhotoUpload({ photo, onPhotoChange }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const allowedTypes = ['image/jpeg', 'image/png'];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast.error('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onPhotoChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        {!photo ? (
          <div
            className="relative w-64 h-64 border-2 border-dashed border-primary/30 rounded-full cursor-pointer hover:border-primary/50 transition-all duration-300 group-hover:scale-105"
            onClick={triggerFileInput}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors duration-300">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">Adicionar foto</p>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="relative group">
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <img src={photo || '/placeholder.svg'} alt="Profile photo" className="w-full h-full object-cover" />
            </div>

            {/* Overlay com botões */}
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={triggerFileInput}
                  className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white text-black"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={removePhoto}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-foreground/80">Foto de perfil</p>
        <p className="text-xs text-muted-foreground mt-1 mb-2">Tamanho máximo: 2MB • Formatos: JPG, PNG</p>
      </div>
    </div>
  );
}
