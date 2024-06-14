import { Client } from "https://deno.land/x/irc@v0.15.0/mod.ts";

Deno.serve(async (req) => {
  const { channel, messages, listen_once } = await req.json();

  const client = new Client({
    nick: "jollyWudchip",
    serverPassword: Deno.env.get("OSU_IRC_PASSWORD"),
    verbose: "formatted",
    channels: [channel],
  });

  const processMessages = new Promise((resolve, reject) => {
    if (listen_once) {
      client.once(listen_once, (message) => {
        client.disconnect();
        resolve({ result: message });
      });
    }

    client.once("register", async () => {
      for (const message of messages) {
        await client.privmsg(channel, message);
      }

      if (!listen_once) {
        resolve({ result: null });
      }
    });
  });

  client.connect("irc.ppy.sh", 6667);
  const result = await processMessages;
  client.disconnect();

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
});
