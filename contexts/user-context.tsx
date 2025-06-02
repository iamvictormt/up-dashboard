'use client';

import { appUrl } from '@/constants/appRoutes';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import Cookies from 'js-cookie';

// Tipos para o usuário
interface User {
  id: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
  address: {
    state: string;
    city: string;
    district: string;
    street: string;
    complement: string;
    number: string;
    zipCode: string;
  };

  partnerSupplier?: {
    id: string;
    tradeName: string;
    companyName: string;
    document: string;
    stateRegistration: string;
    contact: string;
    addressId: string;
    accessPending: boolean;
  } | null;
  professional?: {
    id: string;
    name: string;
    profession: string;
    document: string;
    generalRegister: string;
    registrationAgency: string;
    description: string;
    experience: string;
    officeName: string;
    verified: boolean;
    featured: boolean;
    level: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
    points: number;
    phone: string;
    socialMediaId?: string;
  } | null;
  loveDecoration?: {
    id: string;
    name: string;
    contact: string;
    instagram: string;
    tiktok: string;
  } | null;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

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
          router.push(appUrl.login);
          return;
        }

        const decoded = decodeURIComponent(userString);
        const user = JSON.parse(decoded);
        setUser(user);
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        setError('Erro ao carregar usuário');
        router.push(appUrl.login);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const logout = () => {
    deleteCookie('token');
    deleteCookie('user');
    setUser(null);
    setError(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      deleteCookie('user');
      Cookies.set('user', JSON.stringify(updatedUser), { expires: 1 / 24 });
    }
  };

  const value: UserContextType = {
    user,
    isLoading,
    logout,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useAuth = () => {
  const { user, isLoading } = useUser();
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
};

// Hook para acessar dados do plano
// export const usePlan = () => {
//   const { user } = useUser();
//   return {
//     plan: user?.plan || null,
//     usage: user?.usage || null,
//     canUseFeature: (feature: keyof User['plan']['features'], currentUsage?: number) => {
//       if (!user?.plan) return false;

//       const limit = user.plan.features[feature];
//       if (typeof limit === 'boolean') return limit;
//       if (typeof limit === 'number' && currentUsage !== undefined) {
//         return currentUsage < limit;
//       }
//       return true;
//     },
//     getRemainingUsage: (feature: keyof User['usage']) => {
//       if (!user?.plan || !user?.usage) return 0;

//       const limit = user.plan.features[feature as keyof User['plan']['features']];
//       const used = user.usage[feature];

//       if (typeof limit === 'number') {
//         return Math.max(0, limit - used);
//       }
//       return 0;
//     },
//   };
// };

// Hook para estatísticas do usuário
// export const useUserStats = () => {
//   const { user } = useUser();
//   return {
//     stats: user?.stats || null,
//     addPoints: (points: number) => {
//       if (user) {
//         const updatedStats = {
//           ...user.stats,
//           points: user.stats.points + points,
//           totalActions: user.stats.totalActions + 1,
//         };
// updateUser({ stats: updatedStats })
//       }
//     },
//   };
// };
