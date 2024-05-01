import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { Client, Events, GatewayIntentBits } from "npm:discord.js";

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    }
  );

  const currentTime = new Date();
  currentTime.setSeconds(0, 0);

  const minuteLater = new Date(currentTime);
  minuteLater.setMinutes(currentTime.getMinutes() + 1);

  const { data, error } = await supabase
    .from("matches")
    .select(
      `*,
    match_participants(
      *,
      match_participant_players(
        *,
        team_members(
          *,
          user_profiles(*,
            user_platforms(*

            )
          )
        )
      ),
      participants(
      teams(*))
    )
  `
    )
    .gte("start_time", currentTime.toISOString())
    .lt("start_time", minuteLater.toISOString());

  if (error) {
    throw error;
  }

  console.log("Matches: ", data);

  if (!data) {
    return new Response(JSON.stringify(data), {
      status: 404,
    });
  }

  const discord = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  discord.once(Events.ClientReady, (c) => {
    c.user.setActivity("osu!");

    console.log(`Logged in as ${c.user?.tag}`);
  });

  discord.login(Deno.env.get("DISCORD_TOKEN"));

  async function makeMatch(match) {
    const makeMatch = await supabase.functions.invoke("send-osu-message", {
      body: {
        channel: "BanchoBot",
        message: `!mp make VASH: (${match.match_participants[0].participants.teams.name}) vs (${match.match_participants[1].participants.teams.name})`,
      },
    });

    return makeMatch.data.newChannel;
  }

  async function sendDiscordMessage(match: any) {
    // Logic to send a Discord message

    for (const match_participant of match.match_participants) {
      for (const player of match_participant.match_participant_players) {
        const discord_id = await supabase
          .from("user_platforms")
          .select("value")
          .eq("user_id", player.team_members.user_id)
          .eq("platform_id", 9);

        if (discord_id.data) {
          discord.users.send(
            discord_id.data[0].value,
            `Your match has started. Visit https://esports.vash.software/matches/${match.id}/play to join.`
          );
        }
      }
    }
  }

  function notifyPlayers() {
    // Logic to notify players
  }

  function notifyFollowers() {
    // Logic to notify followers
  }

  for (const match of data) {
    const channelId = await makeMatch(match);

    const matchPlayers = match.match_participants.flatMap(
      (participant) => participant.match_participant_players
    );

    for (const player of matchPlayers) {
      const { data, error } = await supabase.functions.invoke(
        "send-osu-message",
        {
          body: {
            channel: channelId,
            message: `!mp invite ${
              player.team_members.user_profiles.user_platforms.filter(
                (platform) => platform.platform_id == 1
              )[0].value
            }`,
          },
        }
      );
    }
    
    // getStatuses();
    await sendDiscordMessage(match);
    // notifyPlayers();
    // notifyFollowers();
  }

  await discord.destroy();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
