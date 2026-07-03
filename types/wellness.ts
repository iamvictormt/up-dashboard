import { AddressData } from './address';

export interface WellnessOffering {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null; // null = "sob consulta"
  duration?: string | null;
  photoUrl?: string | null;
  wellnessId?: string;
}

export interface Wellness {
  id: string;
  name: string;
  document: string; // CPF
  contact?: string | null;
  description?: string | null;
  whatsappMessage?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  services: WellnessOffering[];
  user?: {
    profileImage?: string | null;
    address?: AddressData | null;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface WellnessRegisterData {
  name: string;
  document: string;
  contact: string;
  email: string;
  password: string;
  confirmPassword: string;
}
