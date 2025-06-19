'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Map, Building, Hash, Plus } from 'lucide-react';
import { applyZipCodeMask } from '@/utils/masks';

interface AddressStepProps {
  formData: any;
  onUpdate: (section: string, field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AddressStep({ formData, onUpdate, onNext, onBack }: AddressStepProps) {
  const handleInputChange = (field: string, value: string) => {
    if (field === 'zipCode') {
      onUpdate('address', field, applyZipCodeMask(value));
    } else if (field === 'number') {
      onUpdate('address', field, value.replace(/\D/g, ''));
    } else {
      onUpdate('address', field, value);
    }
  };

  const fetchAddressByZipCode = async (zipCode: string) => {
    try {
      const cleanZip = zipCode.replace(/\D/g, '');
      if (cleanZip.length !== 8) return;

      const response = await fetch(`https://viacep.com.br/ws/${cleanZip}/json/`);
      const data = await response.json();

      if (!data.erro) {
        onUpdate('address', 'street', data.logradouro);
        onUpdate('address', 'district', data.bairro);
        onUpdate('address', 'city', data.localidade);
        onUpdate('address', 'state', data.uf);
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  useEffect(() => {
    const zipCode = formData.address.zipCode;
    if (zipCode && zipCode.replace(/\D/g, '').length === 8) {
      fetchAddressByZipCode(zipCode);
    }
  }, [formData.address.zipCode]);

  const isFormValid = () => {
    const { zipCode, state, city, district, street, number } = formData.address;
    return zipCode && state && city && district && street && number;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode" className="text-sm font-medium">
            CEP
          </Label>
          <div className="relative">
            <Input
              id="zipCode"
              value={formData.address.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              className="pl-10 h-11"
              placeholder="00000-000"
              maxLength={9}
              required
            />
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-medium">
              Estado
            </Label>
            <div className="relative">
              <Input
                id="state"
                value={formData.address.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="Estado"
                disabled
              />
              <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium">
              Cidade
            </Label>
            <div className="relative">
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Cidade"
                disabled
              />
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="district" className="text-sm font-medium">
            Bairro
          </Label>
          <div className="relative">
            <Input
              id="district"
              value={formData.address.district}
              onChange={(e) => handleInputChange('district', e.target.value)}
              className="pl-10 h-11"
              placeholder="Bairro"
              required
            />
            <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="street" className="text-sm font-medium">
            Rua
          </Label>
          <div className="relative">
            <Input
              id="street"
              value={formData.address.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              className="pl-10 h-11"
              placeholder="Nome da rua"
              required
            />
            <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="number" className="text-sm font-medium">
              Número
            </Label>
            <div className="relative">
              <Input
                id="number"
                value={formData.address.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                className="pl-10 h-11"
                placeholder="123"
                required
              />
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="complement" className="text-sm font-medium">
              Complemento
            </Label>
            <div className="relative">
              <Input
                id="complement"
                value={formData.address.complement}
                onChange={(e) => handleInputChange('complement', e.target.value)}
                className="pl-10 h-11"
                placeholder="Apto, bloco, etc. (opcional)"
              />
              <Plus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" onClick={onBack} className="flex-1 h-11">
          Voltar
        </Button>
        <Button type="button" onClick={onNext} disabled={!isFormValid()} className="flex-1 h-11" variant="secondary">
          Continuar
        </Button>
      </div>
    </div>
  );
}
