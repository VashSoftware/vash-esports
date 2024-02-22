import type { PageServerLoad } from "./$types";

export async function load({ params, locals }) {
  const event = await locals.supabase
    .from("events")
    .select(
      `*,
      participants(*,
        teams (*,
          team_members(
            user_profiles (
              name
            )
          )
        )
      ), 
      rounds (
        map_pools(
          *
        ),
        matches(
          *, 
          match_participants(
            participants(
              teams(
                name
              )
            )
          )
        )
      ), 
      organisations(
        *
      )`
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

  const eventBanner = await locals.supabase.storage
    .from("event_banners")
    .getPublicUrl(event.data.id);

  const session = await locals.getSession();
  event.data.participants.forEach((participant) => {
    participant.teams.team_members.forEach((teamMember) => {
      if (teamMember.user_profiles.user_id === session.user.id) {
        event.disabled = true;
        event.disabledMessage = "You are already registered";
      }
    });
  });

  return {
    event: event.data,
    participantIcons: participantIcons,
    eventBanner,
  };
}
