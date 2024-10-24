import type { IProduct } from "@/types/Products";

type TOrderStatus = "completed" | "pending" | "processing";

export interface IOrderItem {
  item: IProduct;
  qty: number | null;
  total: number | null;
}

export interface IOrder {
  id: string | null;
  items: IOrderItem[];
  total: number | null;
  comment: string | null;
  contactNumber: number | null;
  address: string | null;
  status: TOrderStatus;
  restricted: boolean;
}
