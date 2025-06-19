'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { appUrl } from '@/constants/appRoutes';
import { AuthContainer } from './auth-container';
import { LoginForm } from './login-form';
import { ForgotPasswordModal } from '../login/forgot-password-modal';
import Image from 'next/image';
import { appImages } from '@/constants/appImages';

export function AuthLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) toast.error(errorData.message || 'Email ou senha inválidos');
        if (response.status === 403) toast.info(errorData.message);
        return;
      }

      const data = await response.json();
      Cookies.set('token', data.access_token, { expires: 1 / 24 });
      Cookies.set('role', JSON.stringify(data.role), { expires: 1 / 24 });

      toast.success('Login realizado com sucesso!');
      setTimeout(() => {
        window.location.href = appUrl.mural;
      }, 1500);
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      toast.warning('Sua sessão expirou. Faça login novamente.');
    }
  }, [searchParams]);

  return (
    <>
      <AuthContainer
        type="login"
        title="Bem-vindo de volta"
        subtitle="Entre na sua conta para continuar"
        footerText="Não tem uma conta?"
        footerLinkText="Criar conta gratuita"
        footerLinkHref="/auth/register"
      >
        <LoginForm
          formData={formData}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onForgotPassword={() => setShowForgotPassword(true)}
        />
      </AuthContainer>

      <ForgotPasswordModal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
    </>
  );
}
