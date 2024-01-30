import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  const { data, error } = await locals.supabase
    .from("matches")
    .select(`*, rounds ( events (id, name)), participant1:participant1_id(teams(*)), participant2:participant2_id(teams(*))`)
    .eq("id", params.id)
    .single();

  return {
    match: data,
  };
}