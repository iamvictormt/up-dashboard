'use client';

import { FormEvent, useState } from 'react';
import { CircleCheckBig, Copy, HelpCircle, Loader2, Sparkles, Ticket } from 'lucide-react';
import { toast } from 'sonner';
import { createPhysicalSale } from '@/lib/physical-sales-api';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/user-context';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FormState {
  customerName: string;
  saleAmount: string;
  sellerName: string;
  invoiceNumber: string;
}

const initialState: FormState = {
  customerName: '',
  saleAmount: '',
  sellerName: '',
  invoiceNumber: '',
};

export function PhysicalSalesRegistrationContent() {
  const { user, isLoading } = useUser();
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastGeneratedCode, setLastGeneratedCode] = useState<string | null>(null);
  const [lastPointsAwarded, setLastPointsAwarded] = useState<number | null>(null);
  const [lastSaleAmount, setLastSaleAmount] = useState<number | null>(null);
  const [isFlowInfoOpen, setIsFlowInfoOpen] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.customerName.trim()) {
      toast.error('Informe o nome do cliente.');
      return;
    }

    const saleAmount = Number(form.saleAmount);
    if (!Number.isFinite(saleAmount) || saleAmount <= 0) {
      toast.error('Informe um valor de venda válido.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createPhysicalSale({
        customerName: form.customerName.trim(),
        saleAmount,
        sellerName: form.sellerName.trim() || undefined,
        invoiceNumber: form.invoiceNumber.trim() || undefined,
      });

      setLastGeneratedCode(response.code);
      setLastPointsAwarded(response.points);
      setLastSaleAmount(saleAmount);
      setForm(initialState);
      toast.success('Venda física registrada com sucesso.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Não foi possível registrar a venda física.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSupplierPartner = user?.partnerSupplier?.type === 'SUPPLIER';

  if (!isLoading && !isSupplierPartner) {
    return (
      <div className="p-6 md:p-8 w-full">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[#511A2B]/10 bg-white/60 p-8 text-center shadow-lg backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-[#511A2B]">Conexão Premiada indisponível</h1>
          <p className="mt-2 text-[#511A2B]/70">Este recurso está disponível apenas para lojistas parceiros.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="mx-auto max-w-4xl rounded-3xl border border-[#511A2B]/10 bg-white/60 p-6 shadow-lg backdrop-blur-sm md:p-8">
        <div className="mb-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#511A2B] md:text-3xl">Registro de venda - Conexão Premiada</h1>
              <p className="mt-2 text-[#511A2B]/70">
                Cadastre vendas físicas para gerar códigos únicos que os profissionais poderão resgatar no app.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={() => setIsFlowInfoOpen(true)}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Como funciona?
            </Button>
          </div>
        </div>

        <Card className="rounded-2xl border border-[#511A2B]/10 bg-white/90">
          <CardContent className="p-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label className="text-[#511A2B]">Nome do cliente *</Label>
                <Input
                  value={form.customerName}
                  onChange={(event) => handleChange('customerName', event.target.value)}
                  className="h-11 border-[#511A2B]/20 bg-white text-[#511A2B]"
                  placeholder="Ex: Maria da Silva"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#511A2B]">Valor da venda *</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.saleAmount}
                  onChange={(event) => handleChange('saleAmount', event.target.value)}
                  className="h-11 border-[#511A2B]/20 bg-white text-[#511A2B]"
                  placeholder="Ex: 350.00"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-[#511A2B]">Vendedor (opcional)</Label>
                  <Input
                    value={form.sellerName}
                    onChange={(event) => handleChange('sellerName', event.target.value)}
                    className="h-11 border-[#511A2B]/20 bg-white text-[#511A2B]"
                    placeholder="Ex: João"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#511A2B]">Nota fiscal (opcional)</Label>
                  <Input
                    value={form.invoiceNumber}
                    onChange={(event) => handleChange('invoiceNumber', event.target.value)}
                    className="h-11 border-[#511A2B]/20 bg-white text-[#511A2B]"
                    placeholder="Ex: NF-10293"
                  />
                </div>
              </div>

              <Button type="submit" className="h-11 px-6" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Gerar código de pontos
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {lastGeneratedCode ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="mb-3 flex items-center gap-2 text-emerald-700">
              <CircleCheckBig className="h-5 w-5" />
              <span className="font-semibold">Venda registrada com sucesso</span>
            </div>
            <p className="mb-2 text-sm text-emerald-800">Código único para entregar ao cliente:</p>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2 font-mono text-lg font-bold tracking-widest text-[#511A2B]">
                <Ticket className="h-4 w-4" />
                {lastGeneratedCode}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(lastGeneratedCode)}
                className="rounded-xl border border-emerald-300 bg-white p-2 text-emerald-700 transition hover:bg-emerald-100"
                title="Copiar código"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-sm text-emerald-800">
              Pontos previstos para resgate: <strong>{lastPointsAwarded ?? 0} pontos</strong> (
              {formatCurrency(lastSaleAmount || 0)} na venda).
            </p>
          </div>
        ) : null}
      </div>

      <Dialog open={isFlowInfoOpen} onOpenChange={setIsFlowInfoOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Fluxo da Conexão Premiada</DialogTitle>
            <DialogDescription>
              Entenda como registrar vendas físicas e distribuir pontos com segurança.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-[#511A2B]/80">
            <p>
              <strong>1. Registre a venda:</strong> preencha cliente, valor e dados opcionais da venda.
            </p>
            <p>
              <strong>2. Entregue o código:</strong> após salvar, um código único é gerado para o cliente/profissional.
            </p>
            <p>
              <strong>3. Resgate no app:</strong> o profissional informa esse código na área "Conexão Premiada" em Benefícios.
            </p>
            <p>
              <strong>4. Pontos creditados:</strong> os pontos entram no saldo do profissional imediatamente após o resgate.
            </p>
            <p className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-yellow-800">
              Dica: compartilhe o código com atenção, pois cada código pode ser resgatado apenas uma vez.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Entendi</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
