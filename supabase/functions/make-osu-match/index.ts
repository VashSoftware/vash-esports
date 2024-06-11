async function sendOsuMessages(channel: string, messages: [string]) {
  const res = await fetch(
    "https://mdixwlzweijevgjmcsmt.supabase.co/functions/v1/send-osu-message",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
      },
      body: JSON.stringify({
        channel: channel,
        messages: messages,
      }),
    },
  );

  const data = await res.json();

  return data;
}

Deno.serve(async (req) => {
  const { channel } = await sendOsuMessages("BanchoBot", [
    `!mp make VASH: (hi) vs (hello)`,
  ]);

  console.log("Received message: ", channel);

  await sendOsuMessages(
    channel,
    [
      `!mp invite Stan`,
    ],
  );

  return new Response(
    "",
    { headers: { "Content-Type": "application/json" } },
  );
});
