import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data, error } = await locals.supabase.from("teams").select();

  return {
    teams: data,
    organisations: [1, 2, 3],
  };
};

export const actions = {
  logOut: async (event) => {
    event.locals.supabase.auth.signOut();
  },
  createOrganisation: async (event) => {},
  createTeam: async (event) => {},
} satisfies Actions;