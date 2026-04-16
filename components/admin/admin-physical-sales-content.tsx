'use client';

import { useEffect, useState } from 'react';
import { Loader2, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { fetchAdminPhysicalSales } from '@/lib/physical-sales-api';
import type { PhysicalSale } from '@/types';
import { AdminPhysicalSalesTable } from './admin-physical-sales-table';

export function AdminPhysicalSalesContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [sales, setSales] = useState<PhysicalSale[]>([]);

  const loadSales = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminPhysicalSales();
      setSales(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao carregar histórico de vendas físicas.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B]">Histórico de Conexão Premiada</h1>
            <p className="text-[#511A2B]/70">Visualize todas as vendas físicas e o status de resgate dos códigos.</p>
          </div>
          <Button onClick={loadSales} variant="outline" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
            Atualizar histórico
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-[#511A2B]/70">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Carregando vendas físicas...
          </div>
        ) : (
          <AdminPhysicalSalesTable sales={sales} />
        )}
      </div>
    </div>
  );
}
