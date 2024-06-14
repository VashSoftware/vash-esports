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
      match_maps(map_pool_maps(maps(*, mapsets(*))), scores(*)),
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
</script>

<svelte:head>
  <title
    >{data.match.match_participants[0].participants.teams.name} - {data.match
      .match_participants[1].participants.teams.name} | Vash Esports</title
  >
</svelte:head>

<div class="py-5">
  <div>
    <div class="row align-items-center">
      <div class="col"></div>
      <div class="col">
        <div class="text-center">
          <a href="/events/{data.match.rounds.events.id}">
            <h2>
              {#if data.match.rounds.events.event_groups}{data.match.rounds
                  .events.event_groups.name}
              {/if}{data.match.rounds.events.name}
            </h2></a
          >
          <h3>Grand Finals</h3>
        </div>
      </div>
      <div class="col d-flex justify-content-end gap-3">
        <a href="/matches/{data.match.id}/play" class="btn btn-primary">Play</a>
        <form action="?/addToCalendar" method="post">
          <button type="submit" class="btn btn-secondary"
            >Add to Calendar</button
          >
        </form>
      </div>
    </div>

    <div class="row py-5">
      <div class="col-8">
        <iframe
          src="https://player.twitch.tv/?channel={data.match.rounds.events.event_links.filter(
            (event_link) => event_link.platforms.id == 4
          )[0]?.link_param}&parent={data.hostname}"
          class="w-100 rounded"
          height="525"
          frameborder="0"
          scrolling="no"
          allowfullscreen={true}
          title="Twitch Embed"
        >
        </iframe>
      </div>
      <div class="col">
        <h2>Live Chat</h2>

        {#each [1, 2, 3, 4, 5] as message}
          <div class="py-1">
            <b>Username:</b>
            {message}
          </div>
        {/each}
        <div>
          <input type="text" class="form-control" placeholder="Chat" />
          <button class="btn btn-primary">Send</button>
        </div>
      </div>
    </div>

    <div class="row align-items-center text-center">
      <div class="col">
        <a
          href="/teams/{data.match.match_participants[0].participants.teams.id}"
        >
          <img
            src="https://mdixwlzweijevgjmcsmt.supabase.co/storage/v1/object/public/team_icons/{data
              .match.match_participants[0].participants.teams.id}"
            height="256"
            alt="Team Icon"
            class="w-8 h-8 mr-2"
          />
          <h2>{data.match.match_participants[0].participants.teams.name}</h2>
        </a>

        <h2>Team Members</h2>
        <ul class="list-group">
          {#each data.match.match_participants[0].participants.teams.team_members as teamMember}
            <li class="list-group-item">{teamMember.user_profiles.name}</li>
          {/each}
        </ul>
      </div>
      <div class="col text-center">
        {#if data.match.ongoing}
          <b class="text-danger">(LIVE)</b>
        {/if}
        <h1>
          {data.match.match_maps.filter(
            (match_map) =>
              match_map.scores[0]?.score > match_map.scores[1]?.score
          ).length} - {data.match.match_maps.filter(
            (match_map) =>
              match_map.scores[1]?.score > match_map.scores[0]?.score
          ).length}
        </h1>
      </div>
      <div class="col">
        <a
          href="/teams/{data.match.match_participants[1].participants.teams.id}"
        >
          <img
            src="https://mdixwlzweijevgjmcsmt.supabase.co/storage/v1/object/public/team_icons/{data
              .match.match_participants[1].participants.teams.id}"
            height="256"
            alt="Team Icon"
            class="w-8 h-8 mr-2"
          />
          <h2>{data.match.match_participants[1].participants.teams.name}</h2></a
        >

        <h2>Team Members</h2>
        <ul class="list-group">
          {#each data.match.match_participants[1].participants.teams.team_members as teamMember}
            <li class="list-group-item">{teamMember.user_profiles.name}</li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</div>

<div class="py-3 text-center">
  <div><h2>Community Predictions</h2></div>
</div>

<div class="row">
  <div class="col text-end">
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
        style="width: {participant1PredictionPercentage}%; height: 50px"
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
        style="width:{participant2PredictionPercentage}%; height: 50px"
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

<div class="text-center py-3"><h2>Maps</h2></div>
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
            src="https://assets.ppy.sh/beatmaps/{map.map_pool_maps.maps.mapsets
              .osu_id}/covers/cover@2x.jpg"
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
                >{map.map_pool_maps.maps.mapsets.artist} - {map.map_pool_maps
                  .maps.mapsets.title} [{map.maps.difficulty_name}]</b
              >
            </div>

            <div>
              {map.map_pool_maps.maps.star_rating}★ - {map.map_pool_maps.maps
                .mapsets.bpm}BPM
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col"><h3>{map.scores[1]?.score.toLocaleString()}</h3></div>
  </div>
{/each}
