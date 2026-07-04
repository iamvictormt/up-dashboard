'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Fingerprint, PhoneCall, Mail, Lock, EyeOff, Eye } from 'lucide-react';
import { PhotoUpload } from '../photo-upload';
import { AddressForm } from '@/components/address-form';
import { applyZipCodeMask } from '@/utils/masks';
import { useState } from 'react';

interface WellnessFormProps {
  data: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  addressData: any;
  setAddressData: any;
  handleAddressChange: any;
  photo: string | null;
  onPhotoChange: (photo: string | null) => void;
  isLoading: boolean;
  registerSuccess: boolean;
  onSwitchToLogin: () => void;
  onSwitchToTypeSelection: () => void;
}

export function WellnessForm({
  data,
  onChange,
  onSubmit,
  addressData,
  setAddressData,
  handleAddressChange,
  photo,
  onPhotoChange,
  isLoading,
  registerSuccess,
  onSwitchToTypeSelection,
}: WellnessFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4 pl-1 pr-1">
        <PhotoUpload photo={photo} onPhotoChange={onPhotoChange} />

        <div className="space-y-2">
          <Label htmlFor="wellness-name" className="text-sm font-medium">
            Nome do negócio
          </Label>
          <div className="relative group">
            <Input
              id="wellness-name"
              name="name"
              type="text"
              value={data.name}
              onChange={onChange}
              className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              placeholder="Ex: Espaço Zen Massoterapia"
              required
              disabled={registerSuccess}
            />
            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <div className="space-y-2">
              <Label htmlFor="wellness-document-type" className="text-sm font-medium">
                Tipo de documento
              </Label>
              <div className="relative group">
                <select
                  id="wellness-document-type"
                  name="documentType"
                  value={data.documentType ?? 'CPF'}
                  onChange={onChange}
                  disabled={registerSuccess}
                  className="pl-12 h-12 w-full rounded-md border border-border/50 bg-card/50 text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                >
                  <option value="CPF">CPF (pessoa física)</option>
                  <option value="CNPJ">CNPJ (empresa)</option>
                </select>
                <Fingerprint className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8">
            <div className="space-y-2">
              <Label htmlFor="wellness-document" className="text-sm font-medium">
                {data.documentType === 'CNPJ' ? 'CNPJ' : 'CPF do responsável'}
              </Label>
              <div className="relative group">
                <Input
                  id="wellness-document"
                  name="document"
                  type="text"
                  value={data.document}
                  onChange={onChange}
                  className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder={data.documentType === 'CNPJ' ? 'Ex: 00.000.000/0000-00' : 'Ex: 000.000.000-00'}
                  required
                  disabled={registerSuccess}
                />
                <Fingerprint className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="space-y-2">
              <Label htmlFor="wellness-contact" className="text-sm font-medium">
                Contato (WhatsApp)
              </Label>
              <div className="relative group">
                <Input
                  id="wellness-contact"
                  name="contact"
                  type="tel"
                  value={data.contact}
                  onChange={onChange}
                  className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Ex: (00) 00000-0000"
                  required
                  disabled={registerSuccess}
                />
                <PhoneCall className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="wellness-email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative group">
            <Input
              id="wellness-email"
              name="email"
              type="email"
              value={data.email}
              onChange={onChange}
              className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              placeholder="Ex: contato@teste.com.br"
              required
              disabled={registerSuccess}
            />
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
        </div>

        <AddressForm
          addressData={addressData}
          setAddressData={setAddressData}
          handleAddressChange={handleAddressChange}
          registerSuccess={registerSuccess}
          applyZipCodeMask={applyZipCodeMask}
          isLogin={true}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wellness-password" className="text-sm font-medium">
              Senha
            </Label>
            <div className="relative group">
              <Input
                id="wellness-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={data.password}
                onChange={onChange}
                className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                required
                disabled={registerSuccess}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200">
                <Lock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary" />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={registerSuccess}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wellness-confirmPassword" className="text-sm font-medium">
              Confirmar Senha
            </Label>
            <div className="relative group">
              <Input
                id="wellness-confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={data.confirmPassword}
                onChange={onChange}
                className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                required
                disabled={registerSuccess}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200">
                <Lock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary" />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={registerSuccess}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="block space-y-4 gap-6 mb-4 mt-4 md:flex md:space-y-0">
        <Button
          type="button"
          variant="outline"
          onClick={onSwitchToTypeSelection}
          className="w-full transition-all border-primary/30 bg-secondary/10 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
        >
          <span>Voltar para seleção de tipo</span>
        </Button>

        <Button
          type="submit"
          className="w-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
          disabled={isLoading || registerSuccess}
        >
          {isLoading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
}
