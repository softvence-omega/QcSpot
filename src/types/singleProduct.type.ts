export interface TSingleProduct {
  filterDataFields?: any;
  product: Product;
  variants: any[];
}

interface Product {
  createdAt: string;
  dimensions: string;
  inStock: number;
  isDeleted: boolean;
  lastUpdatedAt: number;
  name: string;
  onTrend: boolean;
  price: number;
  productCode: string;
  searchField: string[];
  shippingTime: number;
  storeName: string;
  thumbnailImg: string[];
  totalPhoto: number;
  totalView: number;
  updatedAt: string;
  variants: string[];
  weight: number;
  __v: number;
  _id: string;
}

export interface IVarient {
  _id: string;
  photos: string[];
  quantity: number;
  [key: string]: any;
}
