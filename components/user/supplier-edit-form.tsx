'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Building, Fingerprint, Phone, Save, Tickets } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { toast } from 'sonner';
import { updatePartnerSupplier } from '@/lib/user-api';
import { applyDocumentCnpjMask, applyPhoneMask } from '@/utils/masks';

interface SupplierData {
  tradeName: string;
  companyName: string;
  document: string;
  stateRegistration?: string;
  contact: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface SupplierEditFormProps {
  supplier: any;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onClose: () => void;
}

export function SupplierEditForm({ supplier, isLoading, setIsLoading, onClose }: SupplierEditFormProps) {
  const { updateUser } = useUser();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState<SupplierData>({
    tradeName: supplier?.tradeName || '',
    companyName: supplier?.companyName || '',
    document: supplier?.document || '',
    stateRegistration: supplier?.stateRegistration || '',
    contact: supplier?.contact || '',
  });

  const validateRequiredFields = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.tradeName.trim()) {
      errors.tradeName = 'Nome comercial é obrigatório';
    }

    if (!formData.companyName.trim()) {
      errors.companyName = 'Razão social é obrigatória';
    }

    if (!formData.document.trim()) {
      errors.document = 'CNPJ é obrigatório';
    }

    if (!formData.contact.trim()) {
      errors.contact = 'Telefone é obrigatório';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getChangedFields = () => {
    const changedFields: any = {};

    if (formData.tradeName !== supplier.tradeName) {
      changedFields.tradeName = formData.tradeName;
    }

    if (formData.companyName !== supplier.companyName) {
      changedFields.companyName = formData.companyName;
    }

    if (formData.document !== supplier.document) {
      changedFields.document = formData.document;
    }

    if (formData.stateRegistration !== supplier.stateRegistration) {
      changedFields.stateRegistration = formData.stateRegistration;
    }

    if (formData.contact !== supplier.contact) {
      changedFields.contact = formData.contact;
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

      const response = await updatePartnerSupplier(changedFields);

      if (response.status !== 200) {
        throw new Error('Erro ao salvar dados do fornecedor');
      }

      updateUser({
        ...supplier,
        ...changedFields,
      });

      return true;
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
      toast.error('Erro ao salvar dados do fornecedor. Tente novamente.');
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
        toast.success('Dados do fornecedor atualizados com sucesso!');
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
          <div className="space-y-2">
            <Label className="text-[#511A2B]" htmlFor="trade-name">
              Nome fantasia *
            </Label>
            <div className="relative">
              <Input
                id="tradeName"
                value={formData.tradeName}
                onChange={(e) => setFormData((prev) => ({ ...prev, tradeName: e.target.value }))}
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                placeholder="Nome fantasia"
              />
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <FieldError error={validationErrors.tradeName} />
          </div>

          <div className="space-y-2">
            <Label className="text-[#511A2B]" htmlFor="companyName">
              Razão Social *
            </Label>
            <div className="relative">
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                placeholder="Razão social"
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <FieldError error={validationErrors.companyName} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-[#511A2B]" htmlFor="document">
              CNPJ *
            </Label>
            <div className="relative">
              <Input
                id="document"
                value={formData.document}
                onChange={(e) => setFormData((prev) => ({ ...prev, document: applyDocumentCnpjMask(e.target.value) }))}
                onBlur={(e) => {
                  e.target.value.length !== 18 ? setFormData((prev) => ({ ...prev, document: '' })) : '';
                }}
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                placeholder="00.000.000/0000-00"
              />{' '}
              <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <FieldError error={validationErrors.document} />
          </div>

          <div className="space-y-2">
            <Label className="text-[#511A2B]" htmlFor="contact">
              Telefone *
            </Label>
            <div className="relative">
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData((prev) => ({ ...prev, contact: applyPhoneMask(e.target.value) }))}
                onBlur={(e) => {
                  e.target.value.length !== 15 ? setFormData((prev) => ({ ...prev, contact: '' })) : '';
                }}
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                placeholder="(11) 99999-9999"
              />
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <FieldError error={validationErrors.contact} />
          </div>

          <div className="space-y-2">
            <Label className="text-[#511A2B]" htmlFor="stateRegistration">
              Inscrição Estadual
            </Label>
            <div className="relative">
              <Input
                id="stateRegistration"
                value={formData.stateRegistration}
                onChange={(e) => setFormData((prev) => ({ ...prev, stateRegistration: e.target.value }))}
                placeholder="Número da inscrição estadual"
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
              <Tickets className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
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
