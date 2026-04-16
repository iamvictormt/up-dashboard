'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import type { PhysicalSale } from '@/types';

interface AdminPhysicalSalesTableProps {
  sales: PhysicalSale[];
}

const statusMap = {
  PENDING: {
    label: 'Pendente',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
  REDEEMED: {
    label: 'Resgatado',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
} as const;

export function AdminPhysicalSalesTable({ sales }: AdminPhysicalSalesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSales = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return sales;

    return sales.filter((sale) => {
      return (
        sale.code.toLowerCase().includes(query) ||
        sale.customerName.toLowerCase().includes(query) ||
        (sale.partnerSupplier?.tradeName || '').toLowerCase().includes(query) ||
        (sale.professional?.email || '').toLowerCase().includes(query)
      );
    });
  }, [sales, searchQuery]);

  return (
    <div className="rounded-2xl border border-[#511A2B]/10 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#511A2B]">Histórico de Conexão Premiada</h2>
          <p className="text-sm text-[#511A2B]/70">Acompanhe todos os códigos físicos gerados e resgatados.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#511A2B]/50" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Buscar por código, cliente ou loja"
            className="h-10 border-[#511A2B]/20 bg-white pl-9 text-[#511A2B]"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Loja/Parceiro</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Valor da venda</TableHead>
            <TableHead>Profissional</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de criação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSales.length > 0 ? (
            filteredSales.map((sale) => {
              const status = statusMap[sale.status];
              return (
                <TableRow key={sale.id}>
                  <TableCell className="font-semibold text-[#511A2B]">{sale.code}</TableCell>
                  <TableCell>{sale.partnerSupplier?.tradeName || '-'}</TableCell>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell>{formatCurrency(sale.saleAmount || 0)}</TableCell>
                  <TableCell>{sale.professional?.email || '-'}</TableCell>
                  <TableCell>
                    <Badge className={status.className}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-[#511A2B]/75">
                    {format(new Date(sale.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-20 text-center text-[#511A2B]/60">
                Nenhuma venda física encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
