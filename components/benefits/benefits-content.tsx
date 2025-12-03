'use client';

import { useState, useEffect } from 'react';
import { BenefitCard } from '@/components/benefits/benefit-card';
import { Input } from '@/components/ui/input';
import { Search, Gift, Sparkles } from 'lucide-react';
import { fetchAvailableBenefits, redeemBenefit } from '@/lib/benefits-api';
import { toast } from 'sonner';
import type { BenefitData } from '@/types';

export function BenefitsContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [benefits, setBenefits] = useState<BenefitData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBenefits, setFilteredBenefits] = useState<BenefitData[]>([]);
  const [redeemingBenefitId, setRedeemingBenefitId] = useState<string | null>(null);

  const loadBenefits = async () => {
    try {
      setIsLoading(true);

      if (!process.env.NEXT_PUBLIC_API_URL) {
        console.warn('NEXT_PUBLIC_API_URL not configured, using default localhost:3000');
      }

      const data = await fetchAvailableBenefits();
      setBenefits(data);
      setFilteredBenefits(data);
    } catch (err) {
      console.error('[v0] Error loading benefits:', err);

      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';

      if (errorMessage.includes('fetch') || errorMessage.includes('Network')) {
        toast.error('Não foi possível conectar à API. Verifique se o servidor está rodando.');
      } else {
        toast.error('Erro ao carregar benefícios. Tente novamente.');
      }

      setBenefits([]);
      setFilteredBenefits([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBenefits();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBenefits(benefits);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = benefits.filter(
      (benefit) => benefit.name.toLowerCase().includes(query) || benefit.description.toLowerCase().includes(query)
    );
    setFilteredBenefits(filtered);
  }, [searchQuery, benefits]);

  const handleRedeem = async (benefitId: string) => {
    try {
      setRedeemingBenefitId(benefitId);

      const data = await redeemBenefit(benefitId);

      toast.success('Benefício resgatado com sucesso!');
      // Reload benefits to update quantities
      await loadBenefits();
    } catch (err: any) {
      console.error('[v0] Error redeeming benefit:', err);

      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.message.includes('401')) {
        toast.error('Você precisa estar logado para resgatar benefícios.');
      } else if (err.message.includes('400')) {
        toast.error('Pontos insuficientes ou benefício indisponível.');
      } else {
        toast.error('Erro ao resgatar benefício. Tente novamente.');
      }
    } finally {
      setRedeemingBenefitId(null);
    }
  };

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-2 flex items-center gap-2">
              Benefícios disponíveis
            </h1>
            <p className="text-[#511A2B]/70">Troque seus pontos por recompensas incríveis</p>
          </div>

          {/* Search Input */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-96">
              <Input
                placeholder="Buscar benefícios..."
                className="pl-4 pr-12 w-full h-12 sm:h-14 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 rounded-lg text-[#511A2B]/70">
                <Search className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading / Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-[#511A2B]/70">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-[#511A2B]/30 animate-spin" />
            Carregando benefícios...
          </div>
        ) : (
          <>
            {filteredBenefits.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredBenefits.map((benefit) => (
                  <BenefitCard
                    key={benefit.id}
                    benefit={benefit}
                    onRedeem={handleRedeem}
                    isRedeeming={redeemingBenefitId === benefit.id}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Gift className="h-16 w-16 text-[#511A2B]/30 mb-4" />
                <p className="text-[#511A2B] text-lg font-medium mb-2">Nenhum benefício encontrado</p>
                <p className="text-[#511A2B]/70 text-sm text-center">
                  {searchQuery
                    ? 'Tente ajustar sua busca ou remover os filtros aplicados'
                    : 'Não há benefícios disponíveis no momento'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
