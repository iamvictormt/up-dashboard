'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Community } from '@/types/community';
import { fetchCommunities } from '@/lib/community-api';
import { useMuralUpdate } from './mural-update-context';

interface CommunityContextType {
  communities: Community[];
  selectedCommunity: Community | null;
  selectCommunity: (community: Community) => void;
  updateSelectedCommunity: any;
  loading: boolean;
  error: string | null;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { updateCount } = useMuralUpdate();

  useEffect(() => {
    loadCommunities();
  }, [updateCount]);

  async function loadCommunities() {
    try {
      setLoading(true);
      const data = await fetchCommunities();
      setCommunities(data);

      // Select the first community by default
      if (data.length > 0 && !selectedCommunity) {
        setSelectedCommunity(data[1]);
      }
    } catch (err) {
      setError('Failed to load communities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const selectCommunity = (community: Community) => {
    setSelectedCommunity(community);
  };

  const updateSelectedCommunity = (updatedFields: Partial<Community>) => {
    loadCommunities();
    setSelectedCommunity((prev) => {
      if (!prev) return null;
      return { ...prev, ...updatedFields };
    });
  };

  return (
    <CommunityContext.Provider
      value={{
        communities,
        selectedCommunity,
        selectCommunity,
        updateSelectedCommunity,
        loading,
        error,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
}
