import type { ICategory } from "@/types/Categories";

export interface IProduct {
  id: string | null;
  name: string | null;
  price: number | null;
  category: ICategory | null;
  image: string | null;
  limitPerOrder: number | null;
}
