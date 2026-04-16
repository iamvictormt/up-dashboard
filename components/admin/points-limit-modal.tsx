'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { WellnessPartnerListItem } from '@/types';
import { updatePartnerSupplierPointsLimit } from '@/lib/store-api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface PointsLimitModalProps {
  partner: WellnessPartnerListItem | null;
  open: boolean;
  onClose: () => void;
  onSaved: (updatedPartner: WellnessPartnerListItem) => void;
}

export function PointsLimitModal({ partner, open, onClose, onSaved }: PointsLimitModalProps) {
  const [pointsLimit, setPointsLimit] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!partner) {
      setPointsLimit('');
      return;
    }

    setPointsLimit(String(partner.pointsLimit ?? 0));
  }, [partner]);

  const consumedPercent = useMemo(() => {
    if (!partner || !partner.pointsLimit || partner.pointsLimit <= 0) return 0;
    return Math.min(((partner.currentPointsAwarded || 0) / partner.pointsLimit) * 100, 100);
  }, [partner]);

  const formattedConsumption = useMemo(() => {
    if (!partner) return '';

    return `${partner.currentPointsAwarded || 0} / ${partner.pointsLimit || 0} pontos`;
  }, [partner]);

  const handleSave = async () => {
    if (!partner) return;

    const numericLimit = Number(pointsLimit);
    if (!Number.isFinite(numericLimit) || numericLimit < 0) {
      toast.error('Informe um limite de pontos válido.');
      return;
    }

    try {
      setIsSaving(true);
      const updatedPartner = await updatePartnerSupplierPointsLimit(partner.id, numericLimit);
      toast.success('Limite de pontos atualizado com sucesso.');
      onSaved(updatedPartner);
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Não foi possível atualizar o limite de pontos.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#511A2B]">Gerenciar limite de pontos</DialogTitle>
          <DialogDescription>
            Defina o limite total de pontos que o parceiro pode distribuir na Conexão Premiada.
          </DialogDescription>
        </DialogHeader>

        {partner ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#511A2B]/10 bg-[#511A2B]/5 p-4">
              <p className="text-sm text-[#511A2B]/70">Parceiro</p>
              <p className="font-semibold text-[#511A2B]">{partner.tradeName}</p>
              <p className="text-xs text-[#511A2B]/70">
                Consumo atual: <span className="font-medium">{formattedConsumption}</span>
              </p>
              <div className="mt-3">
                <Progress value={consumedPercent} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#511A2B]">Novo limite de pontos</label>
              <Input
                type="number"
                min={0}
                value={pointsLimit}
                onChange={(event) => setPointsLimit(event.target.value)}
                className="mt-2 text-[#511A2B]"
              />
              <p className="mt-2 text-xs text-[#511A2B]/60">
                Referência: {(partner.currentPointsAwarded || 0).toLocaleString('pt-BR')} pontos já distribuídos.
              </p>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !partner}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar limite'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
