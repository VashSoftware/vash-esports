<script lang="ts">
  import { enhance } from "$app/forms";

  export let data;
</script>

<div class="row">
  <div class="col">
    <h1 class="py-5">
      Manage {#if data.event.event_groups}{data.event.event_groups?.name}{/if}
      {data.event.name}
    </h1>
  </div>
  <div class="col d-flex justify-content-around align-items-center w-100">
    <div><b>{data.event.participants.length}</b> Registrations</div>
    <div><b>$300</b> Prize pool</div>
    <div><b>03:10</b> Remaining</div>
  </div>
</div>
<div class="my-3">
  <h2 class="my-3">General</h2>
  <form method="post" action="?/updateEventSettings">
    <div class="mb-3">
      <label for="organisationSelect">Organisation</label>
      <select id="organisationSelect" name="name" class="form-select">
        {#each data.organisations as organisation}
          <option value={organisation.id}>{organisation.name}</option>
        {/each}
      </select>
    </div>

    <div class="mb-3">
      <label for="eventNameInput" class="form-label">Name</label>
      <input
        type="text"
        class="form-control"
        id="eventNameInput"
        aria-describedby="emailHelp"
        value={data.event.name}
        name="name"
      />
    </div>

    <div class="mb-3">
      <label for="startTimeInput" class="form-label">Start Time</label>
      <input
        id="startTimeInput"
        class="form-control"
        type="datetime-local"
        name="startTime"
        value={new Date(data.event.created_at).toISOString().substring(0, 16)}
      />
    </div>

    <div class="text-center">
      <button type="submit" class="btn btn-primary">Submit</button>
    </div>
  </form>
</div>

<div class="my-3">
  <h2 class="my-3">Rounds ({data.event.rounds.length})</h2>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Map Pool</th>
          <th>Best Of</th>
          <th>Bans per Team</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each data.event.rounds as round}
          <tr>
            <td>
              <input
                type="text"
                name="round-name"
                class="form-control"
                value={round.name}
              /></td
            >
            <td>
              <select class="form-select" name="map-pool-id">
                {#each data.mapPools as mapPool}
                  <option value={mapPool.id}>{mapPool.name}</option>
                {/each}
              </select></td
            >
            <td
              ><input
                class="form-control"
                type="number"
                name="round-best-of"
                min="1"
                max="999"
                value={round.best_of}
              />
            </td>
            <td>
              <input
                class="form-control"
                type="number"
                name="round-bans"
                min="0"
                max="9"
                value={round.match_player_bans}
              />
            </td>
            <td>
              <form action="?/deleteRound" method="post" use:enhance>
                <input type="hidden" name="round-id" value={round.id} />
                <button type="submit" class="btn btn-danger"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"
                    />
                  </svg>
                </button>
              </form></td
            >
          </tr>
        {/each}
        <tr>
          <td></td>
          <td> </td>
          <td></td>
          <td></td>
          <td>
            <form action="?/addRound" method="post" use:enhance>
              <button type="submit" class="btn btn-success">+</button>
            </form></td
          >
        </tr>
      </tbody>
    </table>
  </div>
</div>

<div class="my-3">
  <div class="row">
    <div class="col">
      <h2 class="my-3">Participants ({data.event.participants.length})</h2>
    </div>

    <div class="col text-end">
      <button class="btn btn-primary">Invite Teams</button>
    </div>
  </div>

  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Registered On</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each data.event.participants as participant}
          <tr>
            <td>{participant.teams.name}</td>
            <td>{new Date(participant.created_at).toLocaleString()}</td>
            <td>
              <form action="?/disqualifyParticipant" method="post" use:enhance>
                <input type="hidden" name="participant-id" value={participant.id}>
                
                <button
                  class="btn btn-danger"
                  disabled={participant.disqualified_at}>Disqualify</button
                >
              </form>
              <button class="btn btn-secondary">Manage</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<div class="my-3">
  <h2 class="my-3">Danger Zone</h2>

  <form action="?/changeVisibility" method="post">
    <button type="submit" class="btn btn-danger">
      {#if data.event.visibility === "public"}Make Private{:else}Make Public{/if}
    </button>
  </form>

  <form action="?/deleteEvent" method="post">
    <button type="submit" class="btn btn-danger">Delete Event</button>
  </form>
</div>
