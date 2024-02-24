import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
  const organisation = await locals.supabase
    .from("organisations")
    .select(
      `*,
      organisation_members(
        *,
        user_profiles(
          *
        )
      ),
      events(
        *
      ),
      event_groups(
        *
      )`
    )
    .eq("id", params.organisation_id)
    .single();

  console.log(organisation);

  return {
    organisation: organisation.data,
  };
};
