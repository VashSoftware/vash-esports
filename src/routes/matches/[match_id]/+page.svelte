<script lang="ts">
  import { enhance } from "$app/forms";

  export let data;

  const getMatch = async () => {
    let updatedMatch = await data.supabase
      .from("matches")
      .select(
        `*,
      rounds ( best_of, events (id, name, event_links(*, platforms(*)), event_groups(*))),
      match_participants(participants(id, teams(id, name, team_members(*, user_profiles(*))))),
      match_maps(map_pool_maps(*, map_pool_map_mods(*, mods(*)), maps(*, mapsets(*))), scores(*)),
      match_predictions(*, user_profiles(*))`
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

  $: participant1Predictions = data.match.match_predictions.filter(
    (prediction) =>
      prediction.winning_participant_id ===
      data.match.match_participants[0].participants.id
  ).length;

  $: participant2Predictions = data.match.match_predictions.filter(
    (prediction) =>
      prediction.winning_participant_id ===
      data.match.match_participants[1].participants.id
  ).length;

  $: participant1PredictionPercentage =
    (participant1Predictions /
      (participant1Predictions + participant2Predictions)) *
    100;

  $: participant2PredictionPercentage =
    (participant2Predictions /
      (participant1Predictions + participant2Predictions)) *
    100;

  function getMatchParticipant(index: number) {
    if (data.match.type == "event") {
      return data.match.match_participants[index].participants.teams;
    } else {
      return data.match.match_participants[index].participants.teams
        .team_members[0].user_profiles;
    }
  }
</script>

<svelte:head>
  <title
    >{data.match.match_participants[0].participants.teams.name} - {data.match
      .match_participants[1].participants.teams.name} | Vash Esports</title
  >
</svelte:head>

{#if data.match.ongoing || new Date(data.match.start_time) > new Date() || data.match.type == "event"}
  <div class="row align-items-center mt-5">
    {#if data.match.type == "event"}
      <div class="col"></div>
      <div class="col">
        <div class="text-center">
          <a href="/events/{data.match.rounds.events.id}">
            <h2>
              {#if data.match.rounds.events.event_groups}{data.match.rounds
                  .events.event_groups.name}
              {/if}

              {data.match.rounds.events.name}
            </h2></a
          >
          <h3>Grand Finals</h3>
        </div>
      </div>
    {/if}
    <div class="col d-flex justify-content-end gap-3">
      {#if data.match.ongoing}<a
          href="/matches/{data.match.id}/play"
          class="btn btn-primary">Play</a
        >{/if}
      {#if new Date(data.match.start_time) > new Date()}
        <form action="?/addToCalendar" method="post">
          <button type="submit" class="btn btn-secondary"
            >Add to Calendar</button
          >
        </form>
      {/if}
    </div>
  </div>
{/if}

<div class="row py-5">
  <div class="col-8">
    <iframe
      src="https://player.twitch.tv/?channel={data.match.rounds.events.event_links.filter(
        (event_link) => event_link.platforms.name == 'Twitch'
      )[0]?.link_param}&parent={data.hostname}"
      class="w-100 rounded"
      height="525"
      frameborder="0"
      scrolling="no"
      allowfullscreen={true}
      title="Twitch Player Embed"
    >
    </iframe>
  </div>
  <div class="col">
    <iframe
      src="https://www.twitch.tv/embed/{data.match.rounds.events.event_links.filter(
        (event_link) => event_link.platforms.name == 'Twitch'
      )[0]?.link_param}/chat?parent={data.hostname}"
      height="525"
      width="350"
      class="w-100 rounded"
      title="Twitch Chat Embed"
    >
    </iframe>
  </div>
</div>

<div class="row align-items-center text-center">
  <div class="col">
    <a href="/teams/{getMatchParticipant(0).id}">
      {#if data.match.type == "event"}
        <img
          src={data.match.match_participants[0].participants.teams.picture_url}
          height="256"
          alt="Team Icon"
          class="w-8 h-8 mr-2 rounded"
        />
      {:else}
        <img
          src={data.match.match_participants[0].participants.teams
            .team_members[0].user_profiles.picture_url}
          height="256"
          alt="User Icon"
          class="w-8 h-8 mr-2 rounded-circle"
        />{/if}
      <h2 class="my-3">{getMatchParticipant(0).name}</h2>
    </a>

    {#if data.match.type == "event"}
      <h2>Team Members</h2>
      <ul class="list-group">
        {#each data.match.match_participants[0].participants.teams.team_members as teamMember}
          <li class="list-group-item">{teamMember.user_profiles.name}</li>
        {/each}
      </ul>
    {/if}
  </div>
  <div class="col text-center">
    <p class="fs-5">Best of: {data.match.rounds.best_of}</p>
    {#if data.match.ongoing}
      <b class="text-danger">(LIVE)</b>
    {/if}
    <h1>
      {data.match.match_maps.filter(
        (match_map) => match_map.scores[0]?.score > match_map.scores[1]?.score
      ).length} - {data.match.match_maps.filter(
        (match_map) => match_map.scores[1]?.score > match_map.scores[0]?.score
      ).length}
    </h1>
  </div>
  <div class="col">
    <a href="/teams/{getMatchParticipant(1).id}">
      {#if data.match.type == "event"}
        <img
          src={data.match.match_participants[1].participants.teams.picture_url}
          height="256"
          alt="Team Icon"
          class="w-8 h-8 mr-2 rounded"
        />
      {:else}
        <img
          src={data.match.match_participants[1].participants.teams
            .team_members[0].user_profiles.picture_url}
          height="256"
          alt="User Icon"
          class="w-8 h-8 mr-2 rounded-circle"
        />{/if}
      <h2 class="my-3">{getMatchParticipant(1).name}</h2></a
    >

    {#if data.match.type == "event"}
      <h2>Team Members</h2>
      <ul class="list-group">
        {#each data.match.match_participants[1].participants.teams.team_members as teamMember}
          <li class="list-group-item">{teamMember.user_profiles.name}</li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

{#if !data.match.winner_participant_id}
  <div class="my-5 text-center">
    <h2 class="mb-3">Predictions</h2>

    <div class="row">
      <div class="col text-center">
        {#if data.session}
          <form action="?/addPrediction" method="post" use:enhance>
            <input
              type="hidden"
              name="participantId"
              value={data.match.match_participants[0].participants.id}
            />
            <button
              type="submit"
              class="btn btn-primary btn-lg"
              disabled={data.match.match_predictions.filter(
                (prediction) =>
                  prediction.user_profiles.user_id === data.session.user.id
              ).length > 0}
              >Vote for {data.match.match_participants[0].participants.teams
                .name}</button
            >
          </form>
        {/if}
      </div>
      <div class="col">
        <div class="progress-stacked" style="height: 48px">
          <div
            class="progress"
            role="progressbar"
            aria-label="Segment one"
            aria-valuenow="90"
            aria-valuemin="0"
            aria-valuemax="100"
            style="width: {participant1PredictionPercentage ||
              0}%; height: 50px"
          >
            <div class="progress-bar fs-5">
              <b
                >{participant1Predictions} ({participant1PredictionPercentage.toFixed(
                  1
                )}%)</b
              >
            </div>
          </div>
          <div
            class="progress"
            role="progressbar"
            aria-label="Segment two"
            aria-valuenow="10"
            aria-valuemin="0"
            aria-valuemax="100"
            style="width:{participant2PredictionPercentage || 0}%; height: 50px"
          >
            <div class="progress-bar bg-danger fs-5">
              <b
                >{participant2Predictions} ({participant2PredictionPercentage.toFixed(
                  1
                )}%)</b
              >
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="col">
          {#if data.session}
            <form action="?/addPrediction" method="post" use:enhance>
              <input
                type="hidden"
                name="participantId"
                value={data.match.match_participants[1].participants.id}
              />
              <button
                type="submit"
                class="btn btn-danger btn-lg"
                disabled={data.match.match_predictions.filter(
                  (prediction) =>
                    prediction.user_profiles.user_id === data.session.user.id
                ).length > 0}
                >Vote for {data.match.match_participants[1].participants.teams
                  .name}</button
              >
            </form>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<div class="text-center mb-5">
  <h2 class="mb-4">Maps Played ({data.match.match_maps.length})</h2>
  {#each data.match.match_maps as map}
    <div class="row my-1 align-items-center">
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
            <div class="col d-flex justify-content-between align-items-center">
              <div class="ms-5">
                <span class="fs-5 badge rounded-pill text-bg-light"
                  >{map.map_pool_maps.map_pool_map_mods[0].mods.code || "NM"}
                  {map.map_pool_maps.mod_priority}</span
                >
              </div>
              <div>
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
              <div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col text-start">
        <h3>{map.scores[1]?.score.toLocaleString()}</h3>
      </div>
    </div>
  {/each}
</div>
