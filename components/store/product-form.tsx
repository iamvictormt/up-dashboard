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
}

interface ProductData {
  photoUrl?: string;
  name: string;
  description: string;
  price: number;
  link: string;
  featured: boolean;
  promotion: boolean;
}

export function ProductFormModal({ storeId, onProductCreated, onClose, isOpen }: ProductFormModalProps) {
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    description: '',
    price: 0,
    link: '',
    featured: false,
    promotion: false,
  });

  const [errors, setErrors] = useState<Partial<ProductData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ProductData, value: string | number | boolean) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductData> = {};

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
      if (productData.photoUrl) cloudinaryImageURL = (await uploadImageCloudinary(productData.photoUrl)) || '';
      productData.photoUrl = cloudinaryImageURL;

      const newProduct = {
        ...productData,
        storeId,
      };

      const response = await createProduct(newProduct);
      if (response.status === 201) {
        onProductCreated(newProduct);
        toast.success('Produto cadastrado com sucesso.');
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
            <DialogTitle className="text-[#511A2B]">Adicionar Produto/Serviço</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <PhotoUploadSimple
            photo={productData.photoUrl || ``}
            isProduct={true}
            onPhotoChange={(photo) => handleInputChange('photoUrl', photo)}
          />

          {/* Nome do Produto */}
          <div>
            <Label htmlFor="name" className="text-[#511A2B] font-medium">
              Nome do Produto/Serviço *
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

          {/* Descrição */}
          <div>
            <Label htmlFor="description" className="text-[#511A2B] font-medium">
              Descrição *
            </Label>
            <Textarea
              id="description"
              value={productData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva seu produto ou serviço..."
              rows={4}
              className={`pl-2 mt-1 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40 ${
                errors.description ? 'border-red-500' : ''
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Preço */}
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
                // Remove tudo que não for número
                const raw = e.target.value.replace(/\D/g, '');

                // Converte para número em reais (centavos -> reais)
                const numberValue = parseFloat(raw) / 100;

                // Limite de R$ 1.000.000,00
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

          {/* Link */}
          <div>
            <Label htmlFor="link" className="text-[#511A2B] font-medium">
              Link (opcional)
            </Label>
            <Input
              id="link"
              type="url"
              value={productData.link}
              onChange={(e) => handleInputChange('link', e.target.value)}
              placeholder="https://exemplo.com/produto"
              className={`pl-2 mt-1 bg-white/80 border-[#511A2B]/20 rounded-xl text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40 ${
                errors.link ? 'border-red-500' : ''
              }`}
            />
            {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link}</p>}
          </div>

          {/* Switches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Produto em Destaque */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <Label className="text-[#511A2B] font-medium">Produto em Destaque</Label>
                <p className="text-sm text-gray-600">Destacar este produto na sua loja</p>
              </div>
              <Switch
                checked={productData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
                className="data-[state=unchecked]:bg-[#ccc] data-[state=checked]:bg-[#511A2B]/80"
              />
            </div>

            {/* Produto em Promoção */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <Label className="text-[#511A2B] font-medium">Produto em Promoção</Label>
                <p className="text-sm text-gray-600">Marcar como produto promocional</p>
              </div>
              <Switch
                checked={productData.promotion}
                onCheckedChange={(checked) => handleInputChange('promotion', checked)}
                className="data-[state=unchecked]:bg-[#ccc] data-[state=checked]:bg-[#511A2B]/80"
              />
            </div>
          </div>

          {/* Botões */}
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
                  <span>Salvar Produto</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
