import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  const { data, error } = await locals.supabase
    .from("teams")
    .select(`*`)
    .eq("id", params.team_id)
    .single();

  return {
    team: data,
  };
};

export const actions = {
  default: async ({ request, locals, params }) => {
    const formData = await request.formData();
    const file = formData.get("icon") as File;

    const fileResponse = await locals.supabase.storage
      .from("team_icons")
      .upload(params.team_id, file, { upsert: true });

    console.log(fileResponse);

    const { data, error } = await locals.supabase.from("teams").select();
  },
} satisfies Actions;
