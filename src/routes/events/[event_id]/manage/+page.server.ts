export async function load({ locals, params }) {
  const [
    event,
    roundsResponse,
    participantsResponse,
    organisations,
    staffMembers,
  ] = await Promise.all([
    locals.supabase.from("events").select().eq("id", params.event_id).single(),
    locals.supabase.from("rounds").select().eq("event_id", params.event_id),
    locals.supabase
      .from("participants")
      .select(`*, teams (*)`)
      .eq("event_id", params.event_id),
    locals.supabase.from("organisations").select(),
    locals.supabase
      .from("event_staff_members")
      .select(`*, user_profiles (*)`)
      .eq("event_id", params.event_id),
  ]);

  return {
    event: event.data,
    rounds: roundsResponse.data,
    participants: participantsResponse.data,
    organisations: organisations.data,
    staffMembers: staffMembers.data,
  };
}
