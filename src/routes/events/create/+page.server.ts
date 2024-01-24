import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  default: async ({ request }: { request: Request }) => {
    const formData = await request.formData();

    const { error } = await request.locals.supabase
      .from("events")
      .insert({ name: formData.get("event-title") });

    if (error) {
      console.log(error);
    }

    throw redirect(302, "/events/1/edit");
  },
} satisfies Actions;
