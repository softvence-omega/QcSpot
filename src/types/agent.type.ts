export interface ITo {
  taobao: string;
  weidian: string;
  ali_1688: string;
}

export interface IAgent {
  _id: string;
  sl: number;
  name: string;
  img: string;
  to: ITo;
  offer: string;
  active: boolean;
  isSelected: boolean;
}
