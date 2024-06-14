/// <reference lib="deno.ns" />
import { Client } from "https://deno.land/x/irc/mod.ts";

Deno.serve(async (req) => {
  const { channel, messages, listen_for } = await req.json();

  const client = new Client({
    nick: "jollyWudchip",
    serverPassword: Deno.env.get("OSU_IRC_PASSWORD"),
    verbose: "formatted",
    floodDelay: 1000,
    channels: [channel],
  });

  const logs: string[] = [];

  const connectToIRC = (): Promise<{ result: any; logs: string[] }> => {
    return new Promise((resolve, reject) => {
      client.on("register", () => {
        for (const message of messages) {
          client.privmsg(channel, message);
        }

        client.on("privmsg", (message) => {
          console.log(message);
          logs.push(message.params.text);
        });

        if (listen_for) {
          client.on(listen_for, (message) => {
            client.disconnect();
            console.log("Disconnected from IRC. Message: ", message);
            console.log("Logs: ", logs);
            resolve({ result: message, logs: logs });
          });
        } else {
          resolve({ result: null, logs: logs });
        }
      });

      client.connect("irc.ppy.sh", 6667).catch(reject);
    });
  };

  try {
    const result = await connectToIRC();
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
    });
  }
});
