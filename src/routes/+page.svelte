<script lang="ts">
  import { goto } from "$app/navigation";

  export let data;
</script>

<div class="text-center py-5">
  <h1><b>Vash Esports</b></h1>
  <h3>Next-Gen Esports Platform</h3>
</div>

<div class="py-4">
  <div class="text-center">
    <h3>Ongoing Matches</h3>
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
            on:click={() =>
              goto(`/matches/${match.id}`)}
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
            <td class="text-center">{match.match_participants[0].points}</td>
            <td class="text-center">-</td>
            <td class="text-center">{match.match_participants[1].points}</td>
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
    <a class="text-body" href="/events"><h3><u>Ongoing events</u></h3></a>
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
          <tr
            role="button"
            class="align-self-center"
          >
            <td><a href="/events/{event.id}">{event.organisations?.name}</a></td
            >
            <td><a href="/events/{event.id}">{event.name}</a></td>
            <td
              ><a href="/events/{event.id}">
                {event.participants.length}
                {#if event.max_participants}
                  / {event.max_participants}{/if}</a
              ></td
            >

            <td class="align-middle text-end">
              <button
                class="btn btn-primary"
                disabled={event.participants.length < event.max_participants}
                data-bs-toggle="modal"
                data-bs-target="#registerEventModal">Register</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<!-- Modal -->
<div
  class="modal fade"
  id="registerEventModal"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">...</div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >Close</button
        >
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
