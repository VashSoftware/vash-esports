<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  export let data;
</script>

<div class="row pb-5" style="position: relative;">
  <img
    src={data.eventBanner.data.publicUrl}
    alt="Match map cover"
    style="filter: blur(2px); object-fit: cover"
  />

  <div
    class="row align-items-center"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; text-shadow: 0 0 16px #000000;"
  >
    <div class="col mx-5">
      <h4><a href="/organisations/{data.event.organisations.id}">{data.event.organisations.name}</a></h4>
      <h1>{data.event.name}</h1>
    </div>

    <div class="col text-end">
      <button
        class="btn btn-lg btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#registerModal">Register</button
      >
      <button
        class="btn btn-lg btn-secondary"
        on:click={() => goto($page.url.pathname + "/manage")}>Manage</button
      >
    </div>
  </div>
</div>

<div class="my-3">
  <h2>Information</h2>
  <div class="row row-cols-4">
    <div class="col">
      <div class="card mb-3">
        <div class="row g-0">
          <div
            class="col-md-3 d-flex align-items-center justify-content-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="3em"
              height="3em"
              viewBox="0 0 24 24"
              {...$$props}
            >
              <path
                fill="currentColor"
                d="M2 2v2h5v4H2v2h5c1.11 0 2-.89 2-2V7h5v10H9v-1c0-1.11-.89-2-2-2H2v2h5v4H2v2h5c1.11 0 2-.89 2-2v-1h5c1.11 0 2-.89 2-2v-4h6v-2h-6V7c0-1.11-.89-2-2-2H9V4c0-1.11-.89-2-2-2z"
              />
            </svg>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h6 class="card-title">Bracket Type</h6>
              <h5 class="card-text">Double Elimination</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card mb-3">
        <div class="row g-0">
          <div
            class="col-md-3 d-flex align-items-center justify-content-center"
          >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="3em"
            height="3em"
            viewBox="0 0 24 24"
            {...$$props}
            >
              <path
                fill="currentColor"
                d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8"
              />
              <path
                fill="currentColor"
                d="M12 11c-2 0-2-.63-2-1s.7-1 2-1s1.39.64 1.4 1h2A3 3 0 0 0 13 7.12V6h-2v1.09C9 7.42 8 8.71 8 10c0 1.12.52 3 4 3c2 0 2 .68 2 1s-.62 1-2 1c-1.84 0-2-.86-2-1H8c0 .92.66 2.55 3 2.92V18h2v-1.08c2-.34 3-1.63 3-2.92c0-1.12-.52-3-4-3"
              />
            </svg>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h6 class="card-title">Entry Fee</h6>
              <h5 class="card-text">$1.99</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card mb-3">
        <div class="row g-0">
          <div
            class="col-md-3 d-flex align-items-center justify-content-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="3em"
              height="3em"
              viewBox="0 0 24 24"
              {...$$props}
            >
              <path
                fill="currentColor"
                d="M2 2v2h5v4H2v2h5c1.11 0 2-.89 2-2V7h5v10H9v-1c0-1.11-.89-2-2-2H2v2h5v4H2v2h5c1.11 0 2-.89 2-2v-1h5c1.11 0 2-.89 2-2v-4h6v-2h-6V7c0-1.11-.89-2-2-2H9V4c0-1.11-.89-2-2-2z"
              />
            </svg>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h6 class="card-title">Max Team Size</h6>
              <h5 class="card-text">1</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card mb-3">
        <div class="row g-0">
          <div
            class="col-md-3 d-flex align-items-center justify-content-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="3em"
              height="3em"
              viewBox="0 0 24 24"
              {...$$props}
            >
              <path
                fill="currentColor"
                d="M2 2v2h5v4H2v2h5c1.11 0 2-.89 2-2V7h5v10H9v-1c0-1.11-.89-2-2-2H2v2h5v4H2v2h5c1.11 0 2-.89 2-2v-1h5c1.11 0 2-.89 2-2v-4h6v-2h-6V7c0-1.11-.89-2-2-2H9V4c0-1.11-.89-2-2-2z"
              />
            </svg>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h6 class="card-title">Max Registrations</h6>
              <h5 class="card-text">∞</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card mb-3">
        <div class="row g-0">
          <div
            class="col-md-3 d-flex align-items-center justify-content-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="3em"
              height="3em"
              viewBox="0 0 24 24"
              {...$$props}
            >
              <path
                fill="currentColor"
                d="M2 2v2h5v4H2v2h5c1.11 0 2-.89 2-2V7h5v10H9v-1c0-1.11-.89-2-2-2H2v2h5v4H2v2h5c1.11 0 2-.89 2-2v-1h5c1.11 0 2-.89 2-2v-4h6v-2h-6V7c0-1.11-.89-2-2-2H9V4c0-1.11-.89-2-2-2z"
              />
            </svg>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h6 class="card-title">osu! Version</h6>
              <h5 class="card-text">Stable</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="my-3">
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
                  {#each participant.teams.team_members as teamMember}
                    <span class="badge rounded-pill text-bg-secondary mx-3"
                      >{teamMember.user_profiles.name}</span
                    >
                  {/each}
                </div>
              </div>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</div>

<div class="my-3">
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
            <tr role="button" on:click={() => goto(`/matches/${match.id}`)}>
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
</div>
