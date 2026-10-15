'use client';

import { FormEvent, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Loader2, Pencil, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cancelPhysicalSale, fetchPhysicalSales, updatePhysicalSale } from '@/lib/physical-sales-api';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { PhysicalSale } from '@/types';

// O tema global é escuro; este cartão é claro, então as cores da tabela são fixadas aqui
const headClass = 'text-[#511A2B]/60';
const rowClass = 'border-[#511A2B]/10 hover:bg-[#FFEDC1]/50';

const errorMessage = (error: any, fallback: string) => error?.response?.data?.message || fallback;

// ponytail: lista tudo sem paginação; paginar no backend quando alguma loja passar de algumas centenas de vendas
export function PhysicalSalesHistory({ refreshKey }: { refreshKey: number }) {
  const [sales, setSales] = useState<PhysicalSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reload, setReload] = useState(0);
  const [editing, setEditing] = useState<PhysicalSale | null>(null);
  const [cancelling, setCancelling] = useState<PhysicalSale | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchPhysicalSales()
      .then((data) => {
        if (!cancelled) {
          setSales(data);
          setHasError(false);
        }
      })
      .catch(() => !cancelled && setHasError(true))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [refreshKey, reload]);

  const totalPoints = sales
    .filter((sale) => sale.redeemedAt && !sale.cancelledAt)
    .reduce((sum, sale) => sum + sale.points, 0);

  const canEdit = (sale: PhysicalSale) => !sale.cancelledAt && new Date(sale.editableUntil).getTime() > Date.now();

  return (
    <Card className="rounded-2xl border border-[#511A2B]/10 bg-white/90">
      <CardContent className="p-6">
        <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#511A2B]">Extrato de lançamentos</h2>
            <p className="text-sm text-[#511A2B]/70">
              Todas as vendas registradas pela sua loja. Você pode corrigir ou cancelar um lançamento em até 3 dias.
            </p>
          </div>
          {sales.length > 0 ? (
            <p className="text-sm text-[#511A2B]/70">
              Pontos creditados: <strong className="text-[#511A2B]">{totalPoints.toLocaleString('pt-BR')}</strong>
            </p>
          ) : null}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#511A2B]/60" />
          </div>
        ) : hasError ? (
          <p className="py-8 text-center text-sm text-red-700">Não foi possível carregar o extrato.</p>
        ) : sales.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#511A2B]/60">Nenhuma venda registrada ainda.</p>
        ) : (
          <Table className="text-[#511A2B]">
            <TableHeader>
              <TableRow className="border-[#511A2B]/15 hover:bg-transparent">
                <TableHead className={headClass}>Data</TableHead>
                <TableHead className={headClass}>Cliente</TableHead>
                <TableHead className={headClass}>Profissional</TableHead>
                <TableHead className={`${headClass} text-right`}>Valor</TableHead>
                <TableHead className={`${headClass} text-right`}>Pontos</TableHead>
                <TableHead className={headClass}>Situação</TableHead>
                <TableHead className={`${headClass} text-right`}>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id} className={`${rowClass} ${sale.cancelledAt ? 'opacity-60' : ''}`}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(sale.createdAt), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    {sale.professional && sale.customerName === sale.professional.name ? (
                      <span className="text-[#511A2B]/50">—</span>
                    ) : (
                      <p>{sale.customerName}</p>
                    )}
                    {sale.sellerName ? <p className="text-xs text-[#511A2B]/60">Vendedor: {sale.sellerName}</p> : null}
                    {sale.invoice ? <p className="text-xs text-[#511A2B]/60">NF: {sale.invoice}</p> : null}
                  </TableCell>
                  <TableCell>
                    {sale.professional ? (
                      <>
                        <p>{sale.professional.name}</p>
                        {sale.professional.document ? (
                          <p className="whitespace-nowrap text-xs text-[#511A2B]/60">{sale.professional.document}</p>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-[#511A2B]/50">—</span>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">{formatCurrency(sale.value)}</TableCell>
                  <TableCell className="text-right font-semibold">{sale.points.toLocaleString('pt-BR')}</TableCell>
                  <TableCell>
                    {sale.cancelledAt ? (
                      <span className="inline-flex rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        Cancelada
                      </span>
                    ) : sale.redeemedAt ? (
                      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                        Creditado
                      </span>
                    ) : (
                      <div>
                        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                          Aguardando resgate
                        </span>
                        <p className="mt-1 font-mono text-xs text-[#511A2B]/60">{sale.code}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {canEdit(sale) ? (
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-[#511A2B] hover:bg-[#511A2B]/10 hover:text-[#511A2B]"
                          onClick={() => setEditing(sale)}
                          title="Corrigir"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-50"
                          onClick={() => setCancelling(sale)}
                          title="Cancelar"
                        >
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <EditSaleDialog
        sale={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          setReload((n) => n + 1);
        }}
      />
      <CancelSaleDialog
        sale={cancelling}
        onClose={() => setCancelling(null)}
        onCancelled={() => {
          setCancelling(null);
          setReload((n) => n + 1);
        }}
      />
    </Card>
  );
}

function EditSaleDialog({
  sale,
  onClose,
  onSaved,
}: {
  sale: PhysicalSale | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ customerName: '', value: '', sellerName: '', invoice: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (sale) {
      setForm({
        customerName: sale.customerName,
        value: String(sale.value),
        sellerName: sale.sellerName ?? '',
        invoice: sale.invoice ?? '',
      });
    }
  }, [sale]);

  const value = Number(form.value);
  const newPoints = Number.isFinite(value) ? Math.ceil(value) : 0;
  const diff = sale ? newPoints - sale.points : 0;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!sale) return;
    if (!form.customerName.trim()) return toast.error('Informe o nome do cliente.');
    if (!Number.isFinite(value) || value < 1) return toast.error('Informe um valor de pelo menos R$ 1,00.');
    if (!form.invoice.trim()) return toast.error('Informe a nota fiscal da venda.');

    try {
      setIsSaving(true);
      await updatePhysicalSale(sale.id, {
        customerName: form.customerName.trim(),
        value,
        sellerName: form.sellerName.trim(),
        invoice: form.invoice.trim(),
      });
      toast.success('Lançamento corrigido.');
      onSaved();
    } catch (error) {
      toast.error(errorMessage(error, 'Não foi possível corrigir o lançamento.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={!!sale} onOpenChange={(open) => !open && !isSaving && onClose()}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-[#511A2B]">Corrigir lançamento</DialogTitle>
            <DialogDescription>
              {sale?.professional
                ? `Os pontos de ${sale.professional.name} são ajustados automaticamente.`
                : 'O código continua o mesmo, com os pontos atualizados.'}
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 space-y-4">
            <div className="space-y-2">
              <Label variant="light" required>
                Nome do cliente
              </Label>
              <Input
                variant="light"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                readOnly={!!sale?.professional}
                aria-readonly={!!sale?.professional}
                className={sale?.professional ? 'cursor-not-allowed bg-[#511A2B]/5 text-[#511A2B]/70' : undefined}
              />
              {sale?.professional ? (
                <p className="text-xs text-[#511A2B]/60">Venda com profissional: o cliente é o próprio profissional.</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label variant="light" required>
                Valor da venda
              </Label>
              <Input
                variant="light"
                type="number"
                min={1}
                step="0.01"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
              {sale?.redeemedAt && diff !== 0 ? (
                <p className={`text-xs ${diff > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {diff > 0 ? '+' : ''}
                  {diff.toLocaleString('pt-BR')} pontos para o profissional
                </p>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label variant="light" optional>
                  Vendedor
                </Label>
                <Input
                  variant="light"
                  value={form.sellerName}
                  onChange={(e) => setForm({ ...form, sellerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label variant="light" required>
                  Nota fiscal
                </Label>
                <Input
                  variant="light"
                  value={form.invoice}
                  onChange={(e) => setForm({ ...form, invoice: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSaving}>
                Voltar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Salvar correção
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CancelSaleDialog({
  sale,
  onClose,
  onCancelled,
}: {
  sale: PhysicalSale | null;
  onClose: () => void;
  onCancelled: () => void;
}) {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (!sale) return;
    try {
      setIsCancelling(true);
      await cancelPhysicalSale(sale.id);
      toast.success('Lançamento cancelado.');
      onCancelled();
    } catch (error) {
      toast.error(errorMessage(error, 'Não foi possível cancelar o lançamento.'));
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Dialog open={!!sale} onOpenChange={(open) => !open && !isCancelling && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#511A2B]">Cancelar lançamento?</DialogTitle>
          <DialogDescription>
            {sale?.redeemedAt && sale.professional
              ? `Os ${sale.points.toLocaleString('pt-BR')} pontos serão retirados da conta de ${sale.professional.name}.`
              : 'O código deixa de valer e não poderá mais ser resgatado.'}{' '}
            Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isCancelling}>
              Voltar
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={handleCancel} disabled={isCancelling}>
            {isCancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Cancelar lançamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
