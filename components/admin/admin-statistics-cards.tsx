'use client';

import { Building2, Trophy, UsersRound, Wallet } from 'lucide-react';
import type { AdminDashboardStatistics } from '@/types';

interface AdminStatisticsCardsProps {
  stats: AdminDashboardStatistics | null;
  isLoading: boolean;
}

const defaultStats: AdminDashboardStatistics = {
  totalProfessionals: 0,
  totalPartnerSuppliers: 0,
  totalBenefitsRedeemed: 0,
  totalPointsAwarded: 0,
  totalPhysicalSales: 0,
  totalPointsAwardedPhysical: 0,
};

export function AdminStatisticsCards({ stats, isLoading }: AdminStatisticsCardsProps) {
  const currentStats = stats || defaultStats;

  const cards = [
    {
      title: 'Profissionais ativos',
      value: currentStats.totalProfessionals,
      icon: UsersRound,
    },
    {
      title: 'Lojistas parceiros',
      value: currentStats.totalPartnerSuppliers,
      icon: Building2,
    },
    {
      title: 'Total de vendas físicas',
      value: currentStats.totalPhysicalSales,
      icon: Trophy,
    },
    {
      title: 'Pontos distribuídos (físico)',
      value: currentStats.totalPointsAwardedPhysical,
      icon: Wallet,
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-[#511A2B]/10 bg-white p-5 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#511A2B]/70">{card.title}</p>
            <card.icon className="h-5 w-5 text-[#511A2B]/60" />
          </div>

          <p className="mt-4 text-3xl font-bold text-[#511A2B]">
            {isLoading ? '...' : card.value.toLocaleString('pt-BR')}
          </p>
        </div>
      ))}
    </div>
  );
}
