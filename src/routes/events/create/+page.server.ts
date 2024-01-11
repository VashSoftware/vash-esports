import { supabase } from "$lib/supabaseClient.js";

export const actions = {
  default: async ({ request }: { request: Request }) => {
    const data = await request.formData();

    const { error } = await supabase
      .from("events")
      .insert({ name: data.get("event-title") });

    if (error) {
      console.log(error);
    }
  },
};
