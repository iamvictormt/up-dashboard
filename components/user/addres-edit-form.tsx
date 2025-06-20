'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Building, Hash, Map, MapPin, Plus, Save } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { applyZipCodeMask } from '@/utils/masks';
import { fetchAddressByZipCode } from '@/lib/address-api';
import { updateAddressUser } from '@/lib/user-api';
import { toast } from 'sonner';

interface AddressData {
  state: string;
  city: string;
  district: string;
  street: string;
  complement: string;
  number: string;
  zipCode: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface AddressEditFormProps {
  address?: any;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onClose: () => void;
}

export function AddressEditForm({ address, isLoading, setIsLoading, onClose }: AddressEditFormProps) {
  const { user, updateUser } = useUser();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState<AddressData>({
    state: address?.state || '',
    city: address?.city || '',
    district: address?.district || '',
    street: address?.street || '',
    complement: address?.complement || '',
    number: address?.number || '',
    zipCode: address?.zipCode || '',
  });

  const getChangedFields = () => {
    const changedFields: any = {};

    if (formData.state !== address?.state) {
      changedFields.state = formData.state;
    }

    if (formData.city !== address?.city) {
      changedFields.city = formData.city;
    }

    if (formData.district !== address?.district) {
      changedFields.district = formData.district;
    }

    if (formData.street !== address?.street) {
      changedFields.street = formData.street;
    }

    if (formData.complement !== address?.complement) {
      changedFields.complement = formData.complement;
    }

    if (formData.number !== address?.number) {
      changedFields.number = formData.number;
    }

    if (formData.zipCode !== address?.zipCode) {
      changedFields.zipCode = formData.zipCode;
    }

    return changedFields;
  };

  const hasChanges = () => {
    const changedFields = getChangedFields();
    return Object.keys(changedFields).length > 0;
  };

  const saveAddressData = async () => {
    if (!user) return;
    try {
      const changedFields = getChangedFields();

      if (Object.keys(changedFields).length === 0) {
        return true;
      }

      await updateAddressUser(user?.id, changedFields);

      updateUser({
        ...user,
        address: {
          ...address,
          ...changedFields,
        },
      });

      return true;
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      toast.error('Erro ao salvar endereço. Tente novamente.');
      return false;
    }
  };

  const handleSave = async () => {
    setValidationErrors({});

    setIsLoading(true);

    try {
      const success = await saveAddressData();

      if (success) {
        toast.success('Endereço atualizado com sucesso!');
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
    const zip = formData.zipCode.replace(/\D/g, '');

    if (zip.length === 8) {
      const fetchAddress = async () => {
        const address = await fetchAddressByZipCode(zip);
        if (address) {
          setFormData((prev) => ({
            ...prev,
            ...address,
            zipCode: prev.zipCode,
          }));
        }
      };

      fetchAddress();
    }
  }, [formData.zipCode]);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-[#511A2B]" htmlFor="zipCode">CEP</Label>
            <div className="relative">
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => {
                  const masked = applyZipCodeMask(e.target.value);
                  setFormData((prev) => ({ ...prev, zipCode: masked }));
                }}
                placeholder="Ex: 00000-000"
                maxLength={9}
                className={`pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40 ${validationErrors.zipCode ? 'border-red-500' : ''}`}
              />
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <FieldError error={validationErrors.zipCode} />
          </div>

          <div className="space-y-2">
            <Label className="text-[#511A2B]" htmlFor="state">Estado</Label>
            <div className="relative">
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                placeholder="Sigla do estado"
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                disabled
              />
              <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[#511A2B]" htmlFor="city">Cidade</Label>
            <div className="relative">
              <Input
                id="city"
                disabled
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="Nome da cidade"
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#511A2B]" htmlFor="district">Bairro</Label>
            <div className="relative">
              <Input
                id="district"
                disabled
                value={formData.district}
                onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
                placeholder="Nome do bairro"
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
              <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>

          <div className="relative">
            <Label className="text-[#511A2B]" htmlFor="street">Rua</Label>
            <div className="relative">
              <Input
                id="street"
                disabled
                value={formData.street}
                onChange={(e) => setFormData((prev) => ({ ...prev, street: e.target.value }))}
                placeholder="Nome da rua"
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
              <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#511A2B]" htmlFor="number">Número</Label>
            <div className="relative">
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
                placeholder="123"
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[#511A2B]" htmlFor="complement">Complemento</Label>
            <div className="relative">
              <Input
                id="complement"
                value={formData.complement}
                onChange={(e) => setFormData((prev) => ({ ...prev, complement: e.target.value }))}
                placeholder="Apartamento, sala, etc."
                className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
              <Plus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button onClick={handleSave} variant="secondary" disabled={isLoading || !hasChanges()}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Salvando...' : 'Salvar Endereço'}
        </Button>
      </div>
    </div>
  );
}

