'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  loginData: {
    email: string;
    senha: string;
  };
  loginError: string | null;
  isLoginLoading: boolean;
  handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoginSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  onSwitchToRegister: () => void;
}

export function LoginForm({
  loginData,
  loginError,
  isLoginLoading,
  handleLoginChange,
  handleLoginSubmit,
  onForgotPassword,
  onSwitchToRegister,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
      {/* Header com decoração */}
      <div className="text-center mb-8 relative">
        <h1 className="text-3xl font-bold mb-3 text-white">
          Acesse sua conta
        </h1>
        <p className="text-muted-foreground text-lg">Entre com suas credenciais para acessar sua conta</p>
      </div>

      {/* Card do formulário */}
      <form onSubmit={handleLoginSubmit} className="space-y-6">
        {loginError && (
          <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium">{loginError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-5">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold text-foreground/90">
              Email
            </Label>
            <div className="relative group">
              <Input
                id="email"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleLoginChange}
                className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                placeholder="seu@email.com.br"
                required
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 group-focus-within:text-primary">
                <Mail className="h-5 w-5 text-muted-foreground group-focus-within:text-primary" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="senha" className="text-sm font-semibold text-foreground/90">
                Senha
              </Label>
              <Button
                variant="link"
                className="h-auto p-0 text-sm text-primary hover:text-primary/80 font-medium"
                type="button"
                onClick={onForgotPassword}
              >
                Esqueceu a senha?
              </Button>
            </div>
            <div className="relative group">
              <Input
                id="senha"
                name="senha"
                type={showPassword ? 'text' : 'password'}
                value={loginData.senha}
                onChange={handleLoginChange}
                className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                placeholder="••••••••"
                required
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

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:hover:scale-100"
          disabled={isLoginLoading}
        >
          {isLoginLoading ? (
            <div className="flex items-center gap-2">
              Entrando...
            </div>
          ) : (
            'Entrar na minha conta'
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Não tem uma conta?</span>
          <Button
            variant="link"
            className="p-0 h-auto text-primary hover:text-primary/80 font-semibold"
            onClick={onSwitchToRegister}
          >
            Cadastre-se gratuitamente
          </Button>
        </div>
      </div>
    </div>
  );
}
