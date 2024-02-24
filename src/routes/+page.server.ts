import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const matches = await locals.supabase
    .from("matches")
    .select(
      `*, rounds (name, events (id, name, event_groups(*)) ), match_participants (participants (teams (name))), spectators(count), match_maps(*, scores(*))`
    )
    .eq("ongoing", true)
    .is("spectators.stopped_at", null);

  const events = await locals.supabase
    .from("events")
    .select(
      `*, participants(teams(team_members( user_profiles(*)))), organisations(name), event_groups(*), event_options(*)`
    )
    .neq("event_status_id", 1)
    .order("created_at", { ascending: false })
    .limit(10);

  const session = await locals.getSession();
  if (session) {
    events.data.forEach((event) => {
      event.participants.forEach((participant) => {
        participant.teams.team_members.forEach((teamMember) => {
          if (teamMember.user_profiles.user_id === session.user.id) {
            event.disabled = true;
            event.disabledMessage = "You are already registered";
          }
        });
      });
    });
  } else {
    events.data.forEach((event) => {
      event.disabled = true;
      event.disabledMessage = "You need to be logged in to register for events";
    });
  }

  return {
    matches: matches.data,
    events: events.data,
  };
};

export const actions = {
  register: async ({ locals, request }) => {
    const formData = await request.formData();
    const teamId = formData.get("team-id");
    const eventId = formData.get("event-id");

    const participant = await locals.supabase.from("participants").insert([
      {
        team_id: teamId,
        event_id: eventId,
      },
    ]);

    console.log(participant);
  },
  dismissNotification: async ({ locals, request }) => {
    const formData = await request.formData();

    const notificationId = formData.get("notification-id");

    const updated = await locals.supabase
      .from("notification_recipients")
      .update({ dismissed_at: new Date() })
      .eq("id", notificationId)
      .select("*")
      .single();

    console.log(updated);
  },
} satisfies Actions;
