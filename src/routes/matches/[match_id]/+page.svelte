<script lang="ts">
  export let data;
</script>

<div class="py-5">
  <div>
    <div class="text-center">
      <a href="/events/{data.match.rounds.events.id}">
        <h2>{data.match.rounds.events.name}</h2></a
      >
      <h3>Grand Finals</h3>
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
        <h1>{data.match.match_participants[0].points} - {data.match.match_participants[1].points}</h1>
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

<h2>Maps</h2>
<div class="table-responsive">
  <table class="table">
    <thead>
      <tr>
        <th>#</th>
        <th>Artist - Name [Difficulty]</th>
        <th>Star Rating</th>
        <th>BPM</th>
      </tr>
    </thead>
    <tbody>
      {#each data.match.match_maps as map, i}
      <tr class="">
        <td>{i + 1}</td>
        <td>{map.maps.mapsets.artist} - {map.maps.mapsets.title} [{map.maps.difficulty_name}]</td>
        <td>{map.maps.star_rating}</td>
        <td>{map.maps.mapsets.bpm}</td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>
