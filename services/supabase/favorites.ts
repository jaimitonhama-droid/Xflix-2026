import { createClient } from "./client";

export type Favorite = {
  id: string;
  user_id: string;
  video_id: string;
};

// Types corresponding to the join we will do
export type FavoriteWithVideo = Favorite & {
  videos: {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    preview_url: string;
    video_url: string;
    price: number;
    rental_price: number;
    duration: number;
    status: string;
    category_id: string;
  };
};

export async function getFavorites(): Promise<FavoriteWithVideo[]> {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("favorites")
    .select(`*, videos(*)`)
    .eq("user_id", userData.user.id);

  if (error) {
    throw error;
  }

  return (data as any) || [];
}

export async function addFavorite(videoId: string): Promise<Favorite> {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("favorites")
    .insert([
      {
        user_id: userData.user.id,
        video_id: videoId,
      },
    ])
    .select()
    .single()

  if (error) {
    throw error;
  }

  return data as any;
}

export async function removeFavorite(videoId: string): Promise<void> {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("favorites")
    .delete()
    .match({ user_id: userData.user.id, video_id: videoId });

  if (error) {
    throw error;
  }
}

export async function checkIsFavorite(videoId: string): Promise<boolean> {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return false;
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .match({ user_id: userData.user.id, video_id: videoId })
    .single();

  if (error) {
    return false;
  }

  return !!data;
}
