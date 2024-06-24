import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const reqData = await request.formData();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: reqData.get("email") as string,
      password: reqData.get("password") as string,
    });

    if (error) {
      return fail(error.status, {
        error: {
          message: error.message,
        },
      });
    }

    if (data.user) {
      throw redirect(302, "/");
    }
  },
} satisfies Actions;
