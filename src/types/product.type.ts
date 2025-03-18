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
