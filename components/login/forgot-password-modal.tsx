'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Shield,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { forgotPassword, resetPassword, verifyResetCode } from '@/lib/auth-api';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'email' | 'code' | 'password';

interface FormData {
  email: string;
  code: string[];
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  code?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const showToast = {
  info: (message: string) => {
    toast.info(message);
  },
  success: (message: string) => {
    toast.success(message);
  },
  error: (message: string) => {
    toast.error(message);
  },
};

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    email: '',
    code: ['', '', '', '', ''],
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Refs para os inputs do código
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('email');
      setFormData({
        email: '',
        code: ['', '', '', '', ''],
        password: '',
        confirmPassword: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    // Permitir apenas números
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...formData.code];
    newCode[index] = value;

    handleInputChange('code', newCode);

    // Auto-focus no próximo input
    if (value && index < 4) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Backspace: limpar atual e voltar para anterior
    if (e.key === 'Backspace' && !formData.code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
    // Arrow keys para navegação
    else if (e.key === 'ArrowLeft' && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 4) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const validateEmail = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCode = (): boolean => {
    const newErrors: FormErrors = {};
    const codeString = formData.code.join('');

    if (codeString.length !== 5) {
      newErrors.code = 'Código deve ter 5 dígitos';
    } else if (!/^\d{5}$/.test(codeString)) {
      newErrors.code = 'Código deve conter apenas números';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.password) {
      newErrors.password = 'Nova senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await forgotPassword({ email: formData.email });

      showToast.info(
        'Se o email informado estiver cadastrado na plataforma, você receberá um código de verificação em alguns instantes.'
      );

      setCurrentStep('code');
      // Focus no primeiro input do código
      setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 100);
    } catch (error) {
      toast.error('Erro ao enviar código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!validateCode()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await verifyResetCode({ email: formData.email, code: formData.code.join('') });
      setCurrentStep('password');
    } catch (error: any) {
      toast.error('Código inválido ou expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await resetPassword({ email: formData.email, code: formData.code.join(''), newPassword: formData.password });
      showToast.success('Senha alterada com sucesso! Você já pode fazer login com sua nova senha.');
      onClose();
    } catch (error) {
      toast.error("Erro ao alterar senha. Tente novamente.")
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'code') {
      setCurrentStep('email');
    } else if (currentStep === 'password') {
      setCurrentStep('code');
    }
    setErrors({});
  };

  const renderEmailStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-bold mb-2 text-white">Recuperar Senha</h1>
        <p className="text-muted-foreground">
          Digite seu email para receber um código de verificação e redefinir sua senha.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative group">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="seu@email.com"
                className={`pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200`}
                disabled={isLoading}
              />
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>

          {errors.email && (
            <p className="text-sm text-red-600 flex items-center mt-1">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        <Button
          onClick={handleSendCode}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3 font-medium"
        >
          {isLoading ? (
            <>Enviando código...</>
          ) : (
            <>
              Enviar código
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderCodeStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-white">Verificar Código</h1>
        <p className="text-muted-foreground">
          Digite o código de 5 dígitos enviado para <br /> <strong>{formData.email}</strong>
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-center space-x-3">
            {formData.code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (codeInputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(index, e)}
                className={`w-12 h-12 p-0 bg-card/50 border-border/50  text-center text-lg font-semibold border-2 rounded-xl`}
                disabled={isLoading}
              />
            ))}
          </div>
          {errors.code && (
            <p className="text-sm text-red-600 flex items-center justify-center mt-2">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.code}
            </p>
          )}
        </div>

        <div className="flex space-x-3 pr-8 pl-8">
          <Button onClick={handleBack} variant="accent" className="w-full" disabled={isLoading}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={handleVerifyCode}
            variant="secondary"
            className="w-full"
            disabled={isLoading || formData.code.some((digit) => !digit)}
          >
            {isLoading ? (
              <>Verificando...</>
            ) : (
              <>
                Verificar
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setCurrentStep('email')}
            className="text-sm text-muted-foreground hover:text-muted-foreground/90 font-medium"
            disabled={isLoading}
          >
            Não recebeu o código? Reenviar
          </button>
        </div>
      </div>
    </div>
  );

  const renderPasswordStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold mb-2 text-white">Nova senha</h1>
        <p className="text-muted-foreground">Defina uma nova senha segura para sua conta.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Nova senha
          </Label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Digite sua nova senha"
              className={`pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200`}
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-muted-foreground hover:text-primary" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 flex items-center mt-1">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.password}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirmar nova senha
          </Label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirme sua nova senha"
              className={`pl-12 h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200`}
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 text-muted-foreground hover:text-primary" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 flex items-center mt-1">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="flex space-x-3 pr-8 pl-8">
          <Button onClick={handleBack} variant="accent" className="w-full" disabled={isLoading}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={handleResetPassword} disabled={isLoading} variant="secondary" className="w-full">
            {isLoading ? (
              <>Alterando...</>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Alterar Senha
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background sm:max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="sr-only">Recuperar Senha</DialogTitle>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 disabled:pointer-events-none data-[state=open]:bg-secondary text-white/90 hover:bg-[#6c2144]/10 hover:text-white h-8 px-3 text-xs">
          <X className="h-4 w-4" />
        </DialogClose>

        {/* Mensagem de Erro Geral */}
        {errors.general && (
          <div className="mb-4 p-4 bg-red-100 border border-red-200 rounded-xl flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800 text-sm">{errors.general}</span>
          </div>
        )}

        {/* Indicador de Progresso */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep === 'email' ? 'bg-primary/90' : 'bg-secondary/40'
              }`}
            >
              1
            </div>
            <div className={`w-8 h-1 ${currentStep !== 'email' ? 'bg-secondary/40' : 'bg-gray-200'}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep === 'code'
                  ? 'bg-primary/90 text-white'
                  : currentStep === 'password'
                  ? 'bg-secondary/40'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              2
            </div>
            <div className={`w-8 h-1 ${currentStep === 'password' ? 'bg-secondary/40' : 'bg-gray-200'}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep === 'password' ? 'bg-primary/90 text-white' : 'bg-gray-200 text-gray-400'
              }`}
            >
              3
            </div>
          </div>
        </div>

        {/* Conteúdo das Etapas */}
        {currentStep === 'email' && renderEmailStep()}
        {currentStep === 'code' && renderCodeStep()}
        {currentStep === 'password' && renderPasswordStep()}
      </DialogContent>
    </Dialog>
  );
}
