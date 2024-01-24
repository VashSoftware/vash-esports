export async function load(request) {
  const { data, error } = await request.locals.supabase.from("events").select();

  return {
    events: data,
  };
}
