import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { data, error } = await locals.supabase
    .from("matches")
    .select(
      `*,
      rounds ( best_of, events (id, name, event_links(*, platforms(*)), event_groups(*))),
      match_participants(participants(id, teams(id, name, picture_url, team_members(*, user_profiles(*))))),
      match_maps(map_pool_maps(maps(*, mapsets(*))), scores(*)),
      match_predictions(*, user_profiles(*))`,
    )
    .eq("id", params.match_id)
    .single();

  return {
    match: data,
    hostname: url.hostname,
  };
};

export const actions = {
  addPrediction: async ({ locals, params, request }) => {
    const formData = await request.formData();
    const teamId = formData.get("participantId");

    const user = await locals.supabase
      .from("user_profiles")
      .select("id")
      .eq("user_id", (await locals.getSession()).user.id)
      .single();

    const existingPrediction = await locals.supabase
      .from("match_predictions")
      .select("*, user_profiles(user_id)")
      .eq("match_id", params.match_id)
      .eq("user_profiles.user_id", (await locals.getSession()).user.id);
    
    if (existingPrediction.data.length > 0) {
      return false;
    }

    const pred = await locals.supabase.from("match_predictions").upsert({
      match_id: params.match_id,
      user_id: user.data.id,
      winning_participant_id: teamId,
    });
  },
  addToCalendar: async ({ locals, params }) => {
    const match = await locals.supabase
      .from("matches")
      .select("*, rounds(*, events(*))")
      .eq("id", params.match_id)
      .single();

    const icsData = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Vash Software//Vash Esports//EN
BEGIN:VEVENT
UID:${params.match_id}@example.com
SUMMARY:OWC2024: macdobald borgar vs evil macdobald borgar
DTSTAMP:20240207T000000Z${match.data.rounds.events.start_time}
DTSTART:20240208T170000Z${match.data.rounds.events.start_time + 1}
DTEND:20240208T180000Z
DESCRIPTION:This is an automatically generated event from Vash Esports.
END:VEVENT
END:VCALENDAR
`.trim();

    const matchCalendarEvent = await locals.supabase
      .from("match_calendar_events")
      .insert([{}])
      .select("*");

    const icsFile = await locals.supabase.storage
      .from("match_calendar_events")
      .upload(`Vash Esports Event.ics`, icsData);

    console.log(icsFile);
  },
} satisfies Actions;
