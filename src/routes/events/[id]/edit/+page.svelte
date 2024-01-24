<script lang="ts">
  export let data;
</script>

<h1>Event</h1>

<form method="POST">
  <label>
    Name:
    <input type="text" name="name" />
  </label>
</form>

- Rules

<h2>Rounds ({data.rounds.length})</h2>
<ul>
  {#each data.rounds as round}
    <li>
      {round.id}
    </li>
  {/each}
</ul>

<h2>Registrations ({data.registrations.length})</h2>
<ul>
  {#each data.registrations as registration}
    <li>
      {registration.id}
    </li>
  {/each}
</ul>