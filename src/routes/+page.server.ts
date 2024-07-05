import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { Provider } from "@supabase/supabase-js";

export const load: PageServerLoad = async ({ locals }) => {
  const matches = await locals.supabase
    .from("matches")
    .select(
      `*, rounds (name, events (id, name, event_groups(*)) ), match_participants (participants (teams (name))), spectators(count), match_maps(*, scores(*))`,
    )
    .eq("ongoing", true)
    .is("spectators.stopped_at", null);

  const events = await locals.supabase
    .from("events")
    .select(
      `*, participants(teams(team_members( user_profiles(*)))), organisations(name), event_groups(*), event_options(*)`,
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
  makeQuickMatch: async ({ locals, request }) => {
    const formData = await request.formData();

    const selectedTeamId = formData.get("team-id");
    const bestOf = formData.get("best-of");
    const quickPlayMaps = formData.getAll("map-ids");
    const modIds = formData.getAll("mod-ids");

    const insertData = async (table, data) => {
      const result = await locals.supabase.from(table).insert(data).select("*");
      if (result.error) throw new Error(result.error.message);
      return result.data;
    };

    const event = await insertData("events", {
      name: "Stan vs Stan",
      quick_event: true,
    });

    const map_pool = await insertData("map_pools", {
      name: `Quick Play Map Pool ${"Stan"} vs ${"Stan"}`,
    });

    const mods = await locals.supabase.from("mods").select("*");
    if (mods.error) throw new Error(mods.error.message);

    quickPlayMaps.forEach(async (map, index) => {
      const mapPoolMod = await insertData("map_pool_mods", {
        type: "mod",
        map_pool_id: map_pool[0].id,
        name: mods.data.filter((mod) => mod.id == modIds[index])[0].name,
        code: mods.data.filter((mod) => mod.id == modIds[index])[0].code,
      });

      const mapPoolModMod = await insertData("map_pool_mod_mods", {
        map_pool_mod_id: mapPoolMod[0].id,
        mod_id: 1,
      });

      console.log(mapPoolModMod);

      await insertData("map_pool_maps", {
        map_pool_id: map_pool[0].id,
        mod_priority: 1,
        map_pool_mod_id: mapPoolMod[0].id,
        map_id: map,
      });
    });

    const round = await insertData("rounds", {
      event_id: event[0].id,
      map_pool_id: map_pool[0].id,
      best_of: bestOf,
      match_player_bans: 0,
      name: "Stan vs Stan",
    });

    let match = await insertData("matches", {
      ongoing: true,
      start_time: new Date(),
      round_id: round[0].id,
      type: "quick",
    });

    console.log(await locals.getSession());

    const userPersonalTeam = await locals.supabase
      .from("teams")
      .select("*, team_members(*, user_profiles(*))")
      .eq("is_personal_team", true)
      .eq(
        "team_members.user_profiles.user_id",
        (await locals.supabase.auth.getUser()).data.user.id,
      );

    const participant_1 = await insertData("participants", {
      team_id: userPersonalTeam.data[0].id,
      event_id: event[0].id,
    });

    const participant_2 = await insertData("participants", {
      team_id: selectedTeamId,
      event_id: event[0].id,
    });

    const match_participant_1 = await locals.supabase
      .from("match_participants")
      .insert({
        match_id: match[0].id,
        participant_id: participant_1[0].id,
        surrendered_bans: true,
      })
      .select("*, participants(teams(team_members(*)))");

    const match_participant_2 = await locals.supabase
      .from("match_participants")
      .insert({
        match_id: match[0].id,
        participant_id: participant_2[0].id,
        surrendered_bans: true,
      })
      .select("*, participants(teams(team_members(*)))");

    console.log(match_participant_1);

    await insertData("match_participant_players", {
      match_participant_id: match_participant_1.data[0].id,
      team_member:
        match_participant_1.data[0].participants.teams.team_members[0].id,
      state: 1,
    });

    await insertData("match_participant_players", {
      match_participant_id: match_participant_2.data[0].id,
      team_member:
        match_participant_2.data[0].participants.teams.team_members[0].id,
      state: 1,
    });

    match = await locals.supabase
      .from("matches")
      .select(
        `*, 
        rounds (*, 
          map_pools(*,
            map_pool_mods(*,
              map_pool_mod_mods(*,
                mods(*
                )
              ),
              map_pool_maps(*,
                maps(*, 
                  mapsets(*
                  )
                )
              )
            )
          ),
          events(*, event_groups(*))
        ),
        match_participants(*,
          match_participant_players(*,
            match_participant_player_states(*
            ),
            team_members(*, 
              user_profiles(*
              )
            )
          ),
          participants(*, 
            teams(*
            )
          )
        ),
        match_maps(*, map_pool_maps( maps(*, mapsets(*))), scores(*, match_participant_players(*))),
        match_bans(*, match_participants(*, participants(*, teams(name))))`,
      )
      .eq("id", match[0].id)
      .single();

    console.log(match);

    fetch('http://osu.esports.vash.software/create-match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: match.data.id }),
    
    })

    throw redirect(302, `/matches/${match.data.id}/play`);
  },
  logInEmail: async ({ request, locals: { supabase } }) => {
    const reqData = await request.formData();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: reqData.get("email") as string,
      password: reqData.get("password") as string,
    });

    if (error) {
      return fail(error.status, {
        error: {
          message: error.message,
        },
      });
    }
  },
  logInOauth: async ({ request, url, locals: { supabase }}) => {
    const formData = await request.formData()
    const provider = formData.get('provider') as Provider

    /**
     * Sign-in will not happen yet, because we're on the server-side, 
     * but we need the returned url.
     */
    const { data, error } = await supabase.auth.signInWithOAuth({ 
      provider,
      options: {
        redirectTo: `${url.origin}/auth/callback?next=/`
      }
    })

    if (error) {
      return fail(error.status, {
        error: {
          message: error.message,
        },
      });
    }

    /* Now authorize sign-in on browser. */
    if (data.url) redirect(303, data.url)
  },
} satisfies Actions;
