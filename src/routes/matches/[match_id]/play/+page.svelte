<script lang="ts">
  import { enhance } from "$app/forms";
  import { tooltip } from "$lib/bootstrapTooltip.js";

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
        ),
        events(*, event_groups(*))
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
      match_maps(*, map_pool_maps( maps(*, mapsets(*))), scores(*, match_participant_players(*))),
      match_bans(*, match_participants(*, participants(*, teams(name))))`
      )
      .eq("id", data.match.id)
      .order("priority", {
        referencedTable: "rounds.map_pools.map_pool_mods",
        ascending: true,
      })
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

    const max_length = 18;

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

  function formatSeconds(seconds) {
    let date = new Date(null);
    date.setSeconds(seconds);
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let secondsValue = date.getUTCSeconds();
    let formattedTime = `${minutes.toString().padStart(2, "0")}:${secondsValue.toString().padStart(2, "0")}`;
    if (hours > 0) {
      formattedTime = `${hours.toString().padStart(2, "0")}:${formattedTime}`;
    }
    return formattedTime;
  }

  function canBan(map) {
    const bans = data.match.match_bans.filter(
      (ban) => ban.map_pool_map_id == map.id
    );

    return bans.length == 0;
  }

  let currentMatchBan = data.match.match_bans
    .filter((ban) => ban.map_pool_map_id == null)
    .sort((a, b) => a.time_limit - b.time_limit)[0];

  $: {
    currentMatchBan = data.match.match_bans
      .filter((ban) => ban.map_pool_map_id == null)
      .sort((a, b) => a.time_limit - b.time_limit)[0];
  }

  let banTimeRemaining = "";

  function startTimer() {
    const currentTime = new Date().getTime();
    const banTime = new Date(currentMatchBan?.time_limit).getTime();
    const timeRemaining = banTime - currentTime;

    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    banTimeRemaining = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    if (timeRemaining > 0) {
      setTimeout(startTimer, 1000);
    }
  }

  startTimer();

  let currentTab = "bans";
  $: currentTab = currentMatchBan ? "bans" : "hello";

  function getSettings() {
    data.supabase.functions.invoke("fetch-match-data");
  }
</script>

<div class="d-flex justify-content-center gap-3 my-4">
  <form action="?/startMap" method="post" use:enhance>
    <button type="submit" class="btn btn-success"> Start map </button>
  </form>

  <form action="?/deleteMatch" method="post" use:enhance>
    <button type="submit" class="btn btn-danger"> Delete match </button>
  </form>
</div>

<!-- This match is being broadcasted on the following official channels: -->
<div class="my-4 text-center">
  <a href="/events/{data.match.rounds.events.id}">
    <h3>
      {data.match.rounds.events.event_groups?.name ?? ""}
      {data.match.rounds.events.name}
    </h3>
  </a>
  <h4>{data.match.rounds.name}</h4>
</div>

<div class="row my-5 align-items-center">
  <div class="col">
    <a href="/teams/{data.match.match_participants[0].participants.teams.id}">
      <h2 class="text-center">
        {data.match.match_participants[0].participants.teams.name}
      </h2>
    </a>

    <div class="row row-cols-2 justify-content-center">
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
  <div class="col text-center fs-1 fw-bold">
    {data.match.match_maps.filter(
      (match_map) =>
        match_map.scores
          .filter(
            (score) =>
              score.match_participant_players.match_participant_id ==
              data.match.match_participants[0].id
          )
          .reduce((sum, score) => sum + score.score, 0) >
        match_map.scores
          .filter(
            (score) =>
              score.match_participant_players.match_participant_id ==
              data.match.match_participants[1].id
          )
          .reduce((sum, score) => sum + score.score, 0)
    ).length} - {data.match.match_maps.filter(
      (match_map) =>
        match_map.scores
          .filter(
            (score) =>
              score.match_participant_players.match_participant_id ==
              data.match.match_participants[1].id
          )
          .reduce((sum, score) => sum + score.score, 0) >
        match_map.scores
          .filter(
            (score) =>
              score.match_participant_players.match_participant_id ==
              data.match.match_participants[0].id
          )
          .reduce((sum, score) => sum + score.score, 0)
    ).length}
  </div>
  <div class="col text-end">
    <a href="/teams/{data.match.match_participants[1].participants.teams.id}">
      <h2 class="text-center">
        {data.match.match_participants[1].participants.teams.name}
      </h2>
    </a>

    <div class="row row-cols-2 justify-content-center">
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

<div class="tab-content" id="pills-tabContent">
  <div
    class="tab-pane fade {currentTab === 'bans' ? 'show active' : ''}"
    id="banTab"
    role="tabpanel"
    aria-labelledby="pills-profile-tab"
    tabindex="0"
  >
    <div class="d-flex justifbfy-content-around align-items-center">
      <div></div>
      <h3 class="text-center my-4">
        <b>{currentMatchBan?.match_participants.participants.teams.name}</b> has
        to ban a map! (2/{data.match.rounds.match_player_bans} Left) ({banTimeRemaining}
        seconds remaining)
      </h3>

      <button
        class="btn btn-danger"
        data-bs-toggle="modal"
        data-bs-target="#surrenderBansModal"
        disabled={data.match.match_participants[1].surrendered_bans}
        >Surrender Bans</button
      >
    </div>

    {#each data.match.rounds.map_pools.map_pool_mods as mod}
      {#if mod.map_pool_maps.filter((map) => map.maps).length > 0}
        <div
          class="d-flex align-items-center flex-wrap justify-content-center my-2"
        >
          {#each mod.map_pool_maps as map}
            {#if map.maps}
              <a
                href="https://osu.ppy.sh/beatmapsets/{map.maps.mapsets
                  .osu_id}#osu/{map.maps.osu_id}"
              >
                <div class="card text-bg-dark m-1 rounded-5">
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
                        <h5 class="mb-0">
                          <b>{mod.code}{map.mod_priority}</b>
                        </h5>
                      </div>
                      <div class="text-center">
                        <p
                          class="card-title lh-sm my-0"
                          style="font-size: smaller;"
                        >
                          {getShortenedMapName(map)}
                        </p>
                        <div>
                          <small>
                            <b>{map.maps?.star_rating}★</b> -
                            <b>{map.maps?.mapsets.bpm}BPM</b> -
                            <b>{formatSeconds(map.maps?.mapsets.time)}</b>
                          </small>
                        </div>
                      </div>
                      <form action="?/banMap" method="post" use:enhance>
                        <input
                          type="hidden"
                          name="map-pool-map-id"
                          value={map.id}
                        />
                        <input
                          type="hidden"
                          name="ban-id"
                          value={currentMatchBan?.id}
                        />

                        {#if canBan(map)}
                          <button
                            type="submit"
                            class="btn btn-danger"
                            disabled={data.match.rounds.match_player_bans == 0}
                            style=" height: 100%; object-fit: cover">BAN</button
                          >
                        {:else}
                          <span
                            use:tooltip
                            data-bs-title={"Cannot ban this map."}
                          >
                            <button
                              type="submit"
                              class="btn btn-danger"
                              disabled
                              style=" height: 100%; object-fit: cover"
                              >BAN</button
                            ></span
                          >
                        {/if}
                      </form>
                    </div>
                  </div>
                </div>
              </a>
            {/if}
          {/each}
        </div>
      {/if}
    {/each}
  </div>
</div>
<div
  class="tab-pane fade {currentTab === 'hello' ? 'show active' : ''}"
  id="playTab"
  role="tabpanel"
  aria-labelledby="pills-home-tab"
  tabindex="0"
>
  <div class="row">
    <div class="col">
      <h1 class="text-center">Maps Played</h1>

      {#each data.match.match_maps as map}
        <div class="row py-1 align-items-center">
          <div class="col text-end">
            <h3>{map.scores[0]?.score.toLocaleString()}</h3>
          </div>
          <div class="col-6">
            <div style="position: relative;">
              <div class="text-center">
                <img
                  class="img-thumbnail w-100 img-fluid"
                  src="https://assets.ppy.sh/beatmaps/{map.map_pool_maps.maps
                    .mapsets.osu_id}/covers/cover@2x.jpg"
                  alt="Match map cover"
                  style="filter: blur(1px) brightness(50%); height: 80px; object-fit: cover"
                />
              </div>
              <div
                class="text-center row align-items-center"
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; text-shadow: 0 0 16px #000000;"
              >
                <div class="col">
                  <div>
                    <b
                      >{map.map_pool_maps.maps.mapsets.artist} - {map
                        .map_pool_maps.maps.mapsets.title} [{map.map_pool_maps
                        .maps.difficulty_name}]</b
                    >
                  </div>

                  <div>
                    {map.map_pool_maps.maps.star_rating}★ - {map.map_pool_maps
                      .maps.mapsets.bpm}BPM
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col">
            <h3>{map.scores[1]?.score.toLocaleString()}</h3>
          </div>
        </div>
      {/each}
    </div>
    <div class="col">
      <h1 class="text-center">Pick Maps</h1>

      {#each data.match.rounds.map_pools.map_pool_mods.filter((mod) => mod.type != "tiebreaker") as mod}
        <div
          class="d-flex align-items-center flex-wrap justify-content-center my-2"
        >
          {#each mod.map_pool_maps as map}
            {#if map.maps}
              <a
                href="https://osu.ppy.sh/beatmapsets/{map.maps.mapsets
                  .osu_id}#osu/{map.maps.osu_id}"
              >
                <div class="card text-bg-dark m-1 rounded-5">
                  <img
                    src="https://assets.ppy.sh/beatmaps/{map.maps?.mapsets
                      .osu_id}/covers/cover@2x.jpg"
                    class="card-img rounded-5"
                    style="filter: blur(1px) brightness({data.match.match_maps.filter(
                      (match_map) => match_map.map_pool_maps.id == map.id
                    ).length > 0
                      ? '30%'
                      : '70%'}); width: 300px; height: 80px; object-fit: cover;"
                    alt="..."
                  />
                  <div class="card-img-overlay">
                    <div
                      class="d-flex justify-content-between align-items-center h-100"
                    >
                      <div class="d-flex flex-column justify-content-center">
                        <h5 class="mb-0">
                          <b>{mod.code}{map.mod_priority}</b>
                        </h5>
                      </div>
                      <div class="text-center">
                        <p
                          class="card-title lh-sm my-0"
                          style="font-size: smaller;"
                        >
                          {getShortenedMapName(map)}
                        </p>
                        <div>
                          <small>
                            <b>{map.maps?.star_rating}★</b> -
                            <b>{map.maps?.mapsets.bpm}BPM</b> -
                            <b>{formatSeconds(map.maps?.mapsets.time)}</b>
                          </small>
                        </div>
                      </div>
                      <form action="?/pickMap" method="post" use:enhance>
                        <input type="hidden" name="map-id" value={map.id} />

                        <button
                          type="submit"
                          class="btn btn-success"
                          disabled={data.match.match_maps.filter(
                            (match_map) => match_map.map_pool_maps.id == map.id
                          ).length > 0}
                          style=" height: 100%; object-fit: cover">PICK</button
                        >
                      </form>
                    </div>
                  </div>
                </div>
              </a>
            {/if}
          {/each}
        </div>
      {/each}
    </div>
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

<div
  class="modal fade"
  id="surrenderBansModal"
  tabindex="-1"
  aria-labelledby="staticBackdropLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">Are you sure?</h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        You will not be able to ban any more maps for the rest of the match.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >Close</button
        >
        <form action="?/surrenderBans" method="post" use:enhance>
          <input
            type="hidden"
            name="match-participant-id"
            value={data.match.match_participants[0].id}
          />
          <button type="submit" class="btn btn-danger" data-bs-dismiss="modal"
            >Confirm</button
          >
        </form>
      </div>
    </div>
  </div>
</div>
