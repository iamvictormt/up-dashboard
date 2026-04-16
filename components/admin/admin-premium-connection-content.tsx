'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AdminStatisticsCards } from './admin-statistics-cards';
import { AdminPartnersTable } from './admin-partners-table';
import { fetchAdminDashboardStatistics } from '@/lib/physical-sales-api';
import { fetchAdminPartnerSuppliers } from '@/lib/store-api';
import type { AdminDashboardStatistics, WellnessPartnerListItem } from '@/types';

const initialStats: AdminDashboardStatistics = {
  totalProfessionals: 0,
  totalPartnerSuppliers: 0,
  totalBenefitsRedeemed: 0,
  totalPointsAwarded: 0,
  totalPhysicalSales: 0,
  totalPointsAwardedPhysical: 0,
};

export function AdminPremiumConnectionContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminDashboardStatistics>(initialStats);
  const [partners, setPartners] = useState<WellnessPartnerListItem[]>([]);

  const sortedPartners = useMemo(() => {
    return [...partners].sort((a, b) => {
      const left = (a.currentPointsAwarded || 0) / (a.pointsLimit || 1);
      const right = (b.currentPointsAwarded || 0) / (b.pointsLimit || 1);
      return right - left;
    });
  }, [partners]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [dashboardStats, partnerList] = await Promise.all([
        fetchAdminDashboardStatistics(),
        fetchAdminPartnerSuppliers(),
      ]);
      setStats({
        ...initialStats,
        ...dashboardStats,
      });
      setPartners(partnerList);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao carregar dados da Conexão Premiada.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePartnerUpdated = (updatedPartner: WellnessPartnerListItem) => {
    setPartners((previous) => previous.map((partner) => (partner.id === updatedPartner.id ? updatedPartner : partner)));
  };

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B]">Dashboard - Conexão Premiada</h1>
            <p className="text-[#511A2B]/70">Controle vendas físicas, pontos distribuídos e limites dos parceiros wellness.</p>
          </div>
          <Button onClick={loadData} variant="outline" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
            Atualizar dados
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-[#511A2B]/70">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Carregando dashboard...
          </div>
        ) : (
          <>
            <AdminStatisticsCards stats={stats} isLoading={isLoading} />
            <AdminPartnersTable partners={sortedPartners} onPartnerUpdated={handlePartnerUpdated} />
          </>
        )}
      </div>
    </div>
  );
}
