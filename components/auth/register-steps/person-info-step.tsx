'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Building, Phone, Instagram, Fingerprint, TicketIcon as Tickets } from 'lucide-react';
import { applyPhoneMask, applyDocumentMask, applyDocumentCnpjMask } from '@/utils/masks';
import { PhotoUploadSimple } from './photo-upload-simple';

type UserType = 'love-decorations' | 'professionals' | 'partner-suppliers';

interface PersonalInfoStepProps {
  userType: UserType;
  formData: any;
  onUpdate: (field: string, value: any) => void;
  onUpdateNested: (section: string, field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PersonalInfoStep({
  userType,
  formData,
  onUpdate,
  onUpdateNested,
  onNext,
  onBack,
}: PersonalInfoStepProps) {
  const handleInputChange = (section: string, field: string, value: string) => {
    if (section === 'loveDecoration' && field === 'contact') {
      onUpdateNested(section, field, applyPhoneMask(value));
    } else if (section === 'professional' && field === 'phone') {
      onUpdateNested(section, field, applyPhoneMask(value));
    } else if (section === 'professional' && field === 'document') {
      onUpdateNested(section, field, applyDocumentMask(value));
    } else if (section === 'partnerSupplier' && field === 'contact') {
      onUpdateNested(section, field, applyPhoneMask(value));
    } else if (section === 'partnerSupplier' && field === 'document') {
      onUpdateNested(section, field, applyDocumentCnpjMask(value));
    } else {
      onUpdateNested(section, field, value);
    }
  };

  const isFormValid = () => {
    if (userType === 'love-decorations') {
      const data = formData.loveDecoration;
      return data.name && data.contact && data.instagram && data.tiktok;
    } else if (userType === 'professionals') {
      const data = formData.professional;
      return (
        data.name && data.officeName && data.document && data.generalRegister && data.registrationAgency && data.phone
      );
    } else if (userType === 'partner-suppliers') {
      const data = formData.partnerSupplier;
      return data.tradeName && data.companyName && data.document && data.stateRegistration && data.contact;
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <PhotoUploadSimple photo={formData.photo} onPhotoChange={(photo) => onUpdate('photo', photo)} />

      <div className="space-y-4">
        {userType === 'love-decorations' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome completo
              </Label>
              <div className="relative">
                <Input
                  value={formData.loveDecoration.name}
                  onChange={(e) => handleInputChange('loveDecoration', 'name', e.target.value)}
                  placeholder="Seu nome completo"
                  required
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact" className="text-sm font-medium">
                  Contato
                </Label>
                <div className="relative">
                  <Input
                    value={formData.loveDecoration.contact}
                    onChange={(e) => handleInputChange('loveDecoration', 'contact', e.target.value)}
                    placeholder="(00) 00000-0000"
                    required
                    onBlur={(e) => {
                      e.target.value.length !== 14 &&
                        e.target.value.length !== 15 &&
                        handleInputChange('loveDecoration', 'contact', '');
                    }}
                  />
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-sm font-medium">
                  Instagram
                </Label>
                <div className="relative">
                  <Input
                    value={formData.loveDecoration.instagram}
                    onChange={(e) => handleInputChange('loveDecoration', 'instagram', e.target.value)}
                    placeholder="@seuinstagram"
                  />
                  <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiktok" className="text-sm font-medium">
                TikTok
              </Label>
              <div className="relative">
                <Input
                  value={formData.loveDecoration.tiktok}
                  onChange={(e) => handleInputChange('loveDecoration', 'tiktok', e.target.value)}
                  placeholder="@seutiktok"
                />
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                </svg>
              </div>
            </div>
          </>
        )}

        {userType === 'professionals' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prof-name" className="text-sm font-medium">
                  Nome completo
                </Label>
                <div className="relative">
                  <Input
                    value={formData.professional.name}
                    onChange={(e) => handleInputChange('professional', 'name', e.target.value)}
                    placeholder="Seu nome completo"
                    required
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="office-name" className="text-sm font-medium">
                  Nome do escritório
                </Label>
                <div className="relative">
                  <Input
                    value={formData.professional.officeName}
                    onChange={(e) => handleInputChange('professional', 'officeName', e.target.value)}
                    placeholder="Nome do seu escritório"
                    required
                  />
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="document" className="text-sm font-medium">
                  CPF/CNPJ
                </Label>
                <div className="relative">
                  <Input
                    value={formData.professional.document}
                    onChange={(e) => handleInputChange('professional', 'document', e.target.value)}
                    placeholder="000.000.000-00/00.000.000/0000-00"
                    required
                    onBlur={(e) => {
                      e.target.value.length !== 14 &&
                        e.target.value.length !== 18 &&
                        handleInputChange('professional', 'document', '');
                    }}
                  />
                  <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rg" className="text-sm font-medium">
                  RG
                </Label>
                <div className="relative">
                  <Input
                    value={formData.professional.generalRegister}
                    onChange={(e) => handleInputChange('professional', 'generalRegister', e.target.value)}
                    placeholder="00.000.000-0"
                    required
                  />
                  <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registration" className="text-sm font-medium">
                  CREA/CAU/ABD
                </Label>
                <div className="relative">
                  <Input
                    value={formData.professional.registrationAgency}
                    onChange={(e) => handleInputChange('professional', 'registrationAgency', e.target.value)}
                    placeholder="1234567890-0/SP"
                    required
                  />
                  <Tickets className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  WhatsApp
                </Label>
                <div className="relative">
                  <Input
                    value={formData.professional.phone}
                    onChange={(e) => handleInputChange('professional', 'phone', e.target.value)}
                    placeholder="(00) 00000-0000"
                    required
                    onBlur={(e) => {
                      e.target.value.length !== 15 &&
                        e.target.value.length !== 14 &&
                        handleInputChange('professional', 'phone', '');
                    }}
                  />
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
              </div>
            </div>
          </>
        )}

        {userType === 'partner-suppliers' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trade-name" className="text-sm font-medium">
                  Nome fantasia
                </Label>
                <div className="relative">
                  <Input
                    value={formData.partnerSupplier.tradeName}
                    onChange={(e) => handleInputChange('partnerSupplier', 'tradeName', e.target.value)}
                    placeholder="Nome fantasia"
                    required
                  />
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-name" className="text-sm font-medium">
                  Razão social
                </Label>
                <div className="relative">
                  <Input
                    value={formData.partnerSupplier.companyName}
                    onChange={(e) => handleInputChange('partnerSupplier', 'companyName', e.target.value)}
                    placeholder="Razão social"
                    required
                  />
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnpj" className="text-sm font-medium">
                  CNPJ
                </Label>
                <div className="relative">
                  <Input
                    value={formData.partnerSupplier.document}
                    onChange={(e) => handleInputChange('partnerSupplier', 'document', e.target.value)}
                    placeholder="00.000.000/0000-00"
                    required
                    onBlur={(e) => {
                      e.target.value.length !== 18 && handleInputChange('partnerSupplier', 'document', '');
                    }}
                  />
                  <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state-reg" className="text-sm font-medium">
                  Inscrição estadual
                </Label>
                <div className="relative">
                  <Input
                    value={formData.partnerSupplier.stateRegistration}
                    onChange={(e) => handleInputChange('partnerSupplier', 'stateRegistration', e.target.value)}
                    placeholder="110.042.490.114"
                    required
                  />
                  <Tickets className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier-contact" className="text-sm font-medium">
                Contato
              </Label>
              <div className="relative">
                <Input
                  value={formData.partnerSupplier.contact}
                  onChange={(e) => handleInputChange('partnerSupplier', 'contact', e.target.value)}
                  placeholder="(00) 00000-0000"
                  required
                  onBlur={(e) => {
                    e.target.value.length !== 15 &&
                      e.target.value.length !== 14 &&
                      handleInputChange('partnerSupplier', 'contact', '');
                  }}
                />
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" onClick={onBack} className="flex-1 h-11">
          Voltar
        </Button>
        <Button variant="secondary" type="button" onClick={onNext} disabled={!isFormValid()} className="flex-1 h-11">
          Continuar
        </Button>
      </div>
    </div>
  );
}
