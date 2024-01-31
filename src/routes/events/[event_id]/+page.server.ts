import type { PageServerLoad } from "./$types";

export async function load({ params, locals }) {
  const event = await locals.supabase
    .from("events")
    .select(
      `*, participants(*, teams (*, team_members ( user_profiles (name)))), rounds (matches(*, match_participants(participants(teams(name)))))`
    )
    .eq("id", params.event_id)
    .single();

  // console.log(
  //   event.data.rounds[0].matches[0].match_participants[0].participants.teams
  //     .name
  // );

  let participantIcons = [];
  for (let i = 0; i < event.data.participants.length; i++) {
    const publicUrl = await locals.supabase.storage
      .from("team_icons")
      .getPublicUrl(event.data.participants[i].teams.id);

    participantIcons = [...participantIcons, publicUrl];
  }

  return {
    event: event.data,
    participantIcons: participantIcons,
  };
}
