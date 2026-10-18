export interface Order {
  id: string;
  user_id: string;
  payment_status: "completed" | "pending" | "failed" | "refunded" | string;
  type?: "vip" | "buy" | "rent" | string;
  amount?: number;
  currency?: string;
  created_at: string;
  updated_at?: string;
  [key: string]: any;
}
