import { Client } from "https://deno.land/x/irc@v0.15.0/mod.ts";

Deno.serve(async (req) => {
  const { channel, messages, listen_once } = await req.json();

  const client = new Client({
    nick: "jollyWudchip",
    serverPassword: Deno.env.get("OSU_IRC_PASSWORD"),
    verbose: (message) => {
      console.log("Received message: ", message);
    },
    floodDelay: 2000,
    channels: [channel],
  });

  // Promise to handle the async operations
  const processMessages = new Promise((resolve, reject) => {
    client.on("register", async () => {
      for (const message of messages) {
        await client.privmsg(channel, message);
      }

      if (!listen_once) {
        resolve(null);
      }
    });

    if (listen_once) {
      client.once(listen_once, (message) => {
        client.disconnect();
        resolve({ result: message });
      });
    }
  });

  await client.connect("irc.ppy.sh", 6667);

  // Wait for the processMessages promise to resolve
  const result = await processMessages;

  return new Response(JSON.stringify(result || { success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
