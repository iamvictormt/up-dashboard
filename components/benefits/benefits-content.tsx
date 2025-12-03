'use client';

import { useState, useEffect } from 'react';
import { BenefitCard } from '@/components/benefits/benefit-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Gift, Sparkles, Package, History } from 'lucide-react';
import { fetchAvailableBenefits, fetchMyRedemptions, redeemBenefit } from '@/lib/benefits-api';
import { toast } from 'sonner';
import type { BenefitData, BenefitRedemptionData } from '@/types';
import { useUser } from '@/contexts/user-context';
import { RedemptionCard } from './redemption-card';

type ViewMode = 'available' | 'redemptions';

export function BenefitsContent() {
  const { user, updateUser } = useUser();
  const [viewMode, setViewMode] = useState<ViewMode>('available');
  const [isLoading, setIsLoading] = useState(true);
  const [benefits, setBenefits] = useState<BenefitData[]>([]);
  const [redemptions, setRedemptions] = useState<BenefitRedemptionData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBenefits, setFilteredBenefits] = useState<BenefitData[]>([]);
  const [filteredRedemptions, setFilteredRedemptions] = useState<BenefitRedemptionData[]>([]);
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

  const loadRedemptions = async () => {
    try {
      setIsLoading(true);
      const data = await fetchMyRedemptions();
      setRedemptions(data);
      setFilteredRedemptions(data);
    } catch (err) {
      toast.error('Erro ao carregar resgates. Tente novamente.');
      setRedemptions([]);
      setFilteredRedemptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSearchQuery('');
    if (viewMode === 'available') {
      loadBenefits();
    } else {
      loadRedemptions();
    }
  }, [viewMode]);

  useEffect(() => {
    if (viewMode === 'available') {
      if (!searchQuery.trim()) {
        setFilteredBenefits(benefits);
        return;
      }

      const query = searchQuery.toLowerCase();
      const filtered = benefits.filter(
        (benefit) => benefit.name.toLowerCase().includes(query) || benefit.description.toLowerCase().includes(query)
      );
      setFilteredBenefits(filtered);
    } else {
      if (!searchQuery.trim()) {
        setFilteredRedemptions(redemptions);
        return;
      }

      const query = searchQuery.toLowerCase();
      const filtered = redemptions.filter(
        (redemption) =>
          redemption.benefit.name.toLowerCase().includes(query) ||
          redemption.benefit.description.toLowerCase().includes(query)
      );
      setFilteredRedemptions(filtered);
    }
  }, [searchQuery, benefits, redemptions, viewMode]);

  const handleRedeem = async (benefitId: string) => {
    try {
      setRedeemingBenefitId(benefitId);

      const data = await redeemBenefit(benefitId);

      if (user?.professional) {
        updateUser({
          professional: {
            ...user.professional,
            points: user.professional.points - data.benefit.pointsCost,
          },
        });
      }

      toast.success('Benefício resgatado com sucesso!');
      await loadBenefits();
    } catch (err: any) {
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
              {viewMode === 'available' ? 'Benefícios disponíveis' : 'Meus resgates'}
            </h1>
            <p className="text-[#511A2B]/70">
              {viewMode === 'available'
                ? 'Troque seus pontos por recompensas incríveis'
                : 'Histórico dos seus benefícios resgatados'}
            </p>
          </div>

          {/* Search Input */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-96">
              <Input
                placeholder={viewMode === 'available' ? 'Buscar benefícios...' : 'Buscar resgates...'}
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

        <div className="inline-grid md:flex gap-1 md:gap-3 mb-6 p-1.5 bg-[#511A2B]/5 rounded-xl w-full md:w-fit">
          <Button
            onClick={() => setViewMode('available')}
            variant={viewMode === 'available' ? 'primary' : 'ghost'}
            className={`rounded-lg transition-all duration-300 ${
              viewMode === 'available'
                ? 'bg-gradient-to-r from-[#511A2B] to-[#511A2B]/90 text-white shadow-md'
                : 'text-[#511A2B] hover:bg-[#511A2B]/10'
            }`}
          >
            <Package className="w-4 h-4 mr-2" />
            Disponíveis
          </Button>
          <Button
            onClick={() => setViewMode('redemptions')}
            variant={viewMode === 'redemptions' ? 'primary' : 'ghost'}
            className={`rounded-lg transition-all duration-300 ${
              viewMode === 'redemptions'
                ? 'bg-gradient-to-r from-[#511A2B] to-[#511A2B]/90 text-white shadow-md'
                : 'text-[#511A2B] hover:bg-[#511A2B]/10'
            }`}
          >
            <History className="w-4 h-4 mr-2" />
            Meus resgates
          </Button>
        </div>

        {/* Loading / Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-[#511A2B]/70">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-[#511A2B]/30 animate-spin" />
            {viewMode === 'available' ? 'Carregando benefícios...' : 'Carregando resgates...'}
          </div>
        ) : (
          <>
            {viewMode === 'available' ? (
              filteredBenefits.length > 0 ? (
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
              )
            ) : filteredRedemptions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredRedemptions.map((redemption) => (
                  <RedemptionCard key={redemption.id} redemption={redemption} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <History className="h-16 w-16 text-[#511A2B]/30 mb-4" />
                <p className="text-[#511A2B] text-lg font-medium mb-2">Nenhum resgate encontrado</p>
                <p className="text-[#511A2B]/70 text-sm text-center">
                  {searchQuery
                    ? 'Tente ajustar sua busca ou remover os filtros aplicados'
                    : 'Você ainda não resgatou nenhum benefício'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
