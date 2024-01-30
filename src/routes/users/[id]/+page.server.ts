import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({locals}) => {
    const { data, error } = await locals.supabase.from('organisations').select();

    return {
        organisations: data,
    }
};