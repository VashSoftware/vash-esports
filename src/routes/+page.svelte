<script lang="ts">
  import { goto } from "$app/navigation";
  import RegisterButton from "../components/registerButton.svelte";

  export let data;
</script>

<div class="text-center py-5">
  <h1><b>Vash Esports</b></h1>
  <h3>The best way to play osu! tournaments.</h3>
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
            <td
              >{#if match.rounds.events.event_groups}<b
                  >{match.rounds.events.event_groups.name}</b
                >
              {/if}{match.rounds.events.name}</td
            >
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
          <tr class="align-self-center">
            <td role="button" on:click={() => goto(`/events/${event.id}`)}
              >{event.organisations?.name}</td
            >
            <td role="button" on:click={() => goto(`/events/${event.id}`)}
              >{#if event.event_groups}<b>{event.event_groups?.name}</b>
              {/if}{event.name}</td
            >
            <td role="button" on:click={() => goto(`/events/${event.id}`)}>
              {event.participants.length}
              {#if event.max_participants}
                / {event.max_participants}{/if}</td
            >

            <td class="align-middle text-end col-1">
              <RegisterButton {event} teams={data.teams} />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
