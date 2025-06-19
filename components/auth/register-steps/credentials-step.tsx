'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface CredentialsStepProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function CredentialsStep({ formData, onUpdate, onSubmit, onBack, isLoading }: CredentialsStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    onUpdate(field, value);
  };

  const isFormValid = () => {
    return (
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      formData.acceptedTerms
    );
  };

  const passwordsMatch = formData.password === formData.confirmPassword;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10 h-11"
              placeholder="seu@email.com"
              required
            />
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Senha
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="pl-10 pr-10 h-11"
              placeholder="••••••••"
              required
            />
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-muted-foreground hover:text-primary" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirmar senha
          </Label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`pl-10 pr-10 h-11`}
              placeholder="••••••••"
              required
            />
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 text-muted-foreground hover:text-primary" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />
              )}
            </Button>
          </div>
          {formData.confirmPassword && !passwordsMatch && (
            <p className="text-sm text-red-600">As senhas não coincidem</p>
          )}
        </div>

        <div className="flex items-start space-x-3 p-4 bg-card/50 rounded-xl">
          <Checkbox
            id="terms"
            checked={formData.acceptedTerms}
            onCheckedChange={(checked) => onUpdate('acceptedTerms', checked)}
            className="mt-0.5"
          />
          <div className="space-y-1">
            <Label htmlFor="terms" className="text-sm font-medium leading-relaxed cursor-pointer">
              Aceito os termos de uso e política de privacidade
            </Label>
            <p className="text-xs text-muted-foreground">
              Ao criar sua conta, você concorda com nossos{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" onClick={onBack} className="flex-1 h-11" disabled={isLoading}>
          Voltar
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!isFormValid() || isLoading}
          className="flex-1 h-11"
          variant="secondary"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Criando conta...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Criar minha conta
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
