'use client';

import type React from 'react';

import { useState } from 'react';
import { X, Calendar, MapPin, Clock, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createEvent } from '@/lib/event-api';
import { toast } from 'sonner';

interface EventFormProps {
  storeId: string;
  storeAddress: {
    state: string;
    city: string;
    district: string;
    street: string;
    complement: string | null;
    number: string;
    zipCode: string;
  };
  onEventCreated: (eventData: any) => void;
  onClose: () => void;
}

interface EventFormData {
  name: string;
  description: string;
  date: string;
  time: string;
  type: string;
  points: number;
  totalSpots: number;
  address: {
    state: string;
    city: string;
    district: string;
    street: string;
    complement: string;
    number: string;
    zipCode: string;
  };
}

export function EventForm({ storeId, storeAddress, onEventCreated, onClose }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    date: '',
    time: '',
    type: 'Workshop',
    points: 50,
    totalSpots: 30,
    address: {
      state: storeAddress.state,
      city: storeAddress.city,
      district: storeAddress.district,
      street: storeAddress.street,
      complement: storeAddress.complement || '',
      number: storeAddress.number,
      zipCode: storeAddress.zipCode,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }

    // Limpar erro do campo
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do evento é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    if (!formData.time) {
      newErrors.time = 'Horário é obrigatório';
    }

    if (formData.points < 1) {
      newErrors.points = 'Pontos deve ser maior que 0';
    }

    if (formData.totalSpots < 1) {
      newErrors.totalSpots = 'Número de vagas deve ser maior que 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const dateTime = new Date(`${formData.date}T${formData.time}:00`).toISOString();

      const eventData = {
        name: formData.name,
        description: formData.description,
        date: dateTime,
        type: formData.type,
        points: formData.points,
        totalSpots: formData.totalSpots,
        storeId: storeId,
        address: formData.address,
      };

      const response = await createEvent(eventData);
      if (response.status === 201) {
        onEventCreated(eventData);
        toast.success('Evento cadastrado com sucesso.');
      }
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      setErrors({ general: 'Erro ao criar evento. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventTypes = ['Workshop', 'Conferência', 'Meetup', 'Hackathon', 'Seminário', 'Curso', 'Palestra'];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] overflow-y-auto bg-white border-[#511A2B]/20 p-0">
        <DialogHeader className="sticky top-0 bg-white border-b border-[#511A2B]/10 p-6 z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl md:text-2xl font-bold text-[#511A2B] flex items-center">
              <Calendar className="w-6 h-6 mr-2" />
              Criar Novo Evento
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5 text-[#511A2B]" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="p-4 bg-red-100 border border-red-200 rounded-xl text-red-800 text-sm">{errors.general}</div>
          )}

          {/* Informações Básicas */}
          <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[#511A2B] flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Informações do Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-[#511A2B] font-medium">
                    Nome do Evento *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: Workshop de TypeScript"
                    className={`mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="type" className="text-[#511A2B] font-medium">
                    Tipo de Evento
                  </Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="mt-1 w-full p-3 border border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl focus:outline-none"
                  >
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-[#511A2B] font-medium">
                  Descrição *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva o evento, objetivos e o que os participantes irão aprender..."
                  className={`mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                  rows={3}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date" className="text-[#511A2B] font-medium">
                    Data *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className={`mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl ${
                      errors.date ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>

                <div>
                  <Label htmlFor="time" className="text-[#511A2B] font-medium">
                    Horário *
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className={`mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl ${
                      errors.time ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                </div>

                <div>
                  <Label htmlFor="totalSpots" className="text-[#511A2B] font-medium">
                    Vagas Disponíveis *
                  </Label>
                  <Input
                    id="totalSpots"
                    type="number"
                    min="1"
                    value={formData.totalSpots}
                    onChange={(e) => handleInputChange('totalSpots', Number.parseInt(e.target.value) || 0)}
                    className={`mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl ${
                      errors.totalSpots ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.totalSpots && <p className="text-red-500 text-sm mt-1">{errors.totalSpots}</p>}
                </div>
              </div>

              {/* <div>
                <Label htmlFor="points" className="text-[#511A2B] font-medium">
                  Pontos de Recompensa
                </Label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  value={formData.points}
                  onChange={(e) => handleInputChange('points', Number.parseInt(e.target.value) || 0)}
                  className={`mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl ${
                    errors.points ? 'border-red-500' : ''
                  }`}
                />
                {errors.points && <p className="text-red-500 text-sm mt-1">{errors.points}</p>}
                <p className="text-sm text-[#511A2B]/70 mt-1">
                  Pontos que os participantes receberão ao completar o evento
                </p>
              </div> */}
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[#511A2B] flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Local do Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="zipCode" className="text-[#511A2B] font-medium">
                    CEP
                  </Label>
                  <Input
                    id="zipCode"
                    value={formData.address.zipCode}
                    onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                    className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="city" className="text-[#511A2B] font-medium">
                    Cidade
                  </Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="state" className="text-[#511A2B] font-medium">
                    Estado
                  </Label>
                  <Input
                    id="state"
                    value={formData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="street" className="text-[#511A2B] font-medium">
                    Rua
                  </Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="number" className="text-[#511A2B] font-medium">
                    Número
                  </Label>
                  <Input
                    id="number"
                    value={formData.address.number}
                    onChange={(e) => handleInputChange('address.number', e.target.value)}
                    className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="district" className="text-[#511A2B] font-medium">
                    Bairro
                  </Label>
                  <Input
                    id="district"
                    value={formData.address.district}
                    onChange={(e) => handleInputChange('address.district', e.target.value)}
                    className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="complement" className="text-[#511A2B] font-medium">
                  Complemento
                </Label>
                <Input
                  id="complement"
                  value={formData.address.complement}
                  onChange={(e) => handleInputChange('address.complement', e.target.value)}
                  placeholder="Ex: Sala 5, Andar 2, etc."
                  className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                />
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Criar Evento
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
