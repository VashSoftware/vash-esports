import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
  const organisation = await locals.supabase
    .from("organisations")
    .select(
      `*,
      organisation_members(
        *,
        user_profiles(
          *
        ),
        organisation_member_roles(
          *,
          organisation_roles(
            *
          )
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

  return {
    organisation: organisation.data,
  };
};

export const actions = {
  createEventGroup: async ({ params, request, locals }) => {
    const formData = await request.formData();
    const name = formData.get("name") as string;

    const eventGroup = await locals.supabase
      .from("event_groups")
      .insert({ name, organisation_id: params.organisation_id })
      .single();

    console.log(`Created Event Group: ${eventGroup.data}`);
  },
  deleteEventGroup: async ({ params, request, locals }) => {
    const formData = await request.formData();
    const id = formData.get("event-group-id") as string;

    const eventGroup = await locals.supabase
      .from("event_groups")
      .delete()
      .eq("id", id)
      .single();

    console.log(`Deleted Event Group: ${eventGroup.data}`);
  }
} satisfies Actions;
