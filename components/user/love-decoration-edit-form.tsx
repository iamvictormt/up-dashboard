'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Instagram, Phone, Save, User } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { updateLoveDecoration } from '@/lib/user-api';
import { toast } from 'sonner';

interface LoveDecorationData {
  name: string;
  contact: string;
  instagram?: string;
  tiktok?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface LoveDecorationEditFormProps {
  loveDecoration: any;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onClose: () => void;
}

export function LoveDecorationEditForm({
  loveDecoration,
  isLoading,
  setIsLoading,
  onClose,
}: LoveDecorationEditFormProps) {
  const { updateUser } = useUser();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState<LoveDecorationData>({
    name: loveDecoration?.name || '',
    contact: loveDecoration?.contact || '',
    instagram: loveDecoration?.instagram || '',
    tiktok: loveDecoration?.tiktok || '',
  });

  const validateRequiredFields = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!formData.contact.trim()) {
      errors.contact = 'Telefone é obrigatório';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getChangedFields = () => {
    const changedFields: any = {};

    if (formData.name !== loveDecoration.name) {
      changedFields.name = formData.name;
    }

    if (formData.contact !== loveDecoration.contact) {
      changedFields.contact = formData.contact;
    }

    if (formData.instagram !== loveDecoration.instagram) {
      changedFields.instagram = formData.instagram;
    }

    if (formData.tiktok !== loveDecoration.tiktok) {
      changedFields.tiktok = formData.tiktok;
    }

    return changedFields;
  };

  const hasChanges = () => {
    const changedFields = getChangedFields();
    return Object.keys(changedFields).length > 0;
  };

  const saveProfileData = async () => {
    try {
      const changedFields = getChangedFields();

      if (Object.keys(changedFields).length === 0) {
        return true;
      }

      const response = await updateLoveDecoration(changedFields);

      if (response.status !== 200) {
        throw new Error('Erro ao salvar dados do perfil');
      }

      updateUser({
        ...loveDecoration,
        ...changedFields,
      });

      return true;
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao salvar dados do perfil. Tente novamente.');
      return false;
    }
  };

  const handleSave = async () => {
    setValidationErrors({});

    if (!validateRequiredFields()) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true);

    try {
      const success = await saveProfileData();

      if (success) {
        toast.success('Perfil editado com sucesso.');
        onClose();
      }
    } catch (error) {
      console.error('Erro geral ao salvar:', error);
      toast.error('Erro inesperado ao salvar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const FieldError = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
      <div className="flex items-center space-x-1 mt-1">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <span className="text-sm text-red-500">{error}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-[#511A2B]" htmlFor="name">
              Nome *
            </Label>
            <div className="relative">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Seu nome completo"
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <FieldError error={validationErrors.name} />
          </div>

          <div>
            <Label className="text-[#511A2B]" htmlFor="contact">
              Telefone *
            </Label>{' '}
            <div className="relative">
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData((prev) => ({ ...prev, contact: e.target.value }))}
                placeholder="(11) 99999-9999"
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                onBlur={(e) => {
                  e.target.value.length !== 15 ? setFormData((prev) => ({ ...prev, contact: '' })) : '';
                }}
              />
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <FieldError error={validationErrors.contact} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-[#511A2B]" htmlFor="instagram">
              Instagram
            </Label>
            <div className="relative">
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))}
                placeholder="@seuinstagram"
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
              <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <FieldError error={validationErrors.instagram} />
          </div>

          <div>
            <Label className="text-[#511A2B]" htmlFor="tiktok">
              TikTok
            </Label>
            <div className="relative">
              <Input
                id="tiktok"
                value={formData.tiktok}
                onChange={(e) => setFormData((prev) => ({ ...prev, tiktok: e.target.value }))}
                placeholder="@seutiktok"
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
              </svg>
            </div>
            <FieldError error={validationErrors.tiktok} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button onClick={handleSave} variant="secondary" disabled={isLoading || !hasChanges()}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
}
