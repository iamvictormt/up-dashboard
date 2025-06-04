'use client';

import type React from 'react';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import {
  X,
  Upload,
  User,
  Building,
  Heart,
  UploadCloud,
  AlertCircle,
  Compass,
  Warehouse,
  Milestone,
  MapPinned,
  Map,
  MapPinHouse,
  Pin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/user-context';
import api from '@/services/api';
import { uploadImage } from '@/utils/image-upload';
import { toast } from 'sonner';
import { applyDocumentCnpjMask, applyDocumentMask, applyPhoneMask, applyZipCodeMask } from '@/utils/masks';
import { AddressForm } from './address-form';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ValidationErrors {
  [key: string]: string;
}

export function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useUser();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(user?.profileImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const [addressData, setAddressData] = useState({
    state: user?.address?.state || '',
    city: user?.address?.city || '',
    district: user?.address?.district || '',
    street: user?.address?.street || '',
    complement: user?.address?.complement || '',
    number: user?.address?.number || '',
    zipCode: user?.address?.zipCode || '',
  });

  const [professionalData, setProfessionalData] = useState({
    name: user?.professional?.name || '',
    profession: user?.professional?.profession || '',
    phone: user?.professional?.phone || '',
    description: user?.professional?.description || '',
    experience: user?.professional?.experience || '',
    officeName: user?.professional?.officeName || '',
  });

  const [supplierData, setSupplierData] = useState({
    tradeName: user?.partnerSupplier?.tradeName || '',
    companyName: user?.partnerSupplier?.companyName || '',
    document: user?.partnerSupplier?.document || '',
    contact: user?.partnerSupplier?.contact || '',
    stateRegistration: user?.partnerSupplier?.stateRegistration || '',
  });

  const [loveDecorationData, setLoveDecorationData] = useState({
    name: user?.loveDecoration?.name || '',
    contact: user?.loveDecoration?.contact || '',
    instagram: user?.loveDecoration?.instagram || '',
    tiktok: user?.loveDecoration?.tiktok || '',
  });

  if (!isOpen) return null;

  const validateRequiredFields = (): boolean => {
    const errors: ValidationErrors = {};

    if (!photo) {
      errors.photo = 'Foto de perfil é obrigatório';
    }

    if (user?.professional) {
      if (!professionalData.name.trim()) {
        errors.name = 'Nome é obrigatório';
      }
      if (!professionalData.profession.trim()) {
        errors.profession = 'Profissão é obrigatória';
      }
      if (!professionalData.phone.trim()) {
        errors.phone = 'Telefone é obrigatório';
      }
    }

    if (user?.partnerSupplier) {
      if (!supplierData.tradeName.trim()) {
        errors.tradeName = 'Nome comercial é obrigatório';
      }
      if (!supplierData.companyName.trim()) {
        errors.companyName = 'Razão social é obrigatória';
      }
      if (!supplierData.document.trim()) {
        errors.document = 'CNPJ é obrigatório';
      }
      if (!supplierData.contact.trim()) {
        errors.contact = 'Telefone é obrigatório';
      }
    }

    if (user?.loveDecoration) {
      if (!loveDecorationData.name.trim()) {
        errors.loveName = 'Nome é obrigatório';
      }
      if (!loveDecorationData.contact.trim()) {
        errors.loveContact = 'Telefone é obrigatório';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveProfileData = async (): Promise<boolean> => {
    try {
      let endpoint = '';
      let data: any = {};

      if (user?.professional) {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/professionals/${user.professional.id}`;
        data.professional = professionalData;
      } else if (user?.partnerSupplier) {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/partner-suppliers/${user.partnerSupplier.id}`;
        data.partnerSupplier = supplierData;
      } else if (user?.loveDecoration) {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/love-decorations/${user.loveDecoration.id}`;
        data.loveDecoration = loveDecorationData;
      } else {
        throw new Error('Tipo de usuário não identificado');
      }

      data.user = {
        id: user.id,
        address: addressData,
      };

      const response = await api.patch(endpoint, data);
      if (response.data) {
        updateUser(response.data);
      }

      if (!response) {
        throw new Error('Erro ao salvar dados do perfil');
      }

      return true;
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setErrorMessage('Erro ao salvar dados do perfil. Tente novamente.');
      return false;
    }
  };

  const handleSave = async () => {
    setErrorMessage(null);
    setValidationErrors({});

    if (!validateRequiredFields()) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true);

    try {
      let uploadedImageUrl: string | null = null;

      if (photo && photo !== user?.profileImage) {
        // uploadedImageUrl = await uploadImage(photo);
        setPhoto(uploadedImageUrl);
      }

      if (uploadedImageUrl && user) {
        // await updateUserProfileImage(user.id, uploadedImageUrl);
      }

      await saveProfileData();

      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro geral ao salvar:', error);
      setErrorMessage('Erro inesperado ao salvar. Tente novamente.');
      toast.error('Erro ao salvar o perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      const img = new window.Image();

      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          alert('Could not process the image');
          URL.revokeObjectURL(imageUrl);
          return;
        }

        const size = Math.min(img.width, img.height);
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;

        canvas.width = size;
        canvas.height = size;

        ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

        setPhoto(dataUrl);

        URL.revokeObjectURL(imageUrl);
        console.log(imageUrl);
      };

      img.onerror = () => {
        alert('Error loading the image');
        URL.revokeObjectURL(imageUrl);
      };
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Professional Register handlers
  const handleProfessionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      setProfessionalData((prev) => ({ ...prev, [name]: applyPhoneMask(value) }));
    } else if (name === 'document') {
      setProfessionalData((prev) => ({ ...prev, [name]: applyDocumentMask(value) }));
    } else {
      setProfessionalData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLoveDecorationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'contact') {
      setLoveDecorationData((prev) => ({ ...prev, [name]: applyPhoneMask(value) }));
    } else {
      setLoveDecorationData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfessionalSelectChange = (value: string) => {
    setProfessionalData((prev) => ({ ...prev, profession: value }));
  };

  // Partner Supplier Register handlers
  const handlePartnerSupplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'contact') {
      setSupplierData((prev) => ({ ...prev, [name]: applyPhoneMask(value) }));
    } else if (name === 'document') {
      setSupplierData((prev) => ({ ...prev, [name]: applyDocumentCnpjMask(value) }));
    } else {
      setSupplierData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const FieldError = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
      <div className="flex items-center space-x-1 mt-1">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <span className="text-sm text-red-500">{error}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            {user?.professional && <User className="w-6 h-6 text-[#511A2B]" />}
            {user?.partnerSupplier && <Building className="w-6 h-6 text-[#511A2B]" />}
            {user?.loveDecoration && <Heart className="w-6 h-6 text-[#511A2B]" />}
            <h2 className="text-xl font-semibold text-[#511A2B]">Editar Perfil</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Upload de Imagem */}
          {!photo ? (
            <div
              className={`border-2 border-dashed rounded-full p-6 text-center w-64 h-64 cursor-pointer hover:border-primary transition-colors place-self-center ${
                validationErrors.photo ? 'border-red-500' : 'border-gray-300'
              }`}
              onClick={triggerFileInput}
            >
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <UploadCloud className="h-12 w-12 text-gray-300 mb-2 mx-auto mt-12" />
              <p className="text-sm text-gray-300">Clique para enviar sua foto de perfil</p>
            </div>
          ) : (
            <div className="relative">
              <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-gray-200 place-self-center">
                <img src={photo || '/placeholder.svg'} alt="Profile photo" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-0 md:right-[12rem] flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={removePhoto}
                  className="rounded-full shadow-md"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          {validationErrors.photo && (
            <div className="place-self-center">
              <FieldError error={validationErrors.photo} />
            </div>
          )}

          {/* Formulários específicos por tipo de usuário */}

          {/* Profissional */}
          {user?.professional && (
            <div className="space-y-4">
              <h3 className="font-medium text-[#511A2B] border-b border-gray-100 pb-2">Informações</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={professionalData.name}
                    onChange={(e) => setProfessionalData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome completo"
                    className={validationErrors.name ? 'border-red-500' : ''}
                  />
                  <FieldError error={validationErrors.name} />
                </div>

                <div>
                  <Label htmlFor="profession">Profissão *</Label>
                  <Input
                    id="profession"
                    value={professionalData.profession}
                    onChange={(e) => setProfessionalData((prev) => ({ ...prev, profession: e.target.value }))}
                    placeholder="Ex: Mecânico, Eletricista"
                    className={validationErrors.profession ? 'border-red-500' : ''}
                  />
                  <FieldError error={validationErrors.profession} />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={professionalData.phone}
                    onChange={(e) => setProfessionalData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    className={validationErrors.phone ? 'border-red-500' : ''}
                  />
                  <FieldError error={validationErrors.phone} />
                </div>

                <div>
                  <Label htmlFor="officeName">Nome do Escritório</Label>
                  <Input
                    id="officeName"
                    value={professionalData.officeName}
                    onChange={(e) => setProfessionalData((prev) => ({ ...prev, officeName: e.target.value }))}
                    placeholder="Nome da sua empresa"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={professionalData.description}
                  onChange={(e) => setProfessionalData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva sua experiência e especialidades"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="experience">Experiência</Label>
                <Textarea
                  id="experience"
                  value={professionalData.experience}
                  onChange={(e) => setProfessionalData((prev) => ({ ...prev, experience: e.target.value }))}
                  placeholder="Detalhe sua experiência profissional"
                  rows={3}
                />
              </div>

              <AddressForm
                addressData={addressData}
                setAddressData={setAddressData}
                handleAddressChange={handleAddressChange}
                registerSuccess={false}
                applyZipCodeMask={applyZipCodeMask}
                isLogin={false}
              />
            </div>
          )}

          {/* Fornecedor */}
          {user?.partnerSupplier && (
            <div className="space-y-4">
              <h3 className="font-medium text-[#511A2B] border-b border-gray-100 pb-2">Informações</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tradeName">Nome Comercial *</Label>
                  <Input
                    id="tradeName"
                    value={supplierData.tradeName}
                    onChange={(e) => setSupplierData((prev) => ({ ...prev, tradeName: e.target.value }))}
                    placeholder="Nome fantasia"
                    className={validationErrors.tradeName ? 'border-red-500' : ''}
                  />
                  <FieldError error={validationErrors.tradeName} />
                </div>

                <div>
                  <Label htmlFor="companyName">Razão Social *</Label>
                  <Input
                    id="companyName"
                    value={supplierData.companyName}
                    onChange={(e) => setSupplierData((prev) => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Razão social da empresa"
                    className={validationErrors.companyName ? 'border-red-500' : ''}
                  />
                  <FieldError error={validationErrors.companyName} />
                </div>

                <div>
                  <Label htmlFor="document">CNPJ *</Label>
                  <Input
                    id="document"
                    value={supplierData.document}
                    onChange={(e) => setSupplierData((prev) => ({ ...prev, document: e.target.value }))}
                    placeholder="00.000.000/0000-00"
                    className={validationErrors.document ? 'border-red-500' : ''}
                  />
                  <FieldError error={validationErrors.document} />
                </div>

                <div>
                  <Label htmlFor="contact">Telefone *</Label>
                  <Input
                    id="contact"
                    value={supplierData.contact}
                    onChange={(e) => setSupplierData((prev) => ({ ...prev, contact: e.target.value }))}
                    onBlur={(e) => {
                      e.target.value.length !== 15 ? setSupplierData((prev) => ({ ...prev, contact: '' })) : '';
                    }}
                    placeholder="(11) 99999-9999"
                    className={validationErrors.contact ? 'border-red-500' : ''}
                  />
                  <FieldError error={validationErrors.contact} />
                </div>

                <div>
                  <Label htmlFor="stateRegistration">Inscrição Estadual</Label>
                  <Input
                    id="stateRegistration"
                    value={supplierData.stateRegistration}
                    onChange={(e) => setSupplierData((prev) => ({ ...prev, stateRegistration: e.target.value }))}
                    placeholder="Número da inscrição estadual"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Love Decoration */}
          {user?.loveDecoration && (
            <div className="space-y-4">
              <h3 className="font-medium text-[#511A2B] border-b border-gray-100 pb-2">Informações</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="loveName">Nome *</Label>
                  <Input
                    id="loveName"
                    value={loveDecorationData.name}
                    onChange={(e) => setLoveDecorationData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome"
                    className={validationErrors.loveName ? 'border-red-500' : ''}
                  />
                  <FieldError error={validationErrors.loveName} />
                </div>

                <div>
                  <Label htmlFor="loveContact">Telefone *</Label>
                  <Input
                    id="loveContact"
                    value={loveDecorationData.contact}
                    onChange={(e) => setLoveDecorationData((prev) => ({ ...prev, contact: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    className={validationErrors.loveContact ? 'border-red-500' : ''}
                  />
                  <FieldError error={validationErrors.loveContact} />
                </div>

                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={loveDecorationData.instagram}
                    onChange={(e) => setLoveDecorationData((prev) => ({ ...prev, instagram: e.target.value }))}
                    placeholder="@seuinstagram"
                    className={validationErrors.instagram ? 'border-red-500' : ''}
                  />
                  <FieldError error={validationErrors.instagram} />
                </div>

                <div>
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input
                    id="tiktok"
                    value={loveDecorationData.tiktok}
                    onChange={(e) => setLoveDecorationData((prev) => ({ ...prev, tiktok: e.target.value }))}
                    placeholder="@seutiktok"
                    className={validationErrors.tiktok ? 'border-red-500' : ''}
                  />
                  <FieldError error={validationErrors.tiktok} />
                </div>
              </div>

              <AddressForm
                addressData={addressData}
                setAddressData={setAddressData}
                handleAddressChange={handleAddressChange}
                registerSuccess={false}
                applyZipCodeMask={applyZipCodeMask}
                isLogin={false}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-100">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white">
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>
    </div>
  );
}
