<script lang="ts">
  import { enhance } from "$app/forms";

  export let data;
</script>

<h1 class="py-5">Manage {data.event.name}</h1>

<div class="my-3">
  <h2>General</h2>
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
  <h2>Rounds ({data.event.rounds.length})</h2>
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
            <td> {round.name}</td>
            <td>
              <select class="form-select" name="map-pool-id">
                {#each data.mapPools as mapPool}
                  <option value={mapPool.id}>{mapPool.name}</option>
                {/each}
              </select></td
            >
            <td>{round.best_of}</td>
            <td>{round.match_player_bans}</td>
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
      <h2>Participants ({data.event.participants.length})</h2>
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
              <button class="btn btn-danger">Disqualify</button>
              <button class="btn btn-secondary">Manage</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
