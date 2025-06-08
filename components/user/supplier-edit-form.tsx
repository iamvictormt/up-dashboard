"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { useUser } from "@/contexts/user-context"

interface SupplierData {
  tradeName: string
  companyName: string
  document: string
  stateRegistration?: string
  contact: string
}

interface ValidationErrors {
  [key: string]: string
}

interface SupplierEditFormProps {
  supplier: any
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  setErrorMessage: (message: string | null) => void
  onClose: () => void
}

const BRAZILIAN_STATES = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]

export function SupplierEditForm({
  supplier,
  isLoading,
  setIsLoading,
  setErrorMessage,
  onClose,
}: SupplierEditFormProps) {
  const { updateUser } = useUser()
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const [formData, setFormData] = useState<SupplierData>({
    tradeName: supplier?.tradeName || "",
    companyName: supplier?.companyName || "",
    document: supplier?.document || "",
    stateRegistration: supplier?.stateRegistration || "",
    contact: supplier?.contact || "",
  })

  // Função para validar campos obrigatórios
  const validateRequiredFields = (): boolean => {
    const errors: ValidationErrors = {}

    if (!formData.tradeName.trim()) {
      errors.tradeName = "Nome comercial é obrigatório"
    }

    if (!formData.companyName.trim()) {
      errors.companyName = "Razão social é obrigatória"
    }

    if (!formData.document.trim()) {
      errors.document = "CNPJ é obrigatório"
    }

    if (!formData.contact.trim()) {
      errors.contact = "Telefone é obrigatório"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Função para validar CNPJ
  const validateCNPJ = (cnpj: string): boolean => {
    if (!cnpj.trim()) return true
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/
    return cnpjRegex.test(cnpj.replace(/\s/g, ""))
  }

  // Validação avançada
  const validateAdvancedFields = (): boolean => {
    const errors: ValidationErrors = { ...validationErrors }

    if (formData.contact) {
      errors.contact = "Formato de telefone inválido. Use (11) 99999-9999 ou +55 11 99999-9999"
    }

    if (formData.document && !validateCNPJ(formData.document)) {
      errors.document = "Formato de CNPJ inválido. Use 00.000.000/0000-00 ou 00000000000000"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Detecta mudanças no formulário comparando com os dados originais
  const getChangedFields = () => {
    const changedFields: any = {}

    if (formData.tradeName !== supplier.tradeName) {
      changedFields.tradeName = formData.tradeName
    }

    if (formData.companyName !== supplier.companyName) {
      changedFields.companyName = formData.companyName
    }

    if (formData.document !== supplier.document) {
      changedFields.document = formData.document
    }

    if (formData.stateRegistration !== supplier.stateRegistration) {
      changedFields.stateRegistration = formData.stateRegistration
    }

    if (formData.contact !== supplier.contact) {
      changedFields.contact = formData.contact
    }

    return changedFields
  }

  // Verifica se há alterações para habilitar/desabilitar o botão salvar
  const hasChanges = () => {
    const changedFields = getChangedFields()
    return Object.keys(changedFields).length > 0
  }

  // Função para salvar dados do perfil
  const saveProfileData = async () => {
    try {
      const changedFields = getChangedFields()

      if (Object.keys(changedFields).length === 0) {
        return true // Nada para atualizar
      }

      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/partnerSupplier/${supplier.id}`

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(changedFields),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar dados do fornecedor")
      }

      // Atualizar contexto local com os novos dados
      updateUser({
        ...supplier,
        ...changedFields,
      })

      return true
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error)
      setErrorMessage("Erro ao salvar dados do fornecedor. Tente novamente.")
      return false
    }
  }

  const handleSave = async () => {
    // Limpar erros anteriores
    setErrorMessage(null)
    setValidationErrors({})

    // Validar campos obrigatórios
    if (!validateRequiredFields()) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    // Validar formatos
    if (!validateAdvancedFields()) {
      setErrorMessage("Por favor, corrija os erros nos campos destacados.")
      return
    }

    setIsLoading(true)

    try {
      const success = await saveProfileData()

      if (success) {
        alert("Dados do fornecedor atualizados com sucesso!")
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
        <h3 className="font-medium text-[#511A2B] border-b border-gray-100 pb-2">Informações da Empresa</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tradeName">Nome Comercial *</Label>
            <Input
              id="tradeName"
              value={formData.tradeName}
              onChange={(e) => setFormData((prev) => ({ ...prev, tradeName: e.target.value }))}
              placeholder="Nome fantasia"
              className={validationErrors.tradeName ? "border-red-500" : ""}
            />
            <FieldError error={validationErrors.tradeName} />
          </div>

          <div>
            <Label htmlFor="companyName">Razão Social *</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
              placeholder="Razão social da empresa"
              className={validationErrors.companyName ? "border-red-500" : ""}
            />
            <FieldError error={validationErrors.companyName} />
          </div>

          <div>
            <Label htmlFor="document">CNPJ *</Label>
            <Input
              id="document"
              value={formData.document}
              onChange={(e) => setFormData((prev) => ({ ...prev, document: e.target.value }))}
              placeholder="00.000.000/0000-00"
              className={validationErrors.document ? "border-red-500" : ""}
            />
            <FieldError error={validationErrors.document} />
          </div>

          <div>
            <Label htmlFor="contact">Telefone *</Label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => setFormData((prev) => ({ ...prev, contact: e.target.value }))}
              placeholder="(11) 99999-9999"
              className={validationErrors.contact ? "border-red-500" : ""}
            />
            <FieldError error={validationErrors.contact} />
          </div>

          <div>
            <Label htmlFor="stateRegistration">Inscrição Estadual</Label>
            <Input
              id="stateRegistration"
              value={formData.stateRegistration}
              onChange={(e) => setFormData((prev) => ({ ...prev, stateRegistration: e.target.value }))}
              placeholder="Número da inscrição estadual"
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
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  )
}
