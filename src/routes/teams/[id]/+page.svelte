<script lang="ts">
  export let data;
</script>

<div class="py-5 row">
  <div class="col">
    <h1>{data.team.name}</h1>
  </div>

  <div class="col text-end">
    <a
      class="col btn btn-primary"
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
