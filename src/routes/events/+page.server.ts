import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async (request) => {
  const { data, error } = await request.locals.supabase
    .from("events")
    .select(`*, participants (count), organisations (name)`)
    .limit(25);

  return {
    events: data,
  };
};

export const actions = {
  default: async (event) => {
    console.log("hello");
  },
} satisfies Actions;
