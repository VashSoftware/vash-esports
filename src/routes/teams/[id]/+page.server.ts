import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
  const { data, error } = await locals.supabase
    .from("teams")
    .select(`*, team_members(*, user_profiles(*))`)
    .eq("id", params.id)
    .single();

  console.log(error);
  return {
    team: data,
  };
};

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    await localStorage.supabase
      .from("team_members")
      .insert([{ teamId: 1, userId: 1 }]);
  },
} satisfies Actions;
