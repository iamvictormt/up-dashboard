'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Clock, Pencil, Plus, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import type { WellnessOffering } from '@/types/wellness';
import {
  createWellnessOffering,
  deleteWellnessOffering,
  fetchMyWellness,
  updateWellnessOffering,
} from '@/lib/wellness-api';

const emptyForm = { name: '', description: '', price: '', duration: '' };

export function MyServicesContent() {
  const [services, setServices] = useState<WellnessOffering[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<WellnessOffering | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    try {
      setIsLoading(true);
      const response = await fetchMyWellness();
      setServices(response.data.services ?? []);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      toast.error('Erro ao carregar seus serviços.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (service: WellnessOffering) => {
    setEditing(service);
    setForm({
      name: service.name,
      description: service.description ?? '',
      price: service.price != null ? String(service.price) : '',
      duration: service.duration ?? '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Informe o nome do serviço.');
      return;
    }
    const payload = {
      name: form.name,
      description: form.description || undefined,
      // preço em branco = "sob consulta"
      price: form.price.trim() === '' ? undefined : Number(form.price.replace(',', '.')),
      duration: form.duration || undefined,
    };
    if (payload.price !== undefined && Number.isNaN(payload.price)) {
      toast.error('Preço inválido.');
      return;
    }

    try {
      setIsSaving(true);
      if (editing) {
        await updateWellnessOffering(editing.id, payload);
        toast.success('Serviço atualizado!');
      } else {
        await createWellnessOffering(payload as Omit<WellnessOffering, 'id'>);
        toast.success('Serviço cadastrado!');
      }
      setDialogOpen(false);
      await load();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      toast.error('Erro ao salvar o serviço.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (service: WellnessOffering) => {
    try {
      await deleteWellnessOffering(service.id);
      toast.success('Serviço removido.');
      setServices((prev) => prev.filter((s) => s.id !== service.id));
    } catch (error) {
      console.error('Erro ao remover serviço:', error);
      toast.error('Erro ao remover o serviço.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3B51]">Meus serviços</h1>
          <p className="text-[#1A3B51]/70 text-sm">
            Cadastre os serviços que aparecem no seu perfil. Preço é opcional — sem preço, exibimos
            &quot;Sob consulta&quot;.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Novo serviço
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-[#1A3B51]/60">
            <Sparkles className="w-8 h-8 mb-2" />
            <p>Nenhum serviço cadastrado ainda.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-[#1A3B51]">{service.name}</h3>
                  <span className="shrink-0 rounded-md bg-[#FFF7DD] px-2 py-0.5 text-xs font-bold text-[#4A1730]">
                    {service.price != null ? formatCurrency(service.price) : 'Sob consulta'}
                  </span>
                </div>
                {service.description && (
                  <p className="text-sm text-[#1A3B51]/70 line-clamp-2">{service.description}</p>
                )}
                {service.duration && (
                  <div className="flex items-center gap-1 text-xs text-[#1A3B51]/55">
                    <Clock className="w-3 h-3" />
                    {service.duration}
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(service)}>
                    <Pencil className="w-3.5 h-3.5 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(service)}>
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar serviço' : 'Novo serviço'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Nome</Label>
              <Input
                id="service-name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Massagem relaxante"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-description">Descrição</Label>
              <Textarea
                id="service-description"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o serviço"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service-price">Preço (opcional)</Label>
                <Input
                  id="service-price"
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="Deixe vazio p/ sob consulta"
                  inputMode="decimal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-duration">Duração</Label>
                <Input
                  id="service-duration"
                  value={form.duration}
                  onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                  placeholder="Ex: 1h"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
