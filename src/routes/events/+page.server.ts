import { supabase } from "$lib/supabaseClient";

export async function load() {
  const { data, error } = await supabase.from("events").select();

  return {
    events: data,
  };
}
