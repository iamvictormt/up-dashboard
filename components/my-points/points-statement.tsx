'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, TrendingDown, TrendingUp } from 'lucide-react';
import { describePointEntry, fetchPointsHistory, type PointHistoryEntry } from '@/lib/points-api';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Data local no formato do <input type="date"> (evita o deslocamento de fuso do toISOString)
export function toISODate(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

const signed = (entry: PointHistoryEntry) => (entry.operation === 'ADD' ? entry.value : -entry.value);

export function PointsStatement({ reloadKey }: { reloadKey: number }) {
  const [from, setFrom] = useState(`${new Date().getFullYear()}-01-01`);
  const [to, setTo] = useState(toISODate(new Date()));
  const [entries, setEntries] = useState<PointHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!from || !to || from > to) return;
    let cancelled = false;
    setIsLoading(true);
    fetchPointsHistory({ from, to })
      .then((r) => {
        if (cancelled) return;
        setEntries(r.data);
        setHasError(false);
      })
      .catch(() => !cancelled && setHasError(true))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [from, to, reloadKey]);

  // Agrupa por mês, mantendo a ordem do mais recente para o mais antigo
  const months = useMemo(() => {
    const groups = new Map<string, PointHistoryEntry[]>();
    for (const entry of entries) {
      const key = format(new Date(entry.createdAt), 'yyyy-MM');
      groups.set(key, [...(groups.get(key) ?? []), entry]);
    }
    return [...groups.entries()].map(([key, items]) => ({
      label: format(new Date(`${key}-01T12:00:00`), "MMMM 'de' yyyy", { locale: ptBR }),
      total: items.reduce((sum, e) => sum + signed(e), 0),
      items,
    }));
  }, [entries]);

  const periodTotal = entries.reduce((sum, e) => sum + signed(e), 0);

  return (
    <Card className="rounded-2xl border border-[#511A2B]/10 bg-white/90">
      <CardContent className="p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label variant="light" htmlFor="statement-from" indicator="none">
                De
              </Label>
              <Input
                id="statement-from"
                type="date"
                variant="light"
                value={from}
                max={to}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label variant="light" htmlFor="statement-to" indicator="none">
                Até
              </Label>
              <Input
                id="statement-to"
                type="date"
                variant="light"
                value={to}
                min={from}
                max={toISODate(new Date())}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
          {!isLoading && entries.length > 0 ? (
            <p className="text-sm text-[#511A2B]/70">
              Saldo do período:{' '}
              <strong className={periodTotal >= 0 ? 'text-emerald-700' : 'text-red-700'}>
                {periodTotal > 0 ? '+' : ''}
                {periodTotal.toLocaleString('pt-BR')} pontos
              </strong>
            </p>
          ) : null}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-[#511A2B]/60" />
          </div>
        ) : hasError ? (
          <p className="py-10 text-center text-sm text-red-700">Não foi possível carregar o extrato.</p>
        ) : months.length === 0 ? (
          <p className="py-10 text-center text-sm text-[#511A2B]/60">Nenhum lançamento neste período.</p>
        ) : (
          <div className="space-y-6">
            {months.map((month) => (
              <section key={month.label}>
                <div className="mb-2 flex items-baseline justify-between border-b border-[#511A2B]/10 pb-2">
                  <h3 className="font-semibold text-[#511A2B] first-letter:uppercase">{month.label}</h3>
                  <span className={cn('text-sm font-semibold', month.total >= 0 ? 'text-emerald-700' : 'text-red-700')}>
                    {month.total > 0 ? '+' : ''}
                    {month.total.toLocaleString('pt-BR')} pts
                  </span>
                </div>
                <ul className="divide-y divide-[#511A2B]/5">
                  {month.items.map((entry) => {
                    const { title, detail } = describePointEntry(entry);
                    const isAdd = entry.operation === 'ADD';
                    return (
                      <li key={entry.id} className="flex items-center justify-between gap-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                              isAdd ? 'bg-emerald-100' : 'bg-red-100',
                            )}
                          >
                            {isAdd ? (
                              <TrendingUp className="h-4 w-4 text-emerald-700" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-700" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-[#511A2B]">{title}</p>
                            <p className="text-xs text-[#511A2B]/60">
                              {format(new Date(entry.createdAt), "dd/MM 'às' HH:mm")}
                              {detail ? ` · ${detail}` : ''}
                            </p>
                          </div>
                        </div>
                        <span
                          className={cn('whitespace-nowrap font-bold', isAdd ? 'text-emerald-700' : 'text-red-700')}
                        >
                          {isAdd ? '+' : '-'}
                          {entry.value.toLocaleString('pt-BR')}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
