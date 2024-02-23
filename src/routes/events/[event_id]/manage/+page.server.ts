export async function load({ locals, params }) {
  const event = await locals.supabase
    .from("events")
    .select(
      `
      *,
      rounds(
        *,
        map_pools(
          *,
          map_pool_maps(
            *,
            maps(
              *
            )
          )
        )
      ),
      participants(
        *,
        teams(
          *,
          team_members(
            *,
            user_profiles(
              *
            )
          )
        )
      )
      `
    )
    .eq("id", params.event_id)
    .single();

  return {
    event: event.data,
  };
}
