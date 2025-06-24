'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Building, Fingerprint, IdCard, Phone, Save, Tickets, User } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Profession } from '@/types';
import { fetchProfessions } from '@/lib/professions-api';
import { toast } from 'sonner';
import { updateProfessional } from '@/lib/user-api';
import { applyDocumentMask, applyPhoneMask } from '@/utils/masks';

interface ProfessionalData {
  name: string;
  professionId?: string;
  document?: string;
  generalRegister?: string;
  registrationAgency?: string;
  description?: string;
  experience?: string;
  officeName?: string;
  phone: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface ProfessionalEditFormProps {
  professional: any;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onClose: () => void;
}

export function ProfessionalEditForm({ professional, isLoading, setIsLoading, onClose }: ProfessionalEditFormProps) {
  const { updateUser } = useUser();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [professions, setProfessions] = useState<Profession[]>([]);

  async function loadProfessions() {
    try {
      const response = await fetchProfessions();
      setProfessions(response);
    } catch (err) {
      toast.error('Erro ao carregar as profissões, contate o administrador');
      console.error(err);
    } finally {
    }
  }

  const [formData, setFormData] = useState<ProfessionalData>({
    name: professional?.name || '',
    professionId: professional?.professionId || '',
    document: professional?.document || '',
    generalRegister: professional?.generalRegister || '',
    registrationAgency: professional?.registrationAgency || '',
    // description: professional?.description || '',
    // experience: professional?.experience || '',
    officeName: professional?.officeName || '',
    phone: professional?.phone || '',
  });

  const validateRequiredFields = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Telefone é obrigatório';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getChangedFields = () => {
    const changedFields: any = {};

    if (formData.name !== professional.name) {
      changedFields.name = formData.name;
    }

    if (formData.professionId !== professional.professionId) {
      changedFields.professionId = formData.professionId;
    }

    if (formData.document !== professional.document) {
      changedFields.document = formData.document;
    }

    if (formData.generalRegister !== professional.generalRegister) {
      changedFields.generalRegister = formData.generalRegister;
    }

    if (formData.registrationAgency !== professional.registrationAgency) {
      changedFields.registrationAgency = formData.registrationAgency;
    }

    // if (formData.description !== professional.description) {
    //   changedFields.description = formData.description;
    // }

    // if (formData.experience !== professional.experience) {
    //   changedFields.experience = formData.experience;
    // }

    if (formData.officeName !== professional.officeName) {
      changedFields.officeName = formData.officeName;
    }

    if (formData.phone !== professional.phone) {
      changedFields.phone = formData.phone;
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

      const response = await updateProfessional(changedFields);

      if (response.status !== 200) {
        throw new Error('Erro ao salvar dados do perfil');
      }

      updateUser({
        ...professional,
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
        toast.success('Perfil atualizado com sucesso!');
        onClose();
      }
    } catch (error) {
      console.error('Erro geral ao salvar:', error);
      toast.error('Erro inesperado ao salvar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfessions();
  }, []);

  // Componente para mostrar erro de campo
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
              Nome completo *
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
            <Label className="text-[#511A2B]" htmlFor="document">
              CPF/CNPJ
            </Label>
            <div className="relative">
              <Input
                id="document"
                value={formData.document}
                onChange={(e) => setFormData((prev) => ({ ...prev, document: applyDocumentMask(e.target.value) }))}
                onBlur={(e) => {
                  e.target.value.length !== 14 && e.target.value.length !== 18
                    ? setFormData((prev) => ({ ...prev, document: '' }))
                    : '';
                }}
                placeholder="123.456.789-00"
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
              <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <FieldError error={validationErrors.document} />
          </div>

          <div>
            <Label className="text-[#511A2B]" htmlFor="phone">
              Whatsapp *
            </Label>
            <div className="relative">
              <Input
                id="phone"
                value={formData.phone}
                placeholder="(11) 99999-9999"
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: applyPhoneMask(e.target.value) }))}
                onBlur={(e) => {
                  e.target.value.length !== 15 ? setFormData((prev) => ({ ...prev, phone: '' })) : '';
                }}
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <FieldError error={validationErrors.phone} />
          </div>

          <div>
            <Label className="text-[#511A2B]" htmlFor="officeName">
              Nome do Escritório
            </Label>
            <div className="relative">
              <Input
                id="officeName"
                value={formData.officeName}
                onChange={(e) => setFormData((prev) => ({ ...prev, officeName: e.target.value }))}
                placeholder="Nome da sua empresa"
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-[#511A2B]" htmlFor="professionId">
              Profissão
            </Label>
            <div className="relative">
              <Select
                value={formData.professionId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, professionId: value }))}
              >
                <SelectTrigger
                  id="profession"
                  className="pl-11 h-12 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                >
                  <SelectValue placeholder="Selecione a profissão" />
                </SelectTrigger>
                <SelectContent className='z-[99999]'>
                  {professions.map((profession) => (
                    <SelectItem key={profession.id} value={profession.id}>
                      {profession.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <IdCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>

          <div>
            <Label className="text-[#511A2B]" htmlFor="generalRegister">
              RG
            </Label>
            <div className="relative">
              <Input
                id="generalRegister"
                value={formData.generalRegister}
                onChange={(e) => setFormData((prev) => ({ ...prev, generalRegister: e.target.value }))}
                placeholder="Número do registro"
                maxLength={10}
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
              <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>
          <div>
            <Label className="text-[#511A2B]" htmlFor="registrationAgency">
              CREA/CAU/ABD
            </Label>
            <div className="relative">
              <Input
                id="registrationAgency"
                value={formData.registrationAgency}
                onChange={(e) => setFormData((prev) => ({ ...prev, registrationAgency: e.target.value }))}
                placeholder="1234567890-0/SP"
                maxLength={20}
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
              <Tickets className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>
        </div>

        {/* <div>
          <Label className="text-[#511A2B]" htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Descreva sua experiência e especialidades"
            rows={3}
          />
        </div>

        <div>
          <Label className="text-[#511A2B]" htmlFor="experience">Experiência</Label>
          <Textarea
            id="experience"
            value={formData.experience}
            onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
            placeholder="Detalhe sua experiência profissional"
            rows={3}
          />
        </div> */}
      </div>

      {/* Footer */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <Button onClick={handleSave} variant="secondary" disabled={isLoading || !hasChanges()}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
}
