import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
  const { data, error } = await locals.supabase
    .from("teams")
    .select(
      `*, team_members(*, user_profiles(*)), participants(events(id, name))`
    )
    .eq("id", params.team_id)
    .single();

  console.log(data);
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
