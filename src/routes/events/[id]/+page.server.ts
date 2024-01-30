import type { PageServerLoad } from "./$types";

export async function load({ params, locals }) {
  const event = await locals.supabase
    .from("events")
    .select(
      `*, participants(*, teams (*, team_members ( user_profiles (name))))`
    )
    .eq("id", params.id)
    .single();

  let participantIcons = [];
  for (let i = 0; i < event.data.participants.length; i++) {
    const publicUrl = await locals.supabase.storage
      .from("team_icons")
      .getPublicUrl(`public/${event.data.participants[i].teams.id}.png`);

    participantIcons = [...participantIcons, publicUrl];
  }

  return {
    event: event.data,
    participantIcons: participantIcons,
  };
}
