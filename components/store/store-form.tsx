'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { X, Save, Store, MapPin, Clock, Copy, Building, WholeWord, Map, Hash, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { createStore, updateStore } from '@/lib/store-api';
import { useUser } from '@/contexts/user-context';
import { applyZipCodeMask } from '@/utils/masks';
import { fetchAddressByZipCode } from '@/lib/address-api';
import { PhotoUploadSimple } from '../auth/register-steps/photo-upload-simple';
import { uploadImageCloudinary } from '@/lib/user-api';

interface StoreFormProps {
  storeData?: {
    id: string;
    name: string;
    description: string;
    website: string;
    openingHours: string;
    logoUrl?: string;
    address: {
      state: string;
      city: string;
      district: string;
      street: string;
      complement: string | null;
      number: string;
      zipCode: string;
    };
  };
  onStoreCreated?: (storeData: any) => void;
  onStoreUpdated?: (storeData: any) => void;
  onClose: () => void;
  isEditing?: boolean;
}

interface StoreFormData {
  logoUrl?: string;
  partnerId: string;
  name: string;
  description: string;
  website: string;
  openingHours: string;
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

interface DaySchedule {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface WeekSchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

function OpeningHoursInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  // Parse the existing string value into schedule object
  const parseStringToSchedule = (str: string): WeekSchedule => {
    const defaultSchedule: WeekSchedule = {
      monday: { isOpen: false, openTime: '08:00', closeTime: '18:00' },
      tuesday: { isOpen: false, openTime: '08:00', closeTime: '18:00' },
      wednesday: { isOpen: false, openTime: '08:00', closeTime: '18:00' },
      thursday: { isOpen: false, openTime: '08:00', closeTime: '18:00' },
      friday: { isOpen: false, openTime: '08:00', closeTime: '18:00' },
      saturday: { isOpen: false, openTime: '08:00', closeTime: '18:00' },
      sunday: { isOpen: false, openTime: '08:00', closeTime: '18:00' },
    };

    if (!str || str === 'Fechado') return defaultSchedule;

    // Parse the string format like "Segunda-feira: 08:00 - 18:00 | Terça-feira: 08:00 - 18:00"
    const dayMappings: Record<string, keyof WeekSchedule> = {
      'Segunda-feira': 'monday',
      'Terça-feira': 'tuesday',
      'Quarta-feira': 'wednesday',
      'Quinta-feira': 'thursday',
      'Sexta-feira': 'friday',
      Sábado: 'saturday',
      Domingo: 'sunday',
    };

    const parts = str.split(' | ');

    parts.forEach((part) => {
      const match = part.match(/^(.+?):\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/);
      if (match) {
        const [, dayName, openTime, closeTime] = match;
        const dayKey = dayMappings[dayName.trim()];
        if (dayKey) {
          defaultSchedule[dayKey] = {
            isOpen: true,
            openTime,
            closeTime,
          };
        }
      }
    });

    return defaultSchedule;
  };

  const [schedule, setSchedule] = useState<WeekSchedule>(() => parseStringToSchedule(value));

