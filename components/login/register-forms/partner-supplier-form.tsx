'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Fingerprint, TicketIcon as Tickets, PhoneCall, Mail, Lock, EyeOff, Eye } from 'lucide-react';
import { PhotoUpload } from '../photo-upload';
import { AddressForm } from '@/components/address-form';
import { applyZipCodeMask } from '@/utils/masks';
import { useState } from 'react';

interface PartnerSupplierFormProps {
  data: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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

export function PartnerSupplierForm({
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
  onSwitchToLogin,
  onSwitchToTypeSelection,
}: PartnerSupplierFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <PhotoUpload photo={photo} onPhotoChange={onPhotoChange} />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <div className="space-y-2">
              <Label htmlFor="trade-name" className="text-sm font-medium">
                Nome fantasia
              </Label>
              <div className="relative group">
                <Input
                  id="trade-name"
                  name="tradeName"
                  type="text"
                  value={data.tradeName}
                  onChange={onChange}
                  className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Ex: Padaria Doce Sabor"
                  required
                  disabled={registerSuccess}
                />
                <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="space-y-2">
              <Label htmlFor="company-name" className="text-sm font-medium">
                Razão social
              </Label>
              <div className="relative group">
                <Input
                  id="company-name"
                  name="companyName"
                  type="text"
                  value={data.companyName}
                  onChange={onChange}
                  className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Ex: Padaria e Confeitaria São João LTDA"
                  required
                  disabled={registerSuccess}
                />
                <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <div className="space-y-2">
              <Label htmlFor="document" className="text-sm font-medium">
                CNPJ
              </Label>
              <div className="relative group">
                <Input
                  id="document"
                  name="document"
                  type="text"
                  value={data.document}
                  onChange={onChange}
                  className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Ex: 00.000.000/0000-00"
                  required
                  disabled={registerSuccess}
                />
                <Fingerprint className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="space-y-2">
              <Label htmlFor="state-registration" className="text-sm font-medium">
                Inscrição estadual
              </Label>
              <div className="relative group">
                <Input
                  id="state-registration"
                  name="stateRegistration"
                  type="text"
                  value={data.stateRegistration}
                  onChange={onChange}
                  className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Ex: 110.042.490.114"
                  required
                  maxLength={16}
                  disabled={registerSuccess}
                />
                <Tickets className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <div className="space-y-2">
              <Label htmlFor="contact" className="text-sm font-medium">
                Contato
              </Label>
              <div className="relative group">
                <Input
                  id="contact"
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

          <div className="col-span-12 md:col-span-6">
            <div className="space-y-2">
              <Label htmlFor="partner-supplier-email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative group">
                <Input
                  id="partner-supplier-email"
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
            <Label htmlFor="password" className="text-sm font-medium">
              Senha
            </Label>
            <div className="relative group">
              <Input
                id="password"
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
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirmar Senha
            </Label>
            <div className="relative group">
              <Input
                id="confirmPassword"
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
