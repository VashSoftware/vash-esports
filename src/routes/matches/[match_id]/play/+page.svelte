<script lang="ts">
  import { enhance } from "$app/forms";

  export let data;

  const getMatch = async () => {
    let updatedMatch = await data.supabase
      .from("matches")
      .select(
        `*, 
      rounds (*, 
        map_pools(*,
          map_pool_mods(*,
            map_pool_mod_mods(*,
              mods(*
              )
            ),
            map_pool_maps(*,
              maps(*, 
                mapsets(*
                )
              )
            )
          )
        )
      ),
      match_participants(*,
        match_participant_players(*,
          match_participant_player_states(*
          ),
          team_members(*, 
            user_profiles(*
            )
          )
        ),
        participants(*, 
          teams(*
          )
        )
      )`
      )
      .eq("id", data.match.id)
      .single();

    console.log(updatedMatch);

    data.match = updatedMatch.data;
  };

  data.supabase
    .channel("schema-db-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
      },
      (payload) => getMatch()
    )
    .subscribe();
</script>

This match is being broadcasted on the following official channels:
<div class="my-5">
  <div class="row my-5">
    <div class="col">
      <h2 class="text-center">
        {data.match.match_participants[0].participants.teams.name}
      </h2>

      <div class="row row-cols-2">
        {#each data.match.match_participants[0].match_participant_players as player}
          <div class="p-2">
            <div class="card col p-2">
              <div class="row">
                <div class="col">{player.team_members.user_profiles.name}</div>
                <div class="col text-end">
                  {player.match_participant_player_states.name}
                  {player.match_participant_player_states.emoji}
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
    <div class="col text-center">1-1</div>
    <div class="col text-end">
      <h2 class="text-center">
        {data.match.match_participants[1].participants.teams.name}
      </h2>

      <div class="row row-cols-2">
        {#each data.match?.match_participants[1].match_participant_players as player}
          <div class="p-2">
            <div class="card col p-2">
              <div class="row">
                <div class="col text-start">
                  {player.team_members.user_profiles.name}
                </div>
                <div class="col text-end">
                  {player.match_participant_player_states.name}
                  {player.match_participant_player_states.emoji}
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- <h2 class="my-5">Phase 0: Preparation</h2>
  <div class="py-4">
    <h3 class="text-center my-4">Rolls</h3>
    <div class="progress-stacked">
      <div
        class="progress"
        role="progressbar"
        aria-label="Segment one"
        aria-valuenow="15"
        aria-valuemin="0"
        aria-valuemax="100"
        style="width: {(data.match.match_participants[0].roll /
          (data.match.match_participants[0].roll +
            data.match.match_participants[1].roll)) *
          100}%"
      >
        <div class="progress-bar">{data.match.match_participants[0].roll}</div>
      </div>
      <div
        class="progress"
        role="progressbar"
        aria-label="Segment two"
        aria-valuenow="30"
        aria-valuemin="0"
        aria-valuemax="100"
        style="width: {(data.match.match_participants[1].roll /
          (data.match.match_participants[0].roll +
            data.match.match_participants[1].roll)) *
          100}%"
      >
        <div class="progress-bar bg-success">
          {data.match.match_participants[1].roll}
        </div>
      </div>
    </div>
  </div> -->

  <h3 class="text-center">macdobald borgar has to ban a map.</h3>
  <div class="row">
    {#each data.match.rounds.map_pools.map_pool_mods as mod}
      {#each mod.map_pool_maps as map}
        <div class="col p-2">
          <div class=" card mb-3">
            <div class="row g-0">
              <div class="col-md-4">
                <img
                  src="https://assets.ppy.sh/beatmaps/{map.maps?.mapsets
                    .osu_id}/covers/cover@2x.jpg"
                  class="img-fluid rounded-start"
                  alt="osu! mapset cover"
                />
              </div>
              <div class="col-md-8">
                <div
                  class="card-body d-flex align-items-center justify-content-between"
                >
                  <div class="card-title">
                    {map.maps?.mapsets.artist} - {map.maps?.mapsets.title}
                  </div>
                  <form method="post" action="?/banMap" use:enhance>
                    <input type="hidden" name="map-id" value="1" />
                    <button type="submit" class="btn btn-danger">Ban</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    {/each}
  </div>

  <h2 class="my-5">Phase 1: Playing</h2>
  <h2>Map pool</h2>
  {#each data.match.rounds.map_pools.map_pool_mods as mod}
    {#each mod.map_pool_maps as map}
      <div class="card mb-3">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="" class="img-fluid rounded-start" alt="..." />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">
                {map.maps?.mapsets.artist} - {map.maps?.mapsets.title}
              </h5>
              <button class="btn btn-primary">Pick</button>
              <button class="btn btn-danger">Ban</button>
            </div>
          </div>
        </div>
      </div>
    {/each}
  {/each}

  <h2 class="my-5">Phase 3: Finishing</h2>
</div>
