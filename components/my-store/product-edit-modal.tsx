'use client';

import type React from 'react';
import { useState } from 'react';
import { X, Save, Package, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { deleteProduct, updateProduct } from '@/lib/product';
import { toast } from 'sonner';
import { ProductData } from '@/types';

interface ProductEditModalProps {
  product: ProductData;
  onProductUpdated: (productData: ProductData) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function ProductEditModal({ product, onProductUpdated, onDelete, onClose }: ProductEditModalProps) {
  const [productData, setProductData] = useState<ProductData>(product);
  const [errors, setErrors] = useState<Partial<ProductData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

    if (!validateForm() || !product.id) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await updateProduct(product.id, productData);
      if (response.status === 200) {
        onProductUpdated(productData);
        toast.success('Produto editado com sucesso.');
      }
    } catch (error) {
      toast.error('Erro ao editar o produto, atualize a pagina e tente novamente.');
      console.error('Erro ao atualizar produto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!product.id) return;
    setIsSubmitting(true);
    try {
      const response = await deleteProduct(product.id);
      if (response.status === 200) {
        onDelete();
        toast.success('Produto editado com sucesso.');
      }
    } catch (error) {
      toast.error('Erro ao excluir o produto, atualize a pagina e tente novamente.');
      console.error('Erro ao excluir produto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-[#511A2B]/20 p-0">
        <DialogHeader className="sticky top-0 bg-white border-b border-[#511A2B]/10 p-6 z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl md:text-2xl font-bold text-[#511A2B] flex items-center">
              <Package className="w-6 h-6 mr-2" />
              Editar Produto
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-full border-red-300 text-red-600 hover:bg-red-50"
                disabled={isSubmitting}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-[#511A2B]/10">
                <X className="w-5 h-5 text-[#511A2B]" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              className={`mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl ${
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
              className={`mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl ${
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
              type="number"
              step="0.01"
              min="0"
              value={productData.price || ''}
              onChange={(e) => handleInputChange('price', Number.parseFloat(e.target.value) || 0)}
              placeholder="0,00"
              className={`mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl ${
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
              className={`mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl ${
                errors.link ? 'border-red-500' : ''
              }`}
            />
            {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link}</p>}
            <p className="text-sm text-gray-500 mt-1">Link para mais informações ou compra do produto</p>
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
                className="data-[state=checked]:bg-[#511A2B]"
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
                className="data-[state=checked]:bg-red-500"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex space-x-3 pt-4">
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
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Salvando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </div>
              )}
            </Button>
          </div>
        </form>

        {/* Modal de confirmação de exclusão */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-white w-full max-w-md rounded-2xl">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center">
                  <Trash2 className="w-5 h-5 mr-2" />
                  Confirmar Exclusão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Tem certeza que deseja excluir o produto "{productData.name}"? Esta ação não pode ser desfeita.
                </p>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Excluindo...</span>
                      </div>
                    ) : (
                      'Excluir'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
