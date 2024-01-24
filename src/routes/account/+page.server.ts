import type { Actions } from './$types';

export const actions = {
	default: async (event) => {
		event.locals.supabase.auth.signOut();
	},
} satisfies Actions;