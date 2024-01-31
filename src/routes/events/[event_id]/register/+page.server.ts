import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const { data, error } = await locals.supabase
    .from("team_members")
    .select(`*, teams (*)`)
    .eq("user_id", locals.user.id);

  return {
    teamMembers: data,
  };
};

export const actions = {
  default: async ({ request, locals, params }) => {
    const reqData = await request.formData();

    const registration = await locals.supabase
      .from("participants")
      .select(`*`)
      .eq("event_id", params.event_id)
      .eq("team_id", reqData.get("team-id"));

    console.log(registration);

    if (registration.data.length > 0) {
      throw redirect(302, `/events/${params.event_id}`);
    }

    const { data, error } = await locals.supabase
      .from("participants")
      .insert([{ team_id: reqData.get("team-id"), event_id: params.event_id }])
      .select();

    throw redirect(302, `/events/${params.event_id}`);
  },
} satisfies Actions;
