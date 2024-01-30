import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const { data, error } = await locals.supabase.from("organisations").select();

  return {
    organisations: data,
  };
}

export const actions = {
  default: async ({ request, locals }: { request: Request }) => {
    const formData = await request.formData();

    const { data, error } = await locals.supabase
      .from("events")
      .insert({ name: formData.get("event-title"), organisation_id: formData.get("organisation-id")})
      .select();

    if (error) {
      console.log(error);
    }

    throw redirect(302, `/events/${data[0].id}`);
  },
} satisfies Actions;
