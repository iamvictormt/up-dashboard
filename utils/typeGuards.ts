import { PartnerSupplierData, ProfessionalData } from "@/types";
import { LoveDecorationData } from "@/types/loveDecoration";

export function isProfessional(data: any): data is ProfessionalData {
  return 'officeName' in data && 'profession' in data;
}

export function isPartnerSupplier(data: any): data is PartnerSupplierData {
  return 'tradeName' in data && 'companyName' in data;
}

export function isLoveDecoration(data: any): data is LoveDecorationData {
  return 'tiktok' in data && 'instagram' in data;
}
