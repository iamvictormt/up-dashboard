'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createPhysicalSale } from '@/lib/physical-sales-api';
import { toast } from 'sonner';
import { Copy, CheckCircle2 } from 'lucide-react';

const saleSchema = z.object({
  customerName: z.string().min(2, 'Nome do cliente é obrigatório'),
  saleValue: z.preprocess((val) => Number(val), z.number().min(0.01, 'Valor da venda deve ser maior que zero')),
  sellerName: z.string().optional(),
  invoiceNumber: z.string().optional(),
});

export function PhysicalSaleForm() {
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof saleSchema>>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      customerName: '',
      saleValue: 0,
      sellerName: '',
      invoiceNumber: '',
    },
  });

  async function onSubmit(values: z.infer<typeof saleSchema>) {
    try {
      setIsLoading(true);
      const response = await createPhysicalSale(values);
      setGeneratedCode(response.data.code);
      toast.success('Venda registrada com sucesso!');
      form.reset();
    } catch (error) {
      toast.error('Erro ao registrar venda. Verifique se você possui limite de pontos.');
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Código copiado para a área de transferência!');
  };

  if (generatedCode) {
    return (
      <Card className="bg-white/80 border-[#511A2B]/10 shadow-lg text-center p-8">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-[#511A2B]">Venda Registrada!</CardTitle>
          <CardDescription>Entregue o código abaixo ao profissional para o resgate de pontos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-[#511A2B]/5 border-2 border-dashed border-[#511A2B]/20 rounded-2xl p-8">
            <span className="text-4xl md:text-6xl font-black tracking-widest text-[#511A2B] font-mono">
              {generatedCode}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => copyToClipboard(generatedCode)} className="rounded-xl">
              <Copy className="w-4 h-4 mr-2" />
              Copiar Código
            </Button>
            <Button onClick={() => setGeneratedCode(null)} className="rounded-xl">
              Registrar Nova Venda
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 border-[#511A2B]/10 shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#511A2B]">Registrar Venda Física</CardTitle>
        <CardDescription>Cadastre a venda para gerar o código de fidelidade.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: João Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="saleValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Venda (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sellerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendedor (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do vendedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da Nota Fiscal (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="000.000.000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl text-lg font-bold" disabled={isLoading}>
              {isLoading ? 'Gerando Código...' : 'Gerar Código de Pontos'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
