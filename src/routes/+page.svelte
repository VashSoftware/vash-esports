<script lang="ts">
  import { goto } from "$app/navigation";

  export let data;
</script>

<div class="text-center py-5">
  <h1><b>Vash Esports</b></h1>
  <p>Next-Gen osu! Events</p>
</div>

<div class="py-4">
  <div class="text-center">
    <h3><u>Ongoing Matches</u></h3>
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
            on:click={() => goto(`/events/${match.rounds.events.id}/matches/${match.id}`)}
          >
            <td>{match.rounds.events.name}</td>
            <td
              >{match.rounds.name}
              {#if match.max_participants}
                / {match.max_participants}{/if}</td
            >
            <td class="text-center">{match.participants.teams.name}</td>
            <td class="text-center">5</td>
            <td class="text-center">-</td>
            <td class="text-center">3</td>
            <td class="text-center">{match.participants.teams.name}</td>
            <td class="text-center">727</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<div class="py-4">
  <div class="text-center">
    <a href="/events"><h3><u>Current events</u></h3></a>
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
            on:click={() => goto(`/events/${event.id}`)}
          >
            <td>{event.organisations?.name}</td>
            <td>{event.name}</td>
            <td
              >{event.participants.length}
              {#if event.max_participants}
                / {event.max_participants}{/if}</td
            >

            <td class="align-middle text-end">
              <a href="/events/{event.id}/register">
                <button type="button" class="btn btn-primary" disabled={event.participants.length < event.max_participants}
                  >Register</button
                >
              </a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
