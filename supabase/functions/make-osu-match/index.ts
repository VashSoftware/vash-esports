import { createClient } from "https://esm.sh/@supabase/supabase-js";

async function sendOsuMessages(
  channel: string,
  messages: string[],
  listen_once: string | null,
  supabase: any,
) {
  const { data, error } = await supabase.functions.invoke("send-osu-message", {
    body: {
      channel: channel,
      messages: messages,
      listen_once: listen_once,
    },
  });

  console.log(data);
  return data;
}

Deno.serve(async (req) => {
  const { match } = await req.json();

  console.log(match);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    },
  );

  const matchParticipantsPlayers = match.match_participants.flatMap(
    (participant) => participant.match_participant_players,
  );

  for (const player of matchParticipantsPlayers) {
    const notification = await supabase.from("notifications").insert({
      user_id: player.team_members.user_profiles.id,
      title: "Match Created",
      body: `You have been invited to a match: ${
        match.match_participants[0].participants.teams.name
      } vs ${match.match_participants[1].participants.teams.name}`,
      href: `/matches/${match.id}/play`,
    });
  }

  const { result } = await sendOsuMessages(
    "BanchoBot",
    [
      `!mp make VASH: (${
        match.match_participants[0].participants.teams.name
      }) vs (${match.match_participants[1].participants.teams.name})`,
    ],
    "nicklist",
    supabase,
  );

  console.log(result);

  const updatedMatch = await supabase.from("matches").update({
    channel_name: result.params.channel,
  }).eq("id", match.id).select();

  console.log(updatedMatch);

  await sendOsuMessages(
    result.params.channel,
    [
      `!mp set 2 3 ${match.match_participants.length}`,
      `!mp invite ${
        match.match_participants[0].match_participant_players[0]
          .team_members.user_profiles.name
      }`,
      `!mp addref ${
        match.match_participants[0].match_participant_players[0]
          .team_members.user_profiles.name
      }`,
    ],
    null,
    supabase,
  );

  return new Response(
    "",
    { headers: { "Content-Type": "application/json" } },
  );
});
