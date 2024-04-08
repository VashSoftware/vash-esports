import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { Client, Events, GatewayIntentBits } from "npm:discord.js";

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    },
  );

  const discord = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  discord.once(Events.ClientReady, (c) => {
    c.user.setActivity("osu!");

    console.log(`Logged in as ${c.user?.tag}`);
  });

  discord.login(Deno.env.get("DISCORD_TOKEN"));

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
            *
          )
        )
      )
    `,
    )
    .gte("start_time", currentTime.toISOString())
    .lt("start_time", minuteLater.toISOString());

  if (error) {
    throw error;
  }

  console.log("Matches: ", data);

  const token = await fetch("https://osu.ppy.sh/oauth/token", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      "client_id": Deno.env.get("OSU_CLIENT_ID")!,
      "client_secret": Deno.env.get("OSU_CLIENT_SECRET")!,
      "grant_type": "client_credentials",
      "scope": "public",
    }),
  });
  const { access_token } = await token.json();

  function makeMatch() {
    // Logic to make a match
    fetch("https://osu.ppy.sh/api/v2/rooms", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + access_token,
        "Content-Type": "application/json",
      },
    });
  }

  function invitePlayers() {
    // Logic to invite players
  }

  async function sendDiscordMessage(match: any) {
    // Logic to send a Discord message

    for (const match_participant of match.match_participants) {
      for (const player of match_participant.match_participant_players) {
        const discord_id = await supabase.from("user_platforms").select("value")
          .eq("user_id", player.team_members.user_id).eq(
            "platform_id",
            9,
          );

        if (discord_id.data) {
          discord.users.send(
            discord_id.data[0].value,
            "Your match has started.",
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
    // makeMatch();
    // invitePlayers();
    await sendDiscordMessage(match);
    // notifyPlayers();
    // notifyFollowers();
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
