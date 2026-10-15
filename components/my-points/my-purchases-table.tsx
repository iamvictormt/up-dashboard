'use client';

import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { MyPurchase } from '@/types';

const headClass = 'text-[#511A2B]/60';

export function MyPurchasesTable({ purchases, isLoading }: { purchases: MyPurchase[]; isLoading: boolean }) {
  return (
    <Card className="rounded-2xl border border-[#511A2B]/10 bg-white/90">
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#511A2B]">Minhas compras</h2>
          <p className="text-sm text-[#511A2B]/70">Compras em lojas parceiras que geraram pontos para você.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-[#511A2B]/60" />
          </div>
        ) : purchases.length === 0 ? (
          <p className="py-10 text-center text-sm text-[#511A2B]/60">
            Nenhuma compra ainda. Quando uma loja parceira registrar uma venda para você, ela aparece aqui.
          </p>
        ) : (
          <Table className="text-[#511A2B]">
            <TableHeader>
              <TableRow className="border-[#511A2B]/15 hover:bg-transparent">
                <TableHead className={headClass}>Data</TableHead>
                <TableHead className={headClass}>Loja</TableHead>
                <TableHead className={`${headClass} text-right`}>Valor</TableHead>
                <TableHead className={`${headClass} text-right`}>Pontos</TableHead>
                <TableHead className={headClass}>Situação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow
                  key={purchase.id}
                  className={`border-[#511A2B]/10 hover:bg-[#FFEDC1]/50 ${purchase.cancelledAt ? 'opacity-60' : ''}`}
                >
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(purchase.createdAt), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{purchase.partner.tradeName}</TableCell>
                  <TableCell className="whitespace-nowrap text-right">{formatCurrency(purchase.value)}</TableCell>
                  <TableCell className="text-right font-semibold">{purchase.points.toLocaleString('pt-BR')}</TableCell>
                  <TableCell>
                    {purchase.cancelledAt ? (
                      <span className="inline-flex rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        Cancelada
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                        Creditada
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
