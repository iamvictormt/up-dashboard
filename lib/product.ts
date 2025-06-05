import api from '@/services/api';
import { CreateProductData } from '@/types/product';
import { AxiosResponse } from 'axios';

export async function createProduct(data: CreateProductData): Promise<AxiosResponse> {
  return await api.post('products', data);
}

export async function updateProduct(productId: string, data: CreateProductData): Promise<AxiosResponse> {
  return await api.patch(`products/${productId}`, data);
}

export async function deleteProduct(productId: string): Promise<AxiosResponse> {
  return await api.delete(`products/${productId}`);
}
