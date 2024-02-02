import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  const { data, error } = await locals.supabase
    .from("matches")
    .select(
      `*, rounds ( best_of, events (id, name)), match_participants(points, participants(id, teams(id, name))), match_maps(maps(*, mapsets(*)), scores(*)), match_predictions(*)`
    )
    .eq("id", params.match_id)
    .single();

  let teamIcons = [];
  for (let i = 0; i < data.match_participants; i++) {
    const teamIcon = await locals.supabase.storage
      .from("team_icons")
      .getPublicUrl(data.match_participants[i].participants.teams.id);

    teamIcons = [...teamIcons, teamIcon];
  }

  const changes = await locals.supabase
    .channel("schema-db-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
      },
      (payload) => console.log(payload)
    )
    .subscribe();

  return {
    match: data,
    teamIcons: [],
  };
};

export const actions = {
  default: async ({ locals, params, request }) => {
    const formData = await request.formData();
    const teamId = formData.get("participantId");

    const existingPrediction = await locals.supabase
      .from("match_predictions")
      .select("*")
      .eq("match_id", params.match_id)
      .eq("user_id", locals.user.id);
    console.log(existingPrediction);
    if (existingPrediction.data.length > 0) {
      return false;
    }

    await locals.supabase.from("match_predictions").upsert({
      match_id: params.match_id,
      user_id: locals.user.id,
      winning_participant_id: teamId,
    });
  },
} satisfies Actions;
