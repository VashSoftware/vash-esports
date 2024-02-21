<script lang="ts">
  import { goto } from "$app/navigation";

  export let data;

  let selectedEvent;
</script>

<svelte:head>
  <title>Vash Esports</title>
</svelte:head>

<div class="text-center py-5">
  <h1><b>Vash Esports</b></h1>
  <h3>The best way to play in osu! tournaments.</h3>
</div>

<div class="py-4">
  <div class="text-center">
    <h3><a class="text-body" href="/matches">Ongoing Matches</a></h3>
  </div>
  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Event</th>
          <th>Round</th>
          <th class="text-center">Team 1</th>
          <th class="text-center" colspan="3">Score</th>
          <th class="text-center">Team 2</th>
          <th class="text-center">Spectators</th>
        </tr>
      </thead>
      <tbody>
        {#each data.matches as match}
          <tr
            role="button"
            class="align-self-center"
            on:click={() => goto(`/matches/${match.id}`)}
          >
            <td>{match.rounds.events.name}</td>
            <td
              >{match.rounds.name}
              {#if match.max_participants}
                / {match.max_participants}{/if}</td
            >
            <td class="text-center"
              >{match.match_participants[0].participants.teams.name}</td
            >
            <td class="text-center"
              >{match.match_maps.filter(
                (match_map) =>
                  match_map.scores[0]?.score > match_map.scores[1]?.score
              ).length}</td
            >
            <td class="text-center">-</td>
            <td class="text-center"
              >{match.match_maps.filter(
                (match_map) =>
                  match_map.scores[1]?.score > match_map.scores[0]?.score
              ).length}</td
            >
            <td class="text-center"
              >{match.match_participants[1].participants.teams.name}</td
            >
            <td class="text-center">{match.spectators[0].count}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<div class="py-4">
  <div class="text-center">
    <h3><a class="text-body" href="/events"><u>Ongoing events</u></a></h3>
  </div>
  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Host</th>
          <th>Name</th>
          <th>Registations</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each data.events as event}
          <tr role="button" class="align-self-center">
            <td on:click={() => goto(`/events/${event.id}`)}
              >{event.organisations?.name}</td
            >
            <td on:click={() => goto(`/events/${event.id}`)}>{event.name}</td>
            <td on:click={() => goto(`/events/${event.id}`)}>
              {event.participants.length}
              {#if event.max_participants}
                / {event.max_participants}{/if}</td
            >

            <td class="align-middle text-end">
              <button
                class="btn btn-primary"
                disabled={event.participants.length < event.max_participants}
                data-bs-toggle="modal"
                data-bs-target="#registerEventModal"
                on:click={() => (selectedEvent = event)}>Register</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<!-- Modal -->
<form action="?/register" method="post">
  <div
    class="modal fade"
    id="registerEventModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Register for {selectedEvent?.name}
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div
          class="modal-body text-center d-flex justify-content-center align-items-center gap-3"
        >
          <input type="hidden" name="event-id" value={selectedEvent?.id} />

          <label for="team-id">Team</label>
          <select style="max-width: 15em;" class="form-select" name="team-id"
            >{#each data.teams as team}
              <option value={team.id}>{team.name}</option>
            {/each}
          </select>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal">Close</button
          >
          <button type="submit" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</form>
