import { createClient } from "https://esm.sh/@supabase/supabase-js";

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    },
  );

  const ongoingMatches = await supabase
    .from("matches")
    .select(
      `*`,
    )
    .eq("ongoing", true);

  console.log("Ongoing matches: ", ongoingMatches.data!);

  for (const match of ongoingMatches.data!) {
    const out = await supabase.functions.invoke(
      "send-osu-message",
      {
        body: {
          channel: match.channel_name,
          messages: [`!mp settings`],
        },
      },
    );

    console.log("Settings for match: ", out);
  }

  return new Response(
    "",
    { headers: { "Content-Type": "application/json" } },
  );
});
