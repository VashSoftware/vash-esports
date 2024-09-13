import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  const user = await locals.supabase
    .from("user_profiles")
    .select("id, user_platforms(platforms(name))")
    .eq("id", params.user_id)
    .single();

  return {
    user: user.data,
  };
};

export const actions = {
  createUser: async ({ params, locals, request }) => {
    const formData = await request.formData();

    const user = await locals.supabase
      .from("user_profiles")
      .update({
        name: formData.get("name"),
        finished_setup: true,
      })
      .eq("id", params.user_id)
      .select("id, country_code")
      .single();

    const team = await locals.supabase
      .from("teams")
      .upsert(
        {
          name: formData.get("name"),
          is_personal_team: true,
          country_code: user.data.country_code,
        },
        {
          onConflict: "name, is_personal_team",
        }
      )
      .select("id")
      .single();

    console.log(team);

    await locals.supabase.from("team_members").upsert(
      {
        user_id: params.user_id,
        team_id: team.data.id,
      },
      {
        onConflict: "user_id, team_id",
      }
    );

    throw redirect(302, `/users/${params.user_id}`);
  },
  logOut: async ({ locals }) => {
    await locals.supabase.auth.signOut();

    throw redirect(302, `/`);
  },
} satisfies Actions;
