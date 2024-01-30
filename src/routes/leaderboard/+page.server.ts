export async function load(request) {
    const { data, error } = await request.locals.supabase.from("teams").select();
  
    return {
      teams: data,
    };
  }
  