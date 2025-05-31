"use client"

import { useState } from "react"
import { Store, MapPin, Star, Edit3, Save, X, Camera, Plus, Trash2, Phone, Calendar, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

interface StoreData {
  id: string
  name: string
  description: string | null
  website: string | null
  rating: number
  openingHours: string | null
  address: {
    id: string
    state: string
    city: string
    district: string
    street: string
    complement: string | null
    number: string
    zipCode: string
  }
  phone?: string
  email?: string
  images?: string[]
  category?: string
}

export function MyStoreContent() {
  const [isEditing, setIsEditing] = useState(false)
  const [storeData, setStoreData] = useState<StoreData>({
    id: "d8821412-3cfc-4e1b-987b-b0760fe6240d",
    name: "Super Soluções",
    description: "Especialistas em soluções tecnológicas e consultoria empresarial para pequenas e médias empresas.",
    website: "www.supersolucoes.com.br",
    rating: 4.2,
    openingHours: "08:00 - 18:00",
    phone: "+55 11 99999-8888",
    email: "contato@supersolucoes.com.br",
    category: "Tecnologia",
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    address: {
      id: "c9af52cc-4739-4f3e-a62a-399ca480ffc5",
      state: "SP",
      city: "São Paulo",
      district: "Centro",
      street: "Av. Principal",
      complement: "Sala 101",
      number: "100",
      zipCode: "01000-000",
    },
  })

  const [editData, setEditData] = useState<StoreData>(storeData)

  const handleSave = () => {
    setStoreData(editData)
    setIsEditing(false)
    console.log("Dados salvos:", editData)
  }

  const handleCancel = () => {
    setEditData(storeData)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1]
      setEditData({
        ...editData,
        address: {
          ...editData.address,
          [addressField]: value,
        },
      })
    } else {
      setEditData({
        ...editData,
        [field]: value,
      })
    }
  }

  const addImage = () => {
    const newImages = [...(editData.images || []), "/placeholder.svg?height=300&width=400"]
    setEditData({ ...editData, images: newImages })
  }

  const removeImage = (index: number) => {
    const newImages = editData.images?.filter((_, i) => i !== index) || []
    setEditData({ ...editData, images: newImages })
  }

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#511A2B] rounded-2xl flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B]">Minha Loja</h1>
              <p className="text-[#511A2B]/70">Gerencie as informações da sua loja</p>
            </div>
          </div>

          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-[#511A2B] rounded-xl flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-[#511A2B]">{storeData.rating.toFixed(1)}</div>
              <div className="text-sm text-[#511A2B]/70">Avaliação</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-[#FEC460] rounded-xl flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-[#511A2B]" />
              </div>
              <div className="text-2xl font-bold text-[#511A2B]">156</div>
              <div className="text-sm text-[#511A2B]/70">Clientes</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-[#D56235] rounded-xl flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-[#511A2B]">23</div>
              <div className="text-sm text-[#511A2B]/70">Eventos</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-[#511A2B]">12</div>
              <div className="text-sm text-[#511A2B]/70">Workshops</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="grid grid-cols-4 bg-white/80 rounded-2xl p-1 mb-8 min-w-max w-full">
              <TabsTrigger
                value="info"
                className="rounded-xl data-[state=active]:bg-[#511A2B] data-[state=active]:text-white text-xs md:text-sm px-2 md:px-3"
              >
                Informações
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="rounded-xl data-[state=active]:bg-[#511A2B] data-[state=active]:text-white text-xs md:text-sm px-2 md:px-3"
              >
                Galeria
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="rounded-xl data-[state=active]:bg-[#511A2B] data-[state=active]:text-white text-xs md:text-sm px-2 md:px-3"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="rounded-xl data-[state=active]:bg-[#511A2B] data-[state=active]:text-white text-xs md:text-sm px-2 md:px-3"
              >
                Configurações
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Informações Tab */}
          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-[#511A2B] flex items-center">
                    <Store className="w-5 h-5 mr-2" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-[#511A2B] font-medium">
                      Nome da Loja
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                      />
                    ) : (
                      <p className="mt-1 text-[#511A2B] font-semibold">{storeData.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-[#511A2B] font-medium">
                      Categoria
                    </Label>
                    {isEditing ? (
                      <Input
                        id="category"
                        value={editData.category || ""}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                      />
                    ) : (
                      <Badge className="mt-1 bg-[#FEC460]/20 text-[#D56235] hover:bg-[#FEC460]/30 rounded-lg">
                        {storeData.category}
                      </Badge>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-[#511A2B] font-medium">
                      Descrição
                    </Label>
                    {isEditing ? (
                      <Textarea
                        id="description"
                        value={editData.description || ""}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                        rows={3}
                      />
                    ) : (
                      <p className="mt-1 text-[#511A2B]/80">{storeData.description || "Sem descrição"}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-[#511A2B] flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="phone" className="text-[#511A2B] font-medium">
                      Telefone
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editData.phone || ""}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                      />
                    ) : (
                      <p className="mt-1 text-[#511A2B]">{storeData.phone || "Não informado"}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-[#511A2B] font-medium">
                      Email
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editData.email || ""}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                      />
                    ) : (
                      <p className="mt-1 text-[#511A2B] break-all">{storeData.email || "Não informado"}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="website" className="text-[#511A2B] font-medium">
                      Website
                    </Label>
                    {isEditing ? (
                      <Input
                        id="website"
                        value={editData.website || ""}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                      />
                    ) : (
                      <p className="mt-1 text-[#511A2B] break-all">{storeData.website || "Não informado"}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="openingHours" className="text-[#511A2B] font-medium">
                      Horário
                    </Label>
                    {isEditing ? (
                      <Input
                        id="openingHours"
                        value={editData.openingHours || ""}
                        onChange={(e) => handleInputChange("openingHours", e.target.value)}
                        placeholder="Ex: 08:00 - 18:00"
                        className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                      />
                    ) : (
                      <p className="mt-1 text-[#511A2B]">{storeData.openingHours || "Não informado"}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Address Information */}
            <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#511A2B] flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="zipCode" className="text-[#511A2B] font-medium">
                      CEP
                    </Label>
                    {isEditing ? (
                      <Input
                        id="zipCode"
                        value={editData.address.zipCode}
                        onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                        className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                      />
                    ) : (
                      <p className="mt-1 text-[#511A2B]">{storeData.address.zipCode}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-[#511A2B] font-medium">
                      Cidade
                    </Label>
                    {isEditing ? (
                      <Input
                        id="city"
                        value={editData.address.city}
                        onChange={(e) => handleInputChange("address.city", e.target.value)}
                        className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                      />
                    ) : (
                      <p className="mt-1 text-[#511A2B]">{storeData.address.city}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state" className="text-[#511A2B] font-medium">
                      Estado
                    </Label>
                    {isEditing ? (
                      <Input
                        id="state"
                        value={editData.address.state}
                        onChange={(e) => handleInputChange("address.state", e.target.value)}
                        className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                      />
                    ) : (
                      <p className="mt-1 text-[#511A2B]">{storeData.address.state}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="street" className="text-[#511A2B] font-medium">
                      Rua
                    </Label>
                    {isEditing ? (
                      <Input
                        id="street"
                        value={editData.address.street}
                        onChange={(e) => handleInputChange("address.street", e.target.value)}
                        className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                      />
                    ) : (
                      <p className="mt-1 text-[#511A2B]">{storeData.address.street}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="number" className="text-[#511A2B] font-medium">
                      Número
                    </Label>
                    {isEditing ? (
                      <Input
                        id="number"
                        value={editData.address.number}
                        onChange={(e) => handleInputChange("address.number", e.target.value)}
                        className="mt-1 border-[#511A2B]/20 focus:border-[#511A2B]/40 rounded-xl"
                      />
                    ) : (
                      <p className="mt-1 text-[#511A2B]">{storeData.address.number}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#511A2B] flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Galeria de Imagens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  {editData.images?.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Loja ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {isEditing && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              onClick={() => removeImage(index)}
                              size="icon"
                              variant="destructive"
                              className="rounded-full"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      onClick={addImage}
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#511A2B] flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-8 h-8 text-gray-400" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-[#511A2B]">Visitas Mensais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 flex items-end justify-between space-x-2">
                    {[40, 65, 45, 80, 55, 70, 85].map((height, index) => (
                      <div key={index} className="bg-[#511A2B] rounded-t-lg flex-1" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Jan</span>
                    <span>Fev</span>
                    <span>Mar</span>
                    <span>Abr</span>
                    <span>Mai</span>
                    <span>Jun</span>
                    <span>Jul</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-[#511A2B]">Avaliações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center space-x-2">
                        <span className="text-sm w-2">{stars}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#FEC460] h-2 rounded-full"
                            style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 5}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-8">
                          {stars === 5 ? "70%" : stars === 4 ? "20%" : "5%"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-white/80 border-[#511A2B]/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#511A2B]">Configurações da Loja</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-medium text-[#511A2B]">Loja Ativa</h3>
                      <p className="text-sm text-gray-600">Sua loja está visível para clientes</p>
                    </div>
                    <Button className="bg-green-500 hover:bg-green-600 text-white rounded-xl">Ativo</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-medium text-[#511A2B]">Notificações</h3>
                      <p className="text-sm text-gray-600">Receber notificações de novos pedidos</p>
                    </div>
                    <Button variant="outline" className="border-[#511A2B]/30 text-[#511A2B] rounded-xl">
                      Configurar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-medium text-[#511A2B]">Backup de Dados</h3>
                      <p className="text-sm text-gray-600">Último backup: 15 Jan 2025</p>
                    </div>
                    <Button variant="outline" className="border-[#511A2B]/30 text-[#511A2B] rounded-xl">
                      Fazer Backup
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
