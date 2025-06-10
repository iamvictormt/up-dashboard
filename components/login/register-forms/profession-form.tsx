'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  User,
  Building,
  Briefcase,
  Fingerprint,
  TicketIcon as Tickets,
  Phone,
  Mail,
  Lock,
  IdCard,
  EyeOff,
  Eye,
} from 'lucide-react';
import { PhotoUpload } from '../photo-upload';
import { AddressForm } from '@/components/address-form';
import { applyZipCodeMask } from '@/utils/masks';
import type { Profession } from '@/types';
import { useState } from 'react';

interface ProfessionalFormProps {
  data: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  addressData: any;
  setAddressData: any;
  handleAddressChange: any;
  photo: string | null;
  onPhotoChange: (photo: string | null) => void;
  professions: Profession[];
  isLoading: boolean;
  registerSuccess: boolean;
  onSwitchToLogin: () => void;
  onSwitchToTypeSelection: () => void;
}

export function ProfessionalForm({
  data,
  onChange,
  onSelectChange,
  onSubmit,
  addressData,
  setAddressData,
  handleAddressChange,
  photo,
  onPhotoChange,
  professions,
  isLoading,
  registerSuccess,
  onSwitchToLogin,
  onSwitchToTypeSelection,
}: ProfessionalFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <PhotoUpload photo={photo} onPhotoChange={onPhotoChange} />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome completo
              </Label>
              <div className="relative group">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="off"
                  value={data.name}
                  onChange={onChange}
                  className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Ex: Ana Maria da Silva"
                  required
                  disabled={registerSuccess}
                />
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="space-y-2">
              <Label htmlFor="office-name" className="text-sm font-medium">
                Nome do escritório
              </Label>
              <div className="relative group">
                <Input
                  id="office-name"
                  name="officeName"
                  type="text"
                  value={data.officeName}
                  onChange={onChange}
                  className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Ex: Lume Arquitetura"
                  required
                  disabled={registerSuccess}
                />
                <Building className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <div className="space-y-2">
              <Label htmlFor="profession" className="text-sm font-medium">
                Profissão
              </Label>
              <div className="relative group">
                <Select value={data.professionId} onValueChange={onSelectChange} disabled={registerSuccess} required>
                  <SelectTrigger className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                    <SelectValue placeholder="Selecione sua profissão" />
                  </SelectTrigger>
                  <SelectContent>
                    {professions.map((profession: Profession) => (
                      <SelectItem key={profession.id} value={profession.id}>
                        {profession.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Briefcase className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="space-y-2">
              <Label htmlFor="document" className="text-sm font-medium">
                CPF/CNPJ
              </Label>
              <div className="relative group">
                <Input
                  id="document"
                  name="document"
                  type="text"
                  value={data.document}
                  onChange={onChange}
                  className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  required
                  disabled={registerSuccess}
                  placeholder="Ex: 000.000.000-00"
                />
                <Fingerprint className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="space-y-2">
              <Label htmlFor="general-register" className="text-sm font-medium">
                RG
              </Label>
              <div className="relative group">
                <Input
                  id="general-register"
                  name="generalRegister"
                  type="text"
                  value={data.generalRegister}
                  onChange={onChange}
                  className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Ex: 000000000"
                  required
                  maxLength={10}
                  disabled={registerSuccess}
                />
                <IdCard className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <div className="space-y-2">
              <Label htmlFor="registration-agency" className="text-sm font-medium">
                CREA/CAU/ABD
              </Label>
              <div className="relative group">
                <Input
                  id="registration-agency"
                  name="registrationAgency"
                  type="text"
                  value={data.registrationAgency}
                  onChange={onChange}
                  className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Ex: 1234567890-0/SP"
                  required
                  maxLength={20}
                  disabled={registerSuccess}
                />
                <Tickets className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Whatsapp
              </Label>
              <div className="relative group">
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={data.phone}
                  onChange={onChange}
                  className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Ex: (00) 00000-0000"
                  required
                  disabled={registerSuccess}
                />
                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="space-y-2">
              <Label htmlFor="professional-email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative group">
                <Input
                  id="professional-email"
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={onChange}
                  className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Ex: contato@teste.com.br"
                  required
                  maxLength={55}
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
                maxLength={22}
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
                maxLength={22}
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

        <div className="flex flex-1 gap-6 mb-4 mt-4">
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
      </div>
    </form>
  );
}
