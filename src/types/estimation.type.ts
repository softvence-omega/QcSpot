export interface ICategoryChild {
  id: string;
  name: string;
  remark: string;
}

export interface ICategory {
  id: string;
  name: string;
  children: ICategoryChild[];
}

export interface ICountry {
  code: string;
  name: string;
  nameEn: string;
  flagUrl: string;
  sort: number;
}

export type ICurrencyEnum = {
  enumName: string;
  nameCn: string;
  symbol: string;
  colorType: string;
  cssClass: string;
  dictType: string;
  label: string;
  name: string;
  ordinal: number;
  showDict: boolean;
  value: string;
};

export type IFeeDetail = {
  additionalFee: any;
  airSurcharge: number;
  chargeableWeight: number;
  currency: string;
  currencyEnum: ICurrencyEnum;
  colorType: string;
  cssClass: string;
  customsFee: number;
  discount: any;
  feeContinue: number;
  feeFirst: number;
  freight: number;
  fuelFee: number;
  height: number;
  length: number;
  needVolumeCal: boolean;
  operationFee: number;
  serviceFee: number;
  total: number;
  volumeBase: number;
  volumeWeight: number;
  weight: number;
  weightContinue: number;
  weightFirst: number;
  width: number;
  [key: string]: any;
};

export type ICategoryRestriction = {
  name: string;
  [key: string]: any;
};

export type IRestrictions = {
  minWeight: number;
  maxWeight: number;
  dimensionRestriction: string;
  volumeWeightRule: string;
  [key: string]: any;
};

export type IShippingData = {
  addressMaxLength: number | null;
  available: boolean;
  declarePerKg: number;
  declareRatio: string;
  defaultDeclareType: string;
  features: string;
  feeDetail: IFeeDetail;
  freeInsure: boolean;
  iconUrl: string;
  id: string;
  iossEnabled: boolean;
  lineTips: any[];
  maxDeclareValue: number;
  minDeclareValue: number;
  name: string;
  prepayTariff: boolean;
  restrictions: IRestrictions;
  categoryRestrictions: ICategoryRestriction[];
  maxWeight: number;
  minWeight: number;
  sort: number;
  tariffRate: number | null;
  taxInclude: boolean;
  transitTime: string;
  unavailableReason: string | null;
  warehouse: string;
};
