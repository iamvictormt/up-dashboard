'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Phone, Mail, Instagram, Lock, ArrowLeft, EyeOff, Eye } from 'lucide-react';
import { PhotoUpload } from '../photo-upload';
import { AddressForm } from '@/components/address-form';
import { applyZipCodeMask } from '@/utils/masks';
import { useState } from 'react';

interface LoveDecorationFormProps {
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

export function LoveDecorationForm({
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
}: LoveDecorationFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4 pl-1 pr-1">
        <PhotoUpload photo={photo} onPhotoChange={onPhotoChange} />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-foreground/90">
                Nome completo
              </Label>
              <div className="relative group">
                <Input
                  id="name"
                  name="name"
                  type="text"
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
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative group">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="off"
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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4">
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
                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-sm font-medium">
                Instagram
              </Label>
              <div className="relative group">
                <Input
                  id="instagram"
                  name="instagram"
                  type="text"
                  value={data.instagram}
                  onChange={onChange}
                  className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Ex: @AnaAMS"
                  required
                  disabled={registerSuccess}
                />
                <Instagram className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="space-y-2">
              <Label htmlFor="tiktok" className="text-sm font-medium">
                Tiktok
              </Label>
              <div className="relative group">
                <Input
                  id="tiktok"
                  name="tiktok"
                  type="text"
                  value={data.tiktok}
                  onChange={onChange}
                  className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Ex: @AnaAMS"
                  required
                  maxLength={55}
                  disabled={registerSuccess}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-tiktok absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                  viewBox="0 0 16 16"
                >
                  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                </svg>
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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
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
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar senha
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
      </div>
    </form>
  );
}
