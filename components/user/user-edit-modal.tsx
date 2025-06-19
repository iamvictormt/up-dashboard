"use client"

import { useState } from "react"
import { X, User, Building, Heart, AlertCircle, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfessionalEditForm } from "./professional-edit-form"
import { SupplierEditForm } from "./supplier-edit-form"
import { LoveDecorationEditForm } from "./love-decoration-edit-form"
import { AddressEditForm } from "./addres-edit-form"

interface UserEditModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UserEditModal({ isOpen, onClose }: UserEditModalProps) {
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const getUserTypeInfo = () => {
    if (user?.professional) {
      return {
        icon: <User className="w-6 h-6 text-[#511A2B]" />,
        title: "Editar perfil",
        type: "professional" as const,
      }
    }
    if (user?.partnerSupplier) {
      return {
        icon: <Building className="w-6 h-6 text-[#511A2B]" />,
        title: "Editar perfil",
        type: "supplier" as const,
      }
    }
    if (user?.loveDecoration) {
      return {
        icon: <Heart className="w-6 h-6 text-[#511A2B]" />,
        title: "Editar perfil",
        type: "loveDecoration" as const,
      }
    }
    return null
  }

  const userTypeInfo = getUserTypeInfo()
  if (!userTypeInfo) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            {userTypeInfo.icon}
            <h2 className="text-xl font-semibold text-[#511A2B]">{userTypeInfo.title}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="p-6 pb-0">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Tabs Content */}
        <div className="p-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <span>Dados do Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="address" className="flex items-center space-x-2">
                <span>Endereço</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              {userTypeInfo.type === "professional" && (
                <ProfessionalEditForm
                  professional={user?.professional}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onClose={onClose}
                />
              )}
              {userTypeInfo.type === "supplier" && (
                <SupplierEditForm
                  supplier={user?.partnerSupplier}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onClose={onClose}
                />
              )}
              {userTypeInfo.type === "loveDecoration" && (
                <LoveDecorationEditForm
                  loveDecoration={user?.loveDecoration}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onClose={onClose}
                />
              )}
            </TabsContent>

            <TabsContent value="address" className="mt-6">
              <AddressEditForm
                address={user?.address}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                onClose={onClose}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
