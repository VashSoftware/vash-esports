export async function load(request) {
  const roundsResponse = await request.locals.supabase.from("rounds").select();
  const registrationsReponse = await request.locals.supabase.from("registrations").select();

  return {
    rounds: roundsResponse.data,
    registrations: registrationsReponse.data,
  };
}
