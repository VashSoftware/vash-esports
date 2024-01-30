<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  export let data;
</script>

<div class="row py-5">
  <div class="col">
    <h1>{data.event.name}</h1>
  </div>

  <div class="col">
    <button
      class="btn btn-lg btn-primary"
      on:click={() => goto($page.url.pathname + "/register")}>Register</button
    >
    <button
      class="btn btn-secondary"
      on:click={() => goto($page.url.pathname + "/manage")}>Manage</button
    >
  </div>
</div>

<div class="py-2">
  <h2>Registrations ({data.event.participants.length})</h2>
  <div class="row">
    <div class="row row-cols-4">
      {#each data.event.participants as participant, i}
      <a href="/teams/{participant.teams.id}">
        <div class="card mb-3" style="max-width: 540px;">
          <div class="row g-0">
            <div class="col-md-4">
              <img src={data.participantIcons[i].data.publicUrl} class="img-fluid rounded-start" alt="Team Icon">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">{participant.teams.name}</h5>
                <ul>
                  {#each participant.teams.team_members as teamMember}
                    <li>{teamMember.user_profiles.name}</li>
                  {/each}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </a>  

      {/each}
    </div>
  </div>
</div>

<div class="py-2">
  <h2>Rounds</h2>
</div>
