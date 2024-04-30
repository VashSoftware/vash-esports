import { Client } from "https://deno.land/x/irc/mod.ts";

Deno.serve(async (req) => {
  const { channel, message } = await req.json();

  const client = new Client({
    nick: "Stan",
    serverPassword: Deno.env.get("OSU_IRC_PASSWORD"),
    verbose: "formatted",
  });

  await client.connect("irc.ppy.sh", 6667);
  client.join(channel);
  client.privmsg(channel, message);
  client.disconnect();

  return new Response("", {
    headers: { "Content-Type": "application/json" },
  });
});
