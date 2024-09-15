// src/utils/realtimeService.js
import supabase from "@/utils/supabaseClient";

export const subscribeToMessages = (
  chatId: string,
  onMessage: (message: any) => void
) => {
  const channel = supabase
    .channel(`public:conversations:session_id=eq.${chatId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'conversations' },
      (payload) => {
        if (onMessage) onMessage(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};