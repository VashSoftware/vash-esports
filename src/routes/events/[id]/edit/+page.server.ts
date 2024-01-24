export async function load(request) {
  const { data, error } = await request.locals.supabase.from("rounds").select();

  return {
    rounds: data,
  };
}
