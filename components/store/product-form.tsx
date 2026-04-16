'use client';

import type React from 'react';

import { useState } from 'react';
import { X, Save, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { createProduct } from '@/lib/product-api';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { formatCurrency } from '@/lib/utils';
import { PhotoUploadSimple } from '../auth/register-steps/photo-upload-simple';
import { uploadImageCloudinary } from '@/lib/user-api';

interface ProductFormModalProps {
  storeId: string;
  onProductCreated: (productData: any) => void;
  onClose: () => void;
  isOpen: boolean;
  isWellness?: boolean;
}

interface ProductData {
  photoUrl?: string;
  name: string;
  description: string;
  price: number;
  link: string;
  featured: boolean;
  promotion: boolean;
  duration?: string;
}

type ProductFormErrors = Partial<Record<keyof ProductData, string>>;

export function ProductFormModal({
  storeId,
  onProductCreated,
  onClose,
  isOpen,
  isWellness = false,
}: ProductFormModalProps) {
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    description: '',
    price: 0,
    link: '',
    featured: false,
    promotion: false,
    duration: '',
  });

  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemLabel = isWellness ? 'Serviço' : 'Produto';
  const itemPluralLabel = isWellness ? 'serviço' : 'produto';
  const featuredLabel = isWellness ? 'Serviço em Destaque' : 'Produto em Destaque';
  const featuredDescription = isWellness
    ? 'Destacar este serviço no seu perfil'
    : 'Destacar este produto na sua loja';
  const promotionLabel = isWellness ? 'Serviço em Promoção' : 'Produto em Promoção';
  const promotionDescription = isWellness
    ? 'Marcar como serviço promocional'
    : 'Marcar como produto promocional';
  const linkPlaceholder = isWellness ? 'https://exemplo.com/servico' : 'https://exemplo.com/produto';

  const handleInputChange = (field: keyof ProductData, value: string | number | boolean | undefined) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ProductFormErrors = {};

    if (!productData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!productData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (productData.price <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }

    if (productData.link && !isValidUrl(productData.link)) {
      newErrors.link = 'URL inválida';
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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (productData.photoUrl && !productData.photoUrl.includes(`https://res.cloudinary.com`)) cloudinaryImageURL = (await uploadImageCloudinary(productData.photoUrl)) || '';
      productData.photoUrl = cloudinaryImageURL;

      const newProduct = {
        ...productData,
        storeId,
      };

      const response = await createProduct(newProduct);
      if (response.status === 201) {
        onProductCreated(newProduct);
        toast.success(`${itemLabel} cadastrado com sucesso.`);
      }
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#511A2B] rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-[#511A2B]">Adicionar {itemLabel}</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <PhotoUploadSimple
            photo={productData.photoUrl || ``}
            isProduct={true}
            onPhotoChange={(photo) => handleInputChange('photoUrl', photo ?? undefined)}
          />

          <div>
            <Label htmlFor="name" className="text-[#511A2B] font-medium">
              Nome do {itemLabel} *
            </Label>
            <Input
              id="name"
              value={productData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Consultoria em TI"
              className={`pl-2 mt-1 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40 ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="description" className="text-[#511A2B] font-medium">
              Descrição *
            </Label>
            <Textarea
              id="description"
              value={productData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={`Descreva seu ${itemPluralLabel}...`}
              rows={4}
              className={`pl-2 mt-1 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40 ${
                errors.description ? 'border-red-500' : ''
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <Label htmlFor="price" className="text-[#511A2B] font-medium">
              Preço (R$) *
            </Label>
            <Input
              id="price"
              type="text"
              inputMode="numeric"
              value={formatCurrency(productData.price || 0)}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                const numberValue = parseFloat(raw) / 100;
                if (numberValue > 1_000_000) return;
                handleInputChange('price', numberValue);
              }}
              placeholder="R$ 0,00"
              className={`pl-2 mt-1 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40 ${
                errors.price ? 'border-red-500' : ''
              }`}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="link" className="text-[#511A2B] font-medium">
                Link (opcional)
              </Label>
              <Input
                id="link"
                type="url"
                value={productData.link}
                onChange={(e) => handleInputChange('link', e.target.value)}
                placeholder={linkPlaceholder}
                className={`pl-2 mt-1 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40 ${
                  errors.link ? 'border-red-500' : ''
                }`}
              />
              {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link}</p>}
            </div>

            <div>
              <Label htmlFor="duration" className="text-[#511A2B] font-medium">
                Duração (opcional, ex: 60 min)
              </Label>
              <Input
                id="duration"
                value={productData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="Ex: 60 min, 1 hora"
                className="pl-2 mt-1 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <Label className="text-[#511A2B] font-medium">{featuredLabel}</Label>
                <p className="text-sm text-gray-600">{featuredDescription}</p>
              </div>
              <Switch
                checked={productData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
                className="data-[state=unchecked]:bg-[#ccc] data-[state=checked]:bg-[#511A2B]/80"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <Label className="text-[#511A2B] font-medium">{promotionLabel}</Label>
                <p className="text-sm text-gray-600">{promotionDescription}</p>
              </div>
              <Switch
                checked={productData.promotion}
                onCheckedChange={(checked) => handleInputChange('promotion', checked)}
                className="data-[state=unchecked]:bg-[#ccc] data-[state=checked]:bg-[#511A2B]/80"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 rounded-xl"
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
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Salvando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Salvar {itemLabel}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
