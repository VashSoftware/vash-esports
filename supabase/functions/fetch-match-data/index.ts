import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { Client } from "https://deno.land/x/irc@v0.15.0/mod.ts";

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    },
  );

  const ongoingMatches = await supabase
    .from("matches")
    .select(
      `*, match_participants(*, match_participant_players(*, team_members(*, user_profiles(*, user_platforms(*))))), rounds(*), match_maps(*, scores(*))`,
    )
    .eq("ongoing", true);

  console.log("Ongoing matches: ", ongoingMatches.data);

  for (const match of ongoingMatches.data!) {
    const ircClient = new Client({
      nick: "jollyWudchip",
      serverPassword: Deno.env.get("OSU_IRC_PASSWORD"),
      floodDelay: 1000,
      channels: [match.channel_name],
    });

    const processMessages = new Promise((resolve, reject) => {
      ircClient.on("register", async () => {
        ircClient.privmsg(match.channel_name, "!mp settings");
      });

      ircClient.on("raw", async (message) => {
        for (const param of message.params) {
          if (
            param.includes(`BanchoBot!cho@ppy.sh PRIVMSG ${match.channel_name}`)
          ) {
            await handleSettings(param, match, supabase);
          }

          if (
            param.includes(
              `BanchoBot!cho@ppy.sh PRIVMSG ${match.channel_name} :The match has finished!`,
            )
          ) {
            await handleResults(param, match, supabase);
          }
        }
      });
    });

    ircClient.connect("irc.ppy.sh", 6667);

    await processMessages;

    ircClient.disconnect();
  }

  return new Response(
    "",
    { headers: { "Content-Type": "application/json" } },
  );
});

async function handleSettings(param: string, match: any, supabase: any) {
  const parsedData = parseSettings(param);
  console.log(parsedData);

  for (const match_participant of match.match_participants) {
    for (
      const match_participant_player of match_participant
        .match_participant_players
    ) {
      console.log(
        match_participant_player.team_members.user_profiles.user_platforms,
      );

      const platform = match_participant_player.team_members.user_profiles
        .user_platforms.filter(
          (platform) => platform.platform_id == 1,
        )[0];

      const playerInLobby = parsedData.players.some(
        (player) => player.id == platform.value,
      );

      const updatedPlayer = await supabase
        .from("match_participant_players")
        .update({ state: playerInLobby ? 3 : 1 })
        .eq("id", match_participant_player.id)
        .select();
    }
  }
}

async function handleResults(param: string, match: any, supabase: any) {
  const parsedData = parseResults(param);
  console.log(parsedData);

  for (const player of parsedData.players) {
    const matchParticipantPlayer = await supabase
      .from("match_participant_players")
      .select("*, team_members(*, user_profiles(*, user_platforms(*)))")
      .in(
        "match_participant_id",
        match.match_participants.map((mp: any) => mp.id),
      )
      .eq("team_members.user_profiles.user_platforms.platform_id", 10)
      .eq("team_members.user_profiles.user_platforms.value", player.name);

    const matchMap = await supabase
      .from("match_maps")
      .select("*")
      .eq("match_id", match.id)
      .order("created_at", { ascending: false });

    const score = await supabase
      .from("scores")
      .update({
        score: player.score,
        failed: player.failed,
      })
      .eq("match_participant_player_id", matchParticipantPlayer.data[0].id)
      .eq("match_map_id", matchMap.data[0].id)
      .select();
  }

  const bestOf = match.rounds.best_of;
  const scoreTeam1 = match.match_maps.filter(
    (match_map) => match_map.scores[0]?.score > match_map.scores[1]?.score,
  ).length;

  const scoreTeam2 = match.match_maps.filter(
    (match_map) => match_map.scores[1]?.score > match_map.scores[0]?.score,
  ).length;

  console.log("Scores: ", scoreTeam1, scoreTeam2, bestOf);

  if (scoreTeam1 > Math.floor(bestOf / 2) + 1) {
    const matchWinner = await supabase
      .from("matches")
      .update({ ongoing: false })
      .eq("match_id", match.id)
      .eq("team_id", 1)
      .select();

    console.log(matchWinner);

    await supabase.functions.invoke("send-osu-message", {
      body: {
        channel: match.channel_name,
        messages: [
          `!mp close`,
        ],
      },
    });
  }

  if (scoreTeam2 > Math.floor(bestOf / 2) + 1) {
    const matchWinner = await supabase
      .from("matches")
      .update({ ongoing: false })
      .eq("id", match.id)
      .select();

    console.log(matchWinner);

    await supabase.functions.invoke("send-osu-message", {
      body: {
        channel: match.channel_name,
        messages: [
          `!mp close`,
        ],
      },
    });
  }
}

function parseSettings(message: string) {
  const data = {
    roomName: "",
    teamMode: "",
    winCondition: "",
    playerCount: 0,
    players: [] as {
      id: string;
      name: string;
      team: string;
      slot: number;
      ready: boolean;
    }[],
  };

  const roomNameRegex = /Room name: (.*), History/;
  const teamModeRegex = /Team mode: (.*), Win condition/;
  const winConditionRegex = /Win condition: (.*)/;
  const playerCountRegex = /Players: (\d+)/;
  const playerRegex =
    /Slot (\d+)\s+(Ready|Not Ready)\s+https:\/\/osu\.ppy\.sh\/u\/(\d+)\s+(.*?)\s+\[(.*?)\]/;

  if (roomNameRegex.test(message)) {
    data.roomName = message.match(roomNameRegex)![1];
  }
  if (teamModeRegex.test(message)) {
    data.teamMode = message.match(teamModeRegex)![1];
  }
  if (winConditionRegex.test(message)) {
    data.winCondition = message.match(winConditionRegex)![1];
  }
  if (playerCountRegex.test(message)) {
    data.playerCount = parseInt(message.match(playerCountRegex)![1], 10);
  }
  const playerMatches = message.match(playerRegex);
  if (playerMatches) {
    const playerMatch = playerMatches;
    data.players.push({
      slot: parseInt(playerMatch[1], 10),
      ready: playerMatch[2] === "Ready",
      id: playerMatch[3],
      name: playerMatch[4].trim(),
      team: playerMatch[5],
    });
  }

  return data;
}

function parseResults(param: string) {
  const data = {
    players: [] as {
      name: string;
      score: number;
      failed: boolean;
    }[],
  };

  const matchResultRegex =
    /:BanchoBot!cho@ppy.sh PRIVMSG #\w+ :(\w+) finished playing \(Score: (\d+), (FAILED|PASSED)\)\./g;
  let match;
  while ((match = matchResultRegex.exec(param)) !== null) {
    data.players.push({
      name: match[1],
      score: parseInt(match[2], 10),
      failed: match[3] === "FAILED",
    });
  }

  return data;
}
