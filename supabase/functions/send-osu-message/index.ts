/// <reference lib="deno.ns" />
import { Client } from "https://deno.land/x/irc/mod.ts";

Deno.serve(async (req) => {
  const { channel, messages } = await req.json();

  const client = new Client({
    nick: "jollyWudchip",
    serverPassword: Deno.env.get("OSU_IRC_PASSWORD"),
    verbose: "formatted",
    channels: [channel],
  });

  await client.connect("irc.ppy.sh", 6667);
  for (const message of messages) {
    client.privmsg(channel, message);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  client.disconnect();

  return new Response("", {
    headers: { "Content-Type": "application/json" },
  });
});
