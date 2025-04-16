export type IReview = {
  _id: string;
  store_name: "weidian" | "taobao" | "1688";
  product_code: string;
  name: string;
  comment: string;
  rating: number;
  status: "pending" | "denied" | "approved";
  createdAt: string;
};
