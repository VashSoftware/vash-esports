import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (request) => {
        const { data, error } = await request.locals.supabase.from("events").select();

        return {
            events: data
        }
}