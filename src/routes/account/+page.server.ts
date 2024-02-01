import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const { data, error } = await locals.supabase.from("teams").select();

  return {
    teams: data,
    organisations: [1, 2, 3],
  };
};

export const actions = {
  logOut: async ({ locals }) => {
    await locals.supabase.auth.signOut();

    throw redirect(302, "/");
  },
  createOrganisation: async (event) => {},
  createTeam: async (event) => {},
} satisfies Actions;
