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

    const max_length = 16;

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
        data-bs-target="#tab-pane-users"
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
        data-bs-target="#tab-pane-teams"
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
    class="tab-pane fade show active"
    id="tab-pane-users"
    role="tabpanel"
    aria-labelledby="pills-home-tab"
    tabindex="0"
  ></div>
  <div
    class="tab-pane fade"
    id="tab-pane-teams"
    role="tabpanel"
    aria-labelledby="pills-profile-tab"
    tabindex="0"
  >
    <h3 class="text-center my-4">
      <b>macdobald borgar</b> has to ban a map! (2/{data.match.rounds
        .match_player_bans} Left)
    </h3>

    {#each data.match.rounds.map_pools.map_pool_mods as mod}
      {#if mod.map_pool_maps.filter((map) => map.maps).length > 0}
        <div class="d-flex align-items-center flex-wrap">
          {#each mod.map_pool_maps as map}
            {#if map.maps}
              <div class="row my-1 px-1">
                <a
                  style="text-decoration: none; color: inherit;"
                  href="https://osu.ppy.sh/beatmaps/{map.maps?.osu_id}"
                  target="_blank"
                >
                  <div class="d-flex">
                    <div
                      class="p-2 d-flex align-items-center rounded-start"
                      style="background-color: #{mod['bg-color'] ||
                        '000000'}; height: 70px; object-fit: cover"
                    >
                      <h5 class="text-black">
                        {mod.code}{map.mod_priority}
                      </h5>
                    </div>

                    <div style="position: relative;">
                      <div class="text-center">
                        <img
                          src="https://assets.ppy.sh/beatmaps/{map.maps?.mapsets
                            .osu_id}/covers/cover@2x.jpg"
                          alt="Match map cover"
                          style="filter: blur(1px) brightness(70%); height: 70px; object-fit: cover"
                        />
                      </div>
                      <div
                        class="text-center row align-items-center"
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; text-shadow: 0 0 8px #000000;"
                      >
                        <div class="col">
                          <div style="font-size: smaller;">
                            {getShortenedMapName(map)}
                          </div>

                          <div>
                            <b>{map.maps?.star_rating}★</b> -
                            <b>{map.maps?.mapsets.bpm}BPM</b>
                          </div>
                        </div>
                      </div>
                    </div>

                    {#if map.type !== "tiebreaker"}
                      <div
                        class=" p-2 d-flex align-items-center rounded-end"
                        style="background-color: #{mod['bg-color'] ||
                          '000000'}; height: 70px; object-fit: cover"
                      >
                        <form action="?/banMap" method="post" use:enhance>
                          <input
                            type="hidden"
                            name="map-pool-map-id"
                            value={map.id}
                          />

                          <button
                            class="btn btn-danger"
                            style=" height: 100%; object-fit: cover">BAN</button
                          >
                        </form>
                      </div>
                    {/if}
                  </div>
                </a>
              </div>
            {/if}
          {/each}
        </div>
      {/if}
    {/each}
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
