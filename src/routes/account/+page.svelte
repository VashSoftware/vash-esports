<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<h1>Account</h1>

Email: stan@stanrunge.dev<button class="btn btn-danger">Change email</button>
<button class="btn btn-danger">Change password</button>

<a href="staff">
  <button class="btn btn-primary">Staff page</button>
</a>
<form method="POST">
  <button type="submit" class="btn btn-danger">Log out</button>
</form>

<div>
  <h2>Organisations ({data.organisations.length})</h2>
  <a href="/organisations/create"><button class="btn btn-primary">Create</button></a>
</div>

<ul>
  {#each data.organisations as organisation}
    <li>
      <div>
        {organisation}
        <button class="btn btn-danger">Leave</button>
      </div>
    </li>
  {/each}
</ul>

<div>
  <h2>Teams ({data.teams.length})</h2>
  <a href="/teams/create"><button class="btn btn-primary">Create</button></a>
</div>

<ul>
  {#each data.teams as team}
    <li>
      <div>
        <a href={`/teams/${team.id}`}>
          {team.id}
        </a>

        <button class="btn btn-danger">Leave</button>
      </div>
    </li>
  {/each}
</ul>

<h2>Purchases (0)</h2>
