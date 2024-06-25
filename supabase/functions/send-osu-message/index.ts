import Banchojs from "npm:bancho.js";

Deno.serve(async (req) => {
  const { channel, messages } = await req.json();

  const banchoClient = new Banchojs.BanchoClient({
    username: "jollyWudchip",
    password: Deno.env.get("OSU_IRC_KEY")!,
    apiKey: Deno.env.get("OSU_API_KEY"),
  });

  await banchoClient.connect();

  const osuChannel = banchoClient.getChannel(channel);
  await osuChannel.join();

  for (const message of messages) {
    console.log(`Sending message to ${channel}: ${message}`);

    await osuChannel.sendMessage(message);
  }

  banchoClient.disconnect();

  return new Response(JSON.stringify({ result: "success" }), {
    headers: { "Content-Type": "application/json" },
  });
});
