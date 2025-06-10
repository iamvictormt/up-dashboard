import api from '@/services/api';
import { PartnerSupplierData, ProfessionalData } from '@/types';
import { AddressData } from '@/types/address';
import { LoveDecorationData } from '@/types/loveDecoration';
import { AxiosResponse } from 'axios';

export async function fetchUserAuthenticated(): Promise<AxiosResponse> {
  return await api.get('users/authenticated');
}

export async function updateLoveDecoration(data: Partial<LoveDecorationData>): Promise<AxiosResponse> {
  return await api.patch(`love-decorations`, data);
}

export async function updateProfessional(data: Partial<ProfessionalData>): Promise<AxiosResponse> {
  return await api.patch(`professionals`, data);
}

export async function updatePartnerSupplier(data: Partial<PartnerSupplierData>): Promise<AxiosResponse> {
  return await api.patch(`partner-suppliers`, data);
}

export async function uploadImageCloudinary(file: any): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Erro ao fazer upload da imagem');
    }

    return result.secure_url;
  } catch (error: any) {
    console.error('Erro no upload da imagem:', error);
    return null;
  }
}

export async function updateAddressUser(userId: string, addressChanged: Partial<AddressData>) {
  return await api.patch(`users/address`, {
    id: userId,
    address: addressChanged,
  });
}

export async function updateImageUser(userId: string, profileImageUrl: string) {
  return await api.patch(`users/${userId}/profile-image`, { profileImage: profileImageUrl });
}

export async function saveUser(data: any, registerType: string) {
  return await api.post(`${registerType}`, data);
}
