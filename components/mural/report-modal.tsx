'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { createReport } from '@/lib/report-api';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: 'POST' | 'COMMENT';
}

const REPORT_REASONS = [
  { id: 'spam', label: 'Spam ou conteúdo enganoso' },
  { id: 'inappropriate', label: 'Conteúdo inapropriado' },
  { id: 'harassment', label: 'Assédio ou bullying' },
  { id: 'violence', label: 'Violência ou discurso de ódio' },
  { id: 'copyright', label: 'Violação de direitos autorais' },
  { id: 'other', label: 'Outro motivo' },
];

export function ReportModal({ isOpen, onClose, targetId, targetType }: ReportModalProps) {
  const { user } = useUser();
  const [reason, setReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!user || !reason) return;

    try {
      setSubmitting(true);
      setError(null);

      await createReport({
        targetId,
        targetType,
        reason,
        description: description.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        // Reset form after closing
        setTimeout(() => {
          setReason('');
          setDescription('');
          setSuccess(false);
        }, 300);
      }, 2000);
    } catch (err) {
      console.error('Error submitting report:', err);
      setError('Falha ao enviar denúncia. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Denunciar {targetType === 'POST' ? 'publicação' : 'comentário'}</span>
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Denúncia enviada</h3>
            <p className="text-gray-500">Obrigado por ajudar a manter nossa comunidade segura.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Ajude-nos a entender o problema com este {targetType === 'POST' ? 'post' : 'comentário'}. Sua denúncia
              será analisada por nossa equipe.
            </p>

            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Motivo da denúncia</h4>
                <RadioGroup value={reason} onValueChange={setReason}>
                  {REPORT_REASONS.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={item.id} id={item.id}/>
                      <Label htmlFor={item.id} className='text-gray-700'>{item.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-[#511A2B]">Detalhes adicionais (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o problema com mais detalhes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                />
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} disabled={!reason || submitting} variant="destructive">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar denúncia'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
