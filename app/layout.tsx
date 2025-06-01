import type React from 'react';
import type { Metadata } from 'next';
import ClientLayout from './clientLayout';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Eevo Platform',
  description: 'Plataforma de conexão entre profissionais e clientes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}
