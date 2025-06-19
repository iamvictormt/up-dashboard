'use client';

import type React from 'react';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { appImages } from '@/constants/appImages';

interface AuthContainerProps {
  children: React.ReactNode;
  type: 'login' | 'register';
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export function AuthContainer({
  children,
  type,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthContainerProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Background Pattern */}
        <div className="fixed inset-0 -z-10 bg-[#46142b]">
          <div className="absolute top-2/4 left-1/5 w-96 h-96 rounded-full bg-[#f5b13d]/10 blur-3xl" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#f5b13d]/10 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex place-content-center gap-3 mb-12">
              <div className="relative w-32 h-32">
                <Image src={appImages.logoUpSvg.src} alt="UP Club Logo" fill className="object-contain" priority />
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-4 leading-tight">
              {type === 'login' ? 'Conecte-se com profissionais incríveis' : 'Faça parte da nossa comunidade'}
            </h2>

            <p className="text-lg text-purple-100 mb-8 leading-relaxed">
              {type === 'login'
                ? 'Acesse sua conta e continue explorando oportunidades, conectando-se com outros profissionais e expandindo sua rede.'
                : 'Junte-se a milhares de profissionais, entusiastas e fornecedores que já fazem parte da nossa plataforma.'}
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-purple-100">Conecte-se com profissionais</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full" />
                <span className="text-purple-100">Descubra oportunidades</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-purple-100">Expanda sua rede</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col bg-[#320f1f]/50 backdrop-blur-sm">
        {/* Header */}
        <motion.header
          className="p-6 flex justify-between items-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="https://up-landing-page.vercel.app/"
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Ir à pagina inicial</span>
          </Link>

          <div className="lg:hidden flex items-center gap-2">
            <div className="relative w-12 h-12">
              <Image src={appImages.logoUpSvg.src} alt="UP Club Logo" fill className="object-contain" priority />
            </div>
          </div>
        </motion.header>

        {/* Main Content */}

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-lg">
            {title !== 'Crie sua conta' && (
              <>
                <div className="relative w-32 h-32 justify-self-center mb-4">
                  <Image src={appImages.logoAbelha.src} alt="UP Club Logo" fill className="object-contain" priority />
                </div>
                <motion.div
                  className="text-center mb-8"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h1 className="text-3xl font-bold mb-2 text-white bg-clip-text text-transparent">{title}</h1>
                  <p className="text-muted-foreground">{subtitle}</p>
                </motion.div>
              </>
            )}

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {children}
            </motion.div>

            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-sm text-muted-foreground">
                {footerText}{' '}
                <Link href={footerLinkHref} className="text-primary font-medium hover:underline transition-colors">
                  {footerLinkText}
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
