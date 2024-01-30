import type { Actions, PageServerLoad } from './$types';

export const actions = {
	default: async (event) => {
		event.locals.supabase.auth.signOut();
	},
} satisfies Actions;

export const load: PageServerLoad = async ({ locals }) => {
	const { data, error } = await locals.supabase.from('teams').select();
	
	return {
		teams: data,
		organisations: [1,2,3]
	};
}