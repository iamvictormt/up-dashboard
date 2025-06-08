"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload, Camera, Trash2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useUser } from "@/contexts/user-context"

interface ProfileImageModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UserImageModal({ isOpen, onClose }: ProfileImageModalProps) {
  const { user, updateUser } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const getUserName = () => {
    if (user?.professional) return user.professional.name
    if (user?.partnerSupplier) return user.partnerSupplier.tradeName
    if (user?.loveDecoration) return user.loveDecoration.name
    return "Usuário"
  }

  const getUserInitials = () => {
    const name = getUserName()
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Por favor, selecione apenas arquivos de imagem.")
      return
    }

    // Validar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("A imagem deve ter no máximo 5MB.")
      return
    }

    setSelectedFile(file)
    setErrorMessage(null)

    // Criar preview da imagem
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      setErrorMessage("Nenhuma imagem selecionada.")
      return
    }

    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      // Criar FormData para upload
      const formData = new FormData()
      formData.append("profileImage", selectedFile)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${user.id}/profile-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao fazer upload da imagem")
      }

      const result = await response.json()

      // Atualizar contexto local com a nova URL da imagem
      updateUser({
        ...user,
        profileImage: result.profileImageUrl,
      })

      setSuccessMessage("Imagem de perfil atualizada com sucesso!")

      // Fechar modal após 2 segundos
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
      setErrorMessage(error instanceof Error ? error.message : "Erro inesperado ao fazer upload")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveImage = async () => {
    if (!user) return

    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${user.id}/profile-image`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao remover imagem de perfil")
      }

      // Atualizar contexto local removendo a imagem
      updateUser({
        ...user,
        profileImage: undefined,
      })

      setSuccessMessage("Imagem de perfil removida com sucesso!")
      setPreviewImage(null)
      setSelectedFile(null)

      // Fechar modal após 2 segundos
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Erro ao remover imagem:", error)
      setErrorMessage("Erro ao remover imagem de perfil. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearSelection = () => {
    setSelectedFile(null)
    setPreviewImage(null)
    setErrorMessage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const currentImage = previewImage || user?.profileImage

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <Camera className="w-6 h-6 text-[#511A2B]" />
            <h2 className="text-xl font-semibold text-[#511A2B]">Alterar Imagem de Perfil</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Messages */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700">{successMessage}</span>
            </div>
          )}

          {/* Current/Preview Image */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={currentImage || "/placeholder.svg"} />
              <AvatarFallback className="bg-[#511A2B] text-white text-2xl">{getUserInitials()}</AvatarFallback>
            </Avatar>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {previewImage ? "Nova imagem selecionada" : "Imagem atual do perfil"}
              </p>
              <p className="text-xs text-gray-500 mt-1">Tamanho máximo: 5MB • Formatos: JPG, PNG, GIF</p>
            </div>
          </div>

          {/* File Input */}
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading}
            />

            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Selecionar Nova Imagem</span>
              </Button>

              {selectedFile && (
                <div className="flex space-x-2">
                  <Button
                    onClick={handleUpload}
                    disabled={isLoading}
                    className="flex-1 bg-[#511A2B] hover:bg-[#511A2B]/90"
                  >
                    {isLoading ? "Salvando..." : "Salvar Nova Imagem"}
                  </Button>
                  <Button variant="outline" onClick={handleClearSelection} disabled={isLoading}>
                    Cancelar
                  </Button>
                </div>
              )}

              {user?.profileImage && !selectedFile && (
                <Button
                  variant="outline"
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remover Imagem Atual</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-100">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}
