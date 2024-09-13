import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
  const { data, error } = await locals.supabase
    .from("teams")
    .select(
      `*, team_members(*, user_profiles(*)), participants(events(id, name, event_groups(*)))`
    )
    .eq("id", params.team_id)
    .single();

  if (data.is_personal_team) {
    throw redirect(303, `/users/${data.team_members[0].user_profiles.id}`);
  }

  return {
    team: data,
  };
};

export const actions = {
  default: async ({ params, locals }) => {
    await locals.supabase
      .from("team_members")
      .upsert({ team_id: params.team_id, user_id: locals.user.id })
      .select();
  },
} satisfies Actions;
