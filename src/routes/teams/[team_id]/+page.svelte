<script lang="ts">
  export let data;
</script>

<div class="py-5 row">
  <div class="col">
    <h1>{data.team.name}</h1>
  </div>

  <div class="col text-end">
    <div class="col">
      <form method="post">
        <button class="btn btn-primary" type="submit">Request to Join</button>
      </form>
    </div>

    <a
      class="col btn btn-secondary"
      href="/teams/{data.team.id}/manage"
      role="button">Manage</a
    >
  </div>
</div>

<h2>Team Members</h2>
<ul>
  {#each data.team.team_members as teamMember}
    <li>{teamMember.user_profiles.name}</li>
  {/each}
</ul>

<h2>Events</h2>
<ul>
  {#each data.team.participants as participation}
    <li>
      <a href="/events/{participation.events.id}">{participation.events.name}</a>
    </li>
  {/each}
</ul>
