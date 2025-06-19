'use client';

import type React from 'react';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import Image from 'next/image';
import { appImages } from '@/constants/appImages';

interface LoginFormProps {
  formData: {
    email: string;
    password: string;
  };
  isLoading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
}

export function LoginForm({ formData, isLoading, onInputChange, onSubmit, onForgotPassword }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.form
      onSubmit={onSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-4">
        <motion.div
          className="space-y-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Label htmlFor="email">
            Email
          </Label>
          <div className="relative group">
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              placeholder="seu@email.com"
              required
            />
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
        </motion.div>

        <motion.div
          className="space-y-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <Label htmlFor="password">
              Senha
            </Label>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-sm text-primary"
              onClick={onForgotPassword}
            >
              Esqueceu a senha?
            </Button>
          </div>
          <div className="relative group">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => onInputChange('password', e.target.value)}
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
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button
          type="submit"
          variant="secondary"
          disabled={isLoading}
          className='w-full'
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Entrando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Entrar na minha conta
            </div>
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
}
