import { Client } from "https://deno.land/x/irc@v0.15.0/mod.ts";
// import { auth, v2 } from "npm:osu-api-extended@3.0.0-beta.34";

Deno.serve(async (req) => {
  const { channel, messages, listen_once } = await req.json();

  const client = new Client({
    nick: "jollyWudchip",
    serverPassword: Deno.env.get("OSU_IRC_PASSWORD"),
    verbose: "formatted",
    channels: [channel],
  });

  // await auth.login({
  //   method: "v1",
  //   // client_id: Deno.env.get("OSU_CLIENT_ID")!,
  //   // client_secret: Deno.env.get("OSU_CLIENT_SECRET")!,
  //   // scopes: ["public", "chat.read", "chat.write", "delegate"],
  //   api_key: Deno.env.get("OSU_API_KEY")!,
  // });

  // const data = await v2.beatmaps.details({ id: 1256136, type: "difficulty" });
  // console.log(data);

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
