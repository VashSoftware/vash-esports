<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  export let data;
</script>

<div class="row py-5">
  <div class="col">
    <h1>{data.event.name}</h1>
  </div>

  <div class="col text-end">
    <button
      class="btn btn-lg btn-primary"
      on:click={() => goto($page.url.pathname + "/register")}>Register</button
    >
    <button
      class="btn btn-lg btn-secondary"
      on:click={() => goto($page.url.pathname + "/manage")}>Manage</button
    >
  </div>
</div>

<h2>Information</h2>
<div class="row">
  <div class="col">
    <p>{data.event.description}</p>
  </div>
</div>

<h2>Participants ({data.event.participants.length})</h2>
<div class="row">
  <div class="row row-cols-4">
    {#each data.event.participants as participant, i}
      <a href="/teams/{participant.teams.id}">
        <div class="card mb-3" style="max-width: 540px;">
          <div class="row g-0">
            <div class="col-md-4">
              <img
                src={data.participantIcons[i].data.publicUrl}
                class="img-fluid rounded-start"
                alt="Team Icon"
              />
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

<h2>Matches</h2>
{#each data.event.rounds as round}
<div class="table-responsive">
  <table class="table table-hover">
    <thead>
      <tr>
        <th>Team 1</th>
        <th>Team 2</th>
        <th>Start Time</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each round.matches as match}
        <tr role="button" on:click={() =>
          goto(`/matches/${match.id}`)}>
          <td>{match.match_participants[0].participants.teams.name}</td>
          <td>{match.match_participants[1].participants.teams.name}</td>
          <!-- TODO: Turn start time into a countdown when within 24 hours and show date on hover tooltip -->
          <td>{new Date(match.start_time).toLocaleString()}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
{/each}