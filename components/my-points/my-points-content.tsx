'use client';

import { useEffect, useMemo, useState } from 'react';
import { Coins, ReceiptText, ShoppingBag, Ticket, TrendingUp, Trophy } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { fetchPointsHistory, type PointHistoryEntry } from '@/lib/points-api';
import { fetchMyPurchases } from '@/lib/physical-sales-api';
import { formatCurrency } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhysicalSaleCodeRedeemCard } from '@/components/physical-sales/physical-sale-code-redeem-card';
import type { MyPurchase } from '@/types';
import { PointsStatement, toISODate } from './points-statement';
import { MyPurchasesTable } from './my-purchases-table';

const LEVEL_LABEL: Record<string, string> = {
  BRONZE: 'Bronze',
  SILVER: 'Prata',
  GOLD: 'Ouro',
  PLATINUM: 'Platina',
};

export function MyPointsContent() {
  const { user, isLoading } = useUser();
  const [tab, setTab] = useState('statement');
  const [reloadKey, setReloadKey] = useState(0);
  const [yearHistory, setYearHistory] = useState<PointHistoryEntry[]>([]);
  const [purchases, setPurchases] = useState<MyPurchase[]>([]);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(true);

  const year = new Date().getFullYear();
  const isProfessional = !!user?.professional;

  useEffect(() => {
    if (!isProfessional) return;
    let cancelled = false;
    setIsLoadingPurchases(true);
    Promise.all([
      fetchPointsHistory({ from: `${year}-01-01`, to: toISODate(new Date()) }).then((r) => r.data),
      fetchMyPurchases(),
    ])
      .then(([history, myPurchases]) => {
        if (cancelled) return;
        setYearHistory(history);
        setPurchases(myPurchases);
      })
      .catch(() => {})
      .finally(() => !cancelled && setIsLoadingPurchases(false));
    return () => {
      cancelled = true;
    };
  }, [isProfessional, reloadKey, year]);

  const summary = useMemo(() => {
    const yearPurchases = purchases.filter((p) => !p.cancelledAt && new Date(p.createdAt).getFullYear() === year);
    return {
      pointsEarned: yearHistory.filter((h) => h.operation === 'ADD').reduce((sum, h) => sum + h.value, 0),
      purchasesCount: yearPurchases.length,
      purchasesValue: yearPurchases.reduce((sum, p) => sum + p.value, 0),
    };
  }, [purchases, yearHistory, year]);

  if (!isLoading && !isProfessional) {
    return (
      <div className="p-6 md:p-8 w-full">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[#511A2B]/10 bg-white/60 p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-[#511A2B]">Meus pontos</h1>
          <p className="mt-2 text-[#511A2B]/70">Esta área é exclusiva para profissionais.</p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      icon: Coins,
      label: 'Saldo atual',
      value: `${(user?.professional?.points ?? 0).toLocaleString('pt-BR')} pts`,
      highlight: true,
    },
    { icon: Trophy, label: 'Nível', value: LEVEL_LABEL[user?.professional?.level ?? ''] ?? '—' },
    { icon: TrendingUp, label: `Pontos ganhos em ${year}`, value: summary.pointsEarned.toLocaleString('pt-BR') },
    {
      icon: ShoppingBag,
      label: `Compras em ${year}`,
      value: formatCurrency(summary.purchasesValue),
      detail: `${summary.purchasesCount} ${summary.purchasesCount === 1 ? 'compra' : 'compras'} em lojas parceiras`,
    },
  ];

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="mx-auto max-w-5xl rounded-3xl border border-[#511A2B]/10 bg-[#FFEDC1] p-6 shadow-lg md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#511A2B] md:text-3xl">Meus pontos</h1>
          <p className="mt-2 text-[#511A2B]/70">
            Acompanhe seu saldo, os pontos que você ganhou e as compras feitas nas lojas parceiras.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, label, value, detail, highlight }) => (
            <div
              key={label}
              className={
                highlight
                  ? 'rounded-2xl bg-[#511A2B] p-5 text-white shadow-md'
                  : 'rounded-2xl border border-[#511A2B]/10 bg-white/90 p-5 text-[#511A2B]'
              }
            >
              <div className="mb-3 flex items-center gap-2 text-sm opacity-80">
                <Icon className="h-4 w-4" />
                {label}
              </div>
              <p className="text-2xl font-bold">{value}</p>
              {detail ? <p className="mt-1 text-xs opacity-70">{detail}</p> : null}
            </div>
          ))}
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList variant="light" className="mb-6 grid w-full grid-cols-3 md:inline-grid md:w-auto">
            <TabsTrigger value="statement" variant="light">
              <ReceiptText className="h-4 w-4" />
              Extrato
            </TabsTrigger>
            <TabsTrigger value="purchases" variant="light">
              <ShoppingBag className="h-4 w-4" />
              Minhas compras
            </TabsTrigger>
            <TabsTrigger value="redeem" variant="light">
              <Ticket className="h-4 w-4" />
              Resgatar código
            </TabsTrigger>
          </TabsList>

          <TabsContent value="statement" className="mt-0">
            <PointsStatement reloadKey={reloadKey} />
          </TabsContent>

          <TabsContent value="purchases" className="mt-0">
            <MyPurchasesTable purchases={purchases} isLoading={isLoadingPurchases} />
          </TabsContent>

          <TabsContent value="redeem" className="mt-0">
            <PhysicalSaleCodeRedeemCard
              onRedeemed={() => {
                setReloadKey((n) => n + 1);
                setTab('statement');
              }}
            />
            <p className="mt-3 text-sm text-[#511A2B]/70">
              Quando a loja encontra você pelo CPF ou nome na hora da venda, os pontos entram sozinhos. O código só é
              necessário quando a loja não conseguiu identificar você.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
