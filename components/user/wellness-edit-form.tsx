'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Fingerprint, MessageCircle, Phone, Save, User } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { toast } from 'sonner';
import { updateWellness } from '@/lib/wellness-api';
import { applyDocumentMask, applyPhoneMask } from '@/utils/masks';
import { uploadImageCloudinary } from '@/lib/user-api';
import { PhotoUploadSimple } from '@/components/auth/register-steps/photo-upload-simple';
import { OpeningHoursInput } from '@/components/store/store-form';

interface WellnessEditFormProps {
  wellness: any;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onClose: () => void;
}

export function WellnessEditForm({ wellness, isLoading, setIsLoading, onClose }: WellnessEditFormProps) {
  const { updateUser } = useUser();
  const [formData, setFormData] = useState({
    name: wellness?.name || '',
    document: wellness?.document || '',
    contact: wellness?.contact || '',
    description: wellness?.description || '',
    whatsappMessage: wellness?.whatsappMessage || '',
    openingHours: wellness?.openingHours || '',
  });
  const [logo, setLogo] = useState<string | null>(wellness?.logoUrl || null);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório.');
      return;
    }
    if (formData.document.replace(/\D/g, '').length !== 11) {
      toast.error('CPF inválido.');
      return;
    }

    try {
      setIsLoading(true);
      let logoUrl = logo || undefined;
      if (logo && !logo.includes('res.cloudinary.com')) {
        logoUrl = (await uploadImageCloudinary(logo)) || undefined;
      }
      const payload = { ...formData, logoUrl };
      const response = await updateWellness(payload);
      if (response.status !== 200) throw new Error('Erro ao salvar');
      updateUser({ ...wellness, ...payload });
      toast.success('Perfil atualizado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar wellness:', error);
      toast.error('Erro ao salvar o perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-[#511A2B]" optional>
          Logo do negócio
        </Label>
        <PhotoUploadSimple photo={logo} onPhotoChange={setLogo} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#511A2B]" htmlFor="wellness-name" required>
            Nome do negócio
          </Label>
          <div className="relative">
            <Input
              id="wellness-name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Espaço Zen Massoterapia"
              className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
            />
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[#511A2B]" htmlFor="wellness-document" required>
            CPF (do responsável/MEI)
          </Label>
          <div className="relative">
            <Input
              id="wellness-document"
              value={formData.document}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, document: applyDocumentMask(e.target.value) }))
              }
              placeholder="000.000.000-00"
              className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
            />
            <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#511A2B]" htmlFor="wellness-contact" required>
            Contato (WhatsApp)
          </Label>
          <div className="relative">
            <Input
              id="wellness-contact"
              value={formData.contact}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, contact: applyPhoneMask(e.target.value) }))
              }
              placeholder="(00) 00000-0000"
              className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
            />
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[#511A2B]" htmlFor="wellness-wa-message" optional>
            Mensagem do WhatsApp
          </Label>
          <div className="relative">
            <Input
              id="wellness-wa-message"
              value={formData.whatsappMessage}
              onChange={(e) => setFormData((prev) => ({ ...prev, whatsappMessage: e.target.value }))}
              placeholder="Texto pré-preenchido ao clicarem no seu WhatsApp"
              className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
            />
            <MessageCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[#511A2B]" htmlFor="wellness-opening-hours" optional>
          Horário de atendimento
        </Label>
        {/* mesmo seletor de horário usado pela loja do lojista parceiro */}
        <OpeningHoursInput
          value={formData.openingHours}
          onChange={(value) => setFormData((prev) => ({ ...prev, openingHours: value }))}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[#511A2B]" htmlFor="wellness-description" optional>
          Descrição
        </Label>
        <Textarea
          id="wellness-description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Conte sobre o negócio e os serviços oferecidos"
          className="bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button onClick={handleSave} variant="secondary" disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
}
