import { redirect } from "@sveltejs/kit";

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get("code") as string;

  if (code) {
    const session = await supabase.auth.exchangeCodeForSession(code);

    const userProfile = await supabase
      .from("user_profiles")
      .upsert(
        {
          user_id: session.data.user.id,
        },
        {
          onConflict: "user_id",
        }
      )
      .select("id");

    redirect(303, `/users/${userProfile.data[0].id}/welcome`);
  }

  /* Return the user to an error page with instructions */
  redirect(303, `/`);
};
