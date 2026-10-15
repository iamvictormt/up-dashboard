import api from '@/services/api';
import { AxiosResponse } from 'axios';
import { formatCurrency } from '@/lib/utils';

export interface PointHistoryEntry {
  id: string;
  operation: 'ADD' | 'REMOVE';
  value: number;
  source: string;
  storeName?: string;
  saleValue?: number;
  saleKind?: 'PURCHASE' | 'ADJUSTMENT' | 'CANCELLATION';
  professionalId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PointsHistoryFilter {
  limit?: number;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD, inclusivo
}

export async function fetchPointsHistory(
  filter: PointsHistoryFilter = { limit: 50 },
): Promise<AxiosResponse<PointHistoryEntry[]>> {
  return await api.get('points/history', { params: filter });
}

// Texto de cada lançamento do extrato
export function describePointEntry(entry: PointHistoryEntry): { title: string; detail?: string } {
  if (entry.source.startsWith('CONEXAO_PREMIADA_')) {
    const kind =
      entry.saleKind === 'ADJUSTMENT'
        ? 'Ajuste de compra'
        : entry.saleKind === 'CANCELLATION'
          ? 'Estorno de compra'
          : 'Compra';
    return {
      title: `${kind} em ${entry.storeName ?? 'loja parceira'}`,
      detail: entry.saleValue ? `Conexão Premiada · ${formatCurrency(entry.saleValue)}` : 'Conexão Premiada',
    };
  }
  // 'LOGIN' é o bônus dado na criação da conta (user.service), não um login diário
  if (entry.source === 'LOGIN') return { title: 'Bônus de boas-vindas' };
  if (entry.source === 'EVENT' || entry.source.startsWith('EVENTO-')) return { title: 'Participação em evento' };
  if (entry.source === 'BENEFIT') return { title: 'Resgate de benefício' };
  if (entry.source.startsWith('Resgate do benefício:')) {
    return { title: 'Resgate de benefício', detail: entry.source.replace('Resgate do benefício:', '').trim() };
  }
  return { title: entry.source };
}
