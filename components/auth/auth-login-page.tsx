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
import { RegisterCarousel } from './register-carousel';
import api from '@/services/api';

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
      const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });
      console.log('response: ', response)

      const data = await response.data;
      Cookies.set('token', data.access_token, { expires: 1 / 24 });
      Cookies.set('role', JSON.stringify(data.role), { expires: 1 / 24 });

      toast.success('Login realizado com sucesso!');
      router.push(appUrl.mural);
    } catch (error) {
      toast.error(error.response.data.message);
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
        leftSideContent={<RegisterCarousel />}
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
