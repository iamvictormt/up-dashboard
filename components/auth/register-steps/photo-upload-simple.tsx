'use client';

import type React from 'react';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface PhotoUploadSimpleProps {
  photo: string | null;
  onPhotoChange: (photo: string | null) => void;
}

export function PhotoUploadSimple({ photo, onPhotoChange }: PhotoUploadSimpleProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const allowedTypes = ['image/jpeg', 'image/png'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!allowedTypes.includes(file.type)) {
        toast.error('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onPhotoChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <motion.div
        className="relative group"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {!photo ? (
          <div
            className="w-44 h-44 border-2 border-dashed border-slate-300 rounded-full cursor-pointer hover:border-primary transition-colors duration-200 flex items-center justify-center bg-transparent hover:bg-primary/50"
            onClick={triggerFileInput}
          >
            <Camera className="w-6 h-6 text-slate-400 group-hover:text-primary/40" />
          </div>
        ) : (
          <div className="relative">
            <div className="w-44 h-44 rounded-full overflow-hidden border-3 border-primary/30 shadow-md">
              <img src={photo || '/placeholder.svg'} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
              onClick={removePhoto}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
      </motion.div>

      <div className="text-center">
        <p className="text-sm font-medium text-primary">Foto de perfil</p>
        <p className="text-xs text-muted-foreground">{photo ? 'Clique no X para remover' : 'Opcional'}</p>
      </div>
    </div>
  );
}
