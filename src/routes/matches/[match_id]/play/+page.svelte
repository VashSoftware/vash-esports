<script lang="ts">
  import { dev } from "$app/environment";
  import { enhance } from "$app/forms";
  import { tooltip } from "$lib/bootstrapTooltip.js";
  import { onMount } from "svelte";
  import _ from "lodash";

  export let data;

  let activeModals = {
    roll: null,
    pickMap: null,
    matchOver: null,
  };

  async function processMatch() {
    const bootstrap = await import("bootstrap");

    if (
      data.match.match_participants.filter((mp) => mp.roll === null).length > 0
    ) {
      if (activeModals.roll === null) {
        activeModals.roll = new bootstrap.Modal("#rollModal");
      }

      return await activeModals.roll.show();
    }

    await activeModals.roll?.hide();

    if (
      (data.match.match_maps[data.match.match_maps.length - 1]?.status ==
        "finished" ||
        data.match.match_maps.length == 0) &&
      data.match.ongoing === true
    ) {
      if (activeModals.pickMap === null) {
        activeModals.pickMap = new bootstrap.Modal("#pickMapModal");
      }

      return await activeModals.pickMap.show();
    }

    await activeModals.pickMap?.hide();

    if (data.match.ongoing === false && activeModals.matchOver === null) {
      activeModals.matchOver = new bootstrap.Modal("#matchOverModal");
    }

    return await activeModals.matchOver.show();
  }

  onMount(async () => {
    processMatch();

    const getMatch = async () => {
      const updatedMatch = await data.supabase
        .from("matches")
        .select(
          `
      *,
      rounds(
        *,
        events(
          *,
          event_groups(
            *
          )
        )
      ),
      match_participants(
        *,
        match_participant_players(
          *,
          match_participant_player_states(
            *
          ),
          team_members(
            *,
            user_profiles(
              *
            )
          )
        ),
        participants(*,
          teams(*, team_members(user_profiles(user_id)))
        )
      ),
      match_maps(*,
        map_pool_maps(*,
          maps(*,
            mapsets(*)
          )
        ),
        scores(*,
          match_participant_players(*)
        )
      ),
      match_bans(*,
        match_participants(*,
          participants(*,
            teams(name)
          )
        )
      ),
      map_pools(
        *,          
        map_pool_maps(
          *,
          maps(
            *,
            mapsets(
              *
            )
          ),
          map_pool_map_mods(
            *,
            mods(
              *
            )
          )
        )
      )
      `
        )
        .eq("id", data.match.id)
        .order("created_at", { referencedTable: "match_maps" })
        .single();

      // updatedMatch.data.map_pools.map_pool_maps = _.groupBy(
      //   updatedMatch.data.map_pools.map_pool_maps,
      //   (map) => map.map_pool_map_mods[0].mod_id
      // );

      data.match = updatedMatch.data;
      processMatch();
    };

    data.supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
        },
        (payload) => {
          getMatch();
        }
      )
      .subscribe();
  });

  function getShortenedMapName(map) {
    let artist = map.maps?.mapsets.artist || "";
    let title = map.maps?.mapsets.title || "";
    let difficulty_name = map.maps?.difficulty_name || "";

    const max_length = 100;
    let fullName = `${artist} - ${title} [${difficulty_name}]`;

    if (fullName.length > max_length) {
      fullName = fullName.substring(0, max_length) + "...";
    }

    return fullName;
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
</script>

<!-- <div class="d-flex justify-content-center gap-3 my-4">
  <form action="?/startMap" method="post" use:enhance>
    <button type="submit" class="btn btn-success"> Start map </button>
  </form>

  <form action="?/endMatch" method="post" use:enhance>
    <button type="submit" class="btn btn-danger"> End match </button>
  </form>
</div> -->

<!-- This match is being broadcasted on the following official channels: -->

{#if data.match.type == "event"}
  <div class="my-4 text-center">
    <a href="/events/{data.match.rounds.events.id}">
      <h3>
        {data.match.rounds.events.event_groups?.name ?? ""}
        {data.match.rounds.events.name}
      </h3>
    </a>
    <h4>{data.match.rounds.name}</h4>
  </div>
{/if}

<div class="row my-4 py-4 align-items-center shadow bg-body-tertiary rounded-5">
  <div class="col">
    <div class="text-center mb-3">
      <img
        src={data.match.match_participants[0].participants.teams.picture_url}
        height="192"
        class="rounded-circle shadow"
        alt=""
      />
    </div>

    <a href="/teams/{data.match.match_participants[0].participants.teams.id}">
      <h2 class="text-center">
        {data.match.match_participants[0].participants.teams.name}
      </h2>
    </a>

    {#if data.match.type == "event"}
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
    {:else}
      <div class=" p-2 text-center">
        {data.match.match_participants[0].match_participant_players[0]
          .match_participant_player_states.name}
        {data.match.match_participants[0].match_participant_players[0]
          .match_participant_player_states.emoji}
      </div>
    {/if}

    {#if data.match.match_participants[0].match_participant_players[0].match_participant_player_states.id == 2}
      <form
        action="?/invitePlayer"
        method="post"
        class="text-center"
        use:enhance
      >
        <input
          type="hidden"
          name="match-participant-player-id"
          value={data.match.match_participants[0].match_participant_players[0]
            .id}
        />

        <button type="submit" class="btn btn-primary"> Invite to Lobby </button>
      </form>
    {/if}
  </div>
  <div class="col text-center">
    <p class="fs-5">Best of: {data.match.rounds.best_of}</p>
    <div class="fs-1 fw-bold">
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
  </div>
  <div class="col text-end">
    <div class="text-center mb-3">
      <img
        src={data.match.match_participants[1].participants.teams.picture_url}
        height="192"
        class="rounded-circle shadow"
        alt=""
      />
    </div>

    <a href="/teams/{data.match.match_participants[1].participants.teams.id}">
      <h2 class="text-center">
        {data.match.match_participants[1].participants.teams.name}
      </h2>
    </a>

    {#if data.match.type == "event"}
      <div class="row row-cols-2 justify-content-center">
        {#each data.match.match_participants[1].match_participant_players as player}
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
    {:else}
      <div class=" p-2 text-center">
        {data.match.match_participants[1].match_participant_players[0]
          .match_participant_player_states.name}
        {data.match.match_participants[1].match_participant_players[0]
          .match_participant_player_states.emoji}
      </div>
    {/if}

    {#if data.match.match_participants[1].match_participant_players[0].match_participant_player_states.id == 2}
      <form
        action="?/invitePlayer"
        method="post"
        class="text-center"
        use:enhance
      >
        <input
          type="hidden"
          name="match-participant-player-id"
          value={data.match.match_participants[1].match_participant_players[0]
            .id}
        />

        <button type="submit" class="btn btn-primary"> Invite to Lobby </button>
      </form>
    {/if}
  </div>
</div>

<div class="row shadow bg-body-tertiary rounded-5 py-4 mb-5">
  <div class="col">
    <h1 class="text-center pb-3">
      Maps Played ({data.match.match_maps.length})
    </h1>

    {#each data.match.match_maps as map}
      <div class="row py-1 align-items-center">
        <div class="col text-end">
          {#if dev}
            <div class="d-flex gap-3">
              {#if map.scores?.reduce((sum, score) => sum + score.score, 0) == 0}
                <form action="?/addSampleScores" method="post" use:enhance>
                  <input type="hidden" name="match-map-id" value={map.id} />

                  <button type="submit" class="btn btn-primary"
                    >Add sample scores</button
                  >
                </form>
              {/if}

              <form action="?/deleteScores" method="post" use:enhance>
                <input type="hidden" name="match-map-id" value={map.id} />

                <button type="submit" class="btn btn-danger"
                  >Delete scores</button
                >
              </form>
            </div>
          {/if}

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

<div
  class="modal fade"
  id="pickMapModal"
  tabindex="-1"
  aria-labelledby="staticBackdropLabel"
  aria-hidden="true"
  data-bs-backdrop="static"
>
  <div class="modal-dialog modal-dialog-centered modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">Pick a Map</h1>
      </div>
      <div class="modal-body text-center">
        {#each Object.entries(_.groupBy( data.match.map_pools.map_pool_maps.filter( (map) => {
                if (!data.match.match_maps.some((matchMap) => matchMap.map_pool_map_id == map.id)) {
                  if (data.match.tiebreaker) {
                    return true;
                  }
                  return map.map_pool_map_mods[0].mods.id !== 12;
                }
                return false;
              } ), (map) => map.map_pool_map_mods[0].mod_id )).sort((a, b) => a[1][0].map_pool_map_mods[0].mods.order - b[1][0].map_pool_map_mods[0].mods.order) as [modId, maps]}
          <div class="bg-body-tertiary shadow rounded my-4 p-3">
            <div class="row d-flex align-items-stretch">
              {#each maps as map}
                <div class="col-12 col-md-2 d-flex">
                  <form
                    id={`map-${map.id}`}
                    action="?/pickMap"
                    method="post"
                    use:enhance
                    class="w-100"
                  >
                    <button
                      type="button"
                      class="position-relative rounded overflow-hidden w-100 h-100 border-0 p-0"
                      style="height: 160px; cursor: pointer;"
                      on:click={() =>
                        document.getElementById(`map-${map.id}`).submit()}
                    >
                      <img
                        class="img-fluid position-absolute top-0 start-0 w-100 h-100"
                        src="https://assets.ppy.sh/beatmaps/{map.maps.mapsets
                          .osu_id}/covers/cover@2x.jpg"
                        alt="Match map cover"
                        style="filter: blur(1px) brightness(50%); object-fit: cover; z-index: 0;"
                      />
                      <div
                        class="position-relative text-light p-2 d-flex flex-column justify-content-between"
                        style="z-index: 1; background: rgba(0, 0, 0, 0.5); height: 160px;"
                      >
                        <div>
                          <input type="hidden" name="map-id" value={map.id} />
                          <span class="fw-bold fs-4"
                            >{map.map_pool_map_mods[0].mods.code ||
                              "NM"}{map.mod_priority}</span
                          >
                        </div>
                        <div
                          class="d-flex flex-column justify-content-center align-items-center flex-grow-1"
                        >
                          <div
                            class="text-center"
                            style="font-size: 0.9rem; white-space: normal;"
                          >
                            {getShortenedMapName(map)}
                          </div>
                        </div>
                      </div>
                    </button>
                  </form>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<form action="?/roll" method="post" use:enhance>
  <div
    class="modal fade"
    id="rollModal"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">
            Waiting for all players to roll...
          </h1>
        </div>
        <div class="modal-body text-center">
          <div>
            <div class="d-flex align-items-center justify-content-around">
              <div class="d-flex flex-column align-items-center">
                <div
                  class="progress progress-bar-vertical mb-3 vertical-progress-bar"
                >
                  <div
                    class="progress-bar bg-primary"
                    role="progressbar"
                    style="height: {data.match.match_participants.filter(
                      (mp) =>
                        mp.participants.teams.team_members.filter(
                          (tm) =>
                            tm.user_profiles.user_id == data.session.user.id
                        )[0]
                    )[0].roll || 0}%;"
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {data.match.match_participants.filter(
                      (mp) =>
                        mp.participants.teams.team_members.filter(
                          (tm) =>
                            tm.user_profiles.user_id == data.session.user.id
                        )[0]
                    )[0].roll}
                  </div>
                </div>

                <input
                  type="hidden"
                  name="match-participant-id"
                  value={data.match.match_participants.filter(
                    (mp) =>
                      mp.participants.teams.team_members.filter(
                        (tm) => tm.user_profiles.user_id == data.session.user.id
                      )[0]
                  )[0].id}
                />
                <button
                  class="btn btn-lg btn-success"
                  class:disabled={data.match.match_participants.filter(
                    (mp) =>
                      mp.participants.teams.team_members.filter(
                        (tm) => tm.user_profiles.user_id == data.session.user.id
                      )[0]
                  )[0].roll}>Roll</button
                >
              </div>

              {#each data.match.match_participants.filter((mp) => mp.participants.teams.team_members.filter((tm) => tm.user_profiles.user_id != data.session.user.id)[0]) as participant}
                <div class="d-flex flex-column align-items-center">
                  <div
                    class="progress progress-bar-vertical mb-3 vertical-progress-bar"
                  >
                    <div
                      class="progress-bar bg-danger"
                      role="progressbar"
                      style="height: {participant.roll}%;"
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {participant.roll}
                    </div>
                  </div>

                  <h4>{participant.participants.teams.name}</h4>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</form>

<div
  class="modal fade"
  id="matchOverModal"
  tabindex="-1"
  aria-labelledby="staticBackdropLabel"
  aria-hidden="true"
  data-bs-backdrop="static"
>
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">Match Ended</h1>
      </div>
      <div class="modal-body text-center">
        <div class="d-flex justify-content-around align-items-center">
          <div>
            <img
              src={data.match.match_participants[0].participants.teams
                .picture_url}
              alt=""
              height="192"
              class="rounded-circle"
            />
            <h2>{data.match.match_participants[0].participants.teams.name}</h2>
          </div>
          <div>
            <h2>
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
            </h2>
          </div>
          <div>
            <img
              src={data.match.match_participants[1].participants.teams
                .picture_url}
              alt=""
              height="192"
              class="rounded-circle"
            />
            <h2>{data.match.match_participants[1].participants.teams.name}</h2>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <a href="/" on:click={async () => await activeModals.matchOver.hide()}>
          <button class="btn btn-success" data-bs-dismiss="modal">
            Back to Home
          </button>
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  .progress-bar-vertical {
    width: 50px;
    min-height: 200px;
    margin-right: 20px;
    float: left;
    display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6, BB7 */
    display: -ms-flexbox; /* TWEENER - IE 10 */
    display: -webkit-flex; /* NEW - Safari 6.1+. iOS 7.1+, BB10 */
    display: flex; /* NEW, Spec - Firefox, Chrome, Opera */
    align-items: flex-end;
    -webkit-align-items: flex-end; /* Safari 7.0+ */
  }

  .progress-bar-vertical .progress-bar {
    width: 100%;
    height: 0;
    -webkit-transition: height 0.6s ease;
    -o-transition: height 0.6s ease;
    transition: height 0.6s ease;
  }
</style>
