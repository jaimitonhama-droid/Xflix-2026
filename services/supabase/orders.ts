import { createClient } from "@/services/supabase/client";

export async function getUserOrders(userId: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user orders:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error fetching orders:", error);
    return { data: null, error };
  }
}
