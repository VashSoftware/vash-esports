<script lang="ts">
  export let data;
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
      <div class="col text-end">
        <a
          class="btn btn-primary"
          href="https://twitch.tv/ces_live"
          role="button"
          style="background-color: #6441a5; border: 2px solid #6441a5;"
          >Watch on Twitch</a
        >
      </div>
    </div>

    <div class="row align-items-center">
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
      </div>
      <div class="col text-center">
        {#if data.match.ongoing}
          <b class="text-danger">(LIVE)</b>
        {/if}
        <h1>
          {data.match.match_participants[0].points} - {data.match
            .match_participants[1].points}
        </h1>
      </div>
      <div class="col text-end">
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
      </div>
    </div>
  </div>
</div>

<!-- <h2>Votes</h2>
Team 1: 90%
Team 2: 10% -->

<div class="text-center"><h2>Maps</h2></div>

{#each data.match.match_maps as map}
  <div class="row py-1 align-items-center">
    <div class="col text-end">
      <h3>{map.scores[0]?.score.toLocaleString()}</h3>
    </div>
    <div class="col">
      <div style="position: relative;">
        <div class="text-center">
          <img
            class="img-thumbnail w-100 img-fluid"
            src="https://assets.ppy.sh/beatmaps/2124033/covers/cover@2x.jpg"
            alt="Match map cover"
            style="filter: blur(1px); height: 60px; object-fit: cover"
          />
        </div>
        <div
          class="text-center row align-items-center"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; text-shadow: 2px 2px 4px #000000;"
        >
          <div class="col">
            <div>
              {map.maps.mapsets.artist} - {map.maps.mapsets.title} [{map.maps
                .difficulty_name}]
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
