<script lang="ts">
  import { enhance } from "$app/forms";

  export let data;

  async function getMap(id) {
    const response = await fetch(`/api/maps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();

    return data;
  }

  let timer;
  function debounce(event) {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const formData = new FormData(event.target);
      const osuId = formData.get("osu-id");
      const mapI = formData.get("map-pool-map-i");
      const modI = formData.get("map-pool-mod-i");

      let map = await getMap(osuId);
      data.mapPool.map_pool_mods[modI].map_pool_maps[mapI].found_maps = [map];
    }, 300);
  }

  async function deletePool(event: Event) {
    await data.supabase
      .from("map_pools")
      .update({
        deleted_at: new Date(),
      })
      .eq("id", data.mapPool.id);

    window.location.href = "/map-pools";
  }
</script>

<a href="/map-pools" type="button" class="btn btn-secondary my-4"
  >{"<"} Back to Map Pools</a
>

<div class="mb-4 d-flex align-items-center justify-content-between">
  <div>
    <h1>{data.mapPool?.name || `Map Pool ${data.mapPool?.id}`}</h1>
    <p>{data.mapPool?.description}</p>
  </div>
  <div>
    <button
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#editMapPoolModal">Edit Map Pool</button
    >
  </div>
</div>

{#each data.mapPool?.map_pool_mods as mod, mod_i}
  {#if mod.map_pool_maps.length > 0}
    <div class="row align-items-center">
      <div class="col-2"><h2>{mod.name}</h2></div>
      <div class="col">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Pool ID</th>
                <th>osu! ID</th>
                <th>Banner</th>
                <th>Artist - Title [Difficulty]</th>
                <th>Mapper</th>
                <th>Star Rating</th>
                <th>BPM</th>
                <th>Time</th>
                <th>CS</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each mod.map_pool_maps as map, map_i}
                <tr class="">
                  <td>{mod.code}{map.mod_priority}</td>
                  <td>
                    <form on:submit|preventDefault={debounce}>
                      <input
                        type="hidden"
                        name="map-pool-mod-i"
                        value={mod_i}
                      />
                      <input
                        type="hidden"
                        name="map-pool-map-i"
                        value={map_i}
                      />

                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter osu! map ID / link"
                        name="osu-id"
                        value={map.maps?.osu_id || ""}
                        on:input={(event) =>
                          event.target.form.dispatchEvent(new Event("submit"))}
                      />
                    </form>

                    {#if map.found_maps}
                      {#each map.found_maps as foundMap}
                        <form action="?/addMap" method="post">
                          <input
                            type="hidden"
                            name="mapId"
                            value={foundMap.id}
                          />
                          <input
                            type="hidden"
                            name="mapPoolMapId"
                            value={map.id}
                          />

                          <div class="card py-3">
                            <img
                              src="https://assets.ppy.sh/beatmaps/{foundMap
                                ?.mapsets.osu_id}/covers/cover.jpg"
                              class="card-img-top"
                              alt="Map Banner"
                            />
                            <div class="card-body">
                              <h5 class="card-title">
                                {foundMap.mapsets.artist} - {foundMap.mapsets
                                  .title}
                              </h5>
                              <p class="card-text">
                                Mapped by {foundMap.mapsets.creator}
                              </p>
                              <div class="d-flex gap-3">
                                <textarea
                                  name="notes"
                                  class="form-control"
                                  placeholder="Notes"
                                />

                                <button type="submit" class="btn btn-primary"
                                  >Add to Map Pool</button
                                >
                              </div>
                            </div>
                          </div>
                        </form>
                      {/each}
                    {/if}
                  </td>
                  <td
                    >{#if map.maps}<img
                        src="https://assets.ppy.sh/beatmaps/{map.maps?.mapsets
                          .osu_id}/covers/cover@2x.jpg"
                        height="32"
                        alt="Map Banner"
                      />{/if}</td
                  >
                  <td
                    >{#if map.maps}{map.maps?.mapsets.artist} - {map.maps
                        ?.mapsets.title} [{map.maps?.difficulty_name}]{/if}</td
                  >
                  <td
                    >{#if map.maps}{map.maps?.mapsets.creator}{/if}</td
                  >
                  <td
                    >{#if map.maps}{map.maps?.star_rating}{/if}</td
                  >
                  <td
                    >{#if map.maps}{map.maps?.mapsets.bpm}{/if}</td
                  >
                  <td
                    >{#if map.maps}{map.maps?.mapsets.time}{/if}</td
                  >
                  <td
                    >{#if map.maps}{map.maps?.circle_size}{/if}</td
                  >
                  <td
                    >{#if map.maps}
                      <form action="?/updateMapPoolMapNotes" method="post">
                        <input
                          type="hidden"
                          name="map-pool-map-id"
                          value={map.id}
                        />

                        <input
                          type="text"
                          name="notes"
                          value={map.notes}
                          class="form-control"
                          placeholder="Add notes"
                        />
                      </form>
                    {/if}</td
                  >
                  <td
                    >{#if map.maps}
                      <form
                        action="?/deleteMapPoolMap"
                        method="post"
                        use:enhance
                      >
                        <input
                          type="hidden"
                          name="map-pool-map-id"
                          value={map.id}
                        />
                        <button type="submit" class="btn btn-danger"
                          ><svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="2em"
                            height="2em"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"
                            />
                          </svg>
                        </button>
                      </form>
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}
{/each}

<div
  class="modal fade"
  id="editMapPoolModal"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">
          Edit {data.mapPool?.name || `Map Pool ${data.mapPool.id}`}
        </h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <form action="?/editMapPool" method="post">
        <div class="modal-body">
          <div class="mb-3">
            <h2>Information</h2>
            <label
              for="mapPoolName"
              class="form-label

              ">Map Pool Name</label
            >
            <input
              type="text"
              class="form-control"
              id="mapPoolName"
              name="name"
              value={data.mapPool.name}
            />

            <label
              for="mapPoolDescription"
              class="form-label

              ">Map Pool Description</label
            >
            <textarea
              class="form-control"
              id="mapPoolDescription"
              name="description">{data.mapPool.description}</textarea
            >

            <h2>Maps</h2>
            <div class="row">
              {#each data.mapPool.map_pool_mods as mod}
                <div class="col col-3">
                  <label for="mapPoolMod" class="form-label">{mod.code}</label>
                  <input
                    type="number"
                    class="form-control"
                    id="mapPoolMaps"
                    name="map-pool-mods-{mod.id}"
                    value={mod.map_pool_maps.length}
                    min="1"
                    max="99"
                  />
                </div>
              {/each}
            </div>
          </div>

          <div class="mb-3 d-flex justify-content-between align-items-center">
            <b>Delete Pool?</b>

            <button type="button" class="btn btn-danger" on:click={deletePool}>
              Delete
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal">Close</button
          >
          <button type="submit" class="btn btn-primary">Save changes</button>
        </div>
      </form>
    </div>
  </div>
</div>