  const dayNames = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  const updateSchedule = (day: keyof WeekSchedule, field: keyof DaySchedule, newValue: string | boolean) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        [field]: newValue,
      },
    };
    setSchedule(newSchedule);

    // Convert to readable string format for storage
    const readableFormat = formatScheduleToString(newSchedule);
    onChange(readableFormat);
  };

  const formatScheduleToString = (sched: WeekSchedule): string => {
    const openDays: string[] = [];

    Object.entries(sched).forEach(([day, daySchedule]) => {
      if (daySchedule.isOpen) {
        const dayName = dayNames[day as keyof typeof dayNames];
        openDays.push(`${dayName}: ${daySchedule.openTime} - ${daySchedule.closeTime}`);
      }
    });

    return openDays.length > 0 ? openDays.join(' | ') : 'Fechado';
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const copyToAllDays = (sourceDay: keyof WeekSchedule) => {
    const sourceSchedule = schedule[sourceDay];
    const newSchedule = { ...schedule };

    Object.keys(newSchedule).forEach((day) => {
      if (day !== sourceDay) {
        newSchedule[day as keyof WeekSchedule] = { ...sourceSchedule };
      }
    });

    setSchedule(newSchedule);
    onChange(formatScheduleToString(newSchedule));
  };

  const setAllDaysClosed = () => {
    const newSchedule = { ...schedule };
    Object.keys(newSchedule).forEach((day) => {
      newSchedule[day as keyof WeekSchedule].isOpen = false;
    });
    setSchedule(newSchedule);
    onChange(formatScheduleToString(newSchedule));
  };

  const setCommercialHours = () => {
    const newSchedule = { ...schedule };
    const commercialDays: (keyof WeekSchedule)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    Object.keys(newSchedule).forEach((day) => {
      const dayKey = day as keyof WeekSchedule;
      if (commercialDays.includes(dayKey)) {
        newSchedule[dayKey] = { isOpen: true, openTime: '08:00', closeTime: '18:00' };
      } else if (dayKey === 'saturday') {
        newSchedule[dayKey] = { isOpen: true, openTime: '08:00', closeTime: '14:00' };
      } else {
        newSchedule[dayKey] = { isOpen: false, openTime: '08:00', closeTime: '18:00' };
      }
    });

    setSchedule(newSchedule);
    onChange(formatScheduleToString(newSchedule));
  };

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={setCommercialHours}
          className="text-xs bg-[#511A2B]/10 text-[#511A2B] border-[#511A2B]/20 hover:bg-[#511A2B]/20 hover:text-[#511A2B]"
        >
          <Clock className="w-3 h-3 mr-1" />
          Horário Comercial
        </Button>
        <Button type="button" size="sm" variant="destructive" onClick={setAllDaysClosed}>
          <X className="w-3 h-3 mr-1" />
          Fechar Todos
        </Button>
      </div>

      <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 rounded-lg">
        {Object.entries(schedule).map(([day, daySchedule]) => {
          const dayKey = day as keyof WeekSchedule;
          return (
            <div
              key={day}
              className={`p-4 rounded-xl transition-all ${
                daySchedule.isOpen
                  ? 'bg-gradient-to-r from-[#511A2B]/5 to-[#D56235]/5 border border-[#511A2B]/10'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex items-center gap-2 min-w-[180px]">
                  <input
                    type="checkbox"
                    id={`day-${day}`}
                    checked={daySchedule.isOpen}
                    onChange={(e) => updateSchedule(dayKey, 'isOpen', e.target.checked)}
                    className="rounded border-[#511A2B]/20 text-[#511A2B] focus:ring-[#511A2B]/20"
                  />
                  <Label
                    htmlFor={`day-${day}`}
                    className={`text-sm font-medium ${daySchedule.isOpen ? 'text-[#511A2B]' : 'text-[#511A2B]/70'}`}
                  >
                    {dayNames[dayKey]}
                  </Label>
                </div>

                {daySchedule.isOpen ? (
                  <div className="flex flex-col sm:flex-row gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-[#511A2B]/70 whitespace-nowrap">De:</Label>
                      <select
                        value={daySchedule.openTime}
                        onChange={(e) => updateSchedule(dayKey, 'openTime', e.target.value)}
                        className="px-3 py-1 border border-[#511A2B]/20 rounded-lg text-sm focus:border-[#511A2B]/40 focus:outline-none min-w-[80px] bg-white/80 border-[#511A2B]/20 text-[#511A2B]"
                      >
                        {timeOptions.map((time) => (
                          <option key={`${day}-open-${time}`} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-[#511A2B]/70 whitespace-nowrap">Até:</Label>
                      <select
                        value={daySchedule.closeTime}
                        onChange={(e) => updateSchedule(dayKey, 'closeTime', e.target.value)}
                        className="px-3 py-1 border border-[#511A2B]/20 rounded-lg text-sm focus:border-[#511A2B]/40 focus:outline-none min-w-[80px] bg-white/80 border-[#511A2B]/20 text-[#511A2B]"
                      >
                        {timeOptions.map((time) => (
                          <option key={`${day}-close-${time}`} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToAllDays(dayKey)}
                      className="text-xs text-[#511A2B]/70 hover:text-[#511A2B] hover:bg-[#511A2B]/10 whitespace-nowrap ml-auto"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copiar para todos
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center">
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Fechado
                    </Badge>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => updateSchedule(dayKey, 'isOpen', true)}
                      className="text-xs text-[#511A2B]/70 hover:text-[#511A2B] hover:bg-[#511A2B]/10 whitespace-nowrap ml-auto"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Definir horário
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export function StoreForm({ storeData, onStoreCreated, onStoreUpdated, onClose, isEditing = false }: StoreFormProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState<StoreFormData>({
    logoUrl: storeData?.logoUrl || '',
    partnerId: user?.partnerSupplier?.id || '',
    name: storeData?.name || '',
    description: storeData?.description || '',
    website: storeData?.website || '',
    openingHours:
      storeData?.openingHours ||
      'Segunda-feira: 08:00 - 18:00 | Terça-feira: 08:00 - 18:00 | Quarta-feira: 08:00 - 18:00 | Quinta-feira: 08:00 - 18:00 | Sexta-feira: 08:00 - 18:00 | Sábado: 08:00 - 14:00',
    address: {
      state: storeData?.address.state || '',
      city: storeData?.address.city || '',
      district: storeData?.address.district || '',
      street: storeData?.address.street || '',
      complement: storeData?.address.complement || '',
      number: storeData?.address.number || '',
      zipCode: storeData?.address.zipCode || '',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
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
      newErrors.name = 'Nome da loja é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.address.zipCode.trim()) {
      newErrors['address.zipCode'] = 'CEP é obrigatório';
    }

    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'Cidade é obrigatória';
    }

    if (!formData.address.state.trim()) {
      newErrors['address.state'] = 'Estado é obrigatória';
    }

    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Rua é obrigatória';
    }

    if (!formData.address.number.trim()) {
      newErrors['address.number'] = 'Número é obrigatório';
    }

    if (!formData.address.district.trim()) {
      newErrors['address.district'] = 'Bairro é obrigatório';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'URL do website inválida';
    }

    if (formData.openingHours === 'Fechado') {
      newErrors.openingHours = 'Defina pelo menos um dia de funcionamento';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let cloudinaryImageURL = '';

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (formData.logoUrl) cloudinaryImageURL = (await uploadImageCloudinary(formData.logoUrl)) || '';
      formData.logoUrl = cloudinaryImageURL;

      const response =
        isEditing && storeData?.id ? await updateStore(storeData?.id, formData) : await createStore(formData);

      if (isEditing && onStoreUpdated) {
        onStoreUpdated(response.data);
      } else if (!isEditing && onStoreCreated) {
        onStoreCreated(response.data);
      }
    } catch (error) {
      console.error('Erro ao salvar loja:', error);
      setErrors({ general: 'Erro ao salvar loja. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const zip = formData.address.zipCode.replace(/\D/g, '');

    if (zip.length === 8) {
      const fetchAddress = async () => {
        const address = await fetchAddressByZipCode(zip);
        if (address) {
          setFormData({
            ...formData,
            address: {
              ...formData.address,
              ...address,
            },
          });
        }
      };

      fetchAddress();
    }
  }, [formData.address.zipCode]);

  // Sempre renderizar como modal
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#511A2B] rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-[#511A2B]"> {isEditing ? 'Editar Loja' : 'Cadastrar Loja'}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-4 bg-red-100 border border-red-200 rounded-xl text-red-800 text-sm">
                {errors.general}
              </div>
            )}

            {/* Informações Básicas */}
            <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#511A2B] flex items-center">Informações da Loja</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <PhotoUploadSimple
                  photo={formData.logoUrl || ``}
                  isStore={true}
                  onPhotoChange={(photo) => handleInputChange('logoUrl', photo)}
                />

                <div>
                  <Label htmlFor="name" className="text-[#511A2B] font-medium">
                    Nome da Loja *
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ex: Super Soluções"
                      className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                    />
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="description" className="text-[#511A2B] font-medium">
                    Descrição *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Descreva sua loja, produtos e serviços..."
                    className="bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                    rows={3}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <Label htmlFor="website" className="text-[#511A2B] font-medium">
                    Website
                  </Label>
                  <div className="relative">
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://meusite.com.br"
                      className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                    />
                    <WholeWord className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                </div>

                <div className="z-[1]">
                  <Label htmlFor="openingHours" className="text-[#511A2B] font-medium">
                    Horário de Funcionamento *
                  </Label>
                  <div className="mt-2">
                    <OpeningHoursInput
                      value={formData.openingHours}
                      onChange={(value) => handleInputChange('openingHours', value)}
                      error={errors.openingHours}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#511A2B] flex items-center">Endereço da Loja</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="zipCode" className="text-[#511A2B] font-medium">
                      CEP *
                    </Label>
                    <div className="relative">
                      <Input
                        id="zipCode"
                        value={formData.address.zipCode}
                        onChange={(e) => {
                          const masked = applyZipCodeMask(e.target.value);
                          handleInputChange('address.zipCode', masked);
                        }}
                        placeholder="00000-000"
                        maxLength={9}
                        className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                      />
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    {errors['address.zipCode'] && (
                      <p className="text-red-500 text-sm mt-1">{errors['address.zipCode']}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-[#511A2B] font-medium">
                      Cidade *
                    </Label>
                    <div className="relative">
                      <Input
                        id="city"
                        value={formData.address.city}
                        onChange={(e) => handleInputChange('address.city', e.target.value)}
                        placeholder="São Paulo"
                        className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                        disabled
                      />
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    {errors['address.city'] && <p className="text-red-500 text-sm mt-1">{errors['address.city']}</p>}
                  </div>

                  <div>
                    <Label htmlFor="state" className="text-[#511A2B] font-medium">
                      Estado *
                    </Label>
                    <div className="relative">
                      <Input
                        id="state"
                        value={formData.address.state}
                        onChange={(e) => handleInputChange('address.state', e.target.value)}
                        placeholder="SP"
                        className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                        disabled
                      />
                      <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    {errors['address.state'] && <p className="text-red-500 text-sm mt-1">{errors['address.state']}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="street" className="text-[#511A2B] font-medium">
                      Rua *
                    </Label>
                    <div className="relative">
                      <Input
                        id="street"
                        value={formData.address.street}
                        onChange={(e) => handleInputChange('address.street', e.target.value)}
                        placeholder="Av. Principal"
                        className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                        disabled
                      />
                      <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    {errors['address.street'] && (
                      <p className="text-red-500 text-sm mt-1">{errors['address.street']}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="number" className="text-[#511A2B] font-medium">
                      Número *
                    </Label>
                    <div className="relative">
                      <Input
                        id="number"
                        value={formData.address.number}
                        onChange={(e) => handleInputChange('address.number', e.target.value)}
                        placeholder="100"
                        className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                      />
                      <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    {errors['address.number'] && (
                      <p className="text-red-500 text-sm mt-1">{errors['address.number']}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="district" className="text-[#511A2B] font-medium">
                      Bairro *
                    </Label>
                    <div className="relative">
                      <Input
                        id="district"
                        value={formData.address.district}
                        onChange={(e) => handleInputChange('address.district', e.target.value)}
                        placeholder="Centro"
                        className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                        disabled
                      />
                      <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    {errors['address.district'] && (
                      <p className="text-red-500 text-sm mt-1">{errors['address.district']}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="complement" className="text-[#511A2B] font-medium">
                    Complemento
                  </Label>
                  <div className="relative">
                    <Input
                      id="complement"
                      value={formData.address.complement}
                      onChange={(e) => handleInputChange('address.complement', e.target.value)}
                      placeholder="Ex: Sala 101, Andar 2, etc."
                      className="pl-10 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
                    />
                    <Plus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
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
                    {isEditing ? 'Atualizando...' : 'Criando...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Atualizar Loja' : 'Cadastrar Loja'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
