import { createClient } from "https://esm.sh/@supabase/supabase-js";

async function sendOsuMessages(
  channel: string,
  messages: string[],
  listen_once: string | null,
) {
  const res = await fetch(
    "https://mdixwlzweijevgjmcsmt.supabase.co/functions/v1/send-osu-message",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
      },
      body: JSON.stringify({
        channel: channel,
        messages: messages,
        listen_once: listen_once,
      }),
    },
  );

  const data = await res.json();

  console.log(data);
  return data;
}

Deno.serve(async (req) => {
  const { match } = await req.json();

  console.log(match);

  const { result, logs } = await sendOsuMessages("BanchoBot", [
    `!mp make VASH: (${
      match.match_participants[0].participants.teams.name
    }) vs (${match.match_participants[1].participants.teams.name})`,
  ], "nicklist");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    },
  );

  console.log(result, logs);

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
  );

  return new Response(
    "",
    { headers: { "Content-Type": "application/json" } },
  );
});
