<script lang="ts">
  export let data;
</script>

<div class="py-5">
  <div class="row">
    <div class="col">
      <a href="/events/{data.match.rounds.events.id}">
        <h2>{data.match.rounds.events.name}</h2></a
      >
      <h3>Grand Finals</h3>
      <h1>
        {data.match.participant1.teams.name}
        {data.match.participant2.teams.name}
      </h1>
    </div>

    <div class="col">5-3</div>
  </div>
</div>

<h1>Maps</h1>
{#each [1,2,3,4,5] as map}
hello
{/each}