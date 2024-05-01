import { Client } from "https://deno.land/x/irc/mod.ts";

Deno.serve(async (req) => {
  const { channel, message } = await req.json();

  const client = new Client({
    nick: "jollyWudchip",
    serverPassword: Deno.env.get("OSU_IRC_PASSWORD"),
    verbose: "formatted",
  });

  client.on("connected", () => {
    client.join(channel);
    client.privmsg(channel, message);
  });

  let newChannel = "";
  client.on("mode:channel", (msg) => {
    newChannel = msg.params.target;
  });

  await client.connect("irc.ppy.sh", 6667);

  await new Promise((resolve) => setTimeout(resolve, 10000));
  client.disconnect();

  return new Response(JSON.stringify({ newChannel }), {
    headers: { "Content-Type": "application/json" },
  });
});
