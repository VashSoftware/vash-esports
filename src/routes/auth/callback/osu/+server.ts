import { redirect } from "@sveltejs/kit";
import { PUBLIC_OSU_CLIENT_ID } from "$env/static/public";
import { OSU_CLIENT_SECRET } from "$env/static/private";

export const GET = async ({ url, locals: { supabase, getSession } }) => {
  const code = url.searchParams.get("code") as string;

  if (code) {
    const token = await fetch("https://osu.ppy.sh/oauth/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: PUBLIC_OSU_CLIENT_ID,
        client_secret: OSU_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${url.origin}/auth/callback/osu`,
      }),
    });

    const { access_token } = await token.json();

    const user = await fetch("https://osu.ppy.sh/api/v2/me/osu", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const osuData = await user.json();

    const session = await getSession();

    const userProfile = await supabase
      .from("user_profiles")
      .select("id, name")
      .eq("user_id", session.user.id)
      .single();

    const osuId = await supabase
      .from("user_platforms")
      .select("value, platforms!inner(name)")
      .eq("platforms.name", "osu!")
      .eq("value", osuData.id);

    if (osuId.data.length > 0) {
      redirect(303, `/users/${userProfile.data.id}`);
    }

    await supabase
      .from("user_profiles")
      .update({
        name: userProfile.data.name ? userProfile.data.name : osuData.username,
        country_code: osuData.country_code,
      })
      .eq("user_id", session.user.id)
      .select("id, user_id")
      .single();

    const osuPlatform = await supabase
      .from("platforms")
      .select("id")
      .eq("name", "osu!")
      .single();

    const osuUsernamePlatform = await supabase
      .from("platforms")
      .select("id")
      .eq("name", "osu! (username)")
      .single();

    const userPlatforms = await supabase
      .from("user_platforms")
      .upsert(
        [
          {
            user_id: userProfile.data.id,
            platform_id: osuPlatform.data.id,
            value: osuData.id,
          },
          {
            user_id: userProfile.data.id,
            platform_id: osuUsernamePlatform.data.id,
            value: osuData.username,
          },
        ],
        {
          onConflict: "user_id, platform_id",
        }
      )
      .select("*");

    function rankToStar(rank) {
      return Math.max(0, -0.65 * Math.log10(rank + 100) + 9);
    }

    console.log(
      osuData.statistics.global_rank,
      rankToStar(osuData.statistics.global_rank)
    );

    const gameId = await supabase
      .from("games")
      .select("id")
      .eq("name", "osu!")
      .single();

    const userRating = await supabase.from("user_ratings").upsert(
      {
        user_id: userProfile.data.id,
        game_id: gameId.data.id,
        rating: rankToStar(osuData.statistics.global_rank),
      },
      {
        onConflict: "user_id, game_id",
      }
    );

    console.dir(userRating);

    redirect(303, `/users/${userProfile.data.id}`);
  }

  /* Return the user to an error page with instructions */
  redirect(303, `/`);
};
