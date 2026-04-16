'use client';

import { FormEvent, useState } from 'react';
import { Gift, Loader2, Ticket, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { redeemPhysicalSaleCode } from '@/lib/physical-sales-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@/contexts/user-context';

export function PhysicalSaleCodeRedeemCard() {
  const { user, updateUser } = useUser();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedCode = code.trim();
    if (!normalizedCode) {
      toast.error('Informe o código recebido na loja.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await redeemPhysicalSaleCode({ code: normalizedCode });

      if (user?.professional) {
        updateUser({
          professional: {
            ...user.professional,
            points: (user.professional.points || 0) + response.pointsAwarded,
          },
        });
      }

      toast.success(`Resgate concluído! Você ganhou ${response.pointsAwarded} pontos.`);
      setCode('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Não foi possível resgatar este código.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="rounded-2xl border border-[#511A2B]/10 bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#511A2B]">Conexão Premiada</h2>
          <p className="text-sm text-[#511A2B]/70">
            Digite o código recebido na loja física para resgatar pontos no seu saldo.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#511A2B]">Código da Conexão Premiada</label>
            <div className="relative">
              <Ticket className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#511A2B]/40" />
              <Input
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder="Ex: UP-ABC12345"
                className="h-11 border-[#511A2B]/20 bg-white pl-10 text-[#511A2B]"
              />
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resgatando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Resgatar pontos
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
