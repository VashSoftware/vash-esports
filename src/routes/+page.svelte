<script lang="ts">
  import { goto } from "$app/navigation";
  import RegisterButton from "../components/registerButton.svelte";

  export let data;

  let availableMaps = [];
  let availableMods = [];

  let quickPlayMaps = [];

  async function fetchMaps() {
    let maps = await data.supabase.from("maps").select("*, mapsets(*)");

    availableMaps = maps.data;
  }

  async function fetchMods() {
    let mods = await data.supabase.from("mods").select("*");

    availableMods = mods.data;
  }

  async function fetchQuickPlayInfo() {
    await fetchMaps();
    await fetchMods();
  }
</script>

<div class="text-center py-5">
  <h1><b>Vash Esports</b></h1>
  <h3 class="fw-light">The best way to play osu! competitively.</h3>

  <button
    type="button"
    class="btn btn-success btn-lg my-4"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
    on:click={fetchQuickPlayInfo}
  >
    Quick Match
  </button>
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
              {#if event.event_options.max_registrations}
                / {event.event_options.max_registrations}{/if}</td
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

<form action="?/quickMatch" method="post">
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Quick Match</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label"
              >Opponent</label
            >
            <input
              type="text"
              class="form-control"
              id="exampleInputPassword1"
              name="opponent"
              placeholder="Type to search..."
              value="Stan"
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label"
              >Map Pool</label
            >
            <ul>
              {#each quickPlayMaps as quickPlayMap}
                <input
                  type="hidden"
                  name="quickPlayMap"
                  value={quickPlayMap.id}
                />
                <li class="d-flex justify-content-between align-items-center">
                  <div>
                    {quickPlayMap.mapsets.artist} - {quickPlayMap.mapsets.title}
                  </div>
                  <select name="mod"
                    >{#each availableMods as mod}
                      <option value={mod.id}>{mod.code}</option>{/each}</select
                  >
                  <button
                    type="button"
                    class="btn btn-danger"
                    on:click={() =>
                      (quickPlayMaps = quickPlayMaps.filter(
                        (map) => map.id !== quickPlayMap.id
                      ))}
                  >
                    Remove
                  </button>
                </li>
              {/each}
            </ul>

            <ul>
              {#each availableMaps.slice(0, 10) as mapPoolMap}
                <li class="d-flex justify-content-between align-items-center">
                  <div>
                    {mapPoolMap.mapsets.artist} - {mapPoolMap.mapsets.title}
                  </div>
                  <button
                    type="button"
                    class="btn btn-primary"
                    on:click={() => addQuickPlayMap(mapPoolMap)}
                  >
                    Add
                  </button>
                </li>
              {/each}
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal">Close</button
          >
          <button type="submit" class="btn btn-primary">Play</button>
        </div>
      </div>
    </div>
  </div>
</form>
