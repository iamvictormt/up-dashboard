export interface CreateProductData {
  description: string;
  featured: boolean;
  link: string;
  name: string;
  price: number;
  promotion: boolean;
}

export interface ProductData {
  id?: string;
  name: string;
  description: string;
  price: any;
  link: string;
  featured: boolean;
  promotion: boolean;
  storeId?: string;
}
