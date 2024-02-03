<script lang="ts">
  import { enhance } from "$app/forms";

  export let data;

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

<div class="py-5">
  <div>
    <div class="row text-center">
      <div class="col"></div>
      <div class="col">
        <a href="/events/{data.match.rounds.events.id}">
          <h2>{data.match.rounds.events.name}</h2></a
        >
        <h3>Grand Finals</h3>
      </div>
      <div class="col text-center">
        <a
          class="btn btn-primary"
          href="https://twitch.tv/ces_live"
          role="button"
          style="background-color: #6441a5; border: 2px solid #6441a5;"
          >Watch on Twitch</a
        >
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
    <form method="post" use:enhance>
      <input
        type="hidden"
        name="participantId"
        value={data.match.match_participants[0].participants.id}
      />
      <button
        type="submit"
        class="btn btn-primary btn-lg"
        disabled={data.match.match_predictions.filter((prediction) => prediction.user_id === data.user.id).length > 0}
        >Vote for {data.match.match_participants[0].participants.teams
          .name}</button
      >
    </form>
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
      <form method="post" use:enhance>
        <input
          type="hidden"
          name="participantId"
          value={data.match.match_participants[1].participants.id}
        />
        <button type="submit" class="btn btn-danger btn-lg" disabled={data.match.match_predictions.filter((prediction) => prediction.user_id === data.user.id).length > 0}
          >Vote for {data.match.match_participants[1].participants.teams
            .name}</button
        >
      </form>
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
            src="https://assets.ppy.sh/beatmaps/{map.maps.mapsets
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
                >{map.maps.mapsets.artist} - {map.maps.mapsets.title} [{map.maps
                  .difficulty_name}]</b
              >
            </div>

            <div>
              {map.maps.star_rating}★ - {map.maps.mapsets.bpm}BPM
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col"><h3>{map.scores[1]?.score.toLocaleString()}</h3></div>
  </div>
{/each}
