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
      ),
      match_maps(*, scores(*))`
      )
      .eq("id", data.match.id)
      .single();

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

  function getShortenedMapName(map) {
    let artist = map.maps?.mapsets.artist;
    let title = map.maps?.mapsets.title;
    let difficulty_name = map.maps?.difficulty_name;

    const max_length = 15;

    artist =
      artist.length > max_length
        ? artist.substring(0, max_length) + "..."
        : artist;
    title =
      title.length > max_length
        ? title.substring(0, max_length) + "..."
        : title;
    difficulty_name =
      difficulty_name.length > max_length
        ? difficulty_name.substring(0, max_length) + "..."
        : difficulty_name;

    return `${artist} - ${title} [${difficulty_name}]`;
  }

  function getCurrentBanner() {
    let bans = data.match.rounds.match_player_bans;
    let current_ban = bans - 1;

    return current_ban % 2 == 0
      ? data.match.match_participants[0].participants.teams.name
      : data.match.match_participants[1].participants.teams.name;
  }
</script>

<!-- This match is being broadcasted on the following official channels: -->
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
    <div class="col text-center">
      {data.match.match_maps.filter(
        (match_map) =>
          match_map.scores.filter(
            (score) =>
              score.match_participant_id == data.match.match_participants[0].id
          )[0]?.score >
          match_map.scores.filter(
            (score) =>
              score.match_participant_id == data.match.match_participants[1].id
          )[0]?.score
      ).length} - {data.match.match_maps.filter(
        (match_map) =>
          match_map.scores.filter(
            (score) =>
              score.match_participant_id == data.match.match_participants[1].id
          )[0]?.score >
          match_map.scores.filter(
            (score) =>
              score.match_participant_id == data.match.match_participants[0].id
          )[0]?.score
      ).length}
    </div>
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
</div>

<div class="py-5 text-center">
  <ul
    class="nav nav-pills justify-content-center"
    id="pills-tab"
    role="tablist"
  >
    <li class="nav-item" role="presentation">
      <button
        class="nav-link active"
        id="pills-home-tab"
        data-bs-toggle="pill"
        data-bs-target="#tab-pane-teams"
        type="button"
        role="tab"
        aria-controls="pills-home"
        aria-selected="true">1. Banning</button
      >
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        id="pills-profile-tab"
        data-bs-toggle="pill"
        data-bs-target="#tab-pane-users"
        type="button"
        role="tab"
        aria-controls="pills-profile"
        aria-selected="false">2. Playing</button
      >
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        id="pills-profile-tab"
        data-bs-toggle="pill"
        data-bs-target="#tab-pane-organisations"
        type="button"
        role="tab"
        aria-controls="pills-profile"
        aria-selected="false">Organisations</button
      >
    </li>
  </ul>
</div>

<div class="tab-content" id="pills-tabContent">
  <div
    class="tab-pane fade active show"
    id="tab-pane-teams"
    role="tabpanel"
    aria-labelledby="pills-profile-tab"
    tabindex="0"
  >
    <div class="d-flex justify-content-around align-items-center">
      <div></div>
      <h3 class="text-center my-4">
        <b>{getCurrentBanner()}</b> has to ban a map! (2/{data.match.rounds
          .match_player_bans} Left)
      </h3>
      <form action="?/surrenderBans" method="post">
        <button class="btn btn-danger">Surrender Bans</button>
      </form>
    </div>

    {#each data.match.rounds.map_pools.map_pool_mods as mod}
      {#if mod.map_pool_maps.filter((map) => map.maps).length > 0}
        <div
          class="d-flex align-items-center flex-wrap justify-content-center my-3"
        >
          {#each mod.map_pool_maps as map}
            {#if map.maps}
              <div class="card text-bg-dark m-2 rounded-5">
                <img
                  src="https://assets.ppy.sh/beatmaps/{map.maps?.mapsets
                    .osu_id}/covers/cover@2x.jpg"
                  class="card-img rounded-5"
                  style="filter: blur(1px) brightness(70%); width: 350px; height: 60px; object-fit: cover;"
                  alt="..."
                />
                <div class="card-img-overlay">
                  <div
                    class="d-flex justify-content-between align-items-center h-100"
                  >
                    <div class="d-flex flex-column justify-content-center">
                      <h5 class="mb-0"><b>{mod.code}{map.mod_priority}</b></h5>
                    </div>
                    <div>
                      <small class="card-title text-center">
                        <div class="text-center">
                          {getShortenedMapName(map)}
                        </div>
                      </small>
                      <p class="card-text text-center">
                        <b>{map.maps?.star_rating}★</b> -
                        <b>{map.maps?.mapsets.bpm}BPM</b> -
                        <b>{map.maps?.mapsets.time}</b>
                      </p>
                    </div>
                    <form action="?/banMap" method="post" use:enhance>
                      <input
                        type="hidden"
                        name="map-pool-map-id"
                        value={map.id}
                      />

                      <button
                        type="submit"
                        class="btn btn-danger"
                        style=" height: 100%; object-fit: cover">BAN</button
                      >
                    </form>
                  </div>
                </div>
              </div>
            {/if}
          {/each}
        </div>
      {/if}
    {/each}
  </div>
  <div
    class="tab-pane fade"
    id="tab-pane-users"
    role="tabpanel"
    aria-labelledby="pills-home-tab"
    tabindex="0"
  >
    hello
  </div>
  <div
    class="tab-pane fade"
    id="tab-pane-organisations"
    role="tabpanel"
    aria-labelledby="pills-profile-tab"
    tabindex="0"
  >
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
</div>
