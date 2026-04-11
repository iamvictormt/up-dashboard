import api from '@/services/api';
import { AxiosResponse } from 'axios';

export async function createPhysicalSale(data: {
  customerName: string;
  saleValue: number;
  sellerName?: string;
  invoiceNumber?: string;
}): Promise<AxiosResponse> {
  return await api.post('physical-sales', data);
}

export async function redeemPhysicalPoints(code: string): Promise<AxiosResponse> {
  return await api.post('physical-sales/redeem', { code });
}
