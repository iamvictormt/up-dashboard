"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddressData {
  state: string
  city: string
  district: string
  street: string
  complement: string
  number: string
  zipCode: string
}

interface ValidationErrors {
  [key: string]: string
}

interface AddressEditFormProps {
  address?: any
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  setErrorMessage: (message: string | null) => void
  onClose: () => void
}

const BRAZILIAN_STATES = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
]

export function AddressEditForm({ address, isLoading, setIsLoading, setErrorMessage, onClose }: AddressEditFormProps) {
  const { user, updateUser } = useUser()
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const [formData, setFormData] = useState<AddressData>({
    state: address?.state || "",
    city: address?.city || "",
    district: address?.district || "",
    street: address?.street || "",
    complement: address?.complement || "",
    number: address?.number || "",
    zipCode: address?.zipCode || "",
  })

  // Função para validar CEP
  const validateCEP = (cep: string): boolean => {
    if (!cep.trim()) return true
    const cepRegex = /^\d{5}-\d{3}$|^\d{8}$/
    return cepRegex.test(cep.replace(/\s/g, ""))
  }

  // Validação de campos
  const validateFields = (): boolean => {
    const errors: ValidationErrors = {}

    if (formData.zipCode && !validateCEP(formData.zipCode)) {
      errors.zipCode = "Formato de CEP inválido. Use 12345-678 ou 12345678"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Detecta mudanças no formulário comparando com os dados originais
  const getChangedFields = () => {
    const changedFields: any = {}

    if (formData.state !== address?.state) {
      changedFields.state = formData.state
    }

    if (formData.city !== address?.city) {
      changedFields.city = formData.city
    }

    if (formData.district !== address?.district) {
      changedFields.district = formData.district
    }

    if (formData.street !== address?.street) {
      changedFields.street = formData.street
    }

    if (formData.complement !== address?.complement) {
      changedFields.complement = formData.complement
    }

    if (formData.number !== address?.number) {
      changedFields.number = formData.number
    }

    if (formData.zipCode !== address?.zipCode) {
      changedFields.zipCode = formData.zipCode
    }

    return changedFields
  }

  // Verifica se há alterações para habilitar/desabilitar o botão salvar
  const hasChanges = () => {
    const changedFields = getChangedFields()
    return Object.keys(changedFields).length > 0
  }

  // Função para salvar dados do endereço
  const saveAddressData = async () => {
    try {
      const changedFields = getChangedFields()

      if (Object.keys(changedFields).length === 0) {
        return true // Nada para atualizar
      }

      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/user/${user?.id}/address`

      const response = await fetch(endpoint, {
        method: address?.id ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(changedFields),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar endereço")
      }

      const updatedAddress = await response.json()

      // Atualizar contexto local com os novos dados
      updateUser({
        ...user,
        address: {
          ...address,
          ...updatedAddress,
        },
      })

      return true
    } catch (error) {
      console.error("Erro ao salvar endereço:", error)
      setErrorMessage("Erro ao salvar endereço. Tente novamente.")
      return false
    }
  }

  const handleSave = async () => {
    // Limpar erros anteriores
    setErrorMessage(null)
    setValidationErrors({})

    // Validar formatos
    if (!validateFields()) {
      setErrorMessage("Por favor, corrija os erros nos campos destacados.")
      return
    }

    setIsLoading(true)

    try {
      const success = await saveAddressData()

      if (success) {
        alert("Endereço atualizado com sucesso!")
        onClose()
      }
    } catch (error) {
      console.error("Erro geral ao salvar:", error)
      setErrorMessage("Erro inesperado ao salvar. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Componente para mostrar erro de campo
  const FieldError = ({ error }: { error?: string }) => {
    if (!error) return null
    return (
      <div className="flex items-center space-x-1 mt-1">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <span className="text-sm text-red-500">{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-[#511A2B] border-b border-gray-100 pb-2">Informações de Endereço</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="zipCode">CEP</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => setFormData((prev) => ({ ...prev, zipCode: e.target.value }))}
              placeholder="12345-678"
              className={validationErrors.zipCode ? "border-red-500" : ""}
            />
            <FieldError error={validationErrors.zipCode} />
          </div>

          <div>
            <Label htmlFor="state">Estado</Label>
            <Select
              value={formData.state}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, state: value }))}
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {BRAZILIAN_STATES.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
              placeholder="Nome da cidade"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="district">Bairro</Label>
            <Input
              id="district"
              value={formData.district}
              onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
              placeholder="Nome do bairro"
            />
          </div>

          <div>
            <Label htmlFor="street">Rua</Label>
            <Input
              id="street"
              value={formData.street}
              onChange={(e) => setFormData((prev) => ({ ...prev, street: e.target.value }))}
              placeholder="Nome da rua"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="number">Número</Label>
            <Input
              id="number"
              value={formData.number}
              onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
              placeholder="123"
            />
          </div>

          <div>
            <Label htmlFor="complement">Complemento</Label>
            <Input
              id="complement"
              value={formData.complement}
              onChange={(e) => setFormData((prev) => ({ ...prev, complement: e.target.value }))}
              placeholder="Apartamento, sala, etc."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading || !hasChanges()}
          className="bg-[#511A2B] hover:bg-[#511A2B]/90"
        >
          {isLoading ? "Salvando..." : "Salvar Endereço"}
        </Button>
      </div>
    </div>
  )
}
