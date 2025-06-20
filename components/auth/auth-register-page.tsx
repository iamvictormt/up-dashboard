'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AuthContainer } from './auth-container';
import { RegisterFlow } from './register-flow';
import { RegisterCarousel } from './register-carousel';

export function AuthRegisterPage() {
  const router = useRouter();

  const handleRegisterSuccess = () => {
    toast.success('Conta criada com sucesso! Redirecionando...');
    setTimeout(() => {
      router.push('/auth/login');
    }, 2000);
  };

  return (
    <AuthContainer
      type="register"
      title="Crie sua conta"
      subtitle="Junte-se à nossa comunidade"
      footerText="Já tem uma conta?"
      footerLinkText="Fazer login"
      footerLinkHref="/auth/login"
      leftSideContent={<RegisterCarousel />}
    >
      <RegisterFlow onSuccess={handleRegisterSuccess} />
    </AuthContainer>
  );
}
