'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Save } from 'lucide-react';
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
  setErrorMessage: (message: string | null) => void;
  onClose: () => void;
}

export function AddressEditForm({ address, isLoading, setIsLoading, setErrorMessage, onClose }: AddressEditFormProps) {
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
    setErrorMessage(null);
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
        <h3 className="font-medium text-[#511A2B] border-b border-gray-100 pb-2">Informações de Endereço</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="zipCode">CEP</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => {
                const masked = applyZipCodeMask(e.target.value);
                setFormData((prev) => ({ ...prev, zipCode: masked }));
              }}
              placeholder="Ex: 00000-000"
              maxLength={9}
              className={validationErrors.zipCode ? 'border-red-500' : ''}
            />
            <FieldError error={validationErrors.zipCode} />
          </div>

          <div>
            <Label htmlFor="state">Estado</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
              placeholder="Sigla do estado"
              disabled
            />
          </div>

          <div>
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              disabled
              value={formData.city}
              onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
              placeholder="Nome da cidade"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="district">Bairro</Label>
            <Input
              id="district"
              disabled
              value={formData.district}
              onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
              placeholder="Nome do bairro"
            />
          </div>

          <div>
            <Label htmlFor="street">Rua</Label>
            <Input
              id="street"
              disabled
              value={formData.street}
              onChange={(e) => setFormData((prev) => ({ ...prev, street: e.target.value }))}
              placeholder="Nome da rua"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="number">Número</Label>
            <Input
              id="number"
              value={formData.number}
              onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
              placeholder="123"
            />
          </div>

          <div>
            <Label htmlFor="complement">Complemento</Label>
            <Input
              id="complement"
              value={formData.complement}
              onChange={(e) => setFormData((prev) => ({ ...prev, complement: e.target.value }))}
              placeholder="Apartamento, sala, etc."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading || !hasChanges()}
          className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Salvando...' : 'Salvar Endereço'}
        </Button>
      </div>
    </div>
  );
}
