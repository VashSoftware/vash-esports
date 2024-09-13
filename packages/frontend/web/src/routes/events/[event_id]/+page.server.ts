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
              *
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
      ),
      event_groups(
        *
      ),
      event_options(
        *
      )
      `
    )
    .eq("id", params.event_id)
    .single();

  let participantIcons = [];
  for (let i = 0; i < event.data.participants.length; i++) {
    const publicUrl = event.data.participants[i].teams.picture_url;

    participantIcons = [...participantIcons, publicUrl];
  }

  const eventBanner = await locals.supabase.storage
    .from("event_banners")
    .getPublicUrl(event.data.id);

  const session = await locals.getSession();
  if (session) {
    event.data.participants.forEach((participant) => {
      participant.teams.team_members.forEach((teamMember) => {
        if (teamMember.user_profiles.user_id === session.user.id) {
          event.data.disabled = true;
          event.data.disabledMessage = "You are already registered";
        }
      });
    });
  } else {
    event.data.disabled = true;
    event.data.disabledMessage =
      "You need to be logged in to register for events";
  }

  return {
    event: event.data,
    participantIcons: participantIcons,
    eventBanner,
  };
}
