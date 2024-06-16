<script lang="ts">
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";

  onMount(async () => {
    await import("bootstrap/js/dist/dropdown");
  });

  export let supabase;
  export let session;

  let searchQuery = "";
  let searchResults = [];
  let selectedTeamId = null;
  async function search(event: Event) {
    const foundOpponents = await supabase
      .from("teams")
      .select("id, name, team_members(user_profiles(user_id))")
      .ilike("name", `%${event.target.value}%`)
      .eq("is_personal_team", true);

    searchResults = foundOpponents.data.filter(
      (opponent) =>
        !opponent.team_members.find(
          (teamMember) => teamMember.user_profiles.user_id === session.user.id
        )
    );
  }

  let availableMaps = [];
  let availableMods = [];

  let quickPlayMaps = [];

  async function fetchMaps() {
    let maps = await supabase.from("maps").select("*, mapsets(*)");

    availableMaps = maps.data;
  }

  async function fetchMods() {
    let mods = await supabase.from("mods").select("*");

    availableMods = mods.data;
  }

  async function fetchQuickPlayInfo() {
    await fetchMaps();
    await fetchMods();
  }

  function addQuickPlayMap(map) {
    quickPlayMaps = [...quickPlayMaps, map];

    availableMaps = availableMaps.filter(
      (availableMap) => availableMap.id !== map.id
    );
  }

  $: canMakeQuickMatch = quickPlayMaps.length > 0 && selectedTeamId !== null;
</script>

<button
  type="button"
  class="btn btn-success btn-lg my-4"
  data-bs-toggle="modal"
  data-bs-target="#exampleModal"
  on:click={fetchQuickPlayInfo}
>
  Quick Match
</button>

<form action="/?/makeQuickMatch" method="post" use:enhance>
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
            <div class="position-relative">
              <input type="hidden" name="team-id" value={selectedTeamId} />

              <input
                type="text"
                class="form-control"
                id="exampleInputPassword1"
                placeholder="Type to search..."
                bind:value={searchQuery}
                on:input={search}
              />
              <ul class="list-group position-absolute w-100">
                {#if searchQuery.length > 0 && !selectedTeamId}
                  {#each searchResults as searchResult}
                    <button
                      class="list-group-item"
                      on:click={() => {
                        searchQuery = searchResult.name;
                        selectedTeamId = searchResult.id;
                      }}
                    >
                      {searchResult.name}
                    </button>
                  {/each}
                {/if}
              </ul>
            </div>
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Best of</label
            >
            <input
              type="number"
              class="form-control"
              id="bestOfInput"
              name="best-of"
              value={quickPlayMaps.length}
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label"
              >Map Pool</label
            >
            <ul>
              {#each quickPlayMaps as quickPlayMap (quickPlayMap.id)}
                <!-- Add key to each loop for reactivity -->
                <input type="hidden" name="map-ids" value={quickPlayMap.id} />
                <li
                  class="d-flex justify-content-between align-items-center text-start"
                >
                  <div>
                    {quickPlayMap.mapsets.artist} - {quickPlayMap.mapsets.title}
                  </div>
                  <select bind:value={quickPlayMap.selectedMod} name="mod-ids">
                    <!-- Bind value to quickPlayMap.selectedMod -->
                    {#each availableMods as mod}
                      <option value={mod.id}>
                        {mod.code}
                      </option>
                    {/each}
                  </select>
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
                <li
                  class="d-flex justify-content-between align-items-center text-start"
                >
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
          <button
            type="submit"
            class="btn btn-primary"
            disabled={!canMakeQuickMatch}
            data-bs-dismiss="modal">Play</button
          >
        </div>
      </div>
    </div>
  </div>
</form>
