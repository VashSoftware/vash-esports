import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals, request }) => {
  const url = new URL(request.url);
  let page = 0;
  if (url.searchParams.get("page")) {
    page = parseInt(url.searchParams.get("page") as string) - 1;
  }

  const events = await locals.supabase
    .from("events")
    .select(
      `*, participants (teams(team_members( user_profiles(*)))), organisations (name), event_groups(*)`
    )
    .range(page * 10, page * 10 + 9);

  const eventsCount = await locals.supabase
    .from("events")
    .select("id", { count: "exact", head: true });

  const session = await locals.getSession();
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

  const games = await locals.supabase.from("games").select("*");
  games.data.forEach(
    (game) =>
      (game.logo = locals.supabase.storage
        .from("game_logos")
        .getPublicUrl(game.id).data.publicUrl)
  );

  return {
    events: events.data,
    eventsCount: eventsCount.count,
    games: games.data,
    eventGroups: (await locals.supabase.from("event_groups").select("*")).data,
  };
};

export const actions = {
  createEvent: async ({ locals, request }) => {
    const formData = await request.formData();

    const event = await locals.supabase
      .from("events")
      .insert([
        {
          organisation_id: formData.get("organisation-id"),
          event_group_id: formData.get("event-group-id"),
          game_id: formData.get("game-id"),
          name: formData.get("event-name"),
          description: formData.get("event-description"),
        },
      ])
      .select("*")
      .single();

    await locals.supabase.from("event_options").insert([
      {
        event_id: event.data.id,
      },
    ]);

    console.log("Created event: ", event.data.id);

    throw redirect(302, `/events/${event.data.id}`);
  },
} satisfies Actions;
