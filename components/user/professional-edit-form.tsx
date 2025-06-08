"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"
import { useUser } from "@/contexts/user-context"

interface ProfessionalData {
  name: string
  professionId?: string
  document?: string
  generalRegister?: string
  registrationAgency?: string
  description?: string
  experience?: string
  officeName?: string
  phone: string
}

interface ValidationErrors {
  [key: string]: string
}

interface ProfessionalEditFormProps {
  professional: any
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

export function ProfessionalEditForm({
  professional,
  isLoading,
  setIsLoading,
  setErrorMessage,
  onClose,
}: ProfessionalEditFormProps) {
  const { updateUser } = useUser()
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const [formData, setFormData] = useState<ProfessionalData>({
    name: professional?.name || "",
    professionId: professional?.professionId || "",
    document: professional?.document || "",
    generalRegister: professional?.generalRegister || "",
    registrationAgency: professional?.registrationAgency || "",
    description: professional?.description || "",
    experience: professional?.experience || "",
    officeName: professional?.officeName || "",
    phone: professional?.phone || "",
  })

  // Função para validar campos obrigatórios
  const validateRequiredFields = (): boolean => {
    const errors: ValidationErrors = {}

    if (!formData.name.trim()) {
      errors.name = "Nome é obrigatório"
    }

    if (!formData.phone.trim()) {
      errors.phone = "Telefone é obrigatório"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Função para validar CPF
  const validateCPF = (cpf: string): boolean => {
    if (!cpf.trim()) return true
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/
    return cpfRegex.test(cpf.replace(/\s/g, ""))
  }

  // Validação avançada
  const validateAdvancedFields = (): boolean => {
    const errors: ValidationErrors = { ...validationErrors }

    if (formData.phone) {
      errors.phone = "Formato de telefone inválido. Use (11) 99999-9999 ou +55 11 99999-9999"
    }

    if (formData.document && !validateCPF(formData.document)) {
      errors.document = "Formato de CPF inválido. Use 123.456.789-00 ou 12345678900"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Detecta mudanças no formulário comparando com os dados originais
  const getChangedFields = () => {
    const changedFields: any = {}

    if (formData.name !== professional.name) {
      changedFields.name = formData.name
    }

    if (formData.professionId !== professional.professionId) {
      changedFields.professionId = formData.professionId
    }

    if (formData.document !== professional.document) {
      changedFields.document = formData.document
    }

    if (formData.generalRegister !== professional.generalRegister) {
      changedFields.generalRegister = formData.generalRegister
    }

    if (formData.registrationAgency !== professional.registrationAgency) {
      changedFields.registrationAgency = formData.registrationAgency
    }

    if (formData.description !== professional.description) {
      changedFields.description = formData.description
    }

    if (formData.experience !== professional.experience) {
      changedFields.experience = formData.experience
    }

    if (formData.officeName !== professional.officeName) {
      changedFields.officeName = formData.officeName
    }

    if (formData.phone !== professional.phone) {
      changedFields.phone = formData.phone
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

      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/professional/${professional.id}`

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(changedFields),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar dados do perfil")
      }

      // Atualizar contexto local com os novos dados
      updateUser({
        ...professional,
        ...changedFields,
      })

      return true
    } catch (error) {
      console.error("Erro ao salvar perfil:", error)
      setErrorMessage("Erro ao salvar dados do perfil. Tente novamente.")
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
        alert("Perfil atualizado com sucesso!")
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
        <h3 className="font-medium text-[#511A2B] border-b border-gray-100 pb-2">Informações Pessoais</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Seu nome completo"
              className={validationErrors.name ? "border-red-500" : ""}
            />
            <FieldError error={validationErrors.name} />
          </div>

          <div>
            <Label htmlFor="document">CPF</Label>
            <Input
              id="document"
              value={formData.document}
              onChange={(e) => setFormData((prev) => ({ ...prev, document: e.target.value }))}
              placeholder="123.456.789-00"
              className={validationErrors.document ? "border-red-500" : ""}
            />
            <FieldError error={validationErrors.document} />
          </div>

          <div>
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="(11) 99999-9999"
              className={validationErrors.phone ? "border-red-500" : ""}
            />
            <FieldError error={validationErrors.phone} />
          </div>

          <div>
            <Label htmlFor="officeName">Nome do Escritório</Label>
            <Input
              id="officeName"
              value={formData.officeName}
              onChange={(e) => setFormData((prev) => ({ ...prev, officeName: e.target.value }))}
              placeholder="Nome da sua empresa"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-[#511A2B] border-b border-gray-100 pb-2">Informações Profissionais</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="professionId">ID da Profissão</Label>
            <Input
              id="professionId"
              value={formData.professionId}
              onChange={(e) => setFormData((prev) => ({ ...prev, professionId: e.target.value }))}
              placeholder="ID da profissão"
            />
          </div>

          <div>
            <Label htmlFor="generalRegister">Registro Geral</Label>
            <Input
              id="generalRegister"
              value={formData.generalRegister}
              onChange={(e) => setFormData((prev) => ({ ...prev, generalRegister: e.target.value }))}
              placeholder="Número do registro"
            />
          </div>

          <div>
            <Label htmlFor="registrationAgency">Órgão de Registro</Label>
            <Input
              id="registrationAgency"
              value={formData.registrationAgency}
              onChange={(e) => setFormData((prev) => ({ ...prev, registrationAgency: e.target.value }))}
              placeholder="CREA, CRM, etc."
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Descreva sua experiência e especialidades"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="experience">Experiência</Label>
          <Textarea
            id="experience"
            value={formData.experience}
            onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
            placeholder="Detalhe sua experiência profissional"
            rows={3}
          />
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
