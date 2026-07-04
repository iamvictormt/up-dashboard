'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Clock, Package, Pencil, Plus, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import type { WellnessOffering } from '@/types/wellness';
import {
  createWellnessOffering,
  deleteWellnessOffering,
  fetchMyWellness,
  updateWellnessOffering,
} from '@/lib/wellness-api';
import { uploadImageCloudinary } from '@/lib/user-api';
import { PhotoUploadSimple } from '@/components/auth/register-steps/photo-upload-simple';

const emptyForm = { name: '', description: '', price: 0, duration: '', photoUrl: '' };

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
      price: service.price ?? 0,
      duration: service.duration ?? '',
      photoUrl: service.photoUrl ?? '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Informe o nome do serviço.');
      return;
    }

    try {
      setIsSaving(true);

      let photoUrl = form.photoUrl || undefined;
      if (photoUrl && !photoUrl.includes('res.cloudinary.com')) {
        photoUrl = (await uploadImageCloudinary(photoUrl)) || undefined;
      }

      const payload = {
        name: form.name,
        description: form.description || undefined,
        // R$ 0,00 = "sob consulta"
        price: form.price > 0 ? form.price : undefined,
        duration: form.duration || undefined,
        photoUrl,
      };

      if (editing) {
        await updateWellnessOffering(editing.id, payload);
        toast.success('Serviço atualizado com sucesso.');
      } else {
        await createWellnessOffering(payload as Omit<WellnessOffering, 'id'>);
        toast.success('Serviço cadastrado com sucesso.');
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
    <div className="p-6 md:p-8 w-full">
      <div className="bg-[#FFEDC1] backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#4A1730]/10 shadow-lg w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1A3B51] mb-2">Meus serviços</h1>
            <p className="text-[#1A3B51]/70">
              Cadastre os serviços que aparecem no seu perfil. Preço é opcional — sem preço, exibimos
              &quot;Sob consulta&quot;.
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="rounded-xl font-semibold shadow-md hover:shadow-xl transition-all bg-[#4A1730] hover:bg-[#5C1D3B] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo serviço
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-[#1A3B51]/70">Carregando serviços...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-10 h-10 mx-auto mb-3 text-[#4A1730]/40" />
            <p className="text-[#1A3B51] text-lg font-medium mb-2">Nenhum serviço cadastrado</p>
            <p className="text-[#1A3B51]/70">
              Cadastre seu primeiro serviço para aparecer no seu perfil público
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#4A1730]/15 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4A1730]/30 hover:shadow-md"
              >
                <div className="aspect-[5/2] overflow-hidden bg-[#FFF7DD]">
                  {service.photoUrl ? (
                    <img
                      src={service.photoUrl}
                      alt={service.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Sparkles className="h-8 w-8 text-[#4A1730]/35" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2 border-t border-[#4A1730]/10 px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold leading-tight text-[#1A3B51]">{service.name}</span>
                    <span className="shrink-0 rounded-md bg-[#FFF7DD] px-2 py-0.5 text-xs font-bold text-[#4A1730]">
                      {service.price != null ? formatCurrency(service.price) : 'Sob consulta'}
                    </span>
                  </div>
                  {service.description && (
                    <p className="text-sm text-[#1A3B51]/70 line-clamp-2">{service.description}</p>
                  )}
                  {service.duration && (
                    <div className="flex items-center gap-1 text-xs font-medium text-[#1A3B51]/55">
                      <Clock className="w-3 h-3" />
                      {service.duration}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 px-4 pb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl border-[#4A1730]/20 text-[#4A1730] hover:bg-[#4A1730]/5"
                    onClick={() => openEdit(service)}
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(service)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#511A2B] rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-[#511A2B]">
                {editing ? 'Editar serviço' : 'Adicionar serviço'}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <PhotoUploadSimple
              photo={form.photoUrl || ''}
              isProduct={true}
              label="Foto do serviço"
              onPhotoChange={(photo) => setForm((prev) => ({ ...prev, photoUrl: photo ?? '' }))}
            />

            <div>
              <Label htmlFor="service-name" className="text-[#511A2B] font-medium" required>
                Nome do serviço
              </Label>
              <Input
                id="service-name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Massagem relaxante"
                className="pl-2 mt-1 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
            </div>

            <div>
              <Label htmlFor="service-description" className="text-[#511A2B] font-medium" optional>
                Descrição
              </Label>
              <Textarea
                id="service-description"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o serviço"
                className="mt-1 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service-price" className="text-[#511A2B] font-medium" optional>
                  Preço (R$) — deixe R$ 0,00 para "Sob consulta"
                </Label>
                <Input
                  id="service-price"
                  type="text"
                  inputMode="numeric"
                  value={formatCurrency(form.price || 0)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    const numberValue = raw ? parseFloat(raw) / 100 : 0;
                    if (numberValue > 1_000_000) return;
                    setForm((prev) => ({ ...prev, price: numberValue }));
                  }}
                  placeholder="R$ 0,00"
                  className="pl-2 mt-1 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                />
              </div>
              <div>
                <Label htmlFor="service-duration" className="text-[#511A2B] font-medium" optional>
                  Duração
                </Label>
                <Input
                  id="service-duration"
                  value={form.duration}
                  onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                  placeholder="Ex: 1h"
                  className="pl-2 mt-1 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="flex-1 rounded-xl border-[#511A2B]/20 text-[#511A2B] hover:bg-[#511A2B]/5"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 rounded-xl bg-[#4A1730] hover:bg-[#5C1D3B] text-white"
              >
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
