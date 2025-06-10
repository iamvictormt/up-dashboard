'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { appImages } from '@/constants/appImages';

export function LoginHeader() {
  return (
    <motion.header
      className="container py-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <Link
          href="https://up-landing-page.vercel.app/"
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para tela inicial</span>
        </Link>
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="relative w-16 h-16">
              <Image src={appImages.logoUpSvg.src} alt="UP Club Logo" fill className="object-contain" priority />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
