import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const events = await locals.supabase
    .from("events")
    .select(
      `*, participants (teams(team_members( user_profiles(*)))), organisations (name)`
    )
    .limit(25);

  const session = await locals.getSession();
  events.data.forEach((event) => {
    event.participants.forEach((participant) => {
      participant.teams.team_members.forEach((teamMember) => {
        if (teamMember.user_profiles.user_id === session.user.id) {
          event.disabled = true;
          event.disabledMessage = "You are already registered";
        }
      });
    });
  });

  return {
    events: events.data,
  };
};

export const actions = {
  default: async (event) => {
    console.log("hello");
  },
} satisfies Actions;
