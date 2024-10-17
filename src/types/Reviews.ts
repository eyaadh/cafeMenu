type TReviewStatus = "approved" | "pending";

export interface IReview {
  id: string | null;
  title: string | null;
  rating: number;
  content: string | null;
  author: string | null;
  date: string | null;
  datetime: string | null;
  phoneNumber: string | null;
  email: string | null;
  status: TReviewStatus;
  restricted: boolean;
}
