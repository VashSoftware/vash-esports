import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const { data, error } = await locals.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return fail(error.status, {
        error: {
          message: error.message,
        },
      });
    }

    await locals.supabase.from("user_profiles").upsert({
      user_id: data.user.id,
      name,
    });

    if (data.user) {
      throw redirect(302, "/");
    }

    // create user
    // create personal team for user
    // add user to that personal team
    // create personal organisation for user
    // add user to that personal org
  },
} satisfies Actions;
