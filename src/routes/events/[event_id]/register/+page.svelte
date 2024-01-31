<script lang="ts">
  export let data;
</script>

<div class="text-center py-5">
  <h1>Register for osu! Advanced 2024</h1>
</div>

<form method="POST">
  <div class="text-center">
    Team:
    <select name="team-id">
      {#each data.teamMembers as team}
        <option value={team.teams.id}>{team.teams.name}</option>
      {/each}
    </select>

    <button type="submit" class="btn btn-primary">Register</button>
  </div>
</form>
