/// <reference lib="deno.ns" />
import { Client } from "https://deno.land/x/irc/mod.ts";

async function handleIrc(channel: string, messages: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = new Client({
      nick: "jollyWudchip",
      serverPassword: Deno.env.get("OSU_IRC_PASSWORD"),
      verbose: "formatted",
      channels: [channel],
    });

    client.on("register", async () => {
      try {
        for (const message of messages) {
          client.privmsg(channel, message);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (err) {
        reject(err);
      }
    });

    client.on("nicklist", (message) => {
      client.disconnect();
      resolve(message.params.channel);
    });

    client.connect("irc.ppy.sh", 6667).catch(reject);
  });
}

Deno.serve(async (req) => {
  try {
    const { channel, messages } = await req.json();
    const resultChannel = await handleIrc(channel, messages);

    return new Response(JSON.stringify({ channel: resultChannel }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
