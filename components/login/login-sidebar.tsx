'use client';

import { LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIsMobile } from '../ui/use-mobile';
import Image from 'next/image';
import { appImages } from '@/constants/appImages';

interface LoginSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function LoginSidebar({ activeTab, onTabChange }: LoginSidebarProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        'bg-gradient-to-b from-primary/20 to-secondary/20 backdrop-blur-sm content-center',
        isMobile ? 'w-full p-4' : 'w-1/3 p-8'
      )}
    >
      <div className="flex justify-center">
        <div className="relative w-28 h-28">
          <div className="w-full h-full flex items-center justify-center">
                          <div className="relative w-28 h-28">
                <Image
                  src={appImages.logoAbelha.src}
                  alt="UP Club Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
          </div>
        </div>
      </div>
      <h2 className={cn('text-2xl font-bold mb-6 text-center mt-2', isMobile ? 'hidden' : 'block')}>
        Bem vindo ao{' '}
        <span className="text-primary">
          <br />
          UP Connection
        </span>
      </h2>

      <div className={cn('space-y-4', isMobile ? 'flex space-y-0 gap-4' : 'block')}>
        <motion.button
          onClick={() => onTabChange('login')}
          className={cn(
            'w-full group flex items-center gap-3 p-4 rounded-lg transition-all duration-300',
            activeTab === 'login'
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'bg-card/30 text-foreground hover:bg-card/50',
            isMobile ? 'justify-center flex-1' : ''
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div
            className={cn(
              'flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300',
              activeTab === 'login' ? 'bg-primary-foreground/20' : 'bg-primary/20 group-hover:bg-primary/30'
            )}
          >
            <LogIn
              className={cn(
                'h-5 w-5 transition-all duration-300',
                activeTab === 'login' ? 'text-primary-foreground' : 'text-primary'
              )}
            />
          </div>
          <div className={`text-start ${isMobile ? 'hidden' : 'block'}`}>
            <p className="font-medium text-lg">Login</p>
            <p
              className={cn('text-xs', activeTab === 'login' ? 'text-primary-foreground/80' : 'text-muted-foreground')}
            >
              Acesse sua conta
            </p>
          </div>
        </motion.button>

        <motion.button
          onClick={() => onTabChange('register')}
          className={cn(
            'w-full group flex items-center gap-3 p-4 rounded-lg transition-all duration-300',
            activeTab === 'register'
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'bg-card/30 text-foreground hover:bg-card/50',
            isMobile ? 'justify-center flex-1' : ''
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div
            className={cn(
              'flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300',
              activeTab === 'register' ? 'bg-primary-foreground/20' : 'bg-primary/20 group-hover:bg-primary/30'
            )}
          >
            <UserPlus
              className={cn(
                'h-5 w-5 transition-all duration-300',
                activeTab === 'register' ? 'text-primary-foreground' : 'text-primary'
              )}
            />
          </div>
          <div className={`text-start ${isMobile ? 'hidden' : 'block'}`}>
            <p className="font-medium text-lg">Cadastro</p>
            <p
              className={cn(
                'text-xs',
                activeTab === 'register' ? 'text-primary-foreground/80' : 'text-muted-foreground'
              )}
            >
              Crie sua conta
            </p>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
