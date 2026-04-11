import { PartnerSupplierData } from './partnerSupplier';
import { ProfessionalData } from './professional';

export type PhysicalSaleStatus = 'PENDING' | 'REDEEMED';

export interface PhysicalSale {
  id: string;
  code: string;
  customerName: string;
  saleValue: number;
  sellerName?: string;
  invoiceNumber?: string;
  partnerId: string;
  partner?: PartnerSupplierData;
  redeemedByProfessionalId?: string;
  redeemedByProfessional?: ProfessionalData;
  status: PhysicalSaleStatus;
  createdAt: string;
  updatedAt: string;
}
