<script lang="ts">
  import { goto } from '$app/navigation';

  export let data;
</script>

<div class="py-5 text-center">
  <h1>Leaderboard</h1>

  <div class="btn-group" role="group" aria-label="Basic example">
    <button type="button" class="btn btn-primary">Users</button>
    <button type="button" class="btn btn-primary">Teams</button>
  </div>
</div>

<table class="table table-hover">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Matches Played</th>
      <th scope="col">Rating</th>
    </tr>
  </thead>
  <tbody>
    {#each data.teams as team}
      <tr
      role="button"
      on:click={() => goto(`/teams/${team.id}`)}>
        <td>{team.name}</td>
        <td>{team.participated}</td>
        <td>{1000 || team.rating}</td>
      </tr>
    {/each}
  </tbody>
</table>
