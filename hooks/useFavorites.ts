import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getFavorites, 
  addFavorite, 
  removeFavorite, 
  checkIsFavorite, 
  FavoriteWithVideo 
} from "@/services/supabase/favorites";

export const FAVORITES_QUERY_KEY = ["favorites"];

// Hook to get all favorites
export function useFavorites() {
  return useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: getFavorites,
  });
}

// Hook to check if a specific video is a favorite
export function useIsFavorite(videoId: string) {
  return useQuery({
    queryKey: [...FAVORITES_QUERY_KEY, videoId],
    queryFn: () => checkIsFavorite(videoId),
    enabled: !!videoId,
  });
}

// Hook for adding to favorites with optimistic update
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (videoId: string) => addFavorite(videoId),
    onMutate: async (videoId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: [...FAVORITES_QUERY_KEY, videoId] });

      // Optimistically update the isFavorite status for this video
      queryClient.setQueryData([...FAVORITES_QUERY_KEY, videoId], true);

      return { videoId };
    },
    onError: (err, videoId, context) => {
      // Revert if error
      if (context?.videoId) {
        queryClient.invalidateQueries({ queryKey: [...FAVORITES_QUERY_KEY, context.videoId] });
        queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
      }
    },
    onSettled: (data, error, videoId) => {
      queryClient.invalidateQueries({ queryKey: [...FAVORITES_QUERY_KEY, videoId] });
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });
}

// Hook for removing from favorites with optimistic update
export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (videoId: string) => removeFavorite(videoId),
    onMutate: async (videoId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: [...FAVORITES_QUERY_KEY, videoId] });

      // Optimistically update the isFavorite status for this video
      queryClient.setQueryData([...FAVORITES_QUERY_KEY, videoId], false);

      return { videoId };
    },
    onError: (err, videoId, context) => {
      // Revert if error
      if (context?.videoId) {
        queryClient.invalidateQueries({ queryKey: [...FAVORITES_QUERY_KEY, context.videoId] });
        queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
      }
    },
    onSettled: (data, error, videoId) => {
      queryClient.invalidateQueries({ queryKey: [...FAVORITES_QUERY_KEY, videoId] });
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });
}
