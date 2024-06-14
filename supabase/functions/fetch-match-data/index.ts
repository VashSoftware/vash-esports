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
    .select(`*`)
    .eq("ongoing", true);

  console.log("Ongoing matches: ", ongoingMatches.data!);

  for (const match of ongoingMatches.data!) {
    const ircClient = new Client({
      nick: "jollyWudchip",
      serverPassword: Deno.env.get("OSU_IRC_PASSWORD"),
      floodDelay: 2000,
      channels: [match.channel_name, "Stan"],
    });

    const processMessages = new Promise((resolve, reject) => {
      ircClient.on("register", async () => {
        await ircClient.privmsg(match.channel_name, "!mp settings");
      });

      ircClient.on("raw", (message) => {
        for (const param of message.params) {
          if (
            param.includes(`BanchoBot!cho@ppy.sh PRIVMSG ${match.channel_name}`)
          ) {
            const parsedData = parseMessage(param);

            console.log(parsedData);
          }
        }
      });
    });

    await ircClient.connect("irc.ppy.sh", 6667);

    await processMessages;

    ircClient.disconnect();
  }

  return new Response(
    "",
    { headers: { "Content-Type": "application/json" } },
  );
});

function parseMessage(message: string) {
  const data = {
    roomName: "",
    teamMode: "",
    winCondition: "",
    playerCount: 0,
    players: [] as { id: string; name: string; team: string }[],
  };

  const roomNameRegex = /Room name: (.*), History/;
  const teamModeRegex = /Team mode: (.*), Win condition/;
  const winConditionRegex = /Win condition: (.*)/;
  const playerCountRegex = /Players: (\d+)/;
  const playerRegex =
    /Slot \d+.*https:\/\/osu\.ppy\.sh\/u\/(\d+) (.*)\s+\[(.*)\]/;

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
  if (playerRegex.test(message)) {
    const playerMatch = message.match(playerRegex)!;
    data.players.push({
      id: playerMatch[1],
      name: playerMatch[2].trim(),
      team: playerMatch[3],
    });
  }

  return data;
}
