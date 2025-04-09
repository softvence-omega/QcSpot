export interface ITo {
  taobao: string;
  weidian: string;
  "1688": string;
}

export interface IAgent {
  _id: string;
  sl: number;
  name: string;
  img: string;
  to: ITo;
  active: boolean;
}
