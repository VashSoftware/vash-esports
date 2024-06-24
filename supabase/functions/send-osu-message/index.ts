import { Client } from "https://deno.land/x/irc@v0.15.0/mod.ts";

Deno.serve(async (req) => {
  const { channel, messages, listen_once } = await req.json();

  const client = new Client({
    nick: "jollyWudchip",
    serverPassword: Deno.env.get("OSU_IRC_PASSWORD"),
    verbose: "formatted",
    channels: [channel],
  });

  // deno-lint-ignore no-async-promise-executor
  const processMessages = new Promise(async (resolve, _reject) => {
    client.once("register", () => {
      for (const message of messages) {
        client.privmsg(channel, message);
      }

      if (listen_once) {
        client.once(listen_once, (message) => {
          resolve({ result: message });
        });
      } else {
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
