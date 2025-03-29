export type TProduct = {
  id: number;
  name: string;
  type: string;
  price: number;
  thumbnail: string;
  weight: number;
  shipmentTime: number;
  totalImages: number;
  views: number;
  qc: TQualityCheck[];
  createdAt: string;
  updatedAt: string;
};

export type TQualityCheck = {
  name: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
};

// src/types.ts
export type ProductForm = {
  name: string;
  price: number;
  weight: number;
  shippingTime: number;
  dimensions: string;
  storeName: "taobao" | "weidian" | "1688";
  productCode: string;
  quantity: number;
};

export type ProductVariant = {
  key: string;
  value: string;
};

export type ProductImage = {
  file: File;
  preview: string;
};
