'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Community } from '@/types/community';
import { fetchCommunities } from '@/lib/community-api';

interface CommunityContextType {
  communities: Community[];
  selectedCommunity: Community | null;
  selectCommunity: (community: Community) => void;
  loading: boolean;
  error: string | null;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCommunities() {
      try {
        setLoading(true);
        const data = await fetchCommunities();
        setCommunities(data);

        // Select the first community by default
        if (data.length > 0 && !selectedCommunity) {
          setSelectedCommunity(data[0]);
        }
      } catch (err) {
        setError('Failed to load communities');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCommunities();
  }, []);

  const selectCommunity = (community: Community) => {
    setSelectedCommunity(community);
  };

  return (
    <CommunityContext.Provider
      value={{
        communities,
        selectedCommunity,
        selectCommunity,
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
