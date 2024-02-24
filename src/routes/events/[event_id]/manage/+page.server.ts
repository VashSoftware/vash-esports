import type { Actions } from "./$types.js";

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
      ),
      event_groups(
        *
      )
      `
    )
    .eq("id", params.event_id)
    .single();

  const mapPools = await locals.supabase.from("map_pools").select("*");

  return {
    event: event.data,
    mapPools: mapPools.data,
  };
}

export const actions = {
  updateEvent: async ({ locals, params, body }) => {
    const { data, error } = await locals.supabase
      .from("events")
      .update({
        name: body.name,
        description: body.description,
        start_date: body.start_date,
        end_date: body.end_date,
        map_pool_id: body.map_pool_id,
      })
      .eq("id", params.event_id);

    return { data, error };
  },
  deleteRound: async ({ locals, params }) => {
    console.log("hello!");
  },
  addRound: async ({ locals, params }) => {
    const round = await locals.supabase
      .from("rounds")
      .insert({ event_id: params.event_id })
      .select("*")
      .single();

    console.log(
      `Created round for event ${params.event_id} with ID: ${round.data.id}`
    );
  },
  disqualifyParticipant: async ({ locals, params, request }) => {
    const formData = await request.formData();
    const participantId = formData.get("participant-id");

    const participant = await locals.supabase
      .from("participants")
      .update({ disqualified_at: new Date() })
      .eq("id", participantId)
      .select("*")
      .single();

    console.log(`Disqualified participant from event ${params.event_id}`);
  },
} satisfies Actions;
