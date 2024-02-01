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
<form method="post" action="/account?/logOut">
  <button type="submit" class="btn btn-danger">Log out</button>
</form>

<div>
  <h2>Organisations ({data.organisations.length})</h2>
  <a href="/organisations/create"
    ><button class="btn btn-primary">Create</button></a
  >
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
  <button
    class="btn btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#createTeamModal">Create</button
  >
</div>

{#each data.teams as team}
  <div>
    <a href={`/teams/${team.id}`}>
      {team.id}
    </a>

    <button class="btn btn-danger">Leave</button>
  </div>

  <a href="/teams/{team.id}">
    <div class="card mb-3" style="max-width: 540px;">
      <div class="row g-0">
        <div class="col-md-4">
          <img
            src='https://mdixwlzweijevgjmcsmt.supabase.co/storage/v1/object/public/team_icons/{team.id}'
            class="img-fluid rounded-start"
            alt="Team Icon"
          />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">{team.name}</h5>
          </div>
        </div>
      </div>
    </div>
  </a>
{/each}

<form method="post">
  <div class="modal fade" id="createTeamModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Create Team</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Modal body text goes here.</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal">Close</button
          >
          <button type="button" class="btn btn-primary">Create</button>
        </div>
      </div>
    </div>
  </div>
</form>

<h2>Purchases (0)</h2>
