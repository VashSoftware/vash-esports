<script lang="ts">
  import { goto } from '$app/navigation';

  export let data;
</script>

<div class="py-5">
  <h1>Matches</h1>
</div>

<h2>January 1, 2024</h2>
<div class="table-responsive">
  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">Event</th>
        <th scope="col">Team 1</th>
        <th scope="col">Team 2</th>
      </tr>
    </thead>
    <tbody>
      {#each data.matches as match}
        <tr role="button" on:click={() => goto(`/matches/${match.id}`)}>
          <td>{match.rounds.events.name}</td>
          <td>{match.match_participants[0].participants.teams.name}</td>
          <td>{match.match_participants[1].participants.teams.name}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
