<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";

  export let data;

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

  function addQuickPlayMap(map) {
    quickPlayMaps = [...quickPlayMaps, map];
  }

  let availableMaps = [];
  let availableMods = [];

  let quickPlayMaps = [];

  function groupByDate(matches) {
    const groupedMatches = {};
    matches.forEach((match) => {
      const date = new Date(match.created_at).toLocaleDateString();
      if (!groupedMatches[date]) {
        groupedMatches[date] = [];
      }
      groupedMatches[date].push(match);
    });
    return groupedMatches;
  }
</script>

<div class="py-5 d-flex justify-content-between align-items-center">
  <h1>Matches ({data.matches.length})</h1>

  <div>
    <button
      type="button"
      class="btn btn-success btn-lg"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
      on:click={fetchQuickPlayInfo}
    >
      Quick Match
    </button>
  </div>
</div>

{#each Object.entries(groupByDate(data.matches)) as [date, matches]}
  <h2>{date}</h2>
  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">Event</th>
          <th scope="col">Team 1</th>
          <th scope="col">Team 2</th>
        </tr>
      </thead>
      <tbody>
        {#each matches as match}
          <tr role="button" on:click={() => goto(`/matches/${match.id}`)}>
            <td>{match.rounds.events.name}</td>
            <td>{match.match_participants[0].participants.teams.name}</td>
            <td>{match.match_participants[1].participants.teams.name}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/each}

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
