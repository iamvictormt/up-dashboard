'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Tipos para o usuário
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role: 'user' | 'professional' | 'supplier' | 'admin';
  professional?: {
    id?: string;
    name?: string;
    profession?: string;
    document?: string;
    generalRegister?: string;
    registrationAgency?: string;
    description?: string;
    experience?: string;
    officeName?: string;
    verified?: boolean;
    featured: boolean;
    level?: string;
    points?: number;
    profileImage?: string;
    phone?: string;
  };
  plan: {
    id: string;
    name: string;
    type: 'basic' | 'premium' | 'enterprise';
    price: string;
    period: 'monthly' | 'yearly';
    status: 'active' | 'inactive' | 'expired';
    nextBilling?: string;
    daysLeft?: number;
    features: {
      contacts: number;
      workshops: number;
      events: number;
      projects: number;
      support: string;
      analytics: boolean;
      priority: boolean;
      badge: boolean;
    };
  };
  usage: {
    contacts: number;
    workshops: number;
    events: number;
    projects: number;
  };
  stats: {
    points: number;
    certificates: number;
    successRate: number;
    totalActions: number;
    valueSaved: number;
    supportUsed: string;
  };
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark';
    language: 'pt' | 'en';
  };
  createdAt: string;
  lastLogin: string;
}

// Tipos para o contexto
interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateUsage: (usageData: Partial<User['usage']>) => void;
  refreshUser: () => Promise<void>;
}

// Contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook para usar o contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

// Dados mockados do usuário
const mockUser: User = {
  id: 'user-123',
  name: 'Yev Silva',
  email: 'yev@example.com',
  avatar: '/placeholder.svg?height=40&width=40',
  phone: '+55 11 99999-9999',
  role: 'user',
  plan: {
    id: 'plan-premium',
    name: 'Plano Premium',
    type: 'premium',
    price: 'R$ 49,90',
    period: 'monthly',
    status: 'active',
    nextBilling: '15 Fev 2025',
    daysLeft: 12,
    features: {
      contacts: 100,
      workshops: 15,
      events: 20,
      projects: 10,
      support: 'Chat + Email',
      analytics: true,
      priority: true,
      badge: true,
    },
  },
  usage: {
    contacts: 45,
    workshops: 8,
    events: 12,
    projects: 3,
  },
  stats: {
    points: 1250,
    certificates: 12,
    successRate: 85,
    totalActions: 68,
    valueSaved: 1247,
    supportUsed: '24h',
  },
  preferences: {
    notifications: true,
    theme: 'light',
    language: 'pt',
  },
  createdAt: '2024-01-15T10:00:00Z',
  lastLogin: '2025-01-31T08:30:00Z',
};

// Provider do contexto
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = getCookie('token');
        const userString = getCookie('user');

        if (!token || !userString) {
          router.push('http://localhost:3000/login');
          return;
        }

        const decoded = decodeURIComponent(userString);
        const user = JSON.parse(decoded);
        setUser(user);
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        setError('Erro ao carregar usuário');
        router.push('http://localhost:3000/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [router]);

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simular chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Validação simples (em produção seria feita no backend)
      if (email === 'yev@example.com' && password === '123456') {
        localStorage.setItem('auth_token', 'mock_token_123');
        setUser(mockUser);
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setError(null);
  };

  // Atualizar dados do usuário
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // Atualizar uso de recursos
  const updateUsage = (usageData: Partial<User['usage']>) => {
    if (user) {
      setUser({
        ...user,
        usage: { ...user.usage, ...usageData },
      });
    }
  };

  // Recarregar dados do usuário
  const refreshUser = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simular chamada de API para atualizar dados
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Atualizar com dados mais recentes
      const updatedUser = {
        ...mockUser,
        lastLogin: new Date().toISOString(),
        stats: {
          ...mockUser.stats,
          points: mockUser.stats.points + Math.floor(Math.random() * 50),
        },
      };

      setUser(updatedUser);
    } catch (err) {
      setError('Erro ao atualizar dados do usuário');
      console.error('Erro ao atualizar usuário:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const value: UserContextType = {
    user,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    updateUsage,
    refreshUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Hook para verificar se o usuário está autenticado
export const useAuth = () => {
  const { user, isLoading } = useUser();
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
};

// Hook para acessar dados do plano
export const usePlan = () => {
  const { user } = useUser();
  return {
    plan: user?.plan || null,
    usage: user?.usage || null,
    canUseFeature: (feature: keyof User['plan']['features'], currentUsage?: number) => {
      if (!user?.plan) return false;

      const limit = user.plan.features[feature];
      if (typeof limit === 'boolean') return limit;
      if (typeof limit === 'number' && currentUsage !== undefined) {
        return currentUsage < limit;
      }
      return true;
    },
    getRemainingUsage: (feature: keyof User['usage']) => {
      if (!user?.plan || !user?.usage) return 0;

      const limit = user.plan.features[feature as keyof User['plan']['features']];
      const used = user.usage[feature];

      if (typeof limit === 'number') {
        return Math.max(0, limit - used);
      }
      return 0;
    },
  };
};

// Hook para estatísticas do usuário
export const useUserStats = () => {
  const { user } = useUser();
  return {
    stats: user?.stats || null,
    addPoints: (points: number) => {
      if (user) {
        const updatedStats = {
          ...user.stats,
          points: user.stats.points + points,
          totalActions: user.stats.totalActions + 1,
        };
        // Aqui você poderia fazer uma chamada para a API
        // updateUser({ stats: updatedStats })
      }
    },
  };
};
