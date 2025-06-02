"use client"

import type React from "react"

import { useState } from "react"
import { X, Save, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface ProductFormProps {
  storeId: string
  onProductCreated: (productData: any) => void
  onClose: () => void
}

interface ProductData {
  name: string
  description: string
  price: number
  link: string
  featured: boolean
  promotion: boolean
}

export function ProductForm({ storeId, onProductCreated, onClose }: ProductFormProps) {
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    price: 0,
    link: "",
    featured: false,
    promotion: false,
  })

  const [errors, setErrors] = useState<Partial<ProductData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof ProductData, value: string | number | boolean) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductData> = {}

    if (!productData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!productData.description.trim()) {
      newErrors.description = "Descrição é obrigatória"
    }

    if (productData.price <= 0) {
    //   newErrors.price = "Preço deve ser maior que zero"
    }

    if (productData.link && !isValidUrl(productData.link)) {
      newErrors.link = "URL inválida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newProduct = {
        ...productData,
        storeId,
      }

      onProductCreated(newProduct)
    } catch (error) {
      console.error("Erro ao criar produto:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#511A2B] rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-[#511A2B]">Adicionar Produto/Serviço</CardTitle>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do Produto */}
            <div>
              <Label htmlFor="name" className="text-[#511A2B] font-medium">
                Nome do Produto/Serviço *
              </Label>
              <Input
                id="name"
                value={productData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: Consultoria em TI"
                className={`mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl ${
                  errors.name ? "border-red-500" : ""
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
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descreva seu produto ou serviço..."
                rows={4}
                className={`mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl ${
                  errors.description ? "border-red-500" : ""
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
                value={productData.price || ""}
                onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                className={`mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl ${
                  errors.price ? "border-red-500" : ""
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
                onChange={(e) => handleInputChange("link", e.target.value)}
                placeholder="https://exemplo.com/produto"
                className={`mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl ${
                  errors.link ? "border-red-500" : ""
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
                  onCheckedChange={(checked) => handleInputChange("featured", checked)}
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
                  onCheckedChange={(checked) => handleInputChange("promotion", checked)}
                  className="data-[state=unchecked]:bg-primary/30 data-[state=checked]:bg-primary/90"
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
                    <span>Salvar Produto</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
